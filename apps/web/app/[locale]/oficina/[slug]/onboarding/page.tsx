import { createMetadata } from "@repo/seo/metadata";
import {
  actionUnavailableReason,
  allSolutions,
  solutionBySlug,
} from "@repo/solution-store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OnboardingProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  allSolutions().map((solution) => ({ slug: solution.identity.slug }));

export const generateMetadata = async ({
  params,
}: OnboardingProps): Promise<Metadata> => {
  const { slug } = await params;
  const solution = solutionBySlug(slug);
  return solution
    ? createMetadata({
        title: `Como começar — ${solution.identity.solution_name}`,
        description:
          solution.onboarding?.steps?.[0]?.body ??
          "Os cinco passos para começar a usar esta solução.",
      })
    : {};
};

/**
 * Onboarding (ADR-UX-004): the five steps, entered from `Start`.
 *
 * Download stays a separate action from Start throughout — the contract
 * treats them as different intents, and collapsing them here would undo
 * that distinction at the last step.
 */
const Onboarding = async ({ params }: OnboardingProps) => {
  const { slug } = await params;
  const solution = solutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const steps = solution.onboarding?.steps ?? [];
  const primary = solution.card?.actions?.primary;
  const primaryBlocked = actionUnavailableReason(primary);

  return (
    <article
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-reading-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <p
        className="ed-text-caption mb-3 font-semibold uppercase tracking-[.12em]"
        style={{ color: "var(--ed-label-secondary)" }}
      >
        {solution.identity.solution_name}
      </p>
      <h1
        className="font-semibold"
        style={{
          fontSize: "var(--ed-display-md)",
          letterSpacing: "var(--ed-tracking-display-md)",
          lineHeight: 1.05,
        }}
      >
        Como começar
      </h1>

      {steps.length === 0 ? (
        <p className="mt-8" style={{ color: "var(--ed-label-secondary)" }}>
          Não disponível — o onboarding desta solução ainda não foi definido.
        </p>
      ) : (
        <ol className="mt-12 flex flex-col gap-10">
          {steps.map((step, index) => (
            <li key={step.id}>
              <p
                className="ed-text-caption mb-2 font-semibold uppercase tracking-[.12em]"
                style={{ color: "var(--ed-label-secondary)" }}
              >
                Passo {index + 1}
              </p>
              <h2 className="ed-text-headline font-semibold">{step.title}</h2>
              {step.body ? (
                <p className="mt-2" style={{ lineHeight: 1.6 }}>
                  {step.body}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-14 flex flex-wrap items-center gap-4">
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
          <p
            className="ed-text-small"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            {primaryBlocked} Esta solução ainda não tem um destino público para
            iniciar.
          </p>
        )}

        <Link
          className="font-medium underline"
          href={`/oficina/${solution.identity.slug}`}
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          ← Voltar à solução
        </Link>
      </div>
    </article>
  );
};

export default Onboarding;
