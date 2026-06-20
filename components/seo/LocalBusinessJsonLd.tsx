import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LandscapingService',
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.3255,
      longitude: -79.799,
    },
    areaServed: site.serviceAreas.map((area) => ({ '@type': 'City', name: area })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.4',
      reviewCount: '27',
      bestRating: '5',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Keanu' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'Good professional company to get work done by! Would recommend if you have a big property that needs looking after.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Kai Harris' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'Excellent service… they have been doing our condo for many years — 10 years or more. The staff are wonderful people.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Tommy Moya Ruiz' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'Shout out to Steve the owner who took care of my glass window right away. Would recommend this place to anyone who needs their lawn taken care of!',
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
