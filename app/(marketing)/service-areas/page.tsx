import type { Metadata } from 'next';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getPageBySlug } from '@/lib/content';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Service Areas',
  description:
    'Landscaping and lawn care across Burlington, Oakville, Milton, and the Halton Region.',
};

export default async function ServiceAreasPage() {
  const { content: raw } = getPageBySlug('service-areas');
  const { content } = await compileMDX({
    source: raw,
    options: { parseFrontmatter: false },
  });

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-24 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-sage-500">Where we work</p>
        <h1 className="mt-2 font-display text-5xl text-forest-900">Service Areas</h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.serviceAreas.map((area) => (
            <Link
              key={area}
              href="/contact"
              className="rounded-xl border border-moss-100 bg-white p-6 shadow-card hover:border-forest-700"
            >
              <p className="font-display text-2xl text-forest-900">{area}</p>
              <p className="mt-2 text-sm text-ink-500">Residential & commercial service</p>
            </Link>
          ))}
        </div>
      </section>
      <article className="container-prose px-4 py-16 lg:px-0">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
    </>
  );
}
