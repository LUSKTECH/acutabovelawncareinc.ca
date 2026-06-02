'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = Readonly<{ images: string[]; title: string }>;

export default function ServiceGallery({ images, title }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setLightboxSrc(null), []);
  const open = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    lastFocusedRef.current = e.currentTarget;
    setLightboxSrc(e.currentTarget.dataset.src ?? null);
  }, []);

  // Open/close the native <dialog> when lightboxSrc changes.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (lightboxSrc) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [lightboxSrc]);

  // Focus the close button when lightbox opens; restore on close.
  useEffect(() => {
    if (!lightboxSrc) {
      lastFocusedRef.current?.focus?.();
      return;
    }
    closeButtonRef.current?.focus();
  }, [lightboxSrc]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!lightboxSrc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [lightboxSrc]);

  // Keyboard: Escape + Tab-trap inside dialog.
  useEffect(() => {
    if (!lightboxSrc) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        const active = document.activeElement;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    }
    globalThis.addEventListener('keydown', onKey, true);
    return () => globalThis.removeEventListener('keydown', onKey, true);
  }, [lightboxSrc, close]);

  if (images.length === 0) return null;

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pb-12 lg:px-0">
        <h2 className="font-display text-2xl text-forest-900">
          {title} — project photos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              data-src={src}
              onClick={open}
              aria-label={`View ${title} photo ${i + 1}`}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={src}
                  alt={`${title} project example ${i + 1}`}
                  fill
                  quality={75}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                {/* Always-visible expand affordance so touch users (no hover) see it's interactive. */}
                <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-forest-900/60 text-cream-50">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-forest-900/0 opacity-0 transition group-hover:bg-forest-900/20 group-hover:opacity-100">
                  <span className="rounded-full bg-forest-900/70 px-3 py-1 text-sm text-cream-50">
                    View larger
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-label="Project photo"
        aria-modal="true"
        onClose={close}
        style={{
          margin: 0,
          padding: 0,
          border: 'none',
          background: 'transparent',
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '100vw',
          height: '100vh',
        }}
        // No `flex`/`display` on the <dialog> itself: that would override the UA
        // `dialog:not([open]) { display: none }` rule, leaving the closed overlay
        // covering the page. Centering happens on the inner wrapper instead.
        className="fixed inset-0 z-50 bg-forest-900/95 p-4"
      >
        {lightboxSrc && (
          <div className="flex h-full w-full items-center justify-center">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-cream-50/10 px-4 py-2 text-cream-50 hover:bg-cream-50/20"
            >
              Close
            </button>
            <div className="relative max-h-[85vh] max-w-5xl w-full h-full">
              <Image
                src={lightboxSrc}
                alt={`${title} project photo`}
                fill
                quality={85}
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
