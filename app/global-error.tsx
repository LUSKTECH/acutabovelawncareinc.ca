'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-4">
        <h1 className="font-display text-3xl text-forest-900">Something went wrong</h1>
        <p className="mt-4 text-ink-700">
          We&rsquo;ve been notified. Please try again or call us at{' '}
          <a href="tel:+19056380884" className="font-medium text-forest-700">
            (905) 638-0884
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-forest-700 px-6 py-3 font-medium text-cream-50 hover:bg-forest-900"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
