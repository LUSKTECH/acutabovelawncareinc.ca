import type { MetadataRoute } from 'next';
import { getServiceSlugs } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acutabovelawncareinc.ca';
  const pages = ['', '/services', '/gallery', '/about', '/service-areas', '/contact'];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...getServiceSlugs().map((slug) => ({
      url: `${base}/services/${slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
