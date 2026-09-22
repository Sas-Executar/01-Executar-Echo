import {
  catalogProfessions,
  solutionsForProfession,
} from "@repo/solution-store";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { SolutionCard } from "../_components/solution-card";

export const metadata: Metadata = createMetadata({
  title: "Learn — Oficina",
  description:
    "Por onde começar na Oficina, organizado por profissão e pelo problema que cada solução resolve.",
});

/**
 * Learn (ADR-UX-004) — connected to the store but distinct from it.
 *
 * Browse-by-role is fed from the `PROFESSIONS.yaml` registry via each
 * solution's own classification, so a profession appears here only
 * because a solution declared it. Nothing is inferred: the registry's
 * rule that regulated-profession suitability must never be derived from a
 * category is respected by simply not deriving anything.
 */
const Learn = () => {
  const professions = catalogProfessions();

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-wide)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <header style={{ maxWidth: "var(--ed-read)" }}>
        <h1
          className="font-semibold"
          style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
        >
          Learn
        </h1>
        <p
          className="mt-5 text-[length:var(--ed-body-lg)]"
          style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
        >
          Por onde começar, organizado por profissão. Uma profissão aparece
          aqui porque alguma solução a declarou no próprio contrato — não
          porque foi deduzida da categoria.
        </p>
      </header>

      {professions.length === 0 ? (
        <p className="mt-12" style={{ color: "var(--ed-muted)" }}>
          Nenhuma solução declarou profissões ainda.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {professions.map((profession) => {
            const solutions = solutionsForProfession(profession.id);
            return (
              <section id={profession.id} key={profession.id}>
                <h2 className="mb-2 font-semibold text-[length:var(--ed-headline)]">
                  {profession.label}
                </h2>
                <p
                  className="mb-5 text-[length:var(--ed-small)]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {solutions.length}{" "}
                  {solutions.length === 1 ? "solução" : "soluções"}
                </p>
                <ul
                  className="grid gap-px md:grid-cols-2 lg:grid-cols-3"
                  style={{ background: "var(--ed-line)" }}
                >
                  {solutions.map((solution) => (
                    <li className="contents" key={solution.identity.solution_id}>
                      <SolutionCard solution={solution} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <nav className="mt-16">
        <Link
          className="font-medium underline"
          href="/oficina"
          style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}
        >
          ← Voltar à Oficina
        </Link>
      </nav>
    </div>
  );
};

export default Learn;
