'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, onClose, onPrev, onNext]);

  if (openIndex === null) return null;
  const item = items[openIndex];
  if (!item) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-50 bg-forest-900/95">
      <button
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
