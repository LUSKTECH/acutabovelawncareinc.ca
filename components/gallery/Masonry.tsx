'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/images';
import Lightbox from './Lightbox';

export default function Masonry({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className="block w-full overflow-hidden rounded-xl"
            aria-label={`Open image: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition duration-500 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        items={items}
        openIndex={open}
        onClose={() => setOpen(null)}
        onPrev={() =>
          setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length))
        }
        onNext={() => setOpen((i) => (i === null ? null : (i + 1) % items.length))}
      />
    </>
  );
}
