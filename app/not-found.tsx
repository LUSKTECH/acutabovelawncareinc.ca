import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center lg:px-8">
      <p className="text-sm uppercase tracking-widest text-sage-500">404</p>
      <h1 className="mt-2 font-display text-5xl text-forest-900">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-4 text-ink-700">It may have moved. Try our services overview.</p>
      <Link
        href="/services"
        className="mt-8 inline-block rounded-full bg-forest-700 px-6 py-3 text-cream-50"
      >
        See services
      </Link>
    </section>
  );
}
