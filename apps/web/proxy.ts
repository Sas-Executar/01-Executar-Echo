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
  // middleware on all routes except for static assets and Posthog ingest.
  //
  // `api` and `.well-known` are excluded because they are not localized:
  // the i18n middleware rewrites every matched path under a [locale]
  // segment, so POST /api/vera became /en/api/vera — a route that does not
  // exist — and the endpoint 404'd while the page calling it looked fine.
  matcher: [
    "/((?!api|\\.well-known|_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
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

const composedMiddleware = createNEMO(
  {},
  {
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

/**
 * The root path's cache key is poisoned, repeatedly and durably.
 *
 * Measured on production: "/" returns a prerendered 404 with
 * `x-vercel-cache: HIT`, `x-nextjs-prerender: 1` and an `age` in the
 * hundreds of seconds, while the same URL with a cache-buster returns
 * 200. The application is correct; what is served is a stale artifact
 * from before the locale rewrite worked, and it has survived three
 * deployments (GATE_LOG: "o 404 estático ficou fixado no CDN").
 *
 * Marking the rewrite of "/" `no-store` stops the edge from holding any
 * entry under that key, so a stale one can never be served again — the
 * homepage is a rewrite to a dynamic locale route, not a static asset,
 * and there is nothing at this key worth caching.
 */
const markRootUncacheable = (request: NextRequest, response: Response) => {
  if (request.nextUrl.pathname === "/") {
    response.headers.set("cache-control", "private, no-store, max-age=0");
  }
  return response;
};

/**
 * apps/web's middleware. Deliberately does not run Clerk.
 *
 * This app is the public surface: no route renders authenticated UI and
 * no page reads a session. Clerk was here only because next-forge wraps
 * every app's middleware in it, and running it on a site with nothing to
 * authenticate produced a steady class of outages rather than any
 * benefit:
 *
 *   - GATE-MOBILE-001: a truncated publishable key redirected "/" to a
 *     host that does not resolve; the homepage 404'd in 23 of 25 checks.
 *   - c3d9821: a stale or foreign __session cookie threw out of Clerk's
 *     own handshake verification, before any of this file's guards could
 *     reach it, and returned a hard 500 on every route.
 *   - Verified on the deployed site while checking failing requests:
 *     Clerk was still issuing handshake redirects, and
 *     /oficina/learn?__clerk_handshake=… came back 404.
 *
 * Two previous fixes tried to make that coupling survivable. Removing it
 * is simpler and strictly safer: a visitor here is anonymous by
 * definition. apps/app, which does render sign-in state, keeps Clerk.
 *
 * The i18n rewrite is what makes a bare "/" resolve to "/[locale]" at
 * all (next-international's "rewriteDefault" strategy), so it runs
 * first. Security headers are decorative by comparison — nosecone's
 * middleware has been observed throwing a non-Error value intermittently
 * (WORKFLOW_01_01_EXECUTION_LOG.md, 2026-09-20), and letting that abort
 * the rewrite sent an un-rewritten "/" to Next's router, which 404s.
 * Guarded so a header failure degrades to "missing extra headers"
 * instead of "wrong route entirely".
 */
export default (async (request: NextRequest, event: NextFetchEvent) => {
  const rewritten = await composedMiddleware(request, event);

  if (rewritten) {
    return markRootUncacheable(request, rewritten);
  }

  try {
    return markRootUncacheable(
      request,
      (await securityHeaders()) ?? NextResponse.next()
    );
  } catch (error) {
    parseError(error);
    return markRootUncacheable(request, NextResponse.next());
  }
}) as unknown as NextProxy;
