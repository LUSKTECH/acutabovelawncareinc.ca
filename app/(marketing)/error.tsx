'use client';

import Link from 'next/link';

export default function MarketingError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center lg:px-8">
      <p className="text-sage-500 text-sm tracking-widest uppercase">Error</p>
      <h1 className="font-display text-forest-900 mt-2 text-5xl">Something went wrong.</h1>
      <p className="text-ink-700 mt-4">
        We couldn&rsquo;t load this page. Please try again or contact us directly.
      </p>
      {process.env.NODE_ENV !== 'production' && error.message && (
        <p className="text-ink-500 mt-2 font-mono text-xs">{error.message}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="bg-forest-700 text-cream-50 hover:bg-forest-900 rounded-full px-6 py-3 font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-forest-700 text-forest-700 hover:bg-moss-100 rounded-full border px-6 py-3 font-medium"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
