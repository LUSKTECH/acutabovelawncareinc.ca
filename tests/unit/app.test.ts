import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { cities } from '@/content/areas';
import { getServiceSlugs } from '@/lib/content';

describe('robots()', () => {
  it('allows all user-agents from root', () => {
    const result = robots();
    expect(result.rules).toEqual([{ userAgent: '*', allow: '/', disallow: ['/api/'] }]);
  });

  it('returns a sitemap URL', () => {
    const result = robots();
    expect(typeof result.sitemap).toBe('string');
    expect((result.sitemap as string).endsWith('/sitemap.xml')).toBe(true);
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    try {
      const result = robots();
      expect(result.sitemap).toBe('https://example.com/sitemap.xml');
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });
});

describe('sitemap()', () => {
  it('includes the homepage at priority 1', () => {
    const entries = sitemap();
    // The homepage is the entry whose URL path is just "/" (no further segments).
    const home = entries.find((e) => new URL(e.url).pathname === '/');
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
  });

  it('includes all static pages', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const page of ['/services', '/gallery', '/about', '/service-areas', '/contact']) {
      expect(urls.some((u) => u.endsWith(page))).toBe(true);
    }
  });

  it('includes all service slugs', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const slug of getServiceSlugs()) {
      expect(urls.some((u) => u.includes(`/services/${slug}`))).toBe(true);
    }
  });

  it('includes all city area pages', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const city of cities) {
      expect(urls.some((u) => u.includes(`/areas/${city.slug}`))).toBe(true);
    }
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    try {
      const entries = sitemap();
      // Use URL parsing rather than startsWith — the latter can match
      // 'https://example.com.evil.com/…' (CodeQL CWE-20).
      expect(entries.every((e) => new URL(e.url).origin === 'https://example.com')).toBe(true);
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });
});
