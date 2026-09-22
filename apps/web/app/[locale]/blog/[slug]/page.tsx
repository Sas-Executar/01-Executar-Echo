import { blog } from "@repo/cms";
import {
  AUTHOR,
  ctaForStage,
  searchFrameworks,
  searchQuickFrameworks,
  taxonomyProblems,
  termSlug,
} from "@repo/knowledge";
import { loadCognitiveMap, searchNodes } from "@repo/knowledge/server";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { editorialMdxComponents } from "../../components/editorial/mdx-components";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

interface BlogPostProperties {
  readonly params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = await blog.getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    image: post.image,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const posts = await blog.getPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

/**
 * An article.
 *
 * This is where the ecosystem stops being a set of separate pages. The
 * reader arrives on a concept and leaves toward the Mapa, a framework or
 * a tool — the "FERRAMENTA → CTA" end of the nine-stage narrative
 * architecture, built as real links rather than described in a document.
 *
 * Every outbound link is derived from the article's own tags and title
 * against real corpora. Nothing is hardcoded, and a tag that matches
 * nothing produces no link rather than a guess.
 */
const BlogPost = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;
  const post = await blog.getPost(slug, editorialMdxComponents);

  if (!post) {
    notFound();
  }

  const map = loadCognitiveMap();

  // Concepts this article touches, matched from its own tags. Deduped by
  // id, capped so the footer stays a doorway rather than an index.
  const concepts = dedupe(
    post.tags.flatMap((tag) => searchNodes(map, tag.replace(/-/g, " ")))
  ).slice(0, 6);

  const frameworks = dedupe(
    post.tags.flatMap((tag) => searchFrameworks(tag.replace(/-/g, " "), 2))
  ).slice(0, 3);

  const quickFrameworks = dedupe(
    post.tags.flatMap((tag) => searchQuickFrameworks(tag.replace(/-/g, " "), 2))
  ).slice(0, 3);

  const cta = post.funnelStage ? ctaForStage(post.funnelStage) : undefined;

  // Surfaced rather than swallowed: a pillar that is not in the taxonomy
  // is a content bug, and silently dropping it hides the article from
  // its own category page.
  const problems = taxonomyProblems(post);

  return (
    <>
      <JsonLd
        code={{
          "@type": "BlogPosting",
          "@context": "https://schema.org",
          datePublished: post.date,
          description: post.description,
          headline: post.title,
          image: post.image ? new URL(post.image, url).toString() : undefined,
          author: { "@type": "Person", name: post.author ?? AUTHOR.name },
        }}
      />

      <div
        style={{
          paddingBlock: "var(--ed-section)",
          paddingInline: "var(--ed-gutter)",
        }}
      >
        <header
          className="mx-auto"
          style={{ maxWidth: "var(--ed-reading-max)" }}
        >
          {post.pillar ? (
            <Link
              className="ed-text-caption mb-4 inline-flex items-center font-semibold uppercase tracking-[.12em]"
              href={`/blog/pilar/${termSlug(post.pillar)}`}
              style={{ color: "var(--ed-label-secondary)", minHeight: 44 }}
            >
              {post.pillar}
            </Link>
          ) : null}

          <h1
            className="font-semibold"
            style={{
              fontSize: "var(--ed-display-md)",
              letterSpacing: "var(--ed-tracking-display-md)",
              lineHeight: 1.05,
            }}
          >
            {post.title}
          </h1>

          <p
            className="ed-text-small mt-6"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            {post.author ?? AUTHOR.name} ·{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>{" "}
            · {post.readingTimeMinutes} min de leitura
          </p>

          {problems.length > 0 ? (
            <p
              className="ed-text-caption mt-4 border-l-4 py-2 pl-4"
              style={{
                borderColor: "var(--ed-accent)",
                color: "var(--ed-label-secondary)",
              }}
            >
              {problems.join(" ")}
            </p>
          ) : null}
        </header>

        {/*
          `ed-article` carries the reading measure from the identity
          contract: 66ch capped at 760px, 17px at line-height 1.6, in the
          system stack. Those are acceptance criteria (v2, section
          "Editorial"), not styling preferences, so they live in the token
          layer rather than here.
        */}
        <div className="ed-article mt-16">{post.content}</div>

        {cta ? (
          <aside
            className="mx-auto mt-20"
            style={{
              maxWidth: "var(--ed-reading-max)",
              background: "var(--ed-bg-grouped)",
              color: "var(--ed-label-primary)",
              borderRadius: "var(--ed-radius-container)",
              padding: 40,
            }}
          >
            <p className="ed-text-body-lg">{cta.copy}</p>
            {cta.href ? (
              <Link
                className="mt-6 inline-flex items-center font-semibold"
                href={cta.href}
                style={{
                  minHeight: 56,
                  paddingInline: 24,
                  background: "var(--ed-accent)",
                  color: "var(--ed-label-on-accent)",
                  borderRadius: "var(--ed-radius-control)",
                }}
              >
                {cta.name}
              </Link>
            ) : null}
          </aside>
        ) : null}

        <div
          className="mx-auto mt-20 flex flex-col gap-12"
          style={{ maxWidth: "var(--ed-reading-max)" }}
        >
          {concepts.length > 0 ? (
            <section>
              <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
                Conceitos no Mapa
              </h2>
              <ul className="flex flex-wrap gap-2">
                {concepts.map((node) => (
                  <li key={node.id}>
                    <Link
                      className="ed-text-small inline-flex items-center"
                      href={`/mapa?no=${encodeURIComponent(node.id)}`}
                      style={{
                        minHeight: 44,
                        border: "1px solid var(--ed-separator)",
                        padding: "0 12px",
                      }}
                    >
                      {node.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {frameworks.length > 0 ? (
            <section>
              <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
                Frameworks para estruturar isto
              </h2>
              <ul className="flex flex-col gap-3">
                {frameworks.map((framework) => (
                  <li key={framework.id}>
                    <Link
                      className="font-medium underline"
                      href={`/frameworks/${framework.slug}`}
                      style={{
                        minHeight: 44,
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {framework.name}
                    </Link>
                    <p
                      className="ed-text-caption"
                      style={{ color: "var(--ed-label-secondary)" }}
                    >
                      {framework.purpose}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {quickFrameworks.length > 0 ? (
            <section>
              <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
                Quick Frameworks EXECUTAR
              </h2>
              <ul className="flex flex-col gap-3">
                {quickFrameworks.map((qf) => (
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
                    {qf.fraseSintese ? (
                      <p
                        className="ed-text-caption"
                        style={{ color: "var(--ed-label-secondary)" }}
                      >
                        {qf.fraseSintese}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="ed-text-small mb-4 font-semibold uppercase tracking-wider">
              Continuar
            </h2>
            <ul className="flex flex-wrap gap-4">
              <li>
                <Link className="font-medium underline" href="/mapa">
                  Explorar o Mapa Cognitivo
                </Link>
              </li>
              <li>
                <Link className="font-medium underline" href="/oficina">
                  Ver as ferramentas na Oficina
                </Link>
              </li>
              <li>
                <Link className="font-medium underline" href="/vera">
                  Perguntar à VERA
                </Link>
              </li>
            </ul>
          </section>

          <nav>
            <Link
              className="font-medium underline"
              href="/blog"
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              ← Todos os artigos
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

/** Keeps the first occurrence of each item, by `id`. */
function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export default BlogPost;
