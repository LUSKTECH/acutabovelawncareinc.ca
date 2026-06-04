// Real testimonials from the company's Google Business listing
// (A Cut Above Lawn Care Inc. — place_id ChIJLaal10JjK4gRNjaQLr2g6zY).
// Quotes are lightly trimmed for length with ellipses; wording is otherwise
// the reviewer's own. All three were 5-star reviews (confirmed by the owner).
// Aggregate rating (4.4) verified from the live listing on 2026-05-31.
// "27+ years" is the owner's established experience figure (used across other
// locations / marketing).

import CountUp from '@/components/motion/CountUp';

const GOOGLE_LISTING_URL = 'https://www.google.com/maps/place/?q=place_id:ChIJLaal10JjK4gRNjaQLr2g6zY';

const stats: ReadonlyArray<{
  to: number;
  decimals?: number;
  suffix: string;
  label: string;
  href?: string;
}> = [
  { to: 27, suffix: '+', label: 'Years of experience' },
  { to: 4.4, decimals: 1, suffix: '★', label: 'Rated on Google', href: GOOGLE_LISTING_URL },
];

const testimonials: ReadonlyArray<{ quote: string; name: string; meta: string }> = [
  {
    quote:
      'Good professional company to get work done by! Would recommend if you have a big property that needs looking after.',
    name: 'Keanu',
    meta: 'Google review',
  },
  {
    quote:
      'Excellent service… they have been doing [our condo] for many years — 10 years or more. The staff are wonderful people. They do over and above to make us happy. I do recommend them.',
    name: 'Kai Harris',
    meta: 'Local Guide · Google review',
  },
  {
    quote:
      'Shout out to Steve the owner who took care of my glass window right away. Would recommend this place to anyone who needs their lawn taken care of!',
    name: 'Tommy Moya Ruiz',
    meta: 'Google review',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-clay-500" role="img" aria-label="Rated 5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8" aria-labelledby="social-proof-heading">
      <div className="text-center" data-reveal>
        <p className="text-sm uppercase tracking-widest text-sage-500">Trusted locally</p>
        <h2
          id="social-proof-heading"
          className="mt-2 font-display text-3xl text-forest-900 sm:text-4xl"
        >
          What our clients say
        </h2>
      </div>

      {/* Stat band */}
      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4" data-reveal>
        {stats.map((s) => {
          const inner = (
            <>
              <span className="block font-display text-3xl text-forest-900">
                <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </span>
              <span className="mt-1 block text-sm text-ink-500">{s.label}</span>
            </>
          );
          return s.href ? (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label}: ${s.to} (opens Google listing in a new tab)`}
              className="rounded-xl border border-ink-300/20 bg-white p-6 text-center shadow-sm transition hover:border-forest-700"
            >
              {inner}
            </a>
          ) : (
            <div
              key={s.label}
              className="rounded-xl border border-ink-300/20 bg-white p-6 text-center shadow-sm"
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={t.name}
            data-reveal
            data-reveal-delay={i + 1}
            className="flex flex-col rounded-xl border border-ink-300/20 bg-white p-6 shadow-sm"
          >
            <Stars />
            <blockquote className="mt-4 flex-1 font-serif text-ink-700">
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-medium text-forest-900">{t.name}</span>
              <span className="text-ink-500"> · {t.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
