"use client";

import { type RefObject, useEffect } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Traps keyboard focus inside `containerRef` while `active` is true, and
 * restores it to the previously focused element on close.
 *
 * The v6 handoff lists the missing focus trap as its one blocking
 * pre-production accessibility item: with the drawer open, Tab walked
 * straight out behind the backdrop into page content the user could not
 * see. Marking `<main>` inert (done by the caller) removes that content
 * from the tab order; this hook closes the remaining cycle so Tab from
 * the last control returns to the first rather than escaping to browser
 * chrome.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus in on open, so the first Tab is predictable and screen
    // readers announce the drawer rather than continuing from the page.
    const initial = container.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      // Re-queried on each keypress: the drawer's contents are rendered
      // from navigation config and can change between renders, so a list
      // captured at open time would go stale.
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}
