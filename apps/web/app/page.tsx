import { redirect } from "next/navigation";

/**
 * A structural backstop for the root path, not a duplicate of the i18n
 * rewrite.
 *
 * `proxy.ts` normally rewrites "/" to "/[locale]" before Next's router
 * sees it (next-international's `rewriteDefault` strategy). Measured on
 * this deployment, and on the one before it: immediately after a fresh
 * deploy, some requests to "/" reach the router before the middleware
 * bundle is warm on that edge region, find no matching page for the
 * literal "/", and fall through to Next's static `_not-found` page.
 * That response then gets cached at the edge — `x-nextjs-prerender: 1`,
 * a genuinely static asset — and stays stuck under the "/" key
 * regardless of how many correct responses follow, because a cache HIT
 * never re-invokes the function (or the middleware) to reconsider it.
 * `Cache-Control: no-store` on the middleware's own responses cannot
 * fix this: the poisoned response was never produced by the middleware
 * in the first place.
 *
 * A real page at this exact path removes the dependency on middleware
 * timing entirely — there is no longer a "no match" case for the router
 * to fall back to a static 404 for, so there is nothing here for a
 * cold-start race to cache.
 */
const RootPage = () => {
  redirect("/en");
};

export default RootPage;
