'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCategorizedServices } from '@/content/services/_meta';

const groups = getCategorizedServices();

const topLinkClass = (active: boolean) =>
  active ? 'block py-2 text-xl font-semibold text-forest-700' : 'block py-2 text-xl text-forest-900';

export default function MobileNav() {
  // Drawer is rendered via createPortal outside the sticky `<header>` because
  // the header's `backdrop-blur` establishes a containing block that would
  // collapse the drawer's `position: fixed` against the header instead of the
  // viewport. The portal is gated on `mounted` (see below) so the server HTML
  // and the first client render agree — avoiding a hydration mismatch.
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // Gate the portal on mount: server and first client render both produce no
  // portal (matching HTML), then the drawer mounts client-side after hydration.
  const [mounted, setMounted] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  // Mirror MegaNav: the Areas section covers both /service-areas and /areas/[city].
  const areasActive = pathname.startsWith('/service-areas') || pathname.startsWith('/areas');

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Open/close the native <dialog> when `open` state changes.
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.show();
    } else {
      if (el.open) el.close();
    }
  }, [open]);

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
  // The native <dialog> fires a 'cancel' event on Escape; we intercept at
  // the keydown level to stay consistent and prevent default browser close.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    }
    globalThis.addEventListener('keydown', onKey, true);
    return () => {
      globalThis.removeEventListener('keydown', onKey, true);
    };
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
    globalThis.addEventListener('keydown', onTab);
    return () => {
      globalThis.removeEventListener('keydown', onTab);
    };
  }, [open]);

  const drawer = (
    <dialog
      ref={drawerRef}
      id="mobile-nav-drawer"
      aria-label="Site navigation"
      aria-modal="true"
      onClose={() => {
        setOpen(false);
      }}
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: '100%',
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
      }}
      className="z-50"
    >
      <div className="absolute inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-cream-50">
      <nav aria-label="Mobile" className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <Link
          onClick={close}
          href="/"
          aria-current={isActive('/') ? 'page' : undefined}
          className={topLinkClass(isActive('/'))}
        >
          Home
        </Link>
        {groups.map((g) => {
          const expanded = openCategory === g.category;
          const panelId = `mobile-category-${g.category}`;
          return (
            <div key={g.category} className="rounded-xl border border-moss-100 bg-white">
              <div className="flex items-center justify-between p-3">
                <Link
                  onClick={close}
                  href={`/services#${g.category}`}
                  className="text-lg font-medium text-forest-900"
                >
                  {g.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  aria-label={`Toggle ${g.label} services`}
                  onClick={() => setOpenCategory((v) => (v === g.category ? null : g.category))}
                  className="ml-2 rounded p-1 text-forest-700 transition hover:bg-moss-100"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 transition-transform${expanded ? ' rotate-180' : ''}`} aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
              {expanded && (
                <ul id={panelId} className="space-y-1 px-3 pb-3">
                  {g.services.map((s) => {
                    const active = pathname === `/services/${s.slug}`;
                    return (
                      <li key={s.slug}>
                        <Link
                          onClick={close}
                          href={`/services/${s.slug}`}
                          aria-current={active ? 'page' : undefined}
                          className={active ? 'block py-1 font-semibold text-forest-700' : 'block py-1 text-ink-700'}
                        >
                          {s.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
        <Link
          onClick={close}
          href="/gallery"
          aria-current={isActive('/gallery') ? 'page' : undefined}
          className={topLinkClass(isActive('/gallery'))}
        >
          Gallery
        </Link>
        <Link
          onClick={close}
          href="/about"
          aria-current={isActive('/about') ? 'page' : undefined}
          className={topLinkClass(isActive('/about'))}
        >
          About
        </Link>
        <Link
          onClick={close}
          href="/service-areas"
          aria-current={areasActive ? 'page' : undefined}
          className={topLinkClass(areasActive)}
        >
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
    </dialog>
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
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
