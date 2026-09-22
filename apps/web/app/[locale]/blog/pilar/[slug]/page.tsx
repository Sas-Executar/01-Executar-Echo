import { blog } from "@repo/cms";
import { EDITORIAL_PILLARS, pillarBySlug, termSlug } from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PillarPageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  EDITORIAL_PILLARS.map((pillar) => ({ slug: termSlug(pillar.value) }));

export const generateMetadata = async ({
  params,
}: PillarPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const pillar = pillarBySlug(slug);
  return pillar
    ? createMetadata({
        title: `${pillar.value} — Blog`,
        description: pillar.definition,
      })
    : {};
};

/**
 * Articles under one editorial pillar.
 *
 * The pillar must exist in the taxonomy — an arbitrary slug 404s rather
 * than rendering an empty category that looks like a real but unpopulated
 * section.
 */
const PillarPage = async ({ params }: PillarPageProps) => {
  const { slug } = await params;
  const pillar = pillarBySlug(slug);

  if (!pillar) {
    notFound();
  }

  const posts = (await blog.getPosts()).filter(
    (post) => post.pillar === pillar.value
  );

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
          Pilar editorial
        </p>
        <h1
          className="font-semibold"
          style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
        >
          {pillar.value}
        </h1>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12" style={{ color: "var(--ed-muted)" }}>
          Ainda não há artigos publicados neste pilar.
        </p>
      ) : (
        <ul
          className="mt-12 grid gap-px md:grid-cols-2 lg:grid-cols-3"
          style={{ background: "var(--ed-line)" }}
        >
          {posts.map((post) => (
            <li key={post.slug} style={{ background: "var(--ed-paper)" }}>
              <Link
                className="flex h-full flex-col gap-3 p-6"
                href={`/blog/${post.slug}`}
                style={{ minHeight: 180 }}
              >
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
      )}

      <nav className="mt-16">
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
  );
};

export default PillarPage;
