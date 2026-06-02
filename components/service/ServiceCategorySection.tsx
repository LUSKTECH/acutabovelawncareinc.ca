import ServiceCard from './ServiceCard';
import type { ServiceMeta } from '@/content/services/_meta';

export default function ServiceCategorySection({
  label,
  services,
}: Readonly<{
  label: string;
  services: ServiceMeta[];
}>) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8" data-reveal>
      <h2 className="font-display text-3xl text-forest-900">{label}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </section>
  );
}
