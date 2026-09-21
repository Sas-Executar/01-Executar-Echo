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

// This page used to call showBetaFeature() -> Clerk's auth() -> headers().
// The flags SDK swallows whatever decide() throws (it logs "falling back
// to its defaultValue" and returns false), including Next's own internal
// render-control signals, which left the render in a not-found state.
//
// Measured on production (2026-09-21, dpl_pk6r7D6dxoMmnEr5NAzi69VcRUsX),
// forcing a cache MISS on every request so each one is a fresh render:
//
//     /          7/40 and 2/30 returned 404
//     /pricing   0/30
//     /contact   0/30
//     /blog      0/30
//
// Only this route called the flag, and only this route failed. The CDN
// then pinned one of those 404s under the bare "/" key (it is the static
// _not-found artifact, so it carries x-nextjs-prerender:1 and caching
// headers), which turned an ~18% render failure into a ~100% outage.
//
// The call was also dead: decide() returns defaultValue whenever there is
// no userId, and an anonymous visitor to a public marketing page never
// has one, so the banner could never render. It gated a hardcoded,
// untranslated Next Forge placeholder. Removing it changes no behavior
// and takes Clerk out of this page's render path entirely.
//
// force-dynamic stays: it is what keeps a prerendered artifact from being
// built for this route in the first place.
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

  return (
    <>
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
