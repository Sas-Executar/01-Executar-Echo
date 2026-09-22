"use client";

import type { Task } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import { canTransitionScrollTask, onTimerElapsed } from "@repo/domain";
import type {
  ScrollTaskState,
  ScrollTaskTimerMinutes,
  TaskState,
} from "@repo/schemas";
import { useEffect, useState, useTransition } from "react";
import { advanceTaskForward } from "./scroll-complete-button";

const TIMER_OPTIONS: readonly ScrollTaskTimerMinutes[] = [15, 30, 45];

interface ScrollAutoModeTimerProperties {
  readonly localState: ScrollTaskState;
  readonly onAdvanced: (toState: TaskState) => void;
  readonly onAutoAdvance: () => void;
  readonly onLocalStateChange: (next: ScrollTaskState) => void;
  readonly task: Pick<Task, "id" | "state">;
}

/**
 * Task 7 (Scroll+Scanner P0 plan) — the timer/Auto Mode affordance
 * (15/30/45min, per the decided prototype). Entirely local/session
 * state, never persisted (out of v1 scope, disclosed in the plan) —
 * only the *start* click also persists the real task forward
 * (advanceTaskForward, the same helper scroll-complete-button.tsx's
 * plain click uses, so there is exactly one place that calls
 * completeAction for a non-evidence transition).
 *
 * "Auto-scroll nunca marca conclusão automaticamente": when the timer
 * hits zero with Auto Mode on, this only calls onAutoAdvance() (moves
 * to the next slide) — never onAdvanced()/completeAction. Without Auto
 * Mode, it calls onTimerElapsed() (@repo/domain), which can only ever
 * produce "timer_elapsed", matching packages/domain/__tests__/
 * scroll-task-state.test.ts's own guarantee.
 */
export const ScrollAutoModeTimer = ({
  localState,
  onAdvanced,
  onAutoAdvance,
  onLocalStateChange,
  task,
}: ScrollAutoModeTimerProperties) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<ScrollTaskTimerMinutes | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (
      localState !== "running" ||
      remainingSeconds === null ||
      remainingSeconds <= 0
    ) {
      return;
    }
    const id = setTimeout(() => {
      setRemainingSeconds((seconds) => (seconds === null ? null : seconds - 1));
    }, 1000);
    return () => clearTimeout(id);
  }, [localState, remainingSeconds]);

  useEffect(() => {
    if (localState !== "running" || remainingSeconds !== 0) {
      return;
    }
    if (autoMode) {
      onAutoAdvance();
      return;
    }
    const next = onTimerElapsed(localState);
    if (next) {
      onLocalStateChange(next);
    }
  }, [
    localState,
    remainingSeconds,
    autoMode,
    onAutoAdvance,
    onLocalStateChange,
  ]);

  const startWithTimer = (selected: ScrollTaskTimerMinutes) => {
    if (!canTransitionScrollTask(localState, "running")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const toState = await advanceTaskForward(task);
        if (!toState) {
          return;
        }
        setMinutes(selected);
        setRemainingSeconds(selected * 60);
        onLocalStateChange("running");
        onAdvanced(toState);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Falha ao atualizar a tarefa."
        );
      }
    });
  };

  const resume = () => {
    if (!canTransitionScrollTask(localState, "running")) {
      return;
    }
    setRemainingSeconds((minutes ?? TIMER_OPTIONS[0]) * 60);
    onLocalStateChange("running");
  };

  // Only offered when actually starting fresh (task.state is still
  // READY) — an already-DOING unit (the WIP task, resumed from a
  // previous session) has nothing to "start", so no picker is shown for
  // it even while localState happens to be idle.
  if (localState === "idle" && task.state === "READY") {
    return (
      <div className="flex flex-wrap gap-2">
        {TIMER_OPTIONS.map((option) => (
          <Button
            disabled={isPending}
            key={option}
            onClick={() => startWithTimer(option)}
            type="button"
            variant="outline"
          >
            Iniciar com timer {option}min
          </Button>
        ))}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  if (localState === "timer_elapsed") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm">Timer de {minutes}min esgotado.</p>
        <Button onClick={resume} type="button" variant="outline">
          Continuar
        </Button>
      </div>
    );
  }

  if (remainingSeconds === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-muted-foreground text-sm">
      <span className="font-mono tabular-nums">
        {Math.floor(remainingSeconds / 60)}:
        {String(remainingSeconds % 60).padStart(2, "0")}
      </span>
      <button
        aria-pressed={autoMode}
        className={autoMode ? "font-semibold text-success" : "underline"}
        onClick={() => setAutoMode((current) => !current)}
        type="button"
      >
        Auto {autoMode ? "ligado" : "desligado"}
      </button>
    </div>
  );
};
