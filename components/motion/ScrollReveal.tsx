'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Enables scroll-reveal animations site-wide via a single IntersectionObserver.
 *
 * Progressive enhancement: `js-reveal` is added to <html> only when motion is
 * allowed AND IntersectionObserver is available. The pre-reveal hidden state in
 * globals.css is scoped to `html.js-reveal`, so without JS, with reduced motion,
 * or without observer support, nothing is ever hidden. Renders nothing; mount
 * once in the layout.
 *
 * Re-runs on every client-side navigation (`pathname` dep) so that new pages'
 * `[data-reveal]` elements are observed — without this, elements added after the
 * initial mount would stay at opacity:0 permanently.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in globalThis)) return;

    const root = document.documentElement;

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

    function revealAndObserve() {
      // Skip elements already revealed (idempotent — safe to call multiple times).
      const targets = document.querySelectorAll('[data-reveal]:not(.reveal-in)');
      for (const el of targets) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          // Already in the viewport: mark revealed immediately so js-reveal
          // never hides it (avoids the opacity flash on load / navigation).
          el.classList.add('reveal-in');
        } else {
          observer.observe(el);
        }
      }
    }

    root.classList.add('js-reveal');
    revealAndObserve();
    // Re-scan on the next frame: on client-side navigation React may commit
    // some page sections after this synchronous effect body runs.
    const raf = requestAnimationFrame(revealAndObserve);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
