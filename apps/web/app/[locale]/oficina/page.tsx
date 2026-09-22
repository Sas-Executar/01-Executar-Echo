import { createMetadata } from "@repo/seo/metadata";
import {
  allSolutions,
  catalogAreas,
  catalogProfessions,
} from "@repo/solution-store";
import type { Metadata } from "next";
import Link from "next/link";
import { SolutionCard } from "./_components/solution-card";

export const metadata: Metadata = createMetadata({
  title: "Oficina",
  description:
    "As soluções do ecossistema EXECUTAR: o que cada uma resolve, quando usá-la e quando ela é exagero.",
});

/**
 * Discover — the Oficina's entry surface (ADR-UX-001).
 *
 * Renders under the editorial identity, not the product one: the Oficina
 * sits in the reader's path from an article to a tool, alongside the Blog
 * and the Mapa (ADR-OFICINA-001).
 */
const Oficina = () => {
  const solutions = allSolutions();
  const areas = catalogAreas();
  const professions = catalogProfessions();

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-content-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <header style={{ maxWidth: "var(--ed-reading-max)" }}>
        <h1
          className="font-semibold"
          style={{
            fontSize: "var(--ed-display-md)",
            letterSpacing: "var(--ed-tracking-display-md)",
            lineHeight: 1.05,
          }}
        >
          Oficina
        </h1>
        <p
          className="ed-text-body-lg mt-5"
          style={{ color: "var(--ed-label-secondary)", lineHeight: 1.5 }}
        >
          Ferramentas do ecossistema, descritas pelo problema que resolvem. Cada
          ficha diz também quando a ferramenta é exagero — porque saber quando
          não usar algo economiza mais do que mais uma ferramenta.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="sr-only">Soluções</h2>
        <ul
          className="grid gap-px md:grid-cols-2 lg:grid-cols-3"
          style={{ background: "var(--ed-separator)" }}
        >
          {solutions.map((solution) => (
            <li className="contents" key={solution.identity.solution_id}>
              <SolutionCard solution={solution} />
            </li>
          ))}
        </ul>
      </section>

      {areas.length > 0 ? (
        <section className="mt-16">
          <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
            Áreas
          </h2>
          <ul className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <li
                className="ed-text-small"
                key={area.id}
                style={{
                  border: "1px solid var(--ed-separator)",
                  padding: "8px 12px",
                }}
              >
                {area.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {professions.length > 0 ? (
        <section className="mt-12">
          <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
            Por profissão
          </h2>
          <p
            className="ed-text-small mb-4"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            Profissões são uma dimensão tipada do catálogo, não etiquetas soltas
            — e a adequação a uma profissão regulada nunca é inferida a partir
            da categoria.
          </p>
          <ul className="flex flex-wrap gap-2">
            {professions.map((profession) => (
              <li key={profession.id}>
                <Link
                  className="ed-text-small inline-flex items-center"
                  href={`/oficina/learn#${profession.id}`}
                  style={{
                    minHeight: 44,
                    border: "1px solid var(--ed-separator)",
                    padding: "0 12px",
                  }}
                >
                  {profession.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="mt-16">
        <Link
          className="font-medium underline"
          href="/oficina/learn"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Learn — como começar, por profissão →
        </Link>
      </nav>
    </div>
  );
};

export default Oficina;
