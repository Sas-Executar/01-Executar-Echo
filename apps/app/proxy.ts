import { authMiddleware } from "@repo/auth/proxy";
import { parseError } from "@repo/observability/error";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import type { NextProxy } from "next/server";
import { env } from "./env";

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Clerk middleware wraps other middleware in its callback
// For apps using Clerk, compose middleware inside authMiddleware callback
// For apps without Clerk, use createNEMO for composition (see apps/web)
export default authMiddleware(async () => {
  // nosecone's middleware has been observed throwing a non-Error value
  // intermittently (see WORKFLOW_01_01_EXECUTION_LOG.md, 2026-09-20) —
  // guarded here so a decorative-header failure degrades to "missing
  // extra headers on this response" instead of an unhandled throw.
  // securityHeaders() returns a Promise (@nosecone/next's createMiddleware
  // signature: () => Promise<Response>), so this must be awaited inside the
  // try — an unawaited call lets a rejection surface after the catch has
  // already returned, which is exactly what kept producing this same
  // "Error: [object Object]" in production after the first (synchronous
  // try/catch only) attempt at this guard.
  try {
    return await securityHeaders();
  } catch (error) {
    parseError(error);
    return;
  }
}) as unknown as NextProxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
