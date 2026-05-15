'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getCategorizedServices } from '@/content/services/_meta';

const groups = getCategorizedServices();

export default function MegaNav() {
  const [open, setOpen] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null);
    }
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <nav aria-label="Primary" ref={containerRef} className="flex items-center gap-1">
      <Link
        href="/"
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        Home
      </Link>
      {groups.map((g) => {
        const panelId = `meganav-panel-${g.category}`;
        const isOpen = open === g.category;
        return (
          <div
            key={g.category}
            className="relative"
            onMouseEnter={() => setOpen(g.category)}
            onMouseLeave={() => setOpen((v) => (v === g.category ? null : v))}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : g.category)}
              className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
            >
              {g.label}
            </button>
            {isOpen && (
              <div
                id={panelId}
                className="absolute left-1/2 top-full w-72 -translate-x-1/2 rounded-xl border border-moss-100 bg-cream-50 p-2 shadow-card"
              >
                {g.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-moss-100 hover:text-forest-900"
                    onClick={() => setOpen(null)}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <Link
        href="/gallery"
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        Gallery
      </Link>
      <Link
        href="/about"
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        About
      </Link>
      <Link
        href="/service-areas"
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        Areas
      </Link>
    </nav>
  );
}
