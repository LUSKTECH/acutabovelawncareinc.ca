import type { Metadata } from 'next';
import { getGalleryItems } from '@/lib/images';
import Masonry from '@/components/gallery/Masonry';

export const metadata: Metadata = {
  alternates: { canonical: '/gallery' },
  title: 'Gallery',
  description:
    'Browse a gallery of recent landscaping, hardscaping, and lawn care projects completed across Burlington, Oakville, Milton, and the Halton Region.',
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-12 lg:px-8">
        <p className="text-sage-500 text-sm tracking-widest uppercase">Recent work</p>
        <h1 className="font-display text-forest-900 mt-2 text-4xl sm:text-5xl">Gallery</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8" data-reveal>
        {items.length === 0 ? (
          <p className="text-ink-500 py-16 text-center">Gallery photos are coming soon.</p>
        ) : (
          <Masonry items={items} />
        )}
      </section>
    </>
  );
}
