import { allQuickFrameworks, quickFrameworkBySlug } from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mermaid } from "../../components/editorial/mermaid";

interface QuickFrameworkPageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  allQuickFrameworks().map((qf) => ({ slug: qf.slug }));

export const generateMetadata = async ({
  params,
}: QuickFrameworkPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const qf = quickFrameworkBySlug(slug);

  if (!qf) {
    return {};
  }

  return createMetadata({
    title: `${qf.titulo} — Quick Framework EXECUTAR`,
    description: qf.fraseSintese || qf.contexto,
  });
};

const QuickFrameworkPage = async ({ params }: QuickFrameworkPageProps) => {
  const { slug } = await params;
  const qf = quickFrameworkBySlug(slug);

  if (!qf) {
    notFound();
  }

  return (
    <article
      className="ed-article mx-auto"
      style={{
        maxWidth: "var(--ed-reading-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <p
        className="ed-text-caption mb-3 font-semibold uppercase tracking-[.12em]"
        style={{ color: "var(--ed-label-secondary)" }}
      >
        Quick Framework EXECUTAR
        {qf.factorId ? ` · ${qf.factorId}` : null}
        {qf.macrogrupo ? ` · ${qf.macrogrupo}` : null}
      </p>

      <h1
        className="font-semibold"
        style={{
          fontSize: "var(--ed-display-md)",
          letterSpacing: "var(--ed-tracking-display-md)",
          lineHeight: 1.05,
        }}
      >
        {qf.titulo}
      </h1>

      {qf.fraseSintese ? (
        <p
          className="ed-text-body-lg mt-4 border-l-4 py-2 pl-4"
          style={{
            borderColor: "var(--ed-accent)",
            color: "var(--ed-label-secondary)",
          }}
        >
          {qf.fraseSintese}
        </p>
      ) : null}

      {qf.factorId ? (
        <Link
          className="ed-text-small mt-4 inline-flex items-center underline"
          href={`/mapa?no=${encodeURIComponent(qf.factorId)}`}
          style={{ minHeight: 44 }}
        >
          Ver {qf.factorId} no Mapa Cognitivo →
        </Link>
      ) : null}

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          1. Origem
        </h2>
        <p className="ed-text-body">
          <strong>{qf.origem.termo}.</strong> {qf.origem.significado}
        </p>
        <p className="ed-text-body mt-2">{qf.origem.etimologia}</p>
      </section>

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          2. Contexto
        </h2>
        <p className="ed-text-body">{qf.contexto}</p>
      </section>

      {qf.cincoWDoisH.length > 0 ? (
        <section className="mt-10">
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            3. 5W2H
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {qf.cincoWDoisH.map((row) => (
              <div key={row.variavel}>
                <dt className="ed-text-small font-medium">{row.variavel}</dt>
                <dd
                  className="ed-text-small"
                  style={{ color: "var(--ed-label-secondary)" }}
                >
                  {row.sintese}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          4. Referência padrão-ouro
        </h2>
        <p className="ed-text-body">{qf.referencia.texto}</p>
        {qf.referencia.autorCurto ? (
          <p
            className="ed-text-small mt-1"
            style={{ color: "var(--ed-label-secondary)" }}
          >
            Autor curto: {qf.referencia.autorCurto}
          </p>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          5. Problema existente
        </h2>
        <p className="ed-text-body">{qf.problemaExistente.definicao}</p>
        <p
          className="ed-text-small mt-2"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          {qf.problemaExistente.identificacao} {qf.problemaExistente.explicacao}{" "}
          {qf.problemaExistente.fechamento}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          6. Problema solucionado
        </h2>
        <p className="ed-text-body">{qf.problemaSolucionado.definicao}</p>
        <p
          className="ed-text-small mt-2"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          {qf.problemaSolucionado.identificacao}{" "}
          {qf.problemaSolucionado.explicacao}{" "}
          {qf.problemaSolucionado.fechamento}
        </p>
      </section>

      {qf.processo.length > 0 ? (
        <section className="mt-10">
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            7. Processo
          </h2>
          <ol className="flex flex-col gap-2">
            {qf.processo.map((step) => (
              <li className="ed-text-body" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {qf.visaoSistemaMermaid ? (
        <section className="mt-10">
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            8. Visão do sistema
          </h2>
          <Mermaid chart={qf.visaoSistemaMermaid} />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          9. Progresso esperado
        </h2>
        <p className="ed-text-body">{qf.progressoEsperado}</p>
      </section>

      <section
        className="mt-10 border-l-4 py-2 pl-4"
        style={{ borderColor: "var(--ed-error)" }}
      >
        <h2 className="ed-text-small mb-2 font-semibold uppercase tracking-wider">
          10. Aviso
        </h2>
        <p
          className="ed-text-small"
          style={{ color: "var(--ed-label-secondary)" }}
        >
          {qf.aviso}
        </p>
      </section>

      {qf.next.passos.length > 0 ? (
        <section className="mt-10">
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            11. Next 01-02-03
          </h2>
          <ol className="flex flex-col gap-2">
            {qf.next.passos.map((step) => (
              <li className="ed-text-body" key={step}>
                {step}
              </li>
            ))}
          </ol>
          {qf.next.mermaid ? <Mermaid chart={qf.next.mermaid} /> : null}
        </section>
      ) : null}

      {qf.fontes.length > 0 ? (
        <section className="mt-10">
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            12. Fontes e aprofundamento
          </h2>
          <ul className="flex flex-col gap-2">
            {qf.fontes.map((fonte) => (
              <li className="ed-text-small" key={fonte.href}>
                <a
                  className="underline"
                  href={fonte.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {fonte.label}
                </a>{" "}
                <span style={{ color: "var(--ed-label-secondary)" }}>
                  — {fonte.nota}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {qf.infografico.conclusao ? (
        <section
          className="mt-12"
          style={{
            background: "var(--ed-bg-grouped)",
            borderRadius: "var(--ed-radius-container)",
            padding: 32,
          }}
        >
          <h2 className="ed-text-small mb-3 font-semibold uppercase tracking-wider">
            13. Síntese
          </h2>
          <p className="ed-text-body-lg">{qf.infografico.conclusao}</p>
          {qf.infografico.relacionados.length > 0 ? (
            <p
              className="ed-text-small mt-3"
              style={{ color: "var(--ed-label-secondary)" }}
            >
              Relacionados: {qf.infografico.relacionados.join(", ")}
            </p>
          ) : null}
        </section>
      ) : null}

      <nav className="mt-16 flex flex-wrap gap-4">
        <Link
          className="font-medium underline"
          href="/quick-frameworks"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          ← Todos os Quick Frameworks
        </Link>
        {qf.factorId ? (
          <Link
            className="font-medium underline"
            href={`/mapa?no=${encodeURIComponent(qf.factorId)}`}
            style={{
              minHeight: 44,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Ver no Mapa Cognitivo
          </Link>
        ) : null}
      </nav>
    </article>
  );
};

export default QuickFrameworkPage;
