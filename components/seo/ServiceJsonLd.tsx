import Script from 'next/script';
import { site } from '@/content/site';
import { safeJsonLd } from '@/lib/json-ld';

type Props = Readonly<{ title: string; description: string; slug: string; image: string }>;

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
        telephone: site.phone,
        url: site.url,
        areaServed: site.serviceAreas,
      },
    },
  ];

  return (
    <Script id={`service-jsonld-${slug}`} type="application/ld+json" strategy="afterInteractive">
      {safeJsonLd(data)}
    </Script>
  );
}
