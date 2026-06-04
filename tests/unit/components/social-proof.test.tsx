// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import SocialProof from '@/components/home/SocialProof';
import ServiceAreasStrip from '@/components/home/ServiceAreasStrip';
import ServiceCard from '@/components/service/ServiceCard';
import { services } from '@/content/services/_meta';
import { site } from '@/content/site';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [k: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    priority: _priority,
    quality: _quality,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    quality?: number;
    [k: string]: unknown;
  }) => <img src={src} alt={alt} {...rest} />,
}));

beforeAll(() => {
  // Regular function (not arrow) so `new MockObserver(...)` works as a constructor.
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function (this: { observe: unknown; unobserve: unknown; disconnect: unknown }) {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
    }),
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn((_q: string) => ({
      matches: false,
      media: _q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

describe('SocialProof', () => {
  it('renders the section heading', () => {
    render(<SocialProof />);
    expect(screen.getByText(/what our clients say/i)).toBeTruthy();
  });

  it('renders all three testimonials', () => {
    render(<SocialProof />);
    expect(screen.getByText('Keanu')).toBeTruthy();
    expect(screen.getByText('Kai Harris')).toBeTruthy();
    expect(screen.getByText('Tommy Moya Ruiz')).toBeTruthy();
  });

  it('renders the years-of-experience stat', () => {
    render(<SocialProof />);
    expect(screen.getByText('Years of experience')).toBeTruthy();
  });

  it('renders the Google rating stat', () => {
    render(<SocialProof />);
    // Use exact match to avoid ambiguity with the parent link element's text.
    expect(screen.getByText('Rated on Google')).toBeTruthy();
  });

  it('links the Google rating to the business listing', () => {
    const { container } = render(<SocialProof />);
    const link = container.querySelector('a[href*="google.com"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.rel).toContain('noopener');
  });
});

describe('ServiceAreasStrip', () => {
  it('renders all service area names', () => {
    render(<ServiceAreasStrip />);
    for (const area of site.serviceAreas) {
      expect(screen.getByText(area)).toBeTruthy();
    }
  });

  it('links Burlington to its city page', () => {
    const { container } = render(<ServiceAreasStrip />);
    const burlington = container.querySelector('a[href="/areas/burlington"]');
    expect(burlington).toBeTruthy();
  });
});

describe('ServiceCard', () => {
  const service = services[0]!;

  it('renders the service title', () => {
    render(<ServiceCard service={service} />);
    expect(screen.getByText(service.title)).toBeTruthy();
  });

  it('links to the correct service page', () => {
    const { container } = render(<ServiceCard service={service} />);
    const link = container.querySelector(`a[href="/services/${service.slug}"]`);
    expect(link).toBeTruthy();
  });

  it('renders an image with an alt describing the service', () => {
    const { container } = render(<ServiceCard service={service} />);
    const img = container.querySelector('img');
    expect(img?.alt).toContain(service.title);
  });
});
