import { blog } from "@repo/cms";
import { AUTHOR, NARRATIVE_ARCHITECTURE } from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "EXECUTAR — o custo cognitivo da execução",
  description:
    "O esforço de trabalhar raramente é uma questão de disciplina. É uma questão de condições — e condições podem ser mudadas.",
});

/**
 * Institutional home.
 *
 * The previous version was next-forge's marketing shell with the copy
 * swapped: a bento grid of repeated icons, a stats band and an FAQ, none
 * of which said what this publication is about. This is written from the
 * corpus instead — the thesis, the narrative architecture the content
 * actually follows, and doors into the four surfaces that exist.
 *
 * `force-dynamic` is retained from the previous version: the flags SDK
 * swallowed Next's internal render-control signals on this route and
 * left renders in a not-found state, which is how "/" came back 404 in
 * production (documented in DECISION_LOG and the commit that fixed it).
 */
export const dynamic = "force-dynamic";

const SURFACES = [
  {
    href: "/blog",
    title: "Blog",
    body: "Fatores, mecanismos e evidência — o que aumenta o custo de executar.",
  },
  {
    href: "/mapa",
    title: "Mapa Cognitivo",
    body: "237 nós e 528 relações entre fatores, funções executivas, manifestações e controles.",
  },
  {
    href: "/frameworks",
    title: "Quick Frameworks",
    body: "299 modelos para organizar evidência. Um framework estrutura; não cria evidência.",
  },
  {
    href: "/oficina",
    title: "Oficina",
    body: "Ferramentas descritas pelo problema que resolvem — e por quando são exagero.",
  },
] as const;

const Home = async () => {
  const latest = await blog.getLatestPostMeta();

  return (
    <div>
      <section
        className="mx-auto"
        style={{
          maxWidth: "var(--ed-content-max)",
          paddingInline: "var(--ed-gutter)",
          paddingBlock: "var(--ed-section)",
        }}
      >
        <p
          className="ed-text-caption mb-5 font-semibold uppercase tracking-[.16em]"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          {AUTHOR.tagline}
        </p>

        <h1
          className="font-semibold"
          style={{
            fontSize: "var(--ed-display-xl)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            maxWidth: "16ch",
          }}
        >
          O esforço não é falta de disciplina.
        </h1>

        <p
          className="ed-text-body-lg mt-8"
          style={{
            color: "var(--ed-label-secondary)",
            lineHeight: 1.5,
            maxWidth: "var(--ed-reading-max)",
          }}
        >
          Parte considerável do custo de executar vem das condições em que o
          trabalho acontece: quanta informação chega de uma vez, quão vaga é a
          próxima ação, quantas dependências estão invisíveis. Condições são
          analisáveis — e mudáveis. Aqui descrevemos a situação, nunca
          diagnosticamos a pessoa.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {latest ? (
            <Link
              className="inline-flex items-center font-semibold"
              href={`/blog/${latest.slug}`}
              style={{
                minHeight: 56,
                paddingInline: 24,
                background: "var(--ed-label-primary)",
                color: "var(--ed-bg)",
                borderRadius: "var(--ed-radius-control)",
              }}
            >
              Ler: {latest.title}
            </Link>
          ) : null}
          <Link
            className="inline-flex items-center font-semibold"
            href="/mapa"
            style={{
              minHeight: 56,
              paddingInline: 24,
              border: "1px solid var(--ed-label-primary)",
              borderRadius: "var(--ed-radius-control)",
            }}
          >
            Explorar o Mapa
          </Link>
        </div>
      </section>

      {/*
        The one full-bleed vertical media block the contract allows per
        page. It uses the brand package's own preview render rather than
        a stock photograph — the 85-file brand kit shipped unreferenced
        until now.
      */}
      <section
        className="relative w-full"
        style={{ minHeight: "60vh", background: "var(--ed-bg-grouped)" }}
      >
        <Image
          alt=""
          className="object-contain"
          fill
          sizes="100vw"
          src="/brand/07_brand_preview/EXECUTAR-brand-package-preview.png"
          style={{ padding: "8vw" }}
        />
      </section>

      <section
        className="mx-auto"
        style={{
          maxWidth: "var(--ed-content-max)",
          paddingInline: "var(--ed-gutter)",
          paddingBlock: "var(--ed-section)",
        }}
      >
        <h2
          className="font-semibold"
          style={{
            fontSize: "var(--ed-headline)",
            letterSpacing: "var(--ed-tracking-headline)",
            maxWidth: "var(--ed-reading-max)",
          }}
        >
          Como o conteúdo é construído
        </h2>
        <p
          className="ed-text-small mt-4"
          style={{
            color: "var(--ed-label-secondary)",
            maxWidth: "var(--ed-reading-max)",
          }}
        >
          Cada artigo percorre a mesma arquitetura narrativa, e cada estágio tem
          uma regra que restringe o que ele pode afirmar.
        </p>

        <ol
          className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: "var(--ed-separator)" }}
        >
          {NARRATIVE_ARCHITECTURE.map((stage) => (
            <li
              key={stage.stage}
              style={{ background: "var(--ed-bg)", padding: 24 }}
            >
              <p
                className="ed-text-caption"
                style={{ color: "var(--ed-label-secondary)" }}
              >
                {String(stage.order).padStart(2, "0")}
              </p>
              <h3 className="ed-text-body-lg mt-1 font-semibold">
                {stage.stage}
              </h3>
              <p className="ed-text-small mt-2">{stage.question}</p>
              <p
                className="ed-text-caption mt-3"
                style={{ color: "var(--ed-label-secondary)" }}
              >
                {stage.rule}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="mx-auto"
        style={{
          maxWidth: "var(--ed-content-max)",
          paddingInline: "var(--ed-gutter)",
          paddingBottom: "var(--ed-section)",
        }}
      >
        <h2
          className="mb-8 font-semibold"
          style={{
            fontSize: "var(--ed-headline)",
            letterSpacing: "var(--ed-tracking-headline)",
          }}
        >
          Por onde entrar
        </h2>
        <ul
          className="grid gap-px md:grid-cols-2"
          style={{ background: "var(--ed-separator)" }}
        >
          {SURFACES.map((surface) => (
            <li key={surface.href} style={{ background: "var(--ed-bg)" }}>
              <Link
                className="flex h-full flex-col gap-3 p-8"
                href={surface.href}
                style={{ minHeight: 200 }}
              >
                <span className="ed-text-headline font-semibold">
                  {surface.title}
                </span>
                <span
                  className="ed-text-small"
                  style={{
                    color: "var(--ed-label-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {surface.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mx-auto"
        style={{
          maxWidth: "var(--ed-reading-max)",
          paddingInline: "var(--ed-gutter)",
          paddingBottom: "var(--ed-section)",
        }}
      >
        <h2
          className="font-semibold"
          style={{
            fontSize: "var(--ed-headline)",
            letterSpacing: "var(--ed-tracking-headline)",
          }}
        >
          Quem escreve
        </h2>
        <p className="mt-4 font-medium">{AUTHOR.name}</p>
        <p
          className="ed-text-small"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          {AUTHOR.title}
        </p>
        <p className="mt-4" style={{ lineHeight: 1.6 }}>
          {AUTHOR.bio}
        </p>
      </section>
    </div>
  );
};

export default Home;
