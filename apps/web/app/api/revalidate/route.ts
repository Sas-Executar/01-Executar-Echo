import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Purges a cached path from Next's incremental cache.
 *
 * This exists for one measured defect: the production alias serves a
 * prerendered 404 for "/" (`x-nextjs-prerender: 1`,
 * `x-nextjs-stale-time: 300`, `x-vercel-cache: HIT`) while the same URL
 * with any query string, and the deployment URL itself, return 200. The
 * application is correct; the entry under that one cache key is not, and
 * it has survived four deployments and two alias remaps — a new build
 * does not evict it, so nothing short of an explicit purge will.
 *
 * Guarded by a shared secret and disabled outright when that secret is
 * unset, so it cannot be used to force repeated re-renders. Nothing is
 * read from the request beyond the path to purge, and the path is
 * constrained to a local one.
 */
export const dynamic = "force-dynamic";

export const POST = (request: NextRequest) => {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    // Unconfigured means absent, not open: the endpoint should be
    // indistinguishable from a route that does not exist.
    return new NextResponse(null, { status: 404 });
  }

  if (request.headers.get("x-revalidate-secret") !== secret) {
    return new NextResponse(null, { status: 404 });
  }

  const path = new URL(request.url).searchParams.get("path") ?? "/";

  if (!path.startsWith("/")) {
    return NextResponse.json(
      { error: "path must be a local path" },
      { status: 400 }
    );
  }

  revalidatePath(path, "layout");
  revalidatePath(path, "page");

  return NextResponse.json({ revalidated: path, at: Date.now() });
};
