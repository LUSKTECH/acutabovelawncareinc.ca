'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

type Props = { images: string[]; title: string };

export default function ServiceGallery({ images, title }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const close = useCallback(() => setLightboxSrc(null), []);
  const open = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setLightboxSrc(e.currentTarget.dataset.src ?? null);
  }, []);

  // Keyboard: Escape closes the lightbox
  useEffect(() => {
    if (!lightboxSrc) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
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
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-full bg-forest-900/70 px-3 py-1 text-sm text-cream-50">
                      View larger
                    </span>
                  </div>
                </div>
              </button>
          ))}
        </div>
      </section>

      {lightboxSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project photo"
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/95 p-4"
        >
          <button
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
    </>
  );
}
