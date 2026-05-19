'use client';

import Link from 'next/link';

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center lg:px-8">
      <p className="text-sm uppercase tracking-widest text-sage-500">Error</p>
      <h1 className="mt-2 font-display text-5xl text-forest-900">
        Something went wrong.
      </h1>
      <p className="mt-4 text-ink-700">
        We couldn&rsquo;t load this page. Please try again or contact us directly.
      </p>
      {process.env.NODE_ENV !== 'production' && error.message && (
        <p className="mt-2 font-mono text-xs text-ink-500">{error.message}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-forest-700 px-6 py-3 font-medium text-cream-50 hover:bg-forest-900"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-forest-700 px-6 py-3 font-medium text-forest-700 hover:bg-moss-100"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
