import { describe, it, expect } from 'vitest';
import {
  getAllServices,
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

  it('returns the full service set via getAllServices', () => {
    const all = getAllServices();
    expect(all.length).toBe(22);
    for (const s of all) {
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

describe('site constant shape', () => {
  it('contains the expected business identity fields', () => {
    expect(site.name).toMatch(/A Cut Above/);
    expect(site.phoneE164.startsWith('+')).toBe(true);
    expect(site.serviceAreas.length).toBeGreaterThan(2);
    expect(site.url.startsWith('http')).toBe(true);
  });
});
