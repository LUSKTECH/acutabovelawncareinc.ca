import { describe, it, expect, vi } from 'vitest';
import {
  getServiceSlugs,
  getPageBySlug,
  getServiceBySlug,
  UnknownServiceError,
} from '@/lib/content';
import { site } from '@/content/site';

describe('content loader edge cases', () => {
  it('throws UnknownServiceError for slugs not in the allowlist', () => {
    expect(() => getServiceBySlug('not-a-real-service')).toThrowError(UnknownServiceError);
    try {
      getServiceBySlug('also-fake');
    } catch (err) {
      expect(err).toBeInstanceOf(UnknownServiceError);
      if (err instanceof UnknownServiceError) {
        expect(err.slug).toBe('also-fake');
      }
    }
  });

  it('caches loaded services (second call returns same reference)', () => {
    const a = getServiceBySlug('lawn-care');
    const b = getServiceBySlug('lawn-care');
    expect(a).toBe(b);
  });

  it('loads every service slug without error', () => {
    const slugs = getServiceSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      const s = getServiceBySlug(slug);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(50);
    }
  });

  it('loads both page slugs via getPageBySlug', () => {
    const about = getPageBySlug('about');
    const areas = getPageBySlug('service-areas');
    expect(about.content.length).toBeGreaterThan(50);
    expect(areas.content.length).toBeGreaterThan(50);
  });
});

describe('getPageBySlug error path', () => {
  it('throws and logs when the MDX file is missing', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Force a read error by temporarily patching cwd to a non-existent path.
    const origCwd = process.cwd;
    process.cwd = () => '/nonexistent-path-12345';
    try {
      expect(() => getPageBySlug('about')).toThrow('Page content not found');
      expect(errSpy).toHaveBeenCalled();
    } finally {
      process.cwd = origCwd;
    }
  });
});

describe('site constant shape', () => {
  it('contains the expected business identity fields', () => {
    expect(site.name).toMatch(/A Cut Above/);
    expect(site.phoneE164.startsWith('+')).toBe(true);
    expect(site.serviceAreas.length).toBeGreaterThan(2);
    expect(site.url.startsWith('http')).toBe(true);
  });
});
