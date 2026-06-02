import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    // LocalBusiness is a valid schema.org type; 'LandscapingService' was not.
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    description:
      'Full-service landscaping, hardscaping, and lawn care serving Burlington, Oakville, Milton, and the Halton Region.',
    telephone: site.phone,
    email: site.email,
    url: site.url,
    image: `${site.url}/images/hero/hero.jpg`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.serviceAreas,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  };

  // Rendered as a server-side <script> so the markup is present in the initial
  // HTML for crawlers, rather than injected client-side after hydration.
  return (
    <script
      type="application/ld+json"
      // safeJsonLd escapes `<` to prevent `</script>` breakout; data is trusted.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
