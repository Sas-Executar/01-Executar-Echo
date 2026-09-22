import { blog } from "@repo/cms";
import {
  AUTHOR,
  ctaForStage,
  searchFrameworks,
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
  const post = await blog.getPost(slug);

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
        <header className="mx-auto" style={{ maxWidth: "var(--ed-read)" }}>
          {post.pillar ? (
            <Link
              className="mb-4 inline-flex items-center font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
              href={`/blog/pilar/${termSlug(post.pillar)}`}
              style={{ color: "var(--ed-muted)", minHeight: 44 }}
            >
              {post.pillar}
            </Link>
          ) : null}

          <h1
            className="font-semibold"
            style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
          >
            {post.title}
          </h1>

          <p
            className="mt-6 text-[length:var(--ed-small)]"
            style={{ color: "var(--ed-muted)" }}
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
              className="mt-4 border-l-4 py-2 pl-4 text-[length:var(--ed-caption)]"
              style={{
                borderColor: "var(--ed-yellow)",
                color: "var(--ed-muted)",
              }}
            >
              {problems.join(" ")}
            </p>
          ) : null}
        </header>

        {/*
          `ed-article` carries the validated reading measure: 720px at
          1.62 in the New York serif, with the 52x5px yellow rule above
          each h2. Those are measured values from the v6 handoff, not
          styling preferences, so they live in the token layer.
        */}
        <div className="ed-article mt-16">{post.content}</div>

        {cta ? (
          <aside
            className="mx-auto mt-20"
            style={{
              maxWidth: "var(--ed-read)",
              background: "var(--ed-charcoal)",
              color: "var(--ed-white)",
              padding: 40,
            }}
          >
            <p className="text-[length:var(--ed-body-lg)]">{cta.copy}</p>
            {cta.href ? (
              <Link
                className="mt-6 inline-flex items-center font-semibold"
                href={cta.href}
                style={{
                  minHeight: 56,
                  paddingInline: 24,
                  background: "var(--ed-yellow)",
                  color: "var(--ed-black)",
                  borderRadius: "var(--ed-radius-btn)",
                }}
              >
                {cta.name}
              </Link>
            ) : null}
          </aside>
        ) : null}

        <div
          className="mx-auto mt-20 flex flex-col gap-12"
          style={{ maxWidth: "var(--ed-read)" }}
        >
          {concepts.length > 0 ? (
            <section>
              <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
                Conceitos no Mapa
              </h2>
              <ul className="flex flex-wrap gap-2">
                {concepts.map((node) => (
                  <li key={node.id}>
                    <Link
                      className="inline-flex items-center text-[length:var(--ed-small)]"
                      href={`/mapa?no=${encodeURIComponent(node.id)}`}
                      style={{
                        minHeight: 44,
                        border: "1px solid var(--ed-line)",
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
              <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
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
                      className="text-[length:var(--ed-caption)]"
                      style={{ color: "var(--ed-muted)" }}
                    >
                      {framework.purpose}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
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
