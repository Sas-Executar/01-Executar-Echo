import { blog } from "@repo/cms";
import { searchFrameworks } from "@repo/knowledge";
import { loadCognitiveMap, searchNodes } from "@repo/knowledge/server";
import { createMetadata } from "@repo/seo/metadata";
import { allSolutions } from "@repo/solution-store";
import type { Metadata } from "next";
import Link from "next/link";

interface BuscarProps {
  readonly searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = createMetadata({
  title: "Buscar",
  description:
    "Busca única sobre artigos, conceitos do Mapa Cognitivo, frameworks e soluções da Oficina.",
});

/**
 * Search across every public corpus at once.
 *
 * The v6 handoff leaves this view unspecified — it notes the ⌕ control
 * has no associated view and marks it pending. Rather than leave the
 * control pointing at a 404 (which is what it did, caught by checking
 * failing requests on the deployed site), this searches the corpora that
 * already exist, using the same functions each surface uses.
 *
 * Nothing new is invented: an empty result says so, and says where it
 * looked.
 */
const Buscar = async ({ searchParams }: BuscarProps) => {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const map = loadCognitiveMap();
  const posts = await blog.getPosts();

  const concepts = query ? searchNodes(map, query).slice(0, 8) : [];
  const frameworks = query ? searchFrameworks(query, 8) : [];
  const articles = query
    ? posts.filter((post) =>
        fold(
          `${post.title} ${post.description} ${post.tags.join(" ")}`
        ).includes(fold(query))
      )
    : [];
  const solutions = query
    ? allSolutions().filter((solution) =>
        fold(
          [
            solution.identity.solution_name,
            solution.public_layer?.problem_statement,
          ]
            .filter(Boolean)
            .join(" ")
        ).includes(fold(query))
      )
    : [];

  const total =
    concepts.length + frameworks.length + articles.length + solutions.length;

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-reading-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <h1
        className="font-semibold"
        style={{
          fontSize: "var(--ed-display-md)",
          letterSpacing: "var(--ed-tracking-display-md)",
          lineHeight: 1.05,
        }}
      >
        Buscar
      </h1>

      <form action="/buscar" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Termo de busca</span>
          <input
            className="w-full"
            defaultValue={query}
            name="q"
            placeholder="Conceito, fator, framework ou ferramenta…"
            style={{
              minHeight: 56,
              paddingInline: 16,
              border: "1px solid var(--ed-separator)",
              borderRadius: "var(--ed-radius-control)",
              background: "var(--ed-bg)",
            }}
            type="search"
          />
        </label>
        <button
          className="font-semibold"
          style={{
            minHeight: 56,
            paddingInline: 24,
            background: "var(--ed-label-primary)",
            color: "var(--ed-bg)",
            borderRadius: "var(--ed-radius-control)",
          }}
          type="submit"
        >
          Buscar
        </button>
      </form>

      {query === "" ? (
        <p className="mt-10" style={{ color: "var(--ed-label-secondary)" }}>
          A busca cobre artigos, conceitos do Mapa Cognitivo, frameworks e
          soluções da Oficina.
        </p>
      ) : null}

      {query !== "" && total === 0 ? (
        <div className="mt-10">
          <p className="font-medium">Nenhum resultado para “{query}”.</p>
          <p
            className="ed-text-small mt-2"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            Foram consultados: {posts.length}{" "}
            {posts.length === 1 ? "artigo" : "artigos"}, {map.nodes.length} nós
            do Mapa, o catálogo de frameworks e {allSolutions().length} soluções
            da Oficina.
          </p>
        </div>
      ) : null}

      {total > 0 ? (
        <div className="mt-12 flex flex-col gap-12">
          <ResultGroup
            items={articles.map((post) => ({
              key: post.slug,
              href: `/blog/${post.slug}`,
              label: post.title,
              detail: post.description,
            }))}
            title="Artigos"
          />
          <ResultGroup
            items={concepts.map((node) => ({
              key: node.id,
              href: `/mapa?no=${encodeURIComponent(node.id)}`,
              label: node.label,
              detail: `${node.type} · camada ${node.layer}`,
            }))}
            title="Conceitos no Mapa"
          />
          <ResultGroup
            items={frameworks.map((framework) => ({
              key: framework.id,
              href: `/frameworks/${framework.slug}`,
              label: framework.name,
              detail: framework.purpose,
            }))}
            title="Frameworks"
          />
          <ResultGroup
            items={solutions.map((solution) => ({
              key: solution.identity.solution_id,
              href: `/oficina/${solution.identity.slug}`,
              label: solution.identity.solution_name,
              detail: solution.public_layer?.problem_statement ?? "",
            }))}
            title="Soluções"
          />
        </div>
      ) : null}
    </div>
  );
};

interface ResultItem {
  readonly detail: string;
  readonly href: string;
  readonly key: string;
  readonly label: string;
}

function ResultGroup({
  title,
  items,
}: {
  readonly title: string;
  readonly items: readonly ResultItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
        {title} ({items.length})
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              className="font-medium underline"
              href={item.href}
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {item.label}
            </Link>
            {item.detail ? (
              <p
                className="ed-text-caption"
                style={{ color: "var(--ed-label-secondary)" }}
              >
                {item.detail}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function fold(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export default Buscar;
