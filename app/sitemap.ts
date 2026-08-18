import type { MetadataRoute } from 'next';
import { getServiceSlugs } from '@/lib/content';
import { cities } from '@/content/areas';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acutabovelawncareinc.ca';
  const now = new Date();
  const pages = ['', '/services', '/gallery', '/about', '/service-areas', '/contact'];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...getServiceSlugs().map((slug) => ({
      url: `${base}/services/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...cities.map((c) => ({
      url: `${base}/areas/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];
}
