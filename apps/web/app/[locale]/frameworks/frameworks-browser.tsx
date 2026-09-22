"use client";

import type { Framework, FrameworkDomain } from "@repo/knowledge";
import Link from "next/link";
import { useMemo, useState } from "react";

interface FrameworksBrowserProps {
  readonly frameworks: readonly Framework[];
  readonly domains: readonly FrameworkDomain[];
}

/**
 * Search, filter and sort over the catalog — the same three affordances
 * ADR-UX-002 requires of every discovery surface in this ecosystem.
 *
 * Ranking is explainable by construction (exact name > alias > tag >
 * prose) rather than a similarity score, so a reader can tell why a
 * result is where it is.
 */
export function FrameworksBrowser({
  frameworks,
  domains,
}: FrameworksBrowserProps) {
  const [query, setQuery] = useState("");
  const [domainId, setDomainId] = useState("");
  const [sort, setSort] = useState<"nome" | "dominio">("nome");

  const results = useMemo(() => {
    const needle = fold(query);

    const filtered = frameworks.filter((framework) => {
      if (domainId && framework.domain_id !== domainId) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        fold(framework.name).includes(needle) ||
        framework.aliases.some((a) => fold(a).includes(needle)) ||
        framework.search_tags.some((t) => fold(t).includes(needle)) ||
        fold(framework.purpose).includes(needle)
      );
    });

    return [...filtered].sort((a, b) =>
      sort === "nome"
        ? a.name.localeCompare(b.name, "pt-BR")
        : a.domain_name.localeCompare(b.domain_name, "pt-BR") ||
          a.name.localeCompare(b.name, "pt-BR")
    );
  }, [frameworks, query, domainId, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <label className="flex-1">
          <span className="sr-only">Buscar framework</span>
          <input
            className="w-full"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, sigla ou propósito…"
            style={controlStyle}
            type="search"
            value={query}
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por domínio</span>
          <select
            onChange={(event) => setDomainId(event.target.value)}
            style={controlStyle}
            value={domainId}
          >
            <option value="">Todos os domínios ({frameworks.length})</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name} ({domain.framework_count})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Ordenar</span>
          <select
            onChange={(event) =>
              setSort(event.target.value === "dominio" ? "dominio" : "nome")
            }
            style={controlStyle}
            value={sort}
          >
            <option value="nome">Ordenar por nome</option>
            <option value="dominio">Ordenar por domínio</option>
          </select>
        </label>
      </div>

      <p
        aria-live="polite"
        className="mb-6 text-[length:var(--ed-small)]"
        style={{ color: "var(--ed-muted)" }}
      >
        {results.length === 0
          ? "Nenhum framework corresponde a essa busca."
          : `${results.length} de ${frameworks.length} frameworks`}
      </p>

      <ul className="grid gap-px md:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--ed-line)" }}>
        {results.map((framework) => (
          <li key={framework.id} style={{ background: "var(--ed-paper)" }}>
            <Link
              className="flex h-full flex-col gap-2 p-6"
              href={`/frameworks/${framework.slug}`}
              style={{ minHeight: 180 }}
            >
              <span
                className="text-[length:var(--ed-caption)] uppercase tracking-[.1em]"
                style={{ color: "var(--ed-muted)" }}
              >
                {framework.domain_name}
              </span>
              <span className="font-semibold text-[length:var(--ed-headline)] leading-tight">
                {framework.name}
              </span>
              <span
                className="text-[length:var(--ed-small)]"
                style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
              >
                {framework.purpose}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const controlStyle: React.CSSProperties = {
  minHeight: 44,
  paddingInline: 12,
  border: "1px solid var(--ed-line)",
  borderRadius: "var(--ed-radius-btn)",
  background: "var(--ed-paper)",
};

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
