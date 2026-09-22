import { rankEligibleTasks } from "@repo/application";
import { forWorkspace } from "@repo/database";
import type { Metadata } from "next";
import { resolveWorkspace } from "../lib/resolve-workspace";
import { ScrollTaskView } from "./scroll-task-view";

export const metadata: Metadata = {
  title: "Scroll Task",
  description:
    "Unidade ativa no centro, avançar uma de cada vez — WIP=1 (APP-SCR-001).",
};

/**
 * Fase 7 (APP-SCR-001) — server component: busca as tarefas elegíveis
 * reais (mesma fonte que /now e /sprint já usam,
 * `rankEligibleTasks`/`packages/application`), com `task.state`
 * incluído (Task 7/8 do plano Scroll+Scanner: o cliente precisa saber o
 * estado real para decidir o rótulo/ação de `ScrollCompleteButton`).
 *
 * Também inclui a tarefa WIP (`state: "DOING"`), a mesma checagem que
 * `nextAction()` (`packages/application/src/next-action.ts`) já faz —
 * sem isso, iniciar uma unidade (READY→DOING, persistido de verdade
 * desde o Task 8) a faria desaparecer da lista no próximo
 * `router.refresh()`, já que `rankEligibleTasks` só retorna READY.
 */
const ScrollPage = async () => {
  const resolved = await resolveWorkspace();
  if (!resolved.ok) {
    return resolved.fallback;
  }
  const { workspace } = resolved;

  const db = forWorkspace(workspace.id);
  const [wipTask, ranked] = await Promise.all([
    db.task.findFirst({ where: { state: "DOING" } }),
    rankEligibleTasks(workspace.id),
  ]);

  const tasks = wipTask
    ? [wipTask, ...ranked.map((r) => r.task)]
    : ranked.map((r) => r.task);

  const units = tasks.map((task) => ({
    refId: task.id,
    scope: "task" as const,
    state: task.state,
    titulo: task.title,
  }));

  return <ScrollTaskView units={units} />;
};

export default ScrollPage;
