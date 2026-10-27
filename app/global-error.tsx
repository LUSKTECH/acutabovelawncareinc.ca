'use client';

import { site } from '@/content/site';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-50 flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="font-display text-forest-900 text-3xl">Something went wrong</h1>
        <p className="text-ink-700 mt-4">
          Please try again or call us at{' '}
          <a href={`tel:${site.phoneE164}`} className="text-forest-700 font-medium">
            {site.phone}
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="bg-forest-700 text-cream-50 hover:bg-forest-900 mt-6 rounded-full px-6 py-3 font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
