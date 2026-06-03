// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';

afterEach(cleanup);
import CountUp from '@/components/motion/CountUp';
import ScrollReveal from '@/components/motion/ScrollReveal';

type ObserverCb = (entries: Partial<IntersectionObserverEntry>[], obs: IntersectionObserver) => void;

let latestCb: ObserverCb | null = null;
const observedEls: Element[] = [];

// Use a regular function (not arrow) so `new MockObserver(...)` works.
const MockObserver = vi.fn(function (
  this: { observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> },
  cb: ObserverCb,
) {
  latestCb = cb;
  this.observe = vi.fn((el: Element) => { observedEls.push(el); });
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

beforeAll(() => {
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
  vi.stubGlobal('IntersectionObserver', MockObserver);
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  observedEls.length = 0;
  latestCb = null;
  document.documentElement.classList.remove('js-reveal');
});

const REDUCED_MOTION: MediaQueryList = {
  matches: true,
  media: '',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as unknown as MediaQueryList;

// ── CountUp ─────────────────────────────────────────────────────────────────

describe('CountUp', () => {
  it('displays the final value when prefers-reduced-motion is set (no animation)', () => {
    // With reduced motion the effect returns early so value stays at `to`.
    vi.mocked(globalThis.matchMedia).mockReturnValueOnce(REDUCED_MOTION);
    const { container } = render(<CountUp to={27} suffix="+" />);
    const span = container.querySelector('.tabular-nums')!;
    expect(span.textContent?.replace(/\s/g, '')).toBe('27+');
  });

  it('displays decimal value when reduced motion prevents animation', () => {
    vi.mocked(globalThis.matchMedia).mockReturnValueOnce(REDUCED_MOTION);
    const { container } = render(<CountUp to={4.4} decimals={1} suffix="★" />);
    const span = container.querySelector('.tabular-nums')!;
    expect(span.textContent?.replace(/\s/g, '')).toBe('4.4★');
  });

  it('applies tabular-nums class to the span', () => {
    const { container } = render(<CountUp to={100} />);
    expect(container.querySelector('span.tabular-nums')).toBeTruthy();
  });

  it('does not create an observer when prefers-reduced-motion is set', () => {
    MockObserver.mockClear();
    vi.mocked(globalThis.matchMedia).mockReturnValueOnce(REDUCED_MOTION);
    render(<CountUp to={50} />);
    expect(MockObserver).not.toHaveBeenCalled();
  });

  it('creates an IntersectionObserver when motion is allowed', () => {
    MockObserver.mockClear();
    render(<CountUp to={50} />);
    expect(MockObserver).toHaveBeenCalled();
  });
});

// ── ScrollReveal ─────────────────────────────────────────────────────────────

describe('ScrollReveal', () => {
  it('renders nothing (returns null)', () => {
    const { container } = render(<ScrollReveal />);
    expect(container.firstChild).toBeNull();
  });

  it('does not add js-reveal when prefers-reduced-motion is set', () => {
    vi.mocked(globalThis.matchMedia).mockReturnValueOnce({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList);
    render(<ScrollReveal />);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(false);
  });

  it('adds js-reveal class and observes [data-reveal] elements', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    document.body.appendChild(el);
    try {
      render(<ScrollReveal />);
      expect(document.documentElement.classList.contains('js-reveal')).toBe(true);
      expect(observedEls).toContain(el);
    } finally {
      document.body.removeChild(el);
    }
  });

  it('adds reveal-in class when the observer fires with isIntersecting=true', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    document.body.appendChild(el);
    try {
      render(<ScrollReveal />);
      act(() => {
        latestCb?.(
          [{ target: el, isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      expect(el.classList.contains('reveal-in')).toBe(true);
    } finally {
      document.body.removeChild(el);
    }
  });

  it('does not add reveal-in when isIntersecting=false', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    document.body.appendChild(el);
    try {
      render(<ScrollReveal />);
      act(() => {
        latestCb?.(
          [{ target: el, isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      expect(el.classList.contains('reveal-in')).toBe(false);
    } finally {
      document.body.removeChild(el);
    }
  });
});
