'use client';

import { useEffect, useRef, useState } from 'react';

type Props = Readonly<{
  to: number;
  decimals?: number;
  suffix?: string;
  durationMs?: number;
}>;

/**
 * Counts from 0 up to `to` once, when first scrolled into view.
 *
 * SSR / no-JS / reduced-motion render the final value immediately, so the number
 * is never stuck at 0. The host cell has a content-independent width (a fixed
 * grid column) and we use tabular figures, so the tween causes no layout shift.
 */
export default function CountUp({ to, decimals = 0, suffix = '', durationMs = 1200 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Start from 0 now (off-screen, so no visible flash) and tween in on view.
    setValue(0);
    let raf = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setValue(t < 1 ? to * eased : to);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
