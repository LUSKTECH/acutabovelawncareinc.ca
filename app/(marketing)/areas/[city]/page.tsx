import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
import { cities, getCityBySlug, getCityServices, CityNotFoundError } from '@/content/areas';
import { safeJsonLd } from '@/lib/json-ld';
import ServiceCard from '@/components/service/ServiceCard';
import { site } from '@/content/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  let city;
  try { city = getCityBySlug(slug); } catch (err) { if (err instanceof CityNotFoundError) return {}; throw err; }

  const title = `Landscaping & Lawn Care in ${city.name}, Ontario`;
  const description = `Professional landscaping, hardscaping, and lawn care in ${city.name}. Local crews, free estimates. Serving ${city.name} and the ${city.region}.`;

  return {
    title,
    description,
    alternates: { canonical: `/areas/${city.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: city.heroImage, alt: `Landscaping services in ${city.name}, Ontario` }],
      url: `/areas/${city.slug}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [city.heroImage] },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  let city;
  try { city = getCityBySlug(slug); } catch (err) { if (err instanceof CityNotFoundError) notFound(); throw err; }

  const cityServices = getCityServices(city!);
  const c = city!;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/areas/${c.slug}`,
    name: site.name,
    description: `${c.intro.slice(0, 200)}...`,
    url: `${site.url}/areas/${c.slug}`,
    telephone: site.phone,
    email: site.email,
    areaServed: {
      '@type': 'City',
      name: c.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: c.region },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
  };

  return (
    <>
      <Script id={`city-jsonld-${c.slug}`} type="application/ld+json" strategy="afterInteractive">
        {safeJsonLd(jsonLd)}
      </Script>

      {/* Hero */}
      <section className="relative isolate">
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
          <Image
            src={c.heroImage}
            alt={`Landscaping and lawn care in ${c.name}, Ontario`}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/40 to-transparent" />
        </div>
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="relative -mt-20 text-sm uppercase tracking-[0.3em] text-cream-50/80 md:-mt-24">
            Serving {c.region}
          </p>
          <h1 className="font-display text-4xl text-cream-50 sm:text-5xl md:text-6xl">
            Landscaping in {c.name}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <p className="text-lg text-ink-700">{c.intro}</p>
        <div className="mt-8 rounded-2xl bg-moss-100 px-6 py-5 text-ink-700">
          {c.localContext}
        </div>
        <ul className="mt-6 space-y-2">
          {c.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-ink-700">
              <span className="mt-1 text-sage-500">✓</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Services in this city */}
      <section className="bg-moss-100/40 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-3xl text-forest-900">
            Services we offer in {c.name}
          </h2>
          <p className="mt-2 text-ink-500">
            All services available across {c.name} and nearby {c.region} communities.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cityServices.map((s) =>
              s ? (
                <ServiceCard
                  key={s.slug}
                  service={s}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : null,
            )}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="text-sm font-medium text-forest-700 hover:text-forest-900"
            >
              See all 22 services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl text-forest-900">
          {c.name} landscaping — common questions
        </h2>
        <div className="mt-8 space-y-6">
          {c.faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-moss-100 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-forest-900 marker:content-none">
                {item.question}
                <svg
                  className="h-5 w-5 shrink-0 text-sage-500 transition group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-ink-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center lg:px-8">
        <h2 className="font-display text-3xl text-forest-900 sm:text-4xl">
          Ready for a free estimate in {c.name}?
        </h2>
        <p className="mt-4 text-ink-700">
          Call us at{' '}
          <a href={`tel:${site.phoneE164}`} className="font-medium text-forest-700">
            {site.phone}
          </a>{' '}
          or use the form below — we typically respond the same business day.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-forest-700 px-8 py-4 font-medium text-cream-50 hover:bg-forest-900"
        >
          Get a free estimate
        </Link>
      </section>
    </>
  );
}
