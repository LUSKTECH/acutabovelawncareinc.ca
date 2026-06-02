import type { Metadata } from 'next';
import Image from 'next/image';
import { getPageBySlug } from '@/lib/content';
import { renderMdx } from '@/lib/mdx';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'Meet A Cut Above Lawn Care Inc — a local, family-run landscaping and lawn care company serving Burlington, Oakville, Milton, and the Halton Region.',
};

export default async function AboutPage() {
  const { content: raw, data } = getPageBySlug('about');
  const content = await renderMdx(raw);

  const title = typeof data.title === 'string' ? data.title : 'About us';

  return (
    <>
      {/* Hero banner */}
      <section className="relative isolate">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <Image
            src="/images/projects/landscaping-02.jpg"
            alt="A Cut Above Lawn Care crew working on a landscaping project"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8 lg:px-8">
            <p className="text-sm uppercase tracking-widest text-cream-50/80">
              Who we are
            </p>
            <h1 className="font-display text-5xl text-cream-50 sm:text-6xl">{title}</h1>
          </div>
        </div>
      </section>

      {/* Supporting photos strip */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            '/images/projects/landscaping-01.jpg',
            '/images/projects/hardscapes-01.jpg',
            '/images/projects/lawncare-01.jpg',
          ].map((src, i) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={src}
                alt={`A Cut Above Lawn Care project ${i + 1}`}
                fill
                quality={75}
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <article className="container-prose px-4 pb-24 lg:px-0">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
    </>
  );
}
