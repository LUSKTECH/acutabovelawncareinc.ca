import { site } from '@/content/site';

export default function ServiceAreasStrip() {
  return (
    <section className="bg-forest-700 py-12 text-cream-50">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cream-50/70">Service areas</p>
        <p className="mt-3 font-display text-2xl sm:text-3xl">
          {site.serviceAreas.join(' · ')}
        </p>
      </div>
    </section>
  );
}
