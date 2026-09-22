import { EXPECTED_COUNTS } from "@repo/knowledge";
import { findNode, loadCognitiveMap } from "@repo/knowledge/server";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { MapaExplorer } from "./mapa-explorer";

interface MapaProps {
  readonly searchParams: Promise<{ no?: string }>;
}

export const metadata: Metadata = createMetadata({
  title: "Mapa Cognitivo",
  description:
    "O grafo de fatores, funções cognitivas, manifestações operacionais, controles e evidências que compõem o custo cognitivo da execução.",
});

/**
 * The public Mapa Cognitivo (MAPA-PRD-001).
 *
 * Distinct from Mapa-OS, the internal execution surface in apps/app —
 * see docs/adr/ADR-MAPA-001-mapa-reconciliation.md.
 *
 * The graph is read from the supplied `SCHEMA-RC-SOLUTION-004` artifact
 * and validated on load. It is never generated here.
 */
const Mapa = async ({ searchParams }: MapaProps) => {
  const map = loadCognitiveMap();
  const { no } = await searchParams;

  // Resolved server-side so a shared deep link renders the right node in
  // the initial HTML rather than after hydration.
  const initialNodeId = no && findNode(map, no) ? no : null;

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
        <p
          className="mb-3 font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
          style={{ color: "var(--ed-muted)" }}
        >
          {map.metadata.project}
        </p>
        <h1
          className="font-semibold"
          style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
        >
          Mapa Cognitivo
        </h1>
        <p
          className="mt-5 text-[length:var(--ed-body-lg)]"
          style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
        >
          {EXPECTED_COUNTS.nodes} nós e {EXPECTED_COUNTS.edges} relações entre
          fatores de risco cognitivo, funções executivas, manifestações
          operacionais, controles e evidências. Cada relação carrega a sua
          classe epistêmica — o que foi observado, publicado ou inferido fica
          explícito.
        </p>
      </header>

      <div className="mt-12">
        <MapaExplorer initialNodeId={initialNodeId} map={map} />
      </div>
    </div>
  );
};

export default Mapa;
