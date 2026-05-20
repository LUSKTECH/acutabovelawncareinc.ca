'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getCategorizedServices, type ServiceCategory } from '@/content/services/_meta';

const groups = getCategorizedServices();

type CategoryDropdownProps = {
  category: ServiceCategory;
  label: string;
  services: Array<{ slug: string; title: string }>;
  isOpen: boolean;
  onToggle: (category: ServiceCategory) => void;
  onClose: () => void;
  onMouseEnter: (category: ServiceCategory) => void;
  onMouseLeave: (category: ServiceCategory) => void;
};

function CategoryDropdown({
  category, label, services, isOpen,
  onToggle, onClose, onMouseEnter, onMouseLeave,
}: CategoryDropdownProps) {
  const panelId = `meganav-panel-${category}`;
  const handleToggle = useCallback(() => onToggle(category), [category, onToggle]);
  const handleEnter = useCallback(() => onMouseEnter(category), [category, onMouseEnter]);
  const handleLeave = useCallback(() => onMouseLeave(category), [category, onMouseLeave]);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={handleToggle}
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 hover:text-forest-700"
      >
        {label}
      </button>
      {isOpen && (
        <div
          id={panelId}
          className="absolute left-1/2 top-full w-72 -translate-x-1/2 rounded-xl border border-moss-100 bg-cream-50 p-2 shadow-card"
        >
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-moss-100 hover:text-forest-900"
              onClick={onClose}
            >
              {s.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MegaNav() {
  const [open, setOpen] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => setOpen(null), []);
  const handleToggle = useCallback(
    (category: ServiceCategory) => setOpen((v) => (v === category ? null : category)),
    [],
  );
  const handleMouseEnter = useCallback((category: ServiceCategory) => setOpen(category), []);
  const handleMouseLeave = useCallback(
    (category: ServiceCategory) => setOpen((v) => (v === category ? null : v)),
    [],
  );

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
      {groups.map((g) => (
        <CategoryDropdown
          key={g.category}
          category={g.category}
          label={g.label}
          services={g.services}
          isOpen={open === g.category}
          onToggle={handleToggle}
          onClose={handleClose}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
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
