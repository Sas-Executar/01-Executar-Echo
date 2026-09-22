"use client";

import type { VeraEnvelope } from "@repo/vera";
import Link from "next/link";
import { useState } from "react";

interface VeraConsoleProps {
  /** Why prose synthesis is unavailable, or `null` when it is on. */
  readonly generativeOffReason: string | null;
}

/**
 * VERA's surface.
 *
 * The envelope is rendered in full rather than summarised: what VERA
 * read, what it decided, what it could not resolve. An agent that shows
 * only its conclusion asks to be trusted; this one can be checked.
 */
export function VeraConsole({ generativeOffReason }: VeraConsoleProps) {
  const [question, setQuestion] = useState("");
  const [envelope, setEnvelope] = useState<VeraEnvelope | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/vera", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, route: "/vera" }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setEnvelope((await response.json()) as VeraEnvelope);
    } catch {
      setError("Não foi possível consultar a VERA agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
        <label className="flex-1">
          <span className="sr-only">Sua pergunta</span>
          <input
            className="w-full"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="O que aumenta o custo de retomar uma tarefa?"
            style={{
              minHeight: 56,
              paddingInline: 16,
              border: "1px solid var(--ed-line)",
              borderRadius: "var(--ed-radius-btn)",
              background: "var(--ed-paper)",
            }}
            value={question}
          />
        </label>
        <button
          className="font-semibold"
          disabled={pending}
          style={{
            minHeight: 56,
            paddingInline: 24,
            background: "var(--ed-black)",
            color: "var(--ed-white)",
            borderRadius: "var(--ed-radius-btn)",
            opacity: pending ? 0.6 : 1,
          }}
          type="submit"
        >
          {pending ? "Consultando…" : "Perguntar"}
        </button>
      </form>

      {error ? (
        <p className="mt-4" role="alert" style={{ color: "var(--ed-ink)" }}>
          {error}
        </p>
      ) : null}

      <div aria-live="polite" className="mt-10">
        {envelope ? (
          <Envelope envelope={envelope} offReason={generativeOffReason} />
        ) : null}
      </div>
    </div>
  );
}

function Envelope({
  envelope,
  offReason,
}: {
  readonly envelope: VeraEnvelope;
  readonly offReason: string | null;
}) {
  return (
    <article className="flex flex-col gap-8">
      <p
        className="text-[length:var(--ed-caption)] uppercase tracking-[.12em]"
        style={{ color: "var(--ed-muted)" }}
      >
        Status: {envelope.status} · rota {envelope.canonical_route}
      </p>

      {envelope.answer ? (
        <p
          className="text-[length:var(--ed-body-lg)]"
          style={{ lineHeight: 1.5 }}
        >
          {envelope.answer}
        </p>
      ) : (
        // Stated plainly rather than papered over with a generated
        // paragraph. The retrieval below is the real answer today.
        <p
          className="border-l-4 py-2 pl-4 text-[length:var(--ed-small)]"
          style={{ borderColor: "var(--ed-yellow)", color: "var(--ed-muted)" }}
        >
          {offReason ?? "Sem síntese em linguagem natural para esta resposta."}{" "}
          A VERA responde com o que recuperou e citou, abaixo.
        </p>
      )}

      {envelope.evidence.length > 0 ? (
        <section>
          <h2 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Evidência
          </h2>
          <ul className="flex flex-col gap-4">
            {envelope.evidence.map((item) => (
              <li
                key={item.ref}
                style={{
                  borderLeft: "3px solid var(--ed-line)",
                  paddingLeft: 16,
                }}
              >
                <p>{item.statement}</p>
                <p
                  className="text-[length:var(--ed-caption)]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {item.ref}
                  {item.epistemic_class
                    ? ` · classe ${item.epistemic_class}`
                    : ""}
                </p>
                {/* The limit never travels apart from the statement. */}
                {item.interpretation_limit ? (
                  <p
                    className="mt-1 text-[length:var(--ed-caption)]"
                    style={{ color: "var(--ed-muted)" }}
                  >
                    Limite de interpretação: {item.interpretation_limit}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {envelope.next_actions.length > 0 ? (
        <section>
          <h2 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Para onde ir
          </h2>
          <ul className="flex flex-col gap-3">
            {envelope.next_actions.map((action) => (
              <li key={`${action.href}-${action.label}`}>
                <Link
                  className="font-medium underline"
                  href={action.href}
                  style={{
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {action.label}
                </Link>
                <p
                  className="text-[length:var(--ed-caption)]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {action.rationale}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {envelope.unresolved.length > 0 ? (
        <section>
          <h2 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Não resolvido
          </h2>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-[length:var(--ed-small)]">
            {envelope.unresolved.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <details>
        <summary
          className="cursor-pointer text-[length:var(--ed-small)]"
          style={{ minHeight: 44, display: "flex", alignItems: "center" }}
        >
          O que a VERA leu e decidiu
        </summary>
        <div className="mt-3 flex flex-col gap-4 text-[length:var(--ed-small)]">
          <div>
            <h3 className="font-semibold">Fontes lidas</h3>
            <ul className="list-disc pl-5">
              {envelope.artifacts_read.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Decisões</h3>
            <ul className="list-disc pl-5">
              {envelope.decisions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {Object.keys(envelope.not_applicable).length > 0 ? (
            <div>
              <h3 className="font-semibold">Campos não aplicáveis</h3>
              <ul className="list-disc pl-5">
                {Object.entries(envelope.not_applicable).map(([key, why]) => (
                  <li key={key}>
                    {key}: {why}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
    </article>
  );
}
