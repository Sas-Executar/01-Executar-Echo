#!/usr/bin/env bun
/**
 * Converts the 23 raw Quick Framework / founding-article source files
 * (vendored verbatim at `data/quick-frameworks/sources/`, from
 * `RC-KNW-001_QUICK_FRAMEWORKS_V1.zip` and
 * `RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1.zip` — see
 * `data/quick-frameworks/PROVENANCE.md`) into:
 *
 *   - `data/quick-frameworks/records.json` — the 23 Quick Framework
 *     records (`quickFrameworkSchema` in `../src/quick-frameworks.ts`),
 *     one per FRC-01..20 and one per article's "Parte A" block.
 *   - `packages/cms/content/blog/*.mdx` — the 3 founding articles'
 *     "Parte B" long-form body, as real blog posts.
 *
 * Not read at runtime — same discipline as the Mapa Cognitivo bundle:
 * this script runs once and its output is committed.
 *
 * Run: `bun run packages/knowledge/scripts/ingest-quick-frameworks.ts`
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCES_DIR = path.join(
  import.meta.dirname,
  "../data/quick-frameworks/sources"
);
const OUT_JSON = path.join(
  import.meta.dirname,
  "../data/quick-frameworks/records.json"
);
const CMS_BLOG_DIR = path.join(import.meta.dirname, "../../cms/content/blog");

const TITLE_RE = /^# (?:FRC-\d+\s+)?(.+)/m;
const FRASE_SINTESE_RE = /> \*\*Frase[- ]s[íi]ntese:\*\*\s*(.+)/;
const TERMO_RE = /\*\*Termo\.\*\*\s*(.+)/;
const SIGNIFICADO_RE = /\*\*Significado\.\*\*\s*(.+)/;
const ETIMOLOGIA_RE = /\*\*Etimologia\.\*\*\s*([\s\S]+)/;
const FIVEW2H_ROW_RE = /^\|\s*(.+?)\?\s*\|\s*(.+?)\s*\|$/;
const AUTOR_CURTO_RE = /\*\*Autor curto:\*\*\s*(.+)/;
const AUTOR_CURTO_STRIP_RE = /\*\*Autor curto:\*\*.*$/s;
const DEFINICAO_RE = /\*\*Definição\.\*\*\s*(.+)/;
const IDENTIFICACAO_RE = /\*\*Identificação\.\*\*\s*(.+)/;
const EXPLICACAO_RE = /\*\*Explicação\.\*\*\s*(.+)/;
const FECHAMENTO_RE = /\*\*Fechamento\.\*\*\s*(.+)/;
const PROCESSO_STEP_RE = /^\d+\.\s*\*\*(.+?)\*\*\s*(.+)$/gm;
const TRAILING_COLON_RE = /:$/;
const MERMAID_RE = /```mermaid\n([\s\S]*?)```/;
const NEXT_STEP_RE = /\*\*(Next \d+ — .+?):\*\*\s*(.+)/g;
const FONTE_RE = /^-\s*\[(.+?)\]\((.+?)\)\s*—\s*(.+)$/gm;
const RESUMO_RE = /\*\*Resumo\.\*\*\s*(.+)/;
const FRONTMATTER_LINE_RE = /^([a-z_]+):\s*"?(.+?)"?\s*$/gm;
const SENTENCE_SPLIT_RE = /(?<=[.!?])\s+/;

const SECTION_RE: Record<string, RegExp> = {
  origem: /Origem/,
  contexto: /Contexto/,
  cincoWDoisH: /5W2H/,
  referencia: /Referência padrão-ouro/,
  problemaExistente: /Problema existente/,
  problemaSolucionado: /Problema solucionado/,
  processo: /Processo/,
  visaoSistema: /Visão do sistema/,
  progresso: /Progresso esperado/,
  aviso: /Aviso/,
  next: /Next 01-02-03/,
  fontes: /Fontes e aprofundamento/,
  infografico: /Infográfico 16:9/,
};

function infograficoLabelRe(label: string): RegExp {
  return new RegExp(`\\*\\*${label}[^:]*:\\*\\*\\s*(.+)`);
}

/** The five macro-groups the FRC catalog's own CSV assigns each factor to. */
const MACROGROUP_BY_FACTOR: Record<string, string> = {};
{
  const csv = readFileSync(
    path.join(SOURCES_DIR, "MATRIZ_RASTREABILIDADE.csv"),
    "utf8"
  );
  const lines = csv.trim().split("\n").slice(1);
  for (const line of lines) {
    const [id, , macrogrupo] = line.split(",");
    if (id) {
      MACROGROUP_BY_FACTOR[id] = macrogrupo;
    }
  }
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Pulls the text of a `## N. Heading` section up to the next `## `. */
function section(body: string, heading: RegExp): string {
  const re = new RegExp(
    `## \\d+\\. ${heading.source}\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`,
    "i"
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function parseOrigem(text: string) {
  return {
    termo: text.match(TERMO_RE)?.[1]?.trim() ?? "",
    significado: text.match(SIGNIFICADO_RE)?.[1]?.trim() ?? "",
    etimologia: text.match(ETIMOLOGIA_RE)?.[1]?.trim() ?? "",
  };
}

function parse5W2H(text: string): { variavel: string; sintese: string }[] {
  const rows: { variavel: string; sintese: string }[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(FIVEW2H_ROW_RE);
    if (m) {
      rows.push({ variavel: `${m[1].trim()}?`, sintese: m[2].trim() });
    }
  }
  return rows;
}

function parseReferencia(text: string) {
  const autorCurto = text.match(AUTOR_CURTO_RE)?.[1]?.trim() ?? "";
  const texto = text.replace(AUTOR_CURTO_STRIP_RE, "").trim();
  return { texto, autorCurto };
}

function parseFourPart(text: string) {
  return {
    definicao: text.match(DEFINICAO_RE)?.[1]?.trim() ?? "",
    identificacao: text.match(IDENTIFICACAO_RE)?.[1]?.trim() ?? "",
    explicacao: text.match(EXPLICACAO_RE)?.[1]?.trim() ?? "",
    fechamento: text.match(FECHAMENTO_RE)?.[1]?.trim() ?? "",
  };
}

function parseProcesso(text: string): string[] {
  return [...text.matchAll(PROCESSO_STEP_RE)].map(
    (m) => `${m[1].replace(TRAILING_COLON_RE, "")}: ${m[2].trim()}`
  );
}

function firstMermaid(text: string): string {
  return text.match(MERMAID_RE)?.[1]?.trim() ?? "";
}

function parseNext(text: string) {
  const passos = [...text.matchAll(NEXT_STEP_RE)].map(
    (m) => `${m[1]}: ${m[2].trim()}`
  );
  return { passos, mermaid: firstMermaid(text) };
}

function parseFontes(
  text: string
): { label: string; href: string; nota: string }[] {
  return [...text.matchAll(FONTE_RE)].map((m) => ({
    label: m[1],
    href: m[2],
    nota: m[3].trim(),
  }));
}

function parseInfografico(text: string) {
  const get = (label: string) =>
    text.match(infograficoLabelRe(label))?.[1]?.trim() ?? "";
  const relacionados = get("Relacionados")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    premissa1: get("Premissa 1"),
    premissa2: get("Premissa 2"),
    premissa3: get("Premissa 3"),
    conclusao: get("Conclusão"),
    ilustracaoTopo: get("Ilustração de topo"),
    relacionados,
  };
}

interface QuickFrameworkRecord {
  aviso: string;
  cincoWDoisH: ReturnType<typeof parse5W2H>;
  contexto: string;
  factorId?: string;
  fontes: ReturnType<typeof parseFontes>;
  fraseSintese: string;
  id: string;
  infografico: ReturnType<typeof parseInfografico>;
  macrogrupo?: string;
  next: ReturnType<typeof parseNext>;
  origem: ReturnType<typeof parseOrigem>;
  problemaExistente: ReturnType<typeof parseFourPart>;
  problemaSolucionado: ReturnType<typeof parseFourPart>;
  processo: string[];
  progressoEsperado: string;
  referencia: ReturnType<typeof parseReferencia>;
  slug: string;
  titulo: string;
  visaoSistemaMermaid: string;
}

function parsePartA(
  id: string,
  titulo: string,
  body: string,
  fraseSource = body
): QuickFrameworkRecord {
  // Articles carry the frase-síntese above "# Parte A", outside the slice
  // passed as `body` — `fraseSource` lets the caller pass the full raw
  // file instead while everything else still parses from `body`.
  const fraseSintese = fraseSource.match(FRASE_SINTESE_RE)?.[1]?.trim() ?? "";
  const macrogrupo = MACROGROUP_BY_FACTOR[id];
  return {
    id,
    slug: slugify(titulo),
    titulo,
    fraseSintese,
    factorId: id.startsWith("FRC-") ? id : undefined,
    macrogrupo,
    origem: parseOrigem(section(body, SECTION_RE.origem)),
    contexto: section(body, SECTION_RE.contexto),
    cincoWDoisH: parse5W2H(section(body, SECTION_RE.cincoWDoisH)),
    referencia: parseReferencia(section(body, SECTION_RE.referencia)),
    problemaExistente: parseFourPart(
      section(body, SECTION_RE.problemaExistente)
    ),
    problemaSolucionado: parseFourPart(
      section(body, SECTION_RE.problemaSolucionado)
    ),
    processo: parseProcesso(section(body, SECTION_RE.processo)),
    visaoSistemaMermaid: firstMermaid(section(body, SECTION_RE.visaoSistema)),
    progressoEsperado: section(body, SECTION_RE.progresso),
    aviso: section(body, SECTION_RE.aviso),
    next: parseNext(section(body, SECTION_RE.next)),
    fontes: parseFontes(section(body, SECTION_RE.fontes)),
    infografico: parseInfografico(section(body, SECTION_RE.infografico)),
  };
}

const records: QuickFrameworkRecord[] = [];

for (const file of readdirSync(SOURCES_DIR).sort()) {
  if (!file.endsWith(".md")) {
    continue;
  }
  const raw = readFileSync(path.join(SOURCES_DIR, file), "utf8");

  if (file.startsWith("FRC-")) {
    const id = file.split("__")[0];
    const titulo = raw.match(TITLE_RE)?.[1]?.trim() ?? id;
    records.push(parsePartA(id, titulo, raw));
    continue;
  }

  // Article: frontmatter + "Parte A Quick Framework" + "Parte B Artigo completo".
  const fm = Object.fromEntries(
    [...raw.matchAll(FRONTMATTER_LINE_RE)].map((m) => [m[1], m[2]])
  );
  const partA = raw.slice(raw.indexOf("# Parte A"), raw.indexOf("# Parte B"));
  const partB = raw.slice(raw.indexOf("# Parte B"));

  records.push(parsePartA(fm.id, fm.titulo, partA, raw));

  // The blog post itself, from Parte B. Slug is verbatim from the
  // source's own `url:` field — not invented.
  const slug = fm.url.replace(/^\/|\/$/g, "");
  const bodyMd = partB.replace(/^# Parte B Artigo completo\n/, "");
  const resumo = raw.match(RESUMO_RE)?.[1]?.trim() ?? fm.titulo;
  // The article's own closing line ("Este artigo delimita...") describes
  // the piece rather than hooking the reader; the meta description uses
  // just the opening sentence, matching the one-line style TP-001 uses.
  const description = resumo.split(SENTENCE_SPLIT_RE)[0];

  const frontmatter = [
    "---",
    `title: "${fm.titulo}"`,
    `description: "${description.replace(/"/g, "'")}"`,
    'date: "2026-09-22"',
    "# Classificação pela taxonomia canônica (#06-PILARES-TAXONOMIA/taxonomia.yaml).",
    "# Reaproveita o pilar já usado por TP-001 — nenhum termo novo.",
    'pillar: "Riscos Cognitivos"',
    'author: "Leonardo Pimentel"',
    'tags: ["risco-cognitivo", "fatores-de-risco", "serie-fundadora"]',
    "---",
    "",
    `{/* Fonte: RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1, ${fm.id}. Frontmatter da fonte marca`,
    `   status: ${fm.status} — publicado por decisão do usuário em 2026-09-22 (DECISION_LOG). */}`,
    "",
    bodyMd.trim(),
    "",
  ].join("\n");

  writeFileSync(path.join(CMS_BLOG_DIR, `${slug}.mdx`), frontmatter);
  process.stdout.write(`wrote blog post: ${slug}.mdx\n`);
}

writeFileSync(OUT_JSON, `${JSON.stringify(records, null, 2)}\n`);
process.stdout.write(
  `wrote ${records.length} Quick Framework records to ${OUT_JSON}\n`
);
