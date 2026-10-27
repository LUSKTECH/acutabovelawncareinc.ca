import type { Metadata } from 'next';
import Image from 'next/image';
import { getCategorizedServices } from '@/content/services/_meta';
import ServiceCategorySection from '@/components/service/ServiceCategorySection';

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  title: 'Services',
  description:
    'Explore our full range of landscaping, lawn care, hardscaping, and seasonal services across Burlington, Oakville, Milton, and the wider Halton Region.',
};

export default function ServicesIndex() {
  const groups = getCategorizedServices();
  return (
    <>
      {/* Hero banner */}
      <section className="relative isolate">
        <div className="relative h-[36vh] min-h-[240px] w-full overflow-hidden">
          <Image
            src="/images/projects/hardscapes-02.jpg"
            alt="Landscaping and hardscaping services by A Cut Above Lawn Care"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="from-forest-900/80 via-forest-900/30 absolute inset-0 bg-gradient-to-t to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 lg:px-8">
            <p className="text-cream-50/80 text-sm tracking-widest uppercase">What we do</p>
            <h1 className="font-display text-cream-50 text-4xl sm:text-5xl">Services</h1>
            <p className="text-cream-50/85 mt-3 max-w-2xl text-base">
              Full-service landscaping, lawn care, and hardscaping for commercial properties across
              Halton.
            </p>
          </div>
        </div>
      </section>
      {groups.map((g) => (
        <ServiceCategorySection
          key={g.category}
          id={g.category}
          label={g.label}
          services={g.services}
        />
      ))}
    </>
  );
}
