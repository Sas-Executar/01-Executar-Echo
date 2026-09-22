import "./editorial.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";
import { PublicDesignSystemProvider } from "@repo/design-system/public-provider";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import type { ReactNode } from "react";
import { EditorialFooter } from "./components/editorial/editorial-footer";
import { EditorialShell } from "./components/editorial/editorial-shell";

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * apps/web's root layout. Every route here is a public/institutional
 * surface — Blog, Mapa, Frameworks, Oficina, VERA, institutional pages —
 * so the editorial identity (ADR-DS-002) applies to the whole app rather
 * than to a route group inside it. The authenticated product is a
 * separate app (apps/app) and keeps the product design system.
 */
const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;

  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      // Was hardcoded to "en" while the [locale] segment said otherwise,
      // which mislabelled the Portuguese content for screen readers and
      // translation tooling.
      lang={locale}
      suppressHydrationWarning
    >
      {/*
        The editorial scope sits on <body>, not on the shell div inside
        it. Anything narrower leaves the page canvas itself on the
        product tokens, which is invisible in the light appearance and
        obvious in the dark one: the article would go dark while the
        surrounding canvas stayed light. ADR-DS-002's isolation is
        unaffected — this is still a scoped subtree, and apps/app and
        apps/mobile never render this layout.
      */}
      <body data-surface="editorial">
        <AnalyticsProvider>
          <PublicDesignSystemProvider>
            <EditorialShell footer={<EditorialFooter />}>
              {children}
            </EditorialShell>
          </PublicDesignSystemProvider>
          <Toolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
