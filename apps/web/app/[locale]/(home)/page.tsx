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
          maxWidth: "var(--ed-wide)",
          paddingInline: "var(--ed-gutter)",
          paddingBlock: "var(--ed-section)",
        }}
      >
        <p
          className="mb-5 font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.16em]"
          style={{ color: "var(--ed-muted)" }}
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
          className="mt-8 text-[length:var(--ed-body-lg)]"
          style={{
            color: "var(--ed-muted)",
            lineHeight: 1.5,
            maxWidth: "var(--ed-read)",
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
                background: "var(--ed-black)",
                color: "var(--ed-white)",
                borderRadius: "var(--ed-radius-btn)",
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
              border: "1px solid var(--ed-black)",
              borderRadius: "var(--ed-radius-btn)",
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
        style={{ minHeight: "60vh", background: "var(--ed-charcoal)" }}
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
          maxWidth: "var(--ed-wide)",
          paddingInline: "var(--ed-gutter)",
          paddingBlock: "var(--ed-section)",
        }}
      >
        <h2
          className="font-semibold"
          style={{ fontSize: "var(--ed-headline)", maxWidth: "var(--ed-read)" }}
        >
          Como o conteúdo é construído
        </h2>
        <p
          className="mt-4 text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-muted)", maxWidth: "var(--ed-read)" }}
        >
          Cada artigo percorre a mesma arquitetura narrativa, e cada estágio tem
          uma regra que restringe o que ele pode afirmar.
        </p>

        <ol
          className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: "var(--ed-line)" }}
        >
          {NARRATIVE_ARCHITECTURE.map((stage) => (
            <li
              key={stage.stage}
              style={{ background: "var(--ed-paper)", padding: 24 }}
            >
              <p
                className="text-[length:var(--ed-caption)]"
                style={{ color: "var(--ed-muted)" }}
              >
                {String(stage.order).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-semibold text-[length:var(--ed-body-lg)]">
                {stage.stage}
              </h3>
              <p className="mt-2 text-[length:var(--ed-small)]">
                {stage.question}
              </p>
              <p
                className="mt-3 text-[length:var(--ed-caption)]"
                style={{ color: "var(--ed-muted)" }}
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
          maxWidth: "var(--ed-wide)",
          paddingInline: "var(--ed-gutter)",
          paddingBottom: "var(--ed-section)",
        }}
      >
        <h2
          className="mb-8 font-semibold"
          style={{ fontSize: "var(--ed-headline)" }}
        >
          Por onde entrar
        </h2>
        <ul
          className="grid gap-px md:grid-cols-2"
          style={{ background: "var(--ed-line)" }}
        >
          {SURFACES.map((surface) => (
            <li key={surface.href} style={{ background: "var(--ed-paper)" }}>
              <Link
                className="flex h-full flex-col gap-3 p-8"
                href={surface.href}
                style={{ minHeight: 200 }}
              >
                <span className="font-semibold text-[length:var(--ed-headline)]">
                  {surface.title}
                </span>
                <span
                  className="text-[length:var(--ed-small)]"
                  style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
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
          maxWidth: "var(--ed-read)",
          paddingInline: "var(--ed-gutter)",
          paddingBottom: "var(--ed-section)",
        }}
      >
        <h2
          className="font-semibold"
          style={{ fontSize: "var(--ed-headline)" }}
        >
          Quem escreve
        </h2>
        <p className="mt-4 font-medium">{AUTHOR.name}</p>
        <p
          className="text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-muted)" }}
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
