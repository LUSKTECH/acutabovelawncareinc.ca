import { describe, it, expect, vi } from 'vitest';
import {
  cities,
  getCityBySlug,
  getCityServices,
  CityNotFoundError,
} from '@/content/areas';
import { services } from '@/content/services/_meta';

describe('getCityBySlug', () => {
  it('returns the city for each known slug', () => {
    for (const city of cities) {
      const result = getCityBySlug(city.slug);
      expect(result.slug).toBe(city.slug);
      expect(result.name.length).toBeGreaterThan(0);
    }
  });

  it('throws CityNotFoundError for an unknown slug', () => {
    expect(() => getCityBySlug('timbuktu')).toThrowError(CityNotFoundError);
    try {
      getCityBySlug('nowhere');
    } catch (err) {
      expect(err).toBeInstanceOf(CityNotFoundError);
      if (err instanceof CityNotFoundError) {
        expect(err.slug).toBe('nowhere');
      }
    }
  });
});

describe('getCityServices', () => {
  it('returns a non-empty list for every city', () => {
    for (const city of cities) {
      const svcs = getCityServices(city);
      expect(svcs.length).toBeGreaterThan(0);
    }
  });

  it('all featuredServiceSlugs resolve to real services', () => {
    const validSlugs = new Set(services.map((s) => s.slug));
    for (const city of cities) {
      for (const slug of city.featuredServiceSlugs) {
        expect(validSlugs.has(slug), `${city.slug} → "${slug}" is not a valid service slug`).toBe(
          true,
        );
      }
    }
  });

  it('every returned service has required fields', () => {
    for (const city of cities) {
      for (const svc of getCityServices(city)) {
        expect(svc?.slug.length).toBeGreaterThan(0);
        expect(svc?.title.length).toBeGreaterThan(0);
        expect(svc?.image.startsWith('/')).toBe(true);
      }
    }
  });
});

describe('getCityServices dev warning', () => {
  it('logs a dev warning when a featuredServiceSlug does not exist', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fakeCity = { ...cities[0]!, featuredServiceSlugs: ['nonexistent-slug'] };
    const result = getCityServices(fakeCity);
    expect(result).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent-slug'),
    );
  });

  it('suppresses the warning when NODE_ENV is production', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const fakeCity = { ...cities[0]!, featuredServiceSlugs: ['nonexistent-slug'] };
      getCityServices(fakeCity);
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
      warnSpy.mockRestore();
    }
  });
});

describe('city data shape', () => {
  it('every city has a non-empty intro, localContext, highlights, faq', () => {
    for (const city of cities) {
      expect(city.intro.length, `${city.slug} intro`).toBeGreaterThan(50);
      expect(city.localContext.length, `${city.slug} localContext`).toBeGreaterThan(50);
      expect(city.highlights.length, `${city.slug} highlights`).toBeGreaterThanOrEqual(3);
      expect(city.faq.length, `${city.slug} faq`).toBeGreaterThanOrEqual(3);
      for (const item of city.faq) {
        expect(item.question.length).toBeGreaterThan(10);
        expect(item.answer.length).toBeGreaterThan(50);
      }
    }
  });

  it('heroImage paths exist as /images/ references', () => {
    for (const city of cities) {
      expect(city.heroImage.startsWith('/images/')).toBe(true);
    }
  });
});
