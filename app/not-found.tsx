import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center lg:px-8">
      <p className="text-sage-500 text-sm tracking-widest uppercase">404</p>
      <h1 className="font-display text-forest-900 mt-2 text-5xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="text-ink-700 mt-4">It may have moved. Try our services overview.</p>
      <Link
        href="/services"
        className="bg-forest-700 text-cream-50 mt-8 inline-block rounded-full px-6 py-3"
      >
        See services
      </Link>
    </section>
  );
}
