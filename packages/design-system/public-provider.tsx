import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

/**
 * Provider composition for surfaces with no authenticated UI.
 *
 * Identical to `DesignSystemProvider` minus `AuthProvider` (Clerk).
 *
 * `DesignSystemProvider` mounts `ClerkProvider` unconditionally, which
 * makes a valid Clerk key a hard requirement for *rendering* — including
 * on pages that never read a session. For a public marketing and
 * editorial site that turns an auth misconfiguration into a total
 * outage, and this repository has already been bitten twice: GATE_LOG's
 * `GATE-MOBILE-001` records a truncated publishable key taking the
 * homepage to a 404 in 23 of 25 checks, and commit c3d9821 fixed stale
 * session cookies returning a hard 500 on every route.
 *
 * apps/web references `@repo/auth` in exactly one place — `proxy.ts`,
 * where the middleware still runs — so nothing on these pages needs the
 * provider at all. Dropping it removes the dependency rather than
 * hardening it.
 *
 * Surfaces that do render sign-in state (apps/app) keep
 * `DesignSystemProvider`.
 */
export const PublicDesignSystemProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
