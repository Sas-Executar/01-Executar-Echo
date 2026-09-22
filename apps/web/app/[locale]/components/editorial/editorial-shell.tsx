"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BOTTOM_NAV, PRIMARY_NAV } from "./nav-config";
import { useFocusTrap } from "./use-focus-trap";
import { useScrollChrome } from "./use-scroll-chrome";

interface EditorialShellProps {
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

/**
 * The public/editorial chrome: fixed top nav, side drawer below 900px,
 * three-destination bottom bar, and the content well.
 *
 * Everything renders inside `[data-surface="editorial"]`, which is what
 * swaps the design system for this subtree (ADR-DS-002) — the product
 * identity is untouched outside it.
 *
 * Layout values come from `--ed-*` custom properties rather than Tailwind
 * spacing utilities wherever the handoff fixed an exact number (nav 56px,
 * bottom bar 64px, drawer min(84vw,360px), targets ≥44px). Those were
 * measured, and hard-coding them as utilities would let them drift away
 * from the token source.
 */
export function EditorialShell({ children, footer }: EditorialShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const chromeVisible = useScrollChrome(drawerOpen);
  useFocusTrap(drawerRef, drawerOpen);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Escape closes the drawer (handoff v6 accessibility table).
  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  // The page must not scroll behind an open drawer.
  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className="min-h-dvh"
      data-surface="editorial"
      style={{
        paddingTop: "var(--ed-nav-h)",
        paddingBottom: "var(--ed-bottombar-h)",
      }}
    >
      {/* Top navigation. Translates out with the bottom bar, never alone. */}
      <header
        className="fixed top-0 right-0 left-0 z-50 border-[var(--ed-line)] border-b backdrop-blur-xl"
        data-testid="editorial-nav"
        data-visible={chromeVisible}
        style={{
          height: "var(--ed-nav-h)",
          background: "var(--ed-glass-light)",
          transform: chromeVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform var(--ed-duration-chrome) var(--ed-ease)",
        }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between"
          style={{
            maxWidth: "var(--ed-wide)",
            paddingInline: "var(--ed-gutter)",
          }}
        >
          <button
            aria-controls="editorial-drawer"
            aria-expanded={drawerOpen}
            aria-label="Abrir menu de navegação"
            className="flex items-center justify-center lg:hidden"
            data-testid="drawer-trigger"
            onClick={() => setDrawerOpen(true)}
            style={{
              width: "var(--ed-nav-h)",
              height: "var(--ed-nav-h)",
              marginInlineStart: "calc(var(--ed-gutter) * -0.5)",
              borderRadius: "var(--ed-radius-nav-icon)",
            }}
            type="button"
          >
            <MenuIcon />
          </button>

          <Link
            aria-label="EXECUTAR — página inicial"
            className="flex items-center"
            href="/"
          >
            {/*
              The real brand wordmark, from apps/web/public/brand. Until
              now the 85-file brand kit shipped with zero code references
              and the site used next-forge's placeholder marks.
            */}
            <Image
              alt="EXECUTAR"
              height={18}
              priority
              src="/brand/02_wordmark/executar-wordmark-black-1200px.png"
              style={{ height: 18, width: "auto" }}
              width={120}
            />
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center lg:flex"
            style={{ gap: "calc(var(--ed-gap) * 2)" }}
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                aria-current={isActive(item.href) ? "page" : undefined}
                className="font-medium text-[length:var(--ed-small)]"
                href={item.href}
                key={item.href}
                style={{
                  paddingBlock: 6,
                  borderBottom: isActive(item.href)
                    ? "3px solid var(--ed-yellow)"
                    : "3px solid transparent",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            aria-label="Buscar"
            className="flex items-center justify-center"
            href="/buscar"
            style={{
              width: "var(--ed-nav-h)",
              height: "var(--ed-nav-h)",
              marginInlineEnd: "calc(var(--ed-gutter) * -0.5)",
              borderRadius: "var(--ed-radius-nav-icon)",
            }}
          >
            <SearchIcon />
          </Link>
        </div>
      </header>

      {/* Backdrop. Rendered only when open so it can never swallow taps. */}
      {drawerOpen ? (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-50 lg:hidden"
          onClick={closeDrawer}
          style={{ background: "rgba(0,0,0,.4)" }}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      <div
        aria-hidden={!drawerOpen}
        aria-label="Menu de navegação"
        className="fixed top-0 bottom-0 left-0 z-50 overflow-y-auto lg:hidden"
        data-testid="editorial-drawer"
        id="editorial-drawer"
        ref={drawerRef}
        role="dialog"
        style={{
          width: "var(--ed-drawer-w)",
          background: "var(--ed-paper)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform var(--ed-duration-drawer) var(--ed-ease)",
          visibility: drawerOpen ? "visible" : "hidden",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            height: "var(--ed-nav-h)",
            paddingInline: "var(--ed-gutter)",
          }}
        >
          <span className="font-semibold text-[length:var(--ed-small)]">
            Navegar
          </span>
          <button
            aria-label="Fechar menu"
            onClick={closeDrawer}
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--ed-radius-nav-icon)",
            }}
            type="button"
          >
            ✕
          </button>
        </div>
        <nav aria-label="Navegação do menu">
          {PRIMARY_NAV.map((item) => (
            <Link
              className="flex items-center"
              href={item.href}
              key={item.href}
              // Closed here rather than in an effect on `pathname`: the
              // click is the actual event, and a same-route link would
              // not fire a navigation to react to at all.
              onClick={closeDrawer}
              style={{
                minHeight: "var(--ed-nav-h)",
                paddingInline: "var(--ed-gutter)",
                boxShadow: isActive(item.href)
                  ? "inset 3px 0 0 var(--ed-yellow)"
                  : undefined,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/*
        `inert` removes the page from the tab order and the accessibility
        tree while the drawer is open — the other half of the focus trap.
        Without it, Tab walked into content hidden behind the backdrop.
      */}
      <main id="conteudo" inert={drawerOpen}>
        {children}
      </main>

      {footer}

      {/* Bottom bar: exactly three destinations, by contract. */}
      <nav
        aria-label="Navegação rápida"
        className="fixed right-0 bottom-0 left-0 z-40 border-[var(--ed-line)] border-t backdrop-blur-xl lg:hidden"
        data-testid="editorial-bottom-bar"
        data-visible={chromeVisible}
        style={{
          height: "var(--ed-bottombar-h)",
          background: "var(--ed-glass-light)",
          transform: chromeVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform var(--ed-duration-chrome) var(--ed-ease)",
        }}
      >
        <ul className="grid h-full grid-cols-3">
          {BOTTOM_NAV.map((item) => (
            <li className="contents" key={item.href}>
              <Link
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center text-[length:var(--ed-caption)]"
                href={item.href}
                style={{
                  color: isActive(item.href)
                    ? "var(--ed-ink)"
                    : "var(--ed-muted)",
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
