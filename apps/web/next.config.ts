import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

let nextConfig: NextConfig = withToolbar(withLogging(config));

// packages/cms reads its .mdx at request time with node:fs (see
// packages/cms/lib/posts.ts). Next's file tracing only follows static
// imports, so it never saw those files and left them out of the
// serverless bundle: readSlugs() found an empty directory in production
// and every /legal/* and /blog/[slug] URL 404'd while the .mdx sat in
// the repo. Tracing them in explicitly is what puts them in the bundle.
nextConfig.outputFileTracingIncludes = {
  ...nextConfig.outputFileTracingIncludes,
  "/**": ["../../packages/cms/content/**/*.mdx"],
};

if (process.env.NODE_ENV === "production") {
  const redirects: NextConfig["redirects"] = async () => [
    {
      source: "/legal",
      destination: "/legal/privacy",
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
