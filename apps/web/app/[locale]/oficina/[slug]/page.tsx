import { createMetadata } from "@repo/seo/metadata";
import {
  actionUnavailableReason,
  allSolutions,
  areaLabel,
  gates,
  productTypeLabel,
  professionLabel,
  type Solution,
  solutionBySlug,
} from "@repo/solution-store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SolutionTabs } from "./solution-tabs";

interface SolutionPageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  allSolutions().map((solution) => ({ slug: solution.identity.slug }));

export const generateMetadata = async ({
  params,
}: SolutionPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const solution = solutionBySlug(slug);

  if (!solution) {
    return {};
  }

  return createMetadata({
    title: `${solution.identity.solution_name} — Oficina`,
    description:
      solution.card?.content?.short_description ??
      solution.public_layer?.problem_statement ??
      "",
  });
};

const SolutionPage = async ({ params }: SolutionPageProps) => {
  const { slug } = await params;
  const solution = solutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const { identity, card, lifecycle, classification, scoring } = solution;

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-reading-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <p
        className="mb-3 font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
        style={{ color: "var(--ed-label-secondary)" }}
      >
        {card?.content?.eyebrow ?? productTypeLabel(identity.product_type)}
        {identity.version ? ` · v${identity.version}` : ""}
      </p>

      <h1
        className="font-semibold"
        style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
      >
        {identity.solution_name}
      </h1>

      {solution.public_layer?.problem_statement ? (
        <p
          className="mt-5 text-[length:var(--ed-body-lg)]"
          style={{ lineHeight: 1.5 }}
        >
          {solution.public_layer.problem_statement}
        </p>
      ) : null}

      <ActionBar slug={identity.slug} solution={solution} />

      <SolutionTabs solution={solution} />

      <section className="mt-16">
        <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
          Estado de produção
        </h2>
        <p
          className="mb-4 text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          Esta solução está em{" "}
          {lifecycle?.current_state ?? "estado não declarado"}. Os portões
          abaixo são os do runbook da Oficina — o que já foi concluído e o que
          ainda não.
        </p>
        <ul className="flex flex-wrap gap-2">
          {gates(solution).map(([name, passed]) => (
            <li
              className="text-[length:var(--ed-caption)]"
              key={name}
              style={{
                padding: "6px 10px",
                border: "1px solid var(--ed-separator)",
                background: passed ? "var(--ed-bg-grouped)" : "transparent",
                color: passed
                  ? "var(--ed-label-primary)"
                  : "var(--ed-label-secondary)",
              }}
            >
              {passed ? "✓" : "○"} {name}
            </li>
          ))}
        </ul>

        {lifecycle?.blockers?.length ? (
          <div className="mt-5">
            <h3 className="mb-2 font-semibold text-[length:var(--ed-small)]">
              Pendências declaradas
            </h3>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-[length:var(--ed-small)]">
              {lifecycle.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/*
          SEUS is CALIBRATION_REQUIRED, so no score exists. Saying so is
          more useful than rendering a number nobody could defend.
        */}
        {scoring?.status && scoring.status !== "SCORED" ? (
          <p
            className="mt-5 text-[length:var(--ed-caption)]"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            Pontuação de utilidade ({scoring.methodology_id ?? "SEUS"}):{" "}
            {scoring.status}. Nenhuma pontuação é exibida porque nenhuma foi
            medida.
          </p>
        ) : null}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
          Classificação
        </h2>
        <dl className="grid gap-4 text-[length:var(--ed-small)] sm:grid-cols-2">
          <div>
            <dt style={{ color: "var(--ed-label-secondary)" }}>
              Área principal
            </dt>
            <dd>{areaLabel(classification?.areas?.primary) ?? "—"}</dd>
          </div>
          <div>
            <dt style={{ color: "var(--ed-label-secondary)" }}>
              Tipo de produto
            </dt>
            <dd>{productTypeLabel(identity.product_type)}</dd>
          </div>
          {classification?.professions?.primary?.length ? (
            <div className="sm:col-span-2">
              <dt style={{ color: "var(--ed-label-secondary)" }}>Profissões</dt>
              <dd>
                {classification.professions.primary
                  .map((p) => professionLabel(p.profession_id))
                  .join(" · ")}
              </dd>
            </div>
          ) : null}
        </dl>

        {solution.source ? (
          <p
            className="mt-6 text-[length:var(--ed-caption)]"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            Fonte: {solution.source.repository} · {solution.source.path}
            {solution.source.note ? ` — ${solution.source.note}` : ""}
          </p>
        ) : null}
      </section>

      <nav className="mt-16">
        <Link
          className="font-medium underline"
          href="/oficina"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          ← Todas as soluções
        </Link>
      </nav>
    </div>
  );
};

/**
 * Start and Download are semantically distinct actions (ADR-UX-001):
 * Start begins use or onboarding, Download delivers a package.
 *
 * Either renders as a real control only when it has somewhere to go;
 * otherwise the reason appears in its place. A button that does nothing
 * is worse than no button — and the corpus's own cards record
 * unpublished targets as `PENDING_*`, which is honest in the data and
 * would be dishonest on screen.
 */
function ActionBar({
  solution,
  slug,
}: {
  readonly solution: Solution;
  readonly slug: string;
}) {
  const primary = solution.card?.actions?.primary;
  const secondary = solution.card?.actions?.secondary;
  const primaryBlocked = actionUnavailableReason(primary);
  const secondaryBlocked = actionUnavailableReason(secondary);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {primaryBlocked === null && primary?.target ? (
        <Link
          className="inline-flex items-center font-semibold"
          href={primary.target}
          style={{
            minHeight: 56,
            paddingInline: 24,
            background: "var(--ed-label-primary)",
            color: "var(--ed-bg)",
            borderRadius: "var(--ed-radius-control)",
          }}
        >
          {primary.label ?? "Start"}
        </Link>
      ) : (
        <span
          className="inline-flex items-center text-[length:var(--ed-small)]"
          style={{
            minHeight: 56,
            paddingInline: 20,
            border: "1px dashed var(--ed-separator)",
            color: "var(--ed-label-secondary)",
          }}
        >
          {primary?.label ?? "Start"} — {primaryBlocked}
        </span>
      )}

      {secondaryBlocked === null && secondary?.target ? (
        <Link
          className="inline-flex items-center font-semibold"
          href={secondary.target}
          style={{
            minHeight: 56,
            paddingInline: 24,
            border: "1px solid var(--ed-label-primary)",
            borderRadius: "var(--ed-radius-control)",
          }}
        >
          {secondary.label ?? "Download"}
        </Link>
      ) : null}

      <Link
        className="inline-flex items-center font-medium underline"
        href={`/oficina/${slug}/onboarding`}
        style={{ minHeight: 56, paddingInline: 8 }}
      >
        Como começar
      </Link>
    </div>
  );
}

export default SolutionPage;
