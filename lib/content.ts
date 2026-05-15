import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { services, type ServiceMeta } from '@/content/services/_meta';

/** Thrown only when the requested slug is not in the typed service allowlist. */
export class UnknownServiceError extends Error {
  readonly slug: string;
  constructor(slug: string) {
    super(`Unknown service: ${slug}`);
    this.name = 'UnknownServiceError';
    this.slug = slug;
  }
}

export type ServiceContent = ServiceMeta & {
  excerpt: string;
  body: string;
};

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

const cache = new Map<string, ServiceContent>();

export function getServiceBySlug(slug: string): ServiceContent {
  const cached = cache.get(slug);
  if (cached) return cached;

  const meta = services.find((s) => s.slug === slug);
  if (!meta) throw new UnknownServiceError(slug);

  const raw = readFileSync(join(process.cwd(), 'content/services', `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : '';
  const result: ServiceContent = { ...meta, excerpt, body: content };
  cache.set(slug, result);
  return result;
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
