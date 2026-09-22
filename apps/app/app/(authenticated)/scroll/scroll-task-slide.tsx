"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { canTransitionScrollTask } from "@repo/domain";
import type { ScrollTaskState, ScrollTaskUnit, TaskState } from "@repo/schemas";
import { forwardRef } from "react";
import { ScrollAutoModeTimer } from "./scroll-auto-mode-timer";
import { ScrollCompleteButton } from "./scroll-complete-button";

export interface ScrollTaskUnitWithState extends ScrollTaskUnit {
  readonly state: TaskState;
}

const STATE_LABEL_PT: Record<ScrollTaskState, string> = {
  idle: "Parado",
  running: "Em execução",
  expanded: "Detalhado",
  completed: "Concluído",
  deferred: "Adiado",
  timer_elapsed: "Tempo esgotado",
};

interface ScrollTaskSlideProperties {
  readonly isActive: boolean;
  readonly localState: ScrollTaskState;
  readonly onAdvanced: (toState: TaskState) => void;
  readonly onAutoAdvance: () => void;
  readonly onDefer: () => void;
  readonly onExpand: () => void;
  readonly onLocalStateChange: (next: ScrollTaskState) => void;
  readonly pendingCount: number;
  readonly position: { readonly index: number; readonly total: number };
  readonly unit: ScrollTaskUnitWithState;
}

/**
 * Task 7 (Scroll+Scanner P0 plan) — one scroll-snap section (fluid
 * typography/spacing per the plan's palette/spacing mapping table,
 * translated from chatgpt/scroll-task-prototype's decided design, never
 * its raw hex — ADR-DS-001). Only the active slide renders interactive
 * controls; inert ones show just the title, matching real native
 * scroll — the user sees them by scrolling past, not via a CSS peek.
 */
export const ScrollTaskSlide = forwardRef<
  HTMLElement,
  ScrollTaskSlideProperties
>(
  (
    {
      isActive,
      localState,
      onAdvanced,
      onAutoAdvance,
      onDefer,
      onExpand,
      onLocalStateChange,
      pendingCount,
      position,
      unit,
    },
    ref
  ) => {
    const task = { id: unit.refId, state: unit.state };

    if (!isActive) {
      return (
        <section
          aria-label={unit.titulo}
          className="flex min-h-full w-full items-center justify-center p-8"
          ref={ref}
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          <p className="text-foreground text-xl">{unit.titulo}</p>
        </section>
      );
    }

    return (
      <section
        aria-label={unit.titulo}
        className="flex min-h-full w-full items-center justify-center p-8"
        ref={ref}
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div className="w-full max-w-2xl">
          <div className="mb-5 flex items-center gap-3 text-muted-foreground text-sm">
            <strong className="text-success tabular-nums">
              {String(position.index + 1).padStart(2, "0")} /{" "}
              {String(position.total).padStart(2, "0")}
            </strong>
            <span>{unit.scope}</span>
            <Badge variant="secondary">{STATE_LABEL_PT[localState]}</Badge>
          </div>

          {/* Double-click is a mouse-only shortcut for the same expand
           * action the "Ver detalhe" button below already exposes —
           * Enter does the same via the keyboard, making this div a
           * real (if redundant) second interactive path, not a
           * suppressed lint warning. A real <button> can't be used
           * here: it can't contain the <h2> heading below (not
           * phrasing content), so role="button" is the only spec-valid
           * way to make this interactive. */}
          {/* biome-ignore lint/a11y/useSemanticElements: see comment above — a <button> can't legally contain the <h2> heading below. */}
          <div
            onDoubleClick={onExpand}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onExpand();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <h2 className="cursor-default font-semibold text-[clamp(2.5rem,7vw,6rem)] text-foreground leading-[1.08] tracking-[-0.04em]">
              {unit.titulo}
            </h2>
          </div>

          <p className="mt-4 text-[clamp(1.25rem,2.5vw,2rem)] text-success">
            {pendingCount} pendente{pendingCount === 1 ? "" : "s"}
          </p>

          {localState === "expanded" && (
            <p className="mt-4 text-muted-foreground text-sm">
              Escopo: {unit.scope} · refId: {unit.refId}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-4">
            <ScrollAutoModeTimer
              localState={localState}
              onAdvanced={onAdvanced}
              onAutoAdvance={onAutoAdvance}
              onLocalStateChange={onLocalStateChange}
              task={task}
            />

            <div className="flex flex-wrap gap-2">
              {/* Hidden only in the brief window right after a start
               * click (plain or timer'd) persisted READY→DOING but the
               * server refresh confirming it hasn't landed yet — showing
               * it here would relabel back to "Iniciar" against stale
               * props. Every other localState/task.state combination
               * always shows it. */}
              {!(localState === "running" && unit.state === "READY") && (
                <ScrollCompleteButton onAdvanced={onAdvanced} task={task} />
              )}
              {localState !== "idle" && localState !== "expanded" && (
                <Button onClick={onExpand} type="button" variant="outline">
                  Ver detalhe
                </Button>
              )}
              {canTransitionScrollTask(localState, "deferred") && (
                <Button onClick={onDefer} type="button" variant="ghost">
                  Adiar
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

ScrollTaskSlide.displayName = "ScrollTaskSlide";
