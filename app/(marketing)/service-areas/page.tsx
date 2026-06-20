import type { Metadata } from 'next';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/content';
import { renderMdx } from '@/lib/mdx';
import { site } from '@/content/site';
import { cities } from '@/content/areas';

/** Map a service-area name to its dedicated city page slug, if one exists. */
const citySlugByName = new Map<string, string>(
  cities.map((c): [string, string] => [c.name, c.slug]),
);

export const metadata: Metadata = {
  alternates: { canonical: '/service-areas' },
  title: 'Service Areas',
  description:
    'See where A Cut Above Lawn Care Inc works — professional landscaping and lawn care across Burlington, Oakville, Milton, Halton Hills, and Hamilton.',
};

export default async function ServiceAreasPage() {
  const { content: raw } = getPageBySlug('service-areas');
  const content = await renderMdx(raw);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-24 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-sage-500">Where we work</p>
        <h1 className="mt-2 font-display text-5xl text-forest-900">Service Areas</h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {site.serviceAreas.map((area) => {
            const slug = citySlugByName.get(area);
            return (
              <Link
                key={area}
                href={slug ? `/areas/${slug}` : '/contact'}
                className="rounded-xl border border-moss-100 bg-white p-6 shadow-card hover:border-forest-700"
              >
                <p className="font-display text-2xl text-forest-900">{area}</p>
                <p className="mt-2 text-sm text-ink-500">
                  {slug ? `Landscaping & lawn care in ${area}` : 'Commercial property service'}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      <article className="container-prose px-4 py-16 lg:px-0" data-reveal>
        <h2 className="font-display text-3xl text-forest-900">Services by city</h2>
        <div className="mt-6 prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
    </>
  );
}
