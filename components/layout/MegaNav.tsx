'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCategorizedServices, type ServiceCategory } from '@/content/services/_meta';

type NavOpen = ServiceCategory | 'areas' | null;
import { cities } from '@/content/areas';

const groups = getCategorizedServices();

/** Map each service slug back to its category so the parent nav item can be highlighted. */
const categoryBySlug = new Map<string, ServiceCategory>(
  groups.flatMap((g) => g.services.map((s) => [s.slug, g.category] as const)),
);

const linkBase = 'rounded px-3 py-2 text-sm font-medium transition';
const linkClass = (active: boolean) =>
  active
    ? `${linkBase} font-semibold text-forest-700`
    : `${linkBase} text-ink-700 hover:text-forest-700`;

type CategoryDropdownProps = Readonly<{
  category: ServiceCategory;
  label: string;
  services: Array<{ slug: string; title: string }>;
  isOpen: boolean;
  isActive: boolean;
  onToggle: (category: ServiceCategory) => void;
  onClose: () => void;
  onMouseEnter: (category: ServiceCategory) => void;
  onMouseLeave: (category: ServiceCategory) => void;
}>;

function CategoryDropdown({
  category,
  label,
  services,
  isOpen,
  isActive,
  onToggle,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CategoryDropdownProps) {
  const panelId = `meganav-panel-${category}`;
  const handleToggle = useCallback(() => onToggle(category), [category, onToggle]);
  const handleEnter = useCallback(() => onMouseEnter(category), [category, onMouseEnter]);
  const handleLeave = useCallback(() => onMouseLeave(category), [category, onMouseLeave]);
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) handleLeave();
    },
    [handleLeave],
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleBlur}
    >
      <div className="flex items-center">
        <Link href={`/services#${category}`} onClick={onClose} className={linkClass(isActive)}>
          {label}
        </Link>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={isOpen ? panelId : undefined}
          aria-label={`Toggle ${label} menu`}
          onClick={handleToggle}
          className="text-ink-700 hover:text-forest-700 ml-0.5 rounded p-1 transition"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          id={panelId}
          className="border-moss-100 bg-cream-50 shadow-card absolute top-full left-1/2 w-72 -translate-x-1/2 rounded-xl border p-2"
        >
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="text-ink-700 hover:bg-moss-100 hover:text-forest-900 block rounded-lg px-3 py-2 text-sm"
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
  const [open, setOpen] = useState<NavOpen>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const serviceSlug = pathname.startsWith('/services/') ? pathname.split('/')[2] : undefined;
  const activeCategory = serviceSlug ? categoryBySlug.get(serviceSlug) : undefined;
  const areasActive = pathname.startsWith('/areas') || pathname === '/service-areas';

  const handleClose = useCallback(() => setOpen(null), []);
  const handleAreasEnter = useCallback(() => setOpen('areas'), []);
  const handleAreasLeave = useCallback(() => {
    setOpen((v) => (v === 'areas' ? null : v));
  }, []);
  const handleAreasBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) handleAreasLeave();
    },
    [handleAreasLeave],
  );
  const handleAreasToggle = useCallback(() => {
    setOpen((v) => (v === 'areas' ? null : 'areas'));
  }, []);
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
        aria-current={pathname === '/' ? 'page' : undefined}
        className={linkClass(pathname === '/')}
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
          isActive={activeCategory === g.category}
          onToggle={handleToggle}
          onClose={handleClose}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      <Link
        href="/gallery"
        aria-current={pathname.startsWith('/gallery') ? 'page' : undefined}
        className={linkClass(pathname.startsWith('/gallery'))}
      >
        Gallery
      </Link>
      <Link
        href="/about"
        aria-current={pathname.startsWith('/about') ? 'page' : undefined}
        className={linkClass(pathname.startsWith('/about'))}
      >
        About
      </Link>
      <div
        className="relative"
        onMouseEnter={handleAreasEnter}
        onMouseLeave={handleAreasLeave}
        onFocus={handleAreasEnter}
        onBlur={handleAreasBlur}
      >
        <button
          type="button"
          aria-expanded={open === 'areas'}
          aria-haspopup="true"
          aria-controls={open === 'areas' ? 'meganav-panel-areas' : undefined}
          onClick={handleAreasToggle}
          className={linkClass(areasActive)}
        >
          Areas
        </button>
        {open === 'areas' && (
          <div
            id="meganav-panel-areas"
            className="border-moss-100 bg-cream-50 shadow-card absolute top-full left-1/2 w-56 -translate-x-1/2 rounded-xl border p-2"
          >
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="text-ink-700 hover:bg-moss-100 hover:text-forest-900 block rounded-lg px-3 py-2 text-sm"
                onClick={handleClose}
              >
                {c.name}
              </Link>
            ))}
            <div className="border-moss-100 mx-3 my-1 border-t" />
            <Link
              href="/service-areas"
              className="text-ink-500 hover:bg-moss-100 hover:text-forest-900 block rounded-lg px-3 py-2 text-sm"
              onClick={handleClose}
            >
              All service areas →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
