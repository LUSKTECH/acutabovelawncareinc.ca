import { describe, it, expect } from 'vitest';
import { getServiceSlugs, getServiceBySlug, getFeaturedServices, getPageBySlug } from '@/lib/content';
import { getCategorizedServices, services } from '@/content/services/_meta';

describe('content layer', () => {
  it('exposes every service slug', () => {
    const slugs = getServiceSlugs();
    expect(slugs).toContain('lawn-care');
    expect(slugs).toContain('hardscapes');
    expect(slugs.length).toBe(22);
  });

  it('loads MDX body for each service', () => {
    for (const slug of getServiceSlugs()) {
      const s = getServiceBySlug(slug);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(50);
    }
  });

  it('returns at least one featured service per category', () => {
    const featured = getFeaturedServices();
    const cats = new Set(featured.map((s) => s.category));
    expect(cats.size).toBe(4);
  });

  it('categorizes services in the canonical 4 buckets', () => {
    const groups = getCategorizedServices();
    expect(groups.map((g) => g.category)).toEqual(['landscaping', 'lawn', 'hardscaping', 'other']);
    for (const g of groups) expect(g.services.length).toBeGreaterThan(0);
  });

  it('every service points to a unique image path', () => {
    const images = services.map((s) => s.image);
    expect(new Set(images).size).toBe(images.length);
  });

  it('loads about + service-areas page MDX', () => {
    const about = getPageBySlug('about');
    const areas = getPageBySlug('service-areas');
    expect(about.content.length).toBeGreaterThan(50);
    expect(areas.content.length).toBeGreaterThan(50);
  });
});
