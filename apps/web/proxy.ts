import { authMiddleware } from "@repo/auth/proxy";
import { internationalizationMiddleware } from "@repo/internationalization/proxy";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Custom middleware for Arcjet security checks
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        "CATEGORY:SEARCH_ENGINE", // Allow search engines
        "CATEGORY:PREVIEW", // Allow preview links to show OG images
        "CATEGORY:MONITOR", // Allow uptime monitoring services
      ],
      request
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// Compose non-Clerk middleware with Nemo
const composedMiddleware = createNEMO(
  {},
  {
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

// Clerk middleware wraps other middleware in its callback
export default authMiddleware(async (_auth, request, event) => {
  // Run composed middleware (i18n + arcjet) first: the i18n rewrite is what
  // makes the bare "/" resolve to "/[locale]" at all (next-international's
  // "rewriteDefault" strategy). Security headers are decorative by
  // comparison — nosecone's own middleware has been observed throwing a
  // non-Error value intermittently (see WORKFLOW_01_01_EXECUTION_LOG.md,
  // 2026-09-20), and running it first meant that throw aborted this whole
  // callback before the rewrite ever ran, sending the un-rewritten "/"
  // straight to Next's router — which 404s, since no route matches a bare
  // "/" under the required [locale] segment. Guarding it here so a
  // decorative-header failure degrades to "missing extra headers on this
  // response" instead of "wrong route entirely".
  const middlewareResponse = await composedMiddleware(
    request as unknown as NextRequest,
    event
  );

  let headersResponse: Awaited<ReturnType<typeof securityHeaders>> | undefined;
  try {
    // securityHeaders() returns a Promise (@nosecone/next's createMiddleware
    // signature: () => Promise<Response>) — must be awaited inside the try,
    // or a rejection surfaces after this catch already returned, which is
    // exactly what kept producing "Error: [object Object]" in production
    // after the first (synchronous try/catch only) attempt at this guard.
    headersResponse = await securityHeaders();
  } catch (error) {
    parseError(error);
  }

  // Return middleware response if it exists, otherwise headers response
  return middlewareResponse || headersResponse;
}) as unknown as NextProxy;
