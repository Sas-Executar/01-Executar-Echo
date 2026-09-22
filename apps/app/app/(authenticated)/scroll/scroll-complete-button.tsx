"use client";

import type { Task } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { TASK_STATE_TRANSITIONS, type TaskState } from "@repo/schemas";
import { useState, useTransition } from "react";
import { completeAction } from "@/app/actions/execution/complete-action";

// PT-BR labels for the *destination* state a click reaches — same
// convention as now/components/task-actions.tsx's TRANSITION_LABEL_PT,
// reused verbatim rather than re-invented so the two surfaces never
// describe the same transition two different ways.
const FORWARD_LABEL_PT: Partial<Record<TaskState, string>> = {
  DOING: "Iniciar",
  VERIFY: "Enviar para verificação",
  DONE: "Concluir",
};

/**
 * Single source of the non-evidence completeAction call, reused by both
 * this button's plain click and scroll-auto-mode-timer.tsx's "Iniciar
 * com timer" buttons (both are the exact same READY→DOING/DOING→VERIFY
 * move, one of them just also starts a local countdown) — kept as a
 * plain async helper, not a hook, so it has no UI state of its own and
 * both call sites can own their own isPending/error independently.
 */
export const advanceTaskForward = async (
  task: Pick<Task, "id" | "state">
): Promise<TaskState | null> => {
  const [forward] = TASK_STATE_TRANSITIONS[task.state];
  if (!forward || forward === "DONE") {
    // DONE requires evidence (completeAction throws MissingEvidenceError
    // without it) — only ScrollCompleteButton's own evidence flow below
    // is allowed to request that transition.
    return null;
  }
  await completeAction({ taskId: task.id, toState: forward });
  return forward;
};

interface ScrollCompleteButtonProperties {
  readonly onAdvanced: (toState: TaskState) => void;
  readonly task: Pick<Task, "id" | "state">;
}

/**
 * Task 8 (Scroll+Scanner P0 plan) — the one persisted action in the
 * Scroll view, same pattern as now/components/task-actions.tsx:
 * completeAction + useTransition + an evidence requirement before DONE
 * ("'feito' não substitui evidência" — not skipped just because Scroll's
 * UI is faster). Its label and target state are both derived from the
 * task's real TASK_STATE_TRANSITIONS forward edge, never hardcoded —
 * whatever this button says is exactly what it does.
 */
export const ScrollCompleteButton = ({
  task,
  onAdvanced,
}: ScrollCompleteButtonProperties) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceDescription, setEvidenceDescription] = useState("");

  const [forward] = TASK_STATE_TRANSITIONS[task.state];

  if (!forward) {
    return null;
  }

  const commitPlain = () => {
    setError(null);
    startTransition(async () => {
      try {
        const toState = await advanceTaskForward(task);
        if (toState) {
          onAdvanced(toState);
        }
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Falha ao atualizar a tarefa."
        );
      }
    });
  };

  const commitDone = (description: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await completeAction({
          taskId: task.id,
          toState: "DONE",
          evidence: { description, grade: "A_OBSERVADO" },
        });
        setEvidenceOpen(false);
        setEvidenceDescription("");
        onAdvanced("DONE");
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Falha ao atualizar a tarefa."
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        disabled={isPending}
        onClick={() =>
          forward === "DONE" ? setEvidenceOpen((open) => !open) : commitPlain()
        }
        type="button"
      >
        {FORWARD_LABEL_PT[forward] ?? forward}
      </Button>

      {evidenceOpen && (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <p className="text-muted-foreground text-sm">
            {
              "'feito' não substitui evidência — descreva o que comprova a conclusão."
            }
          </p>
          <Textarea
            aria-label="Descrição da evidência de conclusão"
            onChange={(event) => setEvidenceDescription(event.target.value)}
            placeholder="O que comprova que esta tarefa foi concluída?"
            value={evidenceDescription}
          />
          <Button
            disabled={isPending || evidenceDescription.trim().length === 0}
            onClick={() => commitDone(evidenceDescription.trim())}
            type="button"
          >
            Confirmar conclusão
          </Button>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};
