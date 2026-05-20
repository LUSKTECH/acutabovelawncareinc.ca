import Script from 'next/script';
import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';
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
    <Script id="local-business-jsonld" type="application/ld+json" strategy="afterInteractive">
      {safeJsonLd(data)}
    </Script>
  );
}
