"use client";

import { canTransitionScrollTask } from "@repo/domain";
import type { ScrollTaskState, TaskState } from "@repo/schemas";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollTaskSlide,
  type ScrollTaskUnitWithState,
} from "./scroll-task-slide";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

interface ScrollTaskViewProperties {
  readonly units: readonly ScrollTaskUnitWithState[];
}

const INTERSECTION_THRESHOLD = 0.6;

/**
 * Fase 7 (APP-SCR-001), rewritten for Task 7/8 of the Scroll+Scanner P0
 * plan — real native scroll-snap (chatgpt/scroll-task-prototype's own
 * mechanism, `scroll-snap-type: y proximity` + one full-height section
 * per unit) with IntersectionObserver deriving activeIndex from actual
 * scroll position, not just from button clicks. Persistence
 * (scroll-complete-button.tsx) is real: a transition removes the unit
 * from this page's server-side query (scroll/page.tsx only ever sources
 * READY + the single WIP task), so after router.refresh() the unit
 * simply isn't in the next `units` prop — the array shrinking is what
 * "advances to the next slide", no manual index bump needed for that
 * case (see the units.length effect below, which only clamps).
 *
 * "Auto-scroll nunca marca conclusão automaticamente" and "≤2
 * interações para iniciar" both still hold: canTransitionScrollTask/
 * onTimerElapsed (@repo/domain) own every local transition, this file
 * duplicates none of that logic.
 */
export const ScrollTaskView = ({ units }: ScrollTaskViewProperties) => {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLElement>>(new Map());

  const [activeIndex, setActiveIndex] = useState(0);
  const [localState, setLocalState] = useState<ScrollTaskState>("idle");

  // A persisted transition (or the workspace simply changing) can
  // shrink/grow the server-provided queue across a refresh — clamp
  // rather than pointing past the end of the new array.
  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(units.length - 1, 0)));
  }, [units.length]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const unit = units[index];
      const node = unit ? slideRefs.current.get(unit.refId) : null;
      // Not implemented in jsdom (tests) and absent on some older
      // browsers — guarded rather than assumed present.
      if (typeof node?.scrollIntoView === "function") {
        node.scrollIntoView({
          block: "start",
          behavior: prefersReducedMotion ? "instant" : "smooth",
        });
      }
    },
    [units, prefersReducedMotion]
  );

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, units.length - 1));
      setActiveIndex(clamped);
      setLocalState("idle");
      scrollToIndex(clamped);
    },
    [units.length, scrollToIndex]
  );

  // Real scroll/swipe also drives activeIndex, not just the keyboard/
  // buttons — guarded for environments without IntersectionObserver
  // (jsdom in tests; older browsers).
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !containerRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) {
          return;
        }
        const index = units.findIndex(
          (unit) => slideRefs.current.get(unit.refId) === mostVisible.target
        );
        if (index !== -1) {
          setActiveIndex((current) => {
            if (index === current) {
              return current;
            }
            setLocalState("idle");
            return index;
          });
        }
      },
      { root: containerRef.current, threshold: INTERSECTION_THRESHOLD }
    );
    for (const node of slideRefs.current.values()) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [units]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goTo(activeIndex + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo]);

  const onAdvanced = useCallback(
    (toState: TaskState) => {
      if (toState === "DOING") {
        // Same unit, now started — stay on this slide.
        setLocalState((current) =>
          canTransitionScrollTask(current, "running") ? "running" : current
        );
      } else {
        // VERIFY/DONE — the unit leaves this READY/WIP-only queue; the
        // refresh below drops it from `units`, sliding the next one
        // into this same activeIndex.
        setLocalState("idle");
      }
      router.refresh();
    },
    [router]
  );

  const onAutoAdvance = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const onDefer = useCallback(() => {
    if (!canTransitionScrollTask(localState, "deferred")) {
      return;
    }
    goTo(activeIndex + 1);
  }, [localState, activeIndex, goTo]);

  const onExpand = useCallback(() => {
    setLocalState((current) =>
      canTransitionScrollTask(current, "expanded") ? "expanded" : current
    );
  }, []);

  if (units.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
        <h1 className="font-semibold text-2xl">Scroll Task</h1>
        <p className="text-muted-foreground">
          Nada elegível agora — sem unidades para exibir.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Tarefas"
      className="mx-auto h-[80vh] max-w-2xl overflow-y-auto overscroll-contain"
      ref={containerRef}
      style={{ scrollSnapType: "y proximity" }}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs keyboard focus for the ArrowUp/ArrowDown/PageUp/PageDown handler above to receive events at all.
      tabIndex={0}
    >
      {units.map((unit, index) => (
        <ScrollTaskSlide
          isActive={index === activeIndex}
          key={unit.refId}
          localState={index === activeIndex ? localState : "idle"}
          onAdvanced={onAdvanced}
          onAutoAdvance={onAutoAdvance}
          onDefer={onDefer}
          onExpand={onExpand}
          onLocalStateChange={setLocalState}
          pendingCount={units.length - index}
          position={{ index, total: units.length }}
          ref={(node) => {
            if (node) {
              slideRefs.current.set(unit.refId, node);
            } else {
              slideRefs.current.delete(unit.refId);
            }
          }}
          unit={unit}
        />
      ))}
    </section>
  );
};
