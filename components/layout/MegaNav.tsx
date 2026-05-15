'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCategorizedServices } from '@/content/services/_meta';

const groups = getCategorizedServices();

export default function MegaNav() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      <Link
        href="/"
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        Home
      </Link>
      {groups.map((g) => (
        <div
          key={g.category}
          className="relative"
          onMouseEnter={() => setOpen(g.category)}
          onMouseLeave={() => setOpen((v) => (v === g.category ? null : v))}
        >
          <button
            type="button"
            aria-expanded={open === g.category}
            aria-haspopup="menu"
            onClick={() => setOpen(open === g.category ? null : g.category)}
            className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
          >
            {g.label}
          </button>
          {open === g.category && (
            <div
              role="menu"
              className="absolute left-1/2 top-full -translate-x-1/2 w-72 rounded-xl border border-moss-100 bg-cream-50 p-2 shadow-card"
            >
              {g.services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-moss-100 hover:text-forest-900"
                  onClick={() => setOpen(null)}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
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
