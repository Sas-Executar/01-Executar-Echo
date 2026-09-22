"use client";

import type { Solution } from "@repo/solution-store";
import { useState } from "react";

/**
 * The four tabs ADR-UX-003 fixes for a solution detail page:
 * Overview · Contents · Examples · Dependencies.
 *
 * The tab set is contractual, so it is not derived from whichever fields
 * happen to be populated — a tab with nothing in it says "not yet
 * defined" instead of disappearing, which is information rather than the
 * absence of it.
 */
const TABS = [
  { id: "overview", label: "Visão geral" },
  { id: "contents", label: "Conteúdo" },
  { id: "examples", label: "Exemplos" },
  { id: "dependencies", label: "Dependências" },
] as const;

export function SolutionTabs({ solution }: { readonly solution: Solution }) {
  const [active, setActive] = useState<string>("overview");

  return (
    <div className="mt-12">
      <div
        aria-label="Seções da solução"
        className="flex flex-wrap gap-2 border-b"
        role="tablist"
        style={{ borderColor: "var(--ed-line)" }}
      >
        {TABS.map((tab) => (
          <button
            aria-controls={`panel-${tab.id}`}
            aria-selected={active === tab.id}
            className="font-medium text-[length:var(--ed-small)]"
            id={`tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActive(tab.id)}
            role="tab"
            style={{
              minHeight: 48,
              paddingInline: 16,
              background: "transparent",
              borderBottom:
                active === tab.id
                  ? "3px solid var(--ed-yellow)"
                  : "3px solid transparent",
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`tab-${active}`}
        className="pt-8"
        id={`panel-${active}`}
        role="tabpanel"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the WAI-ARIA Authoring Practices require a tabpanel to be focusable when it holds no focusable element of its own — several of these panels are prose only, and without this a keyboard user who activates a tab cannot reach its content.
        tabIndex={0}
      >
        {active === "overview" ? <OverviewPanel solution={solution} /> : null}
        {active === "contents" ? <ContentsPanel solution={solution} /> : null}
        {active === "examples" ? <ExamplesPanel solution={solution} /> : null}
        {active === "dependencies" ? (
          <DependenciesPanel solution={solution} />
        ) : null}
      </div>
    </div>
  );
}

function OverviewPanel({ solution }: { readonly solution: Solution }) {
  const pub = solution.public_layer;
  const cap = solution.capability_contract;
  const fit = solution.usage_fit;

  return (
    <div className="flex flex-col gap-8">
      <Block title="Problema que resolve">
        {pub?.three_p_n_three?.problema_que_resolve ?? pub?.problem_statement}
      </Block>
      <Block title="Processo aplicado">
        {pub?.three_p_n_three?.processo_aplicado ?? cap?.process_applied}
      </Block>
      <Block title="Progresso pretendido">
        {pub?.three_p_n_three?.progresso_pretendido ?? cap?.intended_progress}
      </Block>

      {/*
              Rendered next to the use cases on purpose. A storefront that
              shows only where a tool helps turns a contract into an
              advertisement; the corpus models both halves.
            */}
      {fit?.risk_of_use?.length ? (
        <section>
          <h3 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Quando isto é exagero
          </h3>
          <ul className="flex flex-col gap-4">
            {fit.risk_of_use.map((risk) => (
              <li
                key={risk.id}
                style={{
                  borderLeft: "3px solid var(--ed-line)",
                  paddingLeft: 16,
                }}
              >
                <p className="font-medium">{risk.scenario}</p>
                <p
                  className="text-[length:var(--ed-small)]"
                  style={{ color: "var(--ed-muted)" }}
                >
                  {risk.failure_mode}
                </p>
                {risk.better_alternative ? (
                  <p className="mt-1 text-[length:var(--ed-small)]">
                    Em vez disso: {risk.better_alternative}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ContentsPanel({ solution }: { readonly solution: Solution }) {
  const pub = solution.public_layer;
  const fit = solution.usage_fit;

  return (
    <div className="flex flex-col gap-8">
      {pub?.tutorial ? (
        <section>
          <h3 className="font-semibold text-[length:var(--ed-headline)]">
            {pub.tutorial.title}
          </h3>
          {pub.tutorial.introduction ? (
            <p className="mt-3">{pub.tutorial.introduction}</p>
          ) : null}
          {pub.tutorial.instructions?.length ? (
            <ol className="mt-5 flex list-decimal flex-col gap-3 pl-5">
              {pub.tutorial.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
          {pub.tutorial.expected_result ? (
            <p
              className="mt-5 text-[length:var(--ed-small)]"
              style={{ color: "var(--ed-muted)" }}
            >
              Resultado esperado: {pub.tutorial.expected_result}
            </p>
          ) : null}
        </section>
      ) : (
        <Empty />
      )}

      {fit?.best_use_cases?.length ? (
        <section>
          <h3 className="mb-3 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Melhores usos
          </h3>
          <ul className="flex flex-col gap-5">
            {fit.best_use_cases.map((useCase) => (
              <li key={useCase.id}>
                <p className="font-medium">{useCase.title}</p>
                {useCase.problem ? (
                  <p
                    className="text-[length:var(--ed-small)]"
                    style={{ color: "var(--ed-muted)" }}
                  >
                    {useCase.problem}
                  </p>
                ) : null}
                {useCase.fit_conditions?.length ? (
                  <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[length:var(--ed-small)]">
                    {useCase.fit_conditions.map((cond) => (
                      <li key={cond}>{cond}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ExamplesPanel({ solution }: { readonly solution: Solution }) {
  const pub = solution.public_layer;

  return pub?.practical_example ? (
    <section className="flex flex-col gap-5">
      <h3 className="font-semibold text-[length:var(--ed-headline)]">
        {pub.practical_example.title}
      </h3>
      <Block title="Cenário">{pub.practical_example.scenario}</Block>
      {pub.practical_example.input_example ? (
        <div>
          <h4 className="mb-2 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Entrada
          </h4>
          <pre
            className="overflow-x-auto p-4 text-[length:var(--ed-small)]"
            style={{
              background: "var(--ed-soft)",
              whiteSpace: "pre-wrap",
            }}
          >
            {pub.practical_example.input_example}
          </pre>
        </div>
      ) : null}
      <Block title="Transformação">
        {pub.practical_example.transformation}
      </Block>
      {pub.practical_example.output_example ? (
        <div>
          <h4 className="mb-2 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
            Saída
          </h4>
          <pre
            className="overflow-x-auto p-4 text-[length:var(--ed-small)]"
            style={{
              background: "var(--ed-soft)",
              whiteSpace: "pre-wrap",
            }}
          >
            {pub.practical_example.output_example}
          </pre>
        </div>
      ) : null}
    </section>
  ) : (
    <Empty />
  );
}

function DependenciesPanel({ solution }: { readonly solution: Solution }) {
  const cap = solution.capability_contract;

  return (
    <div className="flex flex-col gap-8">
      <ListBlock items={cap?.input_required} title="Entradas necessárias" />
      <ListBlock items={cap?.output_generated} title="Saídas geradas" />
      <ListBlock items={cap?.dependencies} title="Dependências" />
      {/*
              Limitations are part of the capability contract, not fine
              print — they are what keeps the tool from being read as more
              than it claims.
            */}
      <ListBlock items={cap?.limitations} title="Limitações" />
    </div>
  );
}

function Block({
  title,
  children,
}: {
  readonly title: string;
  readonly children?: string | null;
}) {
  return (
    <section>
      <h3 className="mb-2 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
        {title}
      </h3>
      {children ? <p>{children}</p> : <Empty />}
    </section>
  );
}

function ListBlock({
  title,
  items,
}: {
  readonly title: string;
  readonly items?: readonly string[] | null;
}) {
  return (
    <section>
      <h3 className="mb-2 font-semibold text-[length:var(--ed-small)] uppercase tracking-wider">
        {title}
      </h3>
      {items?.length ? (
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </section>
  );
}

/** Absence named as absence, rather than an empty region on the page. */
function Empty() {
  return (
    <p style={{ color: "var(--ed-muted)" }}>
      Não disponível — ainda não definido no contrato desta solução.
    </p>
  );
}
