'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/images';

type Props = {
  items: GalleryItem[];
  openIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ items, openIndex, onClose, onPrev, onNext }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Capture the element that had focus before the dialog opened so we can restore it on close.
  useEffect(() => {
    if (openIndex === null) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      lastFocusedRef.current?.focus?.();
    };
  }, [openIndex]);

  // Lock background scroll while open.
  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openIndex]);

  // Keyboard: Escape to close, arrows to navigate, Tab to stay inside dialog.
  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, onClose, onPrev, onNext]);

  if (openIndex === null) return null;
  const item = items[openIndex];
  if (!item) {
    // Indicates a logic bug in the parent — surface in dev rather than hide silently.
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Lightbox: openIndex ${openIndex} is out of bounds (items.length=${items.length})`);
    }
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 bg-forest-900/95"
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full bg-cream-50/10 px-4 py-2 text-cream-50 hover:bg-cream-50/20"
      >
        Close
      </button>
      <button
        onClick={onPrev}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/10 px-4 py-3 text-cream-50 hover:bg-cream-50/20"
      >
        ‹
      </button>
      <button
        onClick={onNext}
        aria-label="Next image"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/10 px-4 py-3 text-cream-50 hover:bg-cream-50/20"
      >
        ›
      </button>
      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center p-8">
        <div className="relative h-full w-full">
          <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
