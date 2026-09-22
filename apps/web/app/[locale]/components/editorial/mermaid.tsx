"use client";

import { use, useEffect, useId, useState } from "react";

/**
 * Renders a Mermaid diagram from raw chart source, for the ~2 diagrams
 * each Quick Framework record carries ("Visão do sistema", "Next
 * 01-02-03") and for a ` ```mermaid ` fence inside a blog article's MDX
 * body (see `packages/cms/lib/posts.ts`).
 *
 * Modelled on `docs/components/geistdocs/mermaid.tsx` (same dynamic
 * import + render cache), but without `next-themes`: this surface
 * doesn't use the product's `.dark` class, it decides appearance by
 * `prefers-color-scheme` alone (`packages/editorial-tokens/css/
 * editorial.css`) — so the signal this component reads is the same one
 * the token layer already reads, rather than a mechanism (`next-themes`
 * `resolvedTheme`) that has no reason to track it.
 */
export const Mermaid = ({ chart }: { chart: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <MermaidContent chart={chart} />;
};

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached) {
    return cached as Promise<T>;
  }

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(query.matches);
    const onChange = (event: MediaQueryListEvent) => setDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return dark;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const dark = usePrefersDark();
  const { default: mermaid } = use(
    cachePromise("mermaid", () => import("mermaid"))
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    fontFamily: "inherit",
    theme: dark ? "dark" : "default",
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${id}-${dark}-${chart}`, () => mermaid.render(id, chart))
  );

  return (
    <div
      className="ed-article-mermaid"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid.render() returns sanitized SVG under securityLevel "strict"; the chart source is either this repo's own committed data or a fenced code block from this repo's own MDX content, never user input.
      dangerouslySetInnerHTML={{ __html: svg }}
      ref={(container) => {
        if (container) {
          bindFunctions?.(container);
        }
      }}
    />
  );
}
