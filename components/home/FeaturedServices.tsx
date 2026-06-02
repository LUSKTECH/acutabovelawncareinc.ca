import Link from 'next/link';
import ServiceCard from '@/components/service/ServiceCard';
import { getFeaturedServices } from '@/lib/content';

export default function FeaturedServices() {
  const featured = getFeaturedServices();
  return (
    <section className="bg-moss-100/40 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <p className="text-sm uppercase tracking-widest text-sage-500">Our work</p>
            <h2 className="mt-2 font-display text-3xl text-forest-900 sm:text-4xl">
              Featured services
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-forest-700 hover:text-forest-900"
          >
            See all services →
          </Link>
        </div>
        {/* 5 featured services: 5-up on desktop avoids an orphaned 5th card. */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {featured.map((s, i) => (
            <div key={s.slug} data-reveal data-reveal-delay={(i % 4) + 1}>
              <ServiceCard
                service={s}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
