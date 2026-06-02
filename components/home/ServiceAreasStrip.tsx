import { Fragment } from 'react';
import Link from 'next/link';
import { site } from '@/content/site';
import { cities } from '@/content/areas';

const citySlugByName = new Map<string, string>(
  cities.map((c): [string, string] => [c.name, c.slug]),
);

export default function ServiceAreasStrip() {
  return (
    <section className="bg-forest-700 py-12 text-cream-50">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8" data-reveal>
        <p className="text-sm uppercase tracking-[0.3em] text-cream-50/70">Service areas</p>
        <p className="mt-3 font-display text-2xl sm:text-3xl">
          {site.serviceAreas.map((area, i) => {
            const slug = citySlugByName.get(area);
            return (
              <Fragment key={area}>
                {i > 0 && <span className="mx-2 text-cream-50/50">·</span>}
                {slug ? (
                  <Link href={`/areas/${slug}`} className="underline-offset-4 hover:underline">
                    {area}
                  </Link>
                ) : (
                  <span>{area}</span>
                )}
              </Fragment>
            );
          })}
        </p>
      </div>
    </section>
  );
}
