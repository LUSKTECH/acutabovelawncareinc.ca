import Link from 'next/link';

export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center lg:px-8" data-reveal>
      <h2 className="font-display text-4xl text-forest-900 sm:text-5xl">
        Let&rsquo;s plan your season.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink-700">
        Tell us about your property and we&rsquo;ll put together a no-pressure quote.
      </p>
      <Link
        href="/contact"
        className="mt-8 inline-block rounded-full bg-forest-700 px-8 py-4 font-medium text-cream-50 hover:bg-forest-900"
      >
        Request a free estimate
      </Link>
    </section>
  );
}
