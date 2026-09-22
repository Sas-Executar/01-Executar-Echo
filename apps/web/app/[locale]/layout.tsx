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
      <body>
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
