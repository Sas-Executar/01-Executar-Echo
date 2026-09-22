import {
  allQuickFrameworks,
  EXPECTED_QUICK_FRAMEWORK_COUNT,
  QUICK_FRAMEWORK_MACROGROUPS,
  quickFrameworksInGroup,
} from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Quick Frameworks EXECUTAR",
  description: `${EXPECTED_QUICK_FRAMEWORK_COUNT} Quick Frameworks — os fatores de risco cognitivo do Mapa Cognitivo e a série fundadora, cada um em 13 blocos: origem, contexto, 5W2H, processo e evidência.`,
});

/**
 * This page takes no request input — the 23 records are build-time
 * constant, same reasoning that already prerendered /frameworks and
 * /oficina/learn after both cold-started in a production sample.
 */
export const dynamic = "force-static";

/**
 * The real Quick Frameworks product. Not to be confused with
 * `/frameworks` (the 299-record general-purpose catalog), which
 * carried this name until it was corrected.
 *
 * 20 of the 23 records are the cognitive-risk factors that the Mapa
 * Cognitivo already materialises as `solutions[]` (`factor_id`
 * `FRC-01`..`FRC-20`) — this is their editorial explanation, not a
 * second, disconnected catalog. The other 3 are the Quick Framework
 * block of each founding-series article.
 */
const QuickFrameworks = () => {
  const all = allQuickFrameworks();
  const articles = all.filter((qf) => qf.id.startsWith("ARTICLE-"));
  const factorCount = all.length - articles.length;

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
          Quick Frameworks EXECUTAR
        </h1>
        <p
          className="ed-text-body-lg mt-5"
          style={{ color: "var(--ed-label-secondary)", lineHeight: 1.5 }}
        >
          {factorCount} fatores de risco cognitivo do Mapa Cognitivo, cada um em
          13 blocos: origem e etimologia, contexto, 5W2H, referência, problema,
          processo, visão do sistema e próximos passos. Ligados aos mesmos dados
          que o Mapa já mostra — não é um segundo catálogo.
        </p>
      </header>

      {articles.length > 0 ? (
        <section className="mt-14">
          <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
            Série fundadora
          </h2>
          <ul className="flex flex-col gap-3">
            {articles.map((qf) => (
              <li key={qf.id}>
                <Link
                  className="font-medium underline"
                  href={`/quick-frameworks/${qf.slug}`}
                  style={{
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {qf.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {QUICK_FRAMEWORK_MACROGROUPS.map((group) => {
        const items = quickFrameworksInGroup(group);
        if (items.length === 0) {
          return null;
        }
        return (
          <section className="mt-14" key={group}>
            <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
              {group}
            </h2>
            <ul
              className="grid gap-px sm:grid-cols-2"
              style={{ background: "var(--ed-separator)" }}
            >
              {items.map((qf) => (
                <li key={qf.id} style={{ background: "var(--ed-bg)" }}>
                  <Link
                    className="flex flex-col gap-1 p-5"
                    href={`/quick-frameworks/${qf.slug}`}
                    style={{ minHeight: 88 }}
                  >
                    <span className="font-medium">{qf.titulo}</span>
                    <span
                      className="ed-text-caption"
                      style={{ color: "var(--ed-label-secondary)" }}
                    >
                      {qf.factorId}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default QuickFrameworks;
