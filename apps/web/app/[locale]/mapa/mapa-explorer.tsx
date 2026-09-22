"use client";

import type {
  CognitiveMap,
  MapEdge,
  MapEvidence,
  MapNode,
} from "@repo/knowledge";
import { NOT_AVAILABLE } from "@repo/knowledge";
import { useMemo, useState } from "react";

/** Reader-facing names for the epistemic classes carried by every node. */
const EPISTEMIC_LABEL: Record<string, string> = {
  A: "Observado",
  B: "Primário",
  C: "Publicado",
  D: "Interno",
  E: "Inferido",
};

/**
 * The four modes from MAPA-PRD-001. Each is a different question, not a
 * different styling of the same list.
 */
interface Mode {
  readonly id: string;
  readonly label: string;
  /** `null` means every node type — the unfiltered Explorar view. */
  readonly types: readonly string[] | null;
}

const MODES: readonly Mode[] = [
  { id: "explorar", label: "Explorar", types: null },
  { id: "fatores", label: "Fatores", types: ["frc_factor"] },
  {
    id: "solucoes",
    label: "Soluções",
    types: ["solution", "control", "engine"],
  },
  { id: "evidencias", label: "Evidências", types: ["evidence", "claim"] },
];

type ModeId = string;

interface MapaExplorerProps {
  readonly map: CognitiveMap;
  /** Deep-linked node, resolved on the server so a shared link renders. */
  readonly initialNodeId: string | null;
}

