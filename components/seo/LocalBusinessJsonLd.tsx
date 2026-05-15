import Script from 'next/script';
import { site } from '@/content/site';

// JSON-LD via next/script. `strategy` controls hydration ordering for executable
// scripts; for `application/ld+json` (data, not code) Next.js renders the inline
// content into the SSR HTML directly, so crawlers see the structured data on
// first byte. No `dangerouslySetInnerHTML` needed — next/script handles escaping.
export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingService',
    name: site.name,
    telephone: site.phone,
    email: site.email,
    url: site.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.serviceAreas,
    openingHours: 'Mo-Fr 08:00-18:00',
  };

  return (
    <Script id="local-business-jsonld" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
