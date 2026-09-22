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
        background: "var(--ed-charcoal)",
        color: "var(--ed-white)",
        marginTop: "var(--ed-section)",
      }}
    >
      <div
        className="mx-auto flex flex-col gap-10 py-16 md:flex-row md:justify-between"
        style={{
          maxWidth: "var(--ed-wide)",
          paddingInline: "var(--ed-gutter)",
        }}
      >
        <div className="flex flex-col gap-4">
          <Image
            alt="EXECUTAR"
            height={20}
            src="/brand/02_wordmark/executar-wordmark-white-1200px.png"
            style={{ height: 20, width: "auto" }}
            width={134}
          />
          <p
            className="max-w-sm text-[length:var(--ed-small)]"
            style={{ color: "rgba(255,255,255,.7)" }}
          >
            Entenda → Estruture → Execute. Análise da situação, nunca
            diagnóstico da pessoa.
          </p>
        </div>

        <div className="flex gap-16">
          <nav aria-label="Mais">
            <h2
              className="mb-4 font-semibold text-[length:var(--ed-caption)] uppercase"
              style={{ color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}
            >
              Mais
            </h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-[length:var(--ed-small)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2
              className="mb-4 font-semibold text-[length:var(--ed-caption)] uppercase"
              style={{ color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}
            >
              Legal
            </h2>
            <ul className="flex flex-col gap-3">
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    className="text-[length:var(--ed-small)]"
                    href={`/legal/${page.slug}`}
                  >
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
