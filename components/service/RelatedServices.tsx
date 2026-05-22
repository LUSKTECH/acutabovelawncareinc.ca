import ServiceCard from './ServiceCard';
import { services, type ServiceCategory } from '@/content/services/_meta';

export default function RelatedServices({
  category,
  slug,
}: Readonly<{
  category: ServiceCategory;
  slug: string;
}>) {
  const siblings = services
    .filter((s) => s.category === category && s.slug !== slug)
    .slice(0, 3);

  if (siblings.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h2 className="font-display text-3xl text-forest-900">Related services</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {siblings.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </section>
  );
}
