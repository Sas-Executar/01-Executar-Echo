"use client";

import { useEffect, useState } from "react";

/** Scroll distance before the chrome starts hiding (handoff v6). */
const THRESHOLD = 80;

/**
 * Returns whether the page chrome should be visible.
 *
 * The contract is specifically that the top nav and the bottom bar move
 * **together** — hiding on scroll-down past 80px and returning together
 * on scroll-up. A single shared piece of state is what guarantees that;
 * two independent listeners would drift and produce the half-hidden
 * chrome the handoff calls out as wrong.
 *
 * `forceVisible` is set while the drawer is open: the handoff requires
 * the chrome to be pinned visible then, so the close control can never
 * scroll out from under the user.
 */
export function useScrollChrome(forceVisible: boolean): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (forceVisible) {
      setVisible(true);
      return;
    }

    let lastY = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      // Coalesced into a frame: scroll fires far more often than the
      // chrome can usefully repaint, and the unthrottled version showed
      // visible jitter at the threshold.
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (y <= THRESHOLD) {
          setVisible(true);
        } else if (y > lastY) {
          setVisible(false);
        } else if (y < lastY) {
          setVisible(true);
        }
        lastY = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [forceVisible]);

  return forceVisible || visible;
}
