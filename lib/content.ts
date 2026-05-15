import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { services, type ServiceMeta } from '@/content/services/_meta';

export type ServiceContent = ServiceMeta & {
  frontmatter: { title: string; slug: string; excerpt: string };
  body: string;
};

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

export function getServiceBySlug(slug: string): ServiceContent {
  const meta = services.find((s) => s.slug === slug);
  if (!meta) throw new Error(`Unknown service: ${slug}`);
  const raw = readFileSync(join(process.cwd(), 'content/services', `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  return {
    ...meta,
    frontmatter: {
      title: String(data.title ?? meta.title),
      slug: String(data.slug ?? slug),
      excerpt: String(data.excerpt ?? ''),
    },
    body: content,
  };
}

export function getAllServices(): ServiceContent[] {
  return getServiceSlugs().map(getServiceBySlug);
}

export function getPageBySlug(slug: 'about' | 'service-areas') {
  const raw = readFileSync(join(process.cwd(), 'content/pages', `${slug}.mdx`), 'utf8');
  return matter(raw);
}

export function getFeaturedServices(): ServiceMeta[] {
  return services.filter((s) => s.featured).sort((a, b) => a.order - b.order);
}
