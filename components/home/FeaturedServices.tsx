import Link from 'next/link';
import ServiceCard from '@/components/service/ServiceCard';
import { getFeaturedServices } from '@/lib/content';

export default function FeaturedServices() {
  const featured = getFeaturedServices();
  return (
    <section className="bg-moss-100/40 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
