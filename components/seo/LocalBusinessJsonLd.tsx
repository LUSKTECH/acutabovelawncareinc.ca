import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingService',
    name: site.name,
    telephone: site.phoneE164,
    email: site.email,
    url: site.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.serviceAreas,
    openingHours: site.openingHours,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} // nosemgrep: react-dangerouslysetinnerhtml
    />
  );
}
