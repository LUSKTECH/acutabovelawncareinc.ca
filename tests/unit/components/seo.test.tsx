// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';
import ServiceJsonLd from '@/components/seo/ServiceJsonLd';
import { site } from '@/content/site';

// next/script renders asynchronously in the real Next.js runtime; stub it to a
// plain <script> so SSR-style inline JSON-LD is inspectable in jsdom.
vi.mock('next/script', () => ({
  default: ({
    children,
    id,
    type,
  }: {
    children?: string;
    id?: string;
    type?: string;
  }) => (
    <script id={id} type={type}>
      {children}
    </script>
  ),
}));

describe('LocalBusinessJsonLd', () => {
  it('renders a script tag with type application/ld+json', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });

  it('emits valid JSON', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(() => JSON.parse(script.innerHTML)).not.toThrow();
  });

  it('has @type LandscapingService', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.innerHTML,
    );
    expect(data['@type']).toBe('LandscapingService');
  });

  it('includes name, telephone, and address locality', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.innerHTML,
    );
    expect(data.name).toBe(site.name);
    expect(data.telephone).toBe(site.phone);
    expect(data.address?.addressLocality).toBe(site.address.locality);
  });

  it('includes openingHoursSpecification', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.innerHTML,
    );
    expect(Array.isArray(data.openingHoursSpecification)).toBe(true);
    expect(data.openingHoursSpecification.length).toBeGreaterThan(0);
  });
});

describe('ServiceJsonLd', () => {
  const defaultProps = {
    title: 'Lawn Aeration',
    description: 'Professional lawn aeration to revive your grass.',
    slug: 'lawn-aeration',
    image: '/images/lawn-aeration.jpg',
  };

  it('renders a script element', () => {
    const { container } = render(<ServiceJsonLd {...defaultProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });

  it('emits a JSON array with two schema items', () => {
    const { container } = render(<ServiceJsonLd {...defaultProps} />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent ?? '[]',
    );
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
  });

  it('first item is a BreadcrumbList', () => {
    const { container } = render(<ServiceJsonLd {...defaultProps} />);
    const [breadcrumb] = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent ?? '[]',
    );
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
  });

  it('second item is a Service with the supplied title', () => {
    const { container } = render(<ServiceJsonLd {...defaultProps} />);
    const [, service] = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent ?? '[]',
    );
    expect(service['@type']).toBe('Service');
    expect(service.name).toBe(defaultProps.title);
    expect(service.url).toContain(defaultProps.slug);
  });
});
