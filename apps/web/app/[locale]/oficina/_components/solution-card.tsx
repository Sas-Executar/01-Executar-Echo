import {
  actionUnavailableReason,
  areaLabel,
  isPublished,
  productTypeLabel,
  type Solution,
} from "@repo/solution-store";
import Link from "next/link";

/**
 * The card is the primary unit of discovery (ADR-UX-001) and is shared
 * across solutions, articles and learning content.
 *
 * It reports the solution's real lifecycle state rather than implying
 * availability: none of the current records has cleared G6, and a card
 * that looked like a shipped product would misstate the pipeline they are
 * genuinely in.
 */
export function SolutionCard({ solution }: { readonly solution: Solution }) {
  const { identity, card, lifecycle } = solution;
  const content = card?.content;
  const primaryBlocked = actionUnavailableReason(card?.actions?.primary);

  return (
    <article style={{ background: "var(--ed-paper)" }}>
      <Link
        className="flex h-full flex-col gap-3 p-6"
        href={`/oficina/${identity.slug}`}
        style={{ minHeight: 260 }}
      >
        <span
          className="text-[length:var(--ed-caption)] uppercase tracking-[.1em]"
          style={{ color: "var(--ed-muted)" }}
        >
          {content?.eyebrow ?? productTypeLabel(identity.product_type)}
        </span>

        <h3 className="font-semibold text-[length:var(--ed-headline)] leading-tight">
          {content?.title ?? identity.solution_name}
        </h3>

        <p
          className="flex-1 text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
        >
          {content?.short_description ??
            solution.public_layer?.problem_statement ??
            ""}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {content?.primary_area || identity.category ? (
            <span
              className="text-[length:var(--ed-caption)]"
              style={{
                border: "1px solid var(--ed-line)",
                padding: "4px 8px",
              }}
            >
              {areaLabel(content?.primary_area) ?? identity.category}
            </span>
          ) : null}

          {/*
            State, not a badge of approval. `isPublished` is G6, and the
            blocked-action note says why Start isn't offered yet.
          */}
          <span
            className="text-[length:var(--ed-caption)]"
            style={{
              padding: "4px 8px",
              background: isPublished(solution)
                ? "var(--ed-yellow)"
                : "var(--ed-soft)",
              color: "var(--ed-ink)",
            }}
          >
            {isPublished(solution)
              ? "Publicado"
              : (lifecycle?.current_state ?? "Em produção")}
          </span>
        </div>

        <span
          className="text-[length:var(--ed-caption)]"
          style={{ color: "var(--ed-muted)" }}
        >
          {primaryBlocked ? primaryBlocked : "Pronto para usar →"}
        </span>
      </Link>
    </article>
  );
}
