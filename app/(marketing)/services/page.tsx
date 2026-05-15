import type { Metadata } from 'next';
import { getCategorizedServices } from '@/content/services/_meta';
import ServiceCategorySection from '@/components/service/ServiceCategorySection';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Landscaping, lawn care, hardscaping, and seasonal services across Burlington, Oakville, and Milton.',
};

export default function ServicesIndex() {
  const groups = getCategorizedServices();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-8 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-sage-500">What we do</p>
        <h1 className="mt-2 font-display text-4xl text-forest-900 sm:text-5xl">Services</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-700">
          Full-service landscaping, lawn care, and hardscaping for residential and commercial
          properties across Halton.
        </p>
      </section>
      {groups.map((g) => (
        <ServiceCategorySection key={g.category} label={g.label} services={g.services} />
      ))}
    </>
  );
}
