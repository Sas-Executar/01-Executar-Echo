import { createMetadata } from "@repo/seo/metadata";
import { generativeStatus, registeredCapabilities } from "@repo/vera";
import type { Metadata } from "next";
import { VeraConsole } from "./vera-console";

export const metadata: Metadata = createMetadata({
  title: "VERA",
  description:
    "A interface de consulta ao corpus do EXECUTAR: recupera, cita e encaminha — sem afirmar o que não pode sustentar.",
});

/**
 * VERA's public surface (ADR-VERA-001).
 *
 * The capability registry is shown on the page: VERA's authority never
 * exceeds what is listed, and anything unlisted is denied. Publishing
 * that list is what lets a reader hold it to the limit.
 */
const Vera = () => {
  const generative = generativeStatus();
  const capabilities = registeredCapabilities();

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-shell)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <header style={{ maxWidth: "var(--ed-read)" }}>
        <h1
          className="font-semibold"
          style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
        >
          VERA
        </h1>
        <p
          className="mt-5 text-[length:var(--ed-body-lg)]"
          style={{ color: "var(--ed-muted)", lineHeight: 1.5 }}
        >
          Pergunte sobre o custo cognitivo da execução. A VERA consulta o mapa
          cognitivo, o catálogo de frameworks e os contratos da Oficina, cita o
          que encontrou e encaminha para onde continuar. Quando não consegue
          sustentar uma resposta, diz isso — análise da situação, nunca
          diagnóstico de uma pessoa.
        </p>
      </header>

      <div className="mt-12">
        <VeraConsole generativeOffReason={generative.reason} />
      </div>

      <section className="mt-20">
        <h2 className="mb-2 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
          O que a VERA pode fazer
        </h2>
        <p
          className="mb-5 text-[length:var(--ed-small)]"
          style={{ color: "var(--ed-muted)" }}
        >
          Esta lista é o limite, não um resumo dele. Uma capacidade que não está
          aqui é negada por padrão, e nenhuma capacidade que altere estado roda
          sem confirmação explícita.
        </p>
        <ul className="flex flex-col gap-3">
          {capabilities.map((capability) => (
            <li
              key={capability.id}
              style={{ borderTop: "1px solid var(--ed-line)", paddingTop: 12 }}
            >
              <p className="font-medium text-[length:var(--ed-small)]">
                {capability.id}
              </p>
              <p
                className="text-[length:var(--ed-small)]"
                style={{ color: "var(--ed-muted)" }}
              >
                {capability.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Vera;
