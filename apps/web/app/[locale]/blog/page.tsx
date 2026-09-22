import { blog } from "@repo/cms";
import { AUTHOR, EDITORIAL_PILLARS, termSlug } from "@repo/knowledge";
import type { Blog, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "O custo cognitivo da execução: o que aumenta o esforço de trabalhar, e quais condições do sistema podem mudar.",
});

/**
 * Editorial home.
 *
 * Shows the real archive. The corpus names TP-002 and TP-003 as a launch
 * minimum and neither exists, so nothing is padded out to fill the grid
 * — an empty shelf is a fact about the publication, and inventing posts
 * to hide it would be the worse outcome.
 */
const BlogIndex = async () => {
  const posts = await blog.getPosts();
  const [lead, ...rest] = posts;

  // Only pillars that actually have an article are offered as a filter;
  // a category link to an empty page is a dead end.
  const usedPillars = EDITORIAL_PILLARS.filter((pillar) =>
    posts.some((post) => post.pillar === pillar.value)
  );

  const jsonLd: WithContext<Blog> = {
    "@type": "Blog",
    "@context": "https://schema.org",
    name: "Blog EXECUTAR",
    description:
      "O custo cognitivo da execução: fatores, mecanismos e o que reduz a exposição.",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author ?? AUTHOR.name },
    })),
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--ed-wide)",
          paddingInline: "var(--ed-gutter)",
          paddingBlock: "var(--ed-section)",
        }}
      >
        <header style={{ maxWidth: "var(--ed-read)" }}>
          <h1
            className="font-semibold"
            style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
          >
            Blog
          </h1>
          <p
            className="mt-5 text-[length:var(--ed-body-lg)]"
            style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
          >
            O custo cognitivo da execução — o que aumenta o esforço de
            trabalhar, por que isso raramente é uma questão de disciplina, e
            quais condições do sistema podem ser mudadas.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-16" style={{ color: "var(--ed-muted)" }}>
            Nenhum artigo publicado ainda.
          </p>
        ) : null}

        {lead ? (
          <article className="mt-16">
            <Link className="block" href={`/blog/${lead.slug}`}>
              {lead.pillar ? (
                <p
                  className="mb-3 font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {lead.pillar}
                </p>
              ) : null}
              <h2
                className="font-semibold"
                style={{
                  fontSize: "var(--ed-display-lg)",
                  lineHeight: 1.02,
                  maxWidth: "14ch",
                }}
              >
                {lead.title}
              </h2>
              <p
                className="mt-5 text-[length:var(--ed-body-lg)]"
                style={{ color: "var(--ed-muted)", maxWidth: "var(--ed-read)" }}
              >
                {lead.description}
              </p>
            </Link>
          </article>
        ) : null}

        {rest.length > 0 ? (
          <section className="mt-20">
            <h2 className="mb-6 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
              Mais artigos
            </h2>
            <ul
              className="grid gap-px md:grid-cols-2 lg:grid-cols-3"
              style={{ background: "var(--ed-line)" }}
            >
              {rest.map((post) => (
                <li key={post.slug} style={{ background: "var(--ed-paper)" }}>
                  <Link
                    className="flex h-full flex-col gap-3 p-6"
                    href={`/blog/${post.slug}`}
                    style={{ minHeight: 200 }}
                  >
                    {post.pillar ? (
                      <span
                        className="text-[length:var(--ed-caption)] uppercase tracking-[.1em]"
                        style={{ color: "var(--ed-muted)" }}
                      >
                        {post.pillar}
                      </span>
                    ) : null}
                    <span className="font-semibold text-[length:var(--ed-headline)] leading-tight">
                      {post.title}
                    </span>
                    <span
                      className="text-[length:var(--ed-small)]"
                      style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
                    >
                      {post.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {usedPillars.length > 0 ? (
          <section className="mt-20">
            <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
              Pilares editoriais
            </h2>
            <ul className="flex flex-wrap gap-2">
              {usedPillars.map((pillar) => (
                <li key={pillar.value}>
                  <Link
                    className="inline-flex items-center text-[length:var(--ed-small)]"
                    href={`/blog/pilar/${termSlug(pillar.value)}`}
                    style={{
                      minHeight: 44,
                      border: "1px solid var(--ed-line)",
                      padding: "0 12px",
                    }}
                  >
                    {pillar.value}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
};

export default BlogIndex;
