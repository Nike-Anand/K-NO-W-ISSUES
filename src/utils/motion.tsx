/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Small motion primitives that make the UI feel dynamic:
 *  - useCountUp            Animated numeral (easing from 0 → target).
 *  - useAppear             Reliably flip a ref to `revealed` once in view.
 *  - observeScrollReveals  One-shot global reveal driver for .reveal nodes.
 */

import React, { useEffect, useRef, useState } from 'react';

export interface CountUpOptions {
  duration?: number; // ms
  delay?: number; // ms
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/** Ease-out cubic. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target: number, options?: CountUpOptions, waitForVisible = true) {
  const { duration = 900, delay = 0, decimals = 0, prefix = '', suffix = '' } = options || {};
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(!waitForVisible);

  useEffect(() => {
    if (!started) return;
    if (target <= 0) { setValue(0); return; }

    const t0 = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - t0);
      const p = Math.min(1, elapsed / duration);
      setValue(target * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, started, duration, delay]);

  useEffect(() => {
    if (!ref.current || started) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          el.classList.add('done');
          obs.disconnect();
        }
      },
      { rootMargin: '40px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  const display = `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return { ref, value: display, raw: value, done: started };
}

/** Adds `revealed` to a node the first time it scrolls into view. */
export interface AppearProps<T = HTMLDivElement> {
  ref?: React.RefObject<T | null>;
  onReveal?: () => void;
}

/** Observe all `.reveal` / `.reveal-up` nodes once globally. Returns a refresh key+fn. */
export function observeScrollReveals(selector = '.reveal, .reveal-up') {
  const nodes = Array.from(document.querySelectorAll(selector));
  if (nodes.length === 0) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  nodes.forEach((n) => obs.observe(n));
}

export { React };