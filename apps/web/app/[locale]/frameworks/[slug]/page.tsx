import {
  allFrameworks,
  frameworkBySlug,
  frameworkDomainById,
  relatedFrameworks,
} from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface FrameworkPageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  allFrameworks().map((framework) => ({ slug: framework.slug }));

export const generateMetadata = async ({
  params,
}: FrameworkPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const framework = frameworkBySlug(slug);

  if (!framework) {
    return {};
  }

  return createMetadata({
    title: `${framework.name} — Quick Framework`,
    description: framework.purpose,
  });
};

const FrameworkPage = async ({ params }: FrameworkPageProps) => {
  const { slug } = await params;
  const framework = frameworkBySlug(slug);

  if (!framework) {
    notFound();
  }

  const domain = frameworkDomainById(framework.domain_id);
  const related = relatedFrameworks(framework);

  return (
    <article
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-reading-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <p
        className="mb-3 font-semibold text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
        style={{ color: "var(--ed-label-secondary)" }}
      >
        {framework.domain_name} · {framework.id}
      </p>

      <h1
        className="font-semibold"
        style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
      >
        {framework.name}
      </h1>

      {framework.aliases.length > 0 ? (
        <p
          className="mt-3 text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          Também conhecido como {framework.aliases.join(", ")}.
        </p>
      ) : null}

      <p
        className="mt-6 text-[length:var(--ed-body-lg)]"
        style={{ lineHeight: 1.5 }}
      >
        {framework.purpose}
      </p>

      {/*
        The skill's governing invariant, stated on the page rather than
        left implicit: a framework organises evidence, it does not create
        evidence. Without this a catalog entry reads like a finding.
      */}
      <p
        className="mt-8 border-l-4 py-2 pl-4 text-[length:var(--ed-small)]"
        style={{
          borderColor: "var(--ed-accent)",
          color: "var(--ed-label-secondary)",
        }}
      >
        Um framework organiza evidência; não cria evidência. Aplicá-lo a uma
        situação real exige separar fato, inferência, hipótese e lacuna.
      </p>

      {framework.search_tags.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Quando procurar por este modelo
          </h2>
          <ul className="flex flex-wrap gap-2">
            {framework.search_tags.map((tag) => (
              <li
                className="text-[length:var(--ed-caption)]"
                key={tag}
                style={{
                  border: "1px solid var(--ed-separator)",
                  padding: "6px 10px",
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {domain ? (
        <section className="mt-10">
          <h2 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Domínio
          </h2>
          <p className="text-[length:var(--ed-small)]">
            {domain.name} — {domain.framework_count} frameworks neste domínio.
          </p>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Frameworks adjacentes
          </h2>
          <ul
            className="grid gap-px sm:grid-cols-2"
            style={{ background: "var(--ed-separator)" }}
          >
            {related.map((item) => (
              <li key={item.id} style={{ background: "var(--ed-bg)" }}>
                <Link
                  className="flex flex-col gap-1 p-5"
                  href={`/frameworks/${item.slug}`}
                  style={{ minHeight: 88 }}
                >
                  <span className="font-medium">{item.name}</span>
                  <span
                    className="text-[length:var(--ed-caption)]"
                    style={{ color: "var(--ed-label-secondary)" }}
                  >
                    {item.domain_name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="mt-16 flex flex-wrap gap-4">
        <Link
          className="font-medium underline"
          href="/frameworks"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          ← Todos os frameworks
        </Link>
        <Link
          className="font-medium underline"
          href="/mapa"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Ver o Mapa Cognitivo
        </Link>
      </nav>
    </article>
  );
};

export default FrameworkPage;
