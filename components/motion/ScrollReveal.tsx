'use client';

import { useEffect } from 'react';

/**
 * Enables scroll-reveal animations site-wide via a single IntersectionObserver.
 *
 * Progressive enhancement: only adds the `js-reveal` class to <html> when motion
 * is allowed. The pre-reveal hidden state in globals.css is scoped to
 * `html.js-reveal`, so without JS — or with prefers-reduced-motion — nothing is
 * ever hidden. Renders nothing; mount once in the layout.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    const targets = document.querySelectorAll('[data-reveal]');
    for (const el of targets) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
