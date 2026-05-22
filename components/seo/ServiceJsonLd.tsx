import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

type Props = { title: string; description: string; slug: string; image: string };

export default function ServiceJsonLd({ title, description, slug, image }: Props) {
  const pageUrl = `${site.url}/services/${slug}`;
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services` },
        { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      description,
      url: pageUrl,
      image: `${site.url}${image}`,
      provider: {
        '@type': 'LandscapingService',
        name: site.name,
        telephone: site.phoneE164,
        url: site.url,
        areaServed: site.serviceAreas,
      },
    },
  ];

  // safeJsonLd escapes < so the script tag cannot be closed early; data is
  // entirely from our own content files, not user input.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} // nosemgrep: react-dangerouslysetinnerhtml
    />
  );
}
