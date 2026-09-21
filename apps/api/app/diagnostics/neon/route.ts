import { runNeonDiagnostics } from "@repo/database/diagnostics";

/**
 * Preview-only instrument for P0-02 (500s on /cron/keep-alive and
 * /cron/routines). See packages/database/diagnostics.ts for why this
 * exists and what it measures. It reports no credentials — host name
 * only — but it is still an instrument rather than a product surface,
 * so production does not serve it.
 */

export const dynamic = "force-dynamic";

export const GET = async (): Promise<Response> => {
  if (process.env.VERCEL_ENV === "production") {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(await runNeonDiagnostics(), {
    headers: { "cache-control": "no-store" },
  });
};
