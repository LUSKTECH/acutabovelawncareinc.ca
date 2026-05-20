'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { getCategorizedServices } from '@/content/services/_meta';

const groups = getCategorizedServices();

export default function MobileNav() {
  // Drawer is rendered via createPortal outside the sticky `<header>` because
  // the header's `backdrop-blur` establishes a containing block that would
  // collapse the drawer's `position: fixed` against the header instead of the
  // viewport. The drawer only mounts when `open` is true (post-click), so
  // there's no SSR/hydration mismatch — initial server render has `open=false`
  // and renders nothing for the portal.
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Move focus into the drawer when it opens; restore to hamburger on close.
  useEffect(() => {
    if (open) {
      // Focus the first focusable element inside the drawer.
      const first = drawerRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [open]);

  // Background scroll lock.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape to close (capture phase so <details> can't absorb it).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  // Tab trap: keep focus inside the open drawer.
  useEffect(() => {
    if (!open || !drawerRef.current) return;
    function onTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', onTab);
    return () => window.removeEventListener('keydown', onTab);
  }, [open]);

  const drawer = (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-cream-50"
    >
      <nav aria-label="Mobile" className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <Link onClick={close} href="/" className="block py-2 text-xl">
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
                    onClick={close}
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
        <Link onClick={close} href="/gallery" className="block py-2 text-xl">
          Gallery
        </Link>
        <Link onClick={close} href="/about" className="block py-2 text-xl">
          About
        </Link>
        <Link onClick={close} href="/service-areas" className="block py-2 text-xl">
          Service Areas
        </Link>
        <Link
          onClick={close}
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
        ref={hamburgerRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={toggle}
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
      {open && typeof document !== 'undefined' && createPortal(drawer, document.body)}
    </>
  );
}
