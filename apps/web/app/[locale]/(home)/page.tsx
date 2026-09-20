import { showBetaFeature } from "@repo/feature-flags";
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { CTA } from "./components/cta";
import { FAQ } from "./components/faq";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { Principles } from "./components/principles";
import { Stats } from "./components/stats";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

// This page called showBetaFeature() -> Clerk's auth() -> headers(), a
// dynamic API, while Next still treated the route as statically
// prerenderable. The flags SDK catches auth()'s own error internally (it
// logs "falling back to its defaultValue" and returns false), and that
// catch also swallows Next's internal bail-out-of-static-rendering
// signal — so the build kept a prerendered artifact for this route that
// renders as not-found. In production that artifact was served for
// roughly 1 in 8 requests to "/" (the rest were dynamic renders, which
// were always correct), confirmed by x-nextjs-prerender:1 on every 404
// and its absence on every 200. Declaring the route dynamic stops the
// broken artifact from being produced at all. Sibling routes
// (/pricing, /contact, /blog) never called the flag and never failed.
export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={dictionary} />
      <Features dictionary={dictionary} />
      <Stats dictionary={dictionary} />
      <Principles dictionary={dictionary} />
      <FAQ dictionary={dictionary} />
      <CTA dictionary={dictionary} />
    </>
  );
};

export default Home;