export function MapaExplorer({ map, initialNodeId }: MapaExplorerProps) {
  const [mode, setMode] = useState<ModeId>("explorar");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(initialNodeId);

  const nodeIndex = useMemo(
    () => new Map(map.nodes.map((node) => [node.id, node])),
    [map.nodes]
  );

  const groups = useMemo(() => {
    const set = new Set<string>();
    for (const node of map.nodes) {
      if (node.group) {
        set.add(node.group);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [map.nodes]);

  const visible = useMemo(() => {
    const allowed = MODES.find((m) => m.id === mode)?.types;
    const needle = fold(query);
    return map.nodes.filter((node) => {
      if (allowed && !allowed.includes(node.type)) {
        return false;
      }
      if (group && node.group !== group) {
        return false;
      }
      if (needle && !fold(`${node.label} ${node.id}`).includes(needle)) {
        return false;
      }
      return true;
    });
  }, [map.nodes, mode, group, query]);

  const selected = selectedId ? nodeIndex.get(selectedId) : undefined;

  const relations = useMemo(() => {
    if (!selected) {
      return [];
    }
    return map.edges.filter(
      (edge) => edge.source === selected.id || edge.target === selected.id
    );
  }, [map.edges, selected]);

  return (
    <div>
      {/*
        The governance rule travels with the data (metadata.governance_rule)
        and is shown, not paraphrased: the whole point of the distinction is
        that a factor is not a risk, and a map that blurs them would teach
        the opposite of what the corpus says.
      */}
      <p
        className="mb-8 border-l-4 py-2 pl-4 text-[length:var(--ed-small)]"
        style={{
          borderColor: "var(--ed-yellow)",
          color: "var(--ed-muted)",
        }}
      >
        {map.metadata.governance_rule}
      </p>

      <div
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Modo de exploração"
      >
        {MODES.map((m) => (
          <button
            aria-selected={mode === m.id}
            className="font-medium text-[length:var(--ed-small)]"
            key={m.id}
            onClick={() => setMode(m.id)}
            role="tab"
            style={{
              minHeight: 44,
              paddingInline: 16,
              borderRadius: "var(--ed-radius-btn)",
              background: mode === m.id ? "var(--ed-black)" : "transparent",
              color: mode === m.id ? "var(--ed-white)" : "var(--ed-ink)",
              border: `1px solid ${mode === m.id ? "var(--ed-black)" : "var(--ed-line)"}`,
            }}
            type="button"
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Buscar no mapa</span>
          <input
            className="w-full"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar conceito, fator, evidência…"
            style={{
              minHeight: 44,
              paddingInline: 12,
              border: "1px solid var(--ed-line)",
              borderRadius: "var(--ed-radius-btn)",
              background: "var(--ed-paper)",
            }}
            type="search"
            value={query}
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por grupo</span>
          <select
            className="w-full sm:w-auto"
            onChange={(event) => setGroup(event.target.value)}
            style={{
              minHeight: 44,
              paddingInline: 12,
              border: "1px solid var(--ed-line)",
              borderRadius: "var(--ed-radius-btn)",
              background: "var(--ed-paper)",
            }}
            value={group}
          >
            <option value="">Todos os grupos ({map.nodes.length})</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p
        aria-live="polite"
        className="mb-4 text-[length:var(--ed-small)]"
        style={{ color: "var(--ed-muted)" }}
      >
        {visible.length === 0
          ? "Nenhum nó corresponde a esses filtros."
          : `${visible.length} de ${map.nodes.length} nós · ${map.edges.length} relações no grafo`}
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/*
          The List view is the primary view, not a fallback. It is fully
          keyboard operable and readable by assistive technology, which a
          force-directed canvas is not — MAPA-PRD-001 requires that the
          same information be reachable without the graph rendering.
        */}
        <ul
          aria-label="Nós do mapa"
          className="max-h-[560px] overflow-y-auto"
          style={{ border: "1px solid var(--ed-line)" }}
        >
          {visible.map((node) => (
            <li key={node.id}>
              <button
                aria-current={selectedId === node.id ? "true" : undefined}
                className="w-full text-left"
                onClick={() => setSelectedId(node.id)}
                style={{
                  minHeight: 56,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--ed-line)",
                  background:
                    selectedId === node.id ? "var(--ed-soft)" : "transparent",
                  boxShadow:
                    selectedId === node.id
                      ? "inset 3px 0 0 var(--ed-yellow)"
                      : undefined,
                }}
                type="button"
              >
                <span className="block font-medium">{node.label}</span>
                <span
                  className="block text-[length:var(--ed-caption)]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {node.type} · {node.layer}
                  {node.group ? ` · ${node.group}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div aria-live="polite">
          {selected ? (
            <NodeDetail
              evidence={map.evidence}
              node={selected}
              nodeIndex={nodeIndex}
              onSelect={setSelectedId}
              relations={relations}
            />
          ) : (
            <p style={{ color: "var(--ed-muted)" }}>
              Selecione um nó para ver suas relações, a classe epistêmica e a
              evidência associada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface NodeDetailProps {
  readonly node: MapNode;
  readonly relations: MapEdge[];
  readonly nodeIndex: Map<string, MapNode>;
  readonly evidence: MapEvidence[];
  readonly onSelect: (id: string) => void;
}

function NodeDetail({
  node,
  relations,
  nodeIndex,
  evidence,
  onSelect,
}: NodeDetailProps) {
  return (
    <article style={{ border: "1px solid var(--ed-line)", padding: 24 }}>
      <h2 className="font-semibold text-[length:var(--ed-headline)]">
        {node.label}
      </h2>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-[length:var(--ed-small)]">
        <Field label="Tipo" value={node.type} />
        <Field label="Camada" value={node.layer} />
        <Field label="Grupo" value={node.group} />
        <Field
          label="Classe epistêmica"
          value={`${node.epistemic_class} · ${EPISTEMIC_LABEL[node.epistemic_class] ?? NOT_AVAILABLE}`}
        />
        <Field label="Estado" value={node.status} />
        <Field label="Origem" value={node.source_ref} />
      </dl>

      {node.notes ? (
        <p className="mt-4 text-[length:var(--ed-small)]">{node.notes}</p>
      ) : null}

      <h3 className="mt-8 mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
        Relações ({relations.length})
      </h3>
      <ul className="flex flex-col gap-3">
        {relations.map((edge) => {
          const isOutgoing = edge.source === node.id;
          const otherId = isOutgoing ? edge.target : edge.source;
          const other = nodeIndex.get(otherId);
          const record = edge.evidence_ref
            ? evidence.find(
                (item) =>
                  item.evidence_id === edge.evidence_ref ||
                  item.claim_id === edge.evidence_ref
              )
            : undefined;

          return (
            <li
              // Addressed by its stable edge_id so a shared relation link
              // keeps resolving to the same relation.
              id={edge.edge_id}
              key={edge.edge_id}
              style={{ borderTop: "1px solid var(--ed-line)", paddingTop: 12 }}
            >
              <p className="text-[length:var(--ed-small)]">
                <span style={{ color: "var(--ed-muted)" }}>
                  {isOutgoing ? "→" : "←"} {edge.relation.replace(/_/g, " ")}
                </span>{" "}
                <button
                  className="font-medium underline"
                  onClick={() => onSelect(otherId)}
                  style={{ minHeight: 24 }}
                  type="button"
                >
                  {other?.label ?? otherId}
                </button>
              </p>
              <p
                className="text-[length:var(--ed-caption)]"
                style={{ color: "var(--ed-muted)" }}
              >
                {edge.edge_id} · classe {edge.epistemic_class}
                {edge.weight ? ` · peso ${edge.weight}` : ""}
                {edge.evidence_ref ? ` · ${edge.evidence_ref}` : ""}
              </p>

              {/*
                An authorized statement never appears without the limit on
                how far it may be read. Separating them is precisely the
                misreading the corpus warns against.
              */}
              {record ? (
                <blockquote
                  className="mt-2 pl-3 text-[length:var(--ed-caption)]"
                  style={{ borderLeft: "3px solid var(--ed-yellow)" }}
                >
                  <p>{record.authorized_statement}</p>
                  <p className="mt-1" style={{ color: "var(--ed-muted)" }}>
                    Limite de interpretação:{" "}
                    {record.interpretation_limit ?? NOT_AVAILABLE}
                  </p>
                </blockquote>
              ) : null}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function Field({
  label,
  value,
}: {
  readonly label: string;
  readonly value?: string;
}) {
  return (
    <div>
      <dt
        className="text-[length:var(--ed-caption)] uppercase tracking-wider"
        style={{ color: "var(--ed-muted)" }}
      >
        {label}
      </dt>
      {/* Absent data is named as absent, never left blank or guessed. */}
      <dd>{value?.trim() ? value : NOT_AVAILABLE}</dd>
    </div>
  );
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
