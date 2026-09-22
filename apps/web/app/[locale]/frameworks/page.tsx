import {
  allFrameworkDomains,
  allFrameworks,
  EXPECTED_FRAMEWORK_COUNT,
} from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { FrameworksBrowser } from "./frameworks-browser";

export const metadata: Metadata = createMetadata({
  title: "Frameworks de apoio",
  description: `${EXPECTED_FRAMEWORK_COUNT} frameworks de estratégia, produto, operações, pesquisa e engenharia — o que cada um organiza, e quando usá-lo.`,
});

/**
 * Rendered once at build time.
 *
 * This page takes no request input — the catalog is build-time constant
 * — but Next was treating it as dynamic, so every request re-serialized
 * all 299 records into the RSC payload. Measured on the deployed site,
 * that route failed roughly 1 request in 15 with a 502 or a >5s
 * response, while /mapa and the static routes were clean across the same
 * sample. Prerendering removes the per-request work entirely.
 */
export const dynamic = "force-static";

/**
 * The catalog of general-purpose frameworks that ships with
 * `skills/executar-safe-frameworks` (SKILL-EXE-SF-001) — SWOT, PESTEL,
 * 5 Whys and 296 others. It organises evidence about anything and
 * creates none of its own.
 *
 * This page used to call itself "Quick Frameworks". That name belongs
 * to a different, EXECUTAR-specific product — see `/quick-frameworks`
 * (`@repo/knowledge`'s `quick-frameworks.ts`) — which makes its own
 * claims about specific cognitive-risk factors, backed by its own
 * sources. Renamed here so the two are never confused again.
 */
const Frameworks = () => {
  const frameworks = allFrameworks();
  const domains = allFrameworkDomains();

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
          Frameworks de apoio
        </h1>
        <p
          className="ed-text-body-lg mt-5"
          style={{ color: "var(--ed-label-secondary)", lineHeight: 1.5 }}
        >
          {frameworks.length} frameworks em {domains.length} domínios. Um
          framework organiza evidência — ele não cria evidência. Cada ficha diz
          o que o modelo estrutura e onde ele se aplica, não o que é verdade
          sobre a sua situação.
        </p>
        <Link
          className="ed-text-small mt-4 inline-flex items-center underline"
          href="/quick-frameworks"
          style={{ color: "var(--ed-label-secondary)", minHeight: 44 }}
        >
          Procura o Quick Framework EXECUTAR? Ele fica em /quick-frameworks →
        </Link>
      </header>

      <div className="mt-12">
        <FrameworksBrowser domains={domains} frameworks={frameworks} />
      </div>
    </div>
  );
};

export default Frameworks;
