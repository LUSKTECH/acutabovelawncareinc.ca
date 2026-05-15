'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { getCategorizedServices } from '@/content/services/_meta';

const groups = getCategorizedServices();

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  // Portal target — render the drawer outside the sticky `<header>` so the
  // header's `backdrop-blur` (which establishes a containing block) doesn't
  // collapse the drawer's `position: fixed` against the viewport.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close drawer on Escape. Use window + capture phase so we catch the event
  // even if focus is inside a <details> or a focused link that might absorb it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  const drawer = (
    <div className="fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-cream-50">
      <nav aria-label="Mobile" className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <Link onClick={() => setOpen(false)} href="/" className="block py-2 text-xl">
          Home
        </Link>
        {groups.map((g) => (
          <details key={g.category} className="rounded-xl border border-moss-100 bg-white p-3">
            <summary className="cursor-pointer text-lg font-medium text-forest-900">
              {g.label}
            </summary>
            <ul className="mt-2 space-y-1">
              {g.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    onClick={() => setOpen(false)}
                    href={`/services/${s.slug}`}
                    className="block py-1 text-ink-700"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
        <Link onClick={() => setOpen(false)} href="/gallery" className="block py-2 text-xl">
          Gallery
        </Link>
        <Link onClick={() => setOpen(false)} href="/about" className="block py-2 text-xl">
          About
        </Link>
        <Link
          onClick={() => setOpen(false)}
          href="/service-areas"
          className="block py-2 text-xl"
        >
          Service Areas
        </Link>
        <Link
          onClick={() => setOpen(false)}
          href="/contact"
          className="block rounded-full bg-forest-700 px-5 py-3 text-center text-cream-50"
        >
          Free estimate
        </Link>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest-700"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      {mounted && open && createPortal(drawer, document.body)}
    </>
  );
}
