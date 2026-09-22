import { legal } from "@repo/cms";
import Image from "next/image";
import Link from "next/link";
import { FOOTER_NAV } from "./nav-config";

/**
 * Editorial footer.
 *
 * Per the v6 handoff the footer does **not** repeat the main navigation —
 * it carries secondary and legal links only. Duplicating the primary nav
 * here is the specific thing the contract rules out.
 */
export const EditorialFooter = async () => {
  const legalPages = await legal.getPostsMeta();

  return (
    <footer
      style={{
        background: "var(--ed-bg-grouped)",
        color: "var(--ed-label-primary)",
        borderTop: "1px solid var(--ed-separator)",
        marginTop: "var(--ed-section)",
      }}
    >
      <div
        className="mx-auto flex flex-col gap-10 py-16 md:flex-row md:justify-between"
        style={{
          maxWidth: "var(--ed-content-max)",
          paddingInline: "var(--ed-gutter)",
        }}
      >
        <div className="flex flex-col gap-4">
          {/*
            The footer is neutral in v2 — content dominates, the brand is
            subordinate — so the wordmark has to follow the appearance
            rather than the old charcoal band. The brand package ships
            only flat black and white PNGs, so both are rendered and the
            token layer hides one (`.ed-mark-light` / `.ed-mark-dark`).
          */}
          <Image
            alt="EXECUTAR"
            className="ed-mark-light"
            height={20}
            src="/brand/02_wordmark/executar-wordmark-black-1200px.png"
            style={{ height: 20, width: "auto" }}
            width={134}
          />
          <Image
            alt=""
            aria-hidden
            className="ed-mark-dark"
            height={20}
            src="/brand/02_wordmark/executar-wordmark-white-1200px.png"
            style={{ height: 20, width: "auto" }}
            width={134}
          />
          <p
            className="ed-text-small max-w-sm"
            style={{ color: "rgba(255,255,255,.7)" }}
          >
            Entenda → Estruture → Execute. Análise da situação, nunca
            diagnóstico da pessoa.
          </p>
        </div>

        <div className="flex gap-16">
          <nav aria-label="Mais">
            <h2
              className="ed-text-caption mb-4 font-semibold uppercase"
              style={{ color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}
            >
              Mais
            </h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link className="ed-text-small" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2
              className="ed-text-caption mb-4 font-semibold uppercase"
              style={{ color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}
            >
              Legal
            </h2>
            <ul className="flex flex-col gap-3">
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link className="ed-text-small" href={`/legal/${page.slug}`}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
