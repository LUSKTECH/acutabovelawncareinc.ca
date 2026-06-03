'use client';

import { useEffect } from 'react';

/**
 * Enables scroll-reveal animations site-wide via a single IntersectionObserver.
 *
 * Progressive enhancement: `js-reveal` is added to <html> only when motion is
 * allowed AND IntersectionObserver is available. The pre-reveal hidden state in
 * globals.css is scoped to `html.js-reveal`, so without JS, with reduced motion,
 * or without observer support, nothing is ever hidden. Renders nothing; mount
 * once in the layout.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in globalThis)) return;

    const root = document.documentElement;
    root.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        }
      },
      // threshold 0: reveal as soon as any part enters. A percentage threshold
      // would never fire for elements taller than the viewport (e.g. a long
      // article), leaving their content stuck at opacity:0.
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    const targets = document.querySelectorAll('[data-reveal]');
    for (const el of targets) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
