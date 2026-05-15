import type { Metadata } from 'next';
import { getGalleryItems } from '@/lib/images';
import Masonry from '@/components/gallery/Masonry';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Recent landscaping, hardscaping, and lawn care projects across Burlington and the Halton Region.',
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-12 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-sage-500">Recent work</p>
        <h1 className="mt-2 font-display text-4xl text-forest-900 sm:text-5xl">Gallery</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <Masonry items={items} />
      </section>
    </>
  );
}
