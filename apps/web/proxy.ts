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
import type { NextFetchEvent } from "next/dist/server/web/spec-extension/fetch-event";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

const CLERK_HANDSHAKE_FAILURE =
  /Handshake token verification failed|jwk-kid-mismatch/;

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

/**
 * Whether Clerk can run at all. `packages/auth/keys.ts` already declares
 * both keys `.optional()`, but `authMiddleware` throws outright when they
 * are absent — so a public site that renders no authenticated UI could
 * still be taken down entirely by a missing or rotated key.
 *
 * apps/web references `@repo/auth` in exactly one place: this file. No
 * page here reads a session. Treating the keys as genuinely optional
 * therefore costs nothing and removes a whole class of outage — the same
 * class GATE-MOBILE-001 and commit c3d9821 both landed in production.
 */
const clerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Clerk middleware wraps other middleware in its callback
const clerkProxy = authMiddleware(async (_auth, request, event) => {
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

// Clerk's own handshake verification runs before our callback ever gets
// control, so a bad __session cookie throws out of clerkProxy() itself —
// the try/catch inside the callback above can't reach it. Seen in
// production on 2026-09-22: a visitor with a stale/foreign Clerk session
// cookie (JWKS "kid" not present in this instance) got a hard 500 on every
// route instead of just being treated as signed out. Clearing the cookie
// and falling back to the composed (non-Clerk) middleware keeps the site
// up for that request; the visitor is simply unauthenticated until they
// sign in again.
export default (async (request: NextRequest, event: NextFetchEvent) => {
  // No Clerk keys: run the i18n rewrite and security headers directly.
  // The visitor is simply unauthenticated, which is the correct state for
  // every route in this app, instead of every route returning a 500.
  if (!clerkConfigured) {
    const rewritten = await composedMiddleware(
      request as unknown as NextRequest,
      event
    );
    if (rewritten) {
      return rewritten;
    }
    try {
      return (await securityHeaders()) ?? NextResponse.next();
    } catch (error) {
      parseError(error);
      return NextResponse.next();
    }
  }

  try {
    return await (
      clerkProxy as unknown as (
        req: NextRequest,
        ev: NextFetchEvent
      ) => Promise<Response>
    )(request, event);
  } catch (error) {
    const isHandshakeFailure =
      error instanceof Error && CLERK_HANDSHAKE_FAILURE.test(error.message);
    if (!isHandshakeFailure) {
      throw error;
    }
    parseError(error);
    // Still run the i18n rewrite so a bare "/" doesn't 404 (see the
    // composedMiddleware comment above) — just skip Clerk entirely.
    const rewritten = await composedMiddleware(
      request as unknown as NextRequest,
      event
    );
    const fallback =
      (rewritten as unknown as NextResponse) ?? NextResponse.next();
    fallback.cookies.delete("__session");
    fallback.cookies.delete("__client_uat");
    return fallback;
  }
}) as unknown as NextProxy;
