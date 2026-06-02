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

  // Server-rendered inline JSON-LD per the Next.js App Router guidance, so the
  // structured data is in the initial HTML for crawlers. safeJsonLd escapes the
  // `<` character (prevents `</script>` breakout) and `data` is trusted site
  // config, so dangerouslySetInnerHTML is safe — the two security rules below
  // are false positives on this official pattern.
  return (
    // eslint-disable-next-line react/no-danger, xss/no-mixed-html
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />
  );
}
