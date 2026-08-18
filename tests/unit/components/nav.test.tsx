// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';

afterEach(cleanup);
import MegaNav from '@/components/layout/MegaNav';
import MobileNav from '@/components/layout/MobileNav';

// ── mocks ──────────────────────────────────────────────────────────────────

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

const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// jsdom doesn't implement <dialog> show/close.
beforeAll(() => {
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

afterEach(() => {
  mockPathname.mockReturnValue('/');
});

// ── MegaNav ────────────────────────────────────────────────────────────────

describe('MegaNav', () => {
  it('renders the primary nav landmark', () => {
    render(<MegaNav />);
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeTruthy();
  });

  it('renders the Home link', () => {
    render(<MegaNav />);
    expect(screen.getByRole('link', { name: /^home$/i })).toBeTruthy();
  });

  it('renders the Gallery link', () => {
    render(<MegaNav />);
    expect(screen.getByRole('link', { name: /gallery/i })).toBeTruthy();
  });

  it('has an Areas dropdown button', () => {
    render(<MegaNav />);
    const btn = screen.getByRole('button', { name: /areas/i });
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the Areas dropdown on click', () => {
    render(<MegaNav />);
    const btn = screen.getByRole('button', { name: /areas/i });
    act(() => { fireEvent.click(btn); });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the Areas dropdown on Escape', () => {
    render(<MegaNav />);
    const btn = screen.getByRole('button', { name: /areas/i });
    act(() => { fireEvent.click(btn); });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('highlights the Home link when pathname is /', () => {
    mockPathname.mockReturnValue('/');
    render(<MegaNav />);
    const home = screen.getByRole('link', { name: /^home$/i });
    expect(home.getAttribute('aria-current')).toBe('page');
  });

  it('does not highlight Home when on a different path', () => {
    mockPathname.mockReturnValue('/services');
    render(<MegaNav />);
    const home = screen.getByRole('link', { name: /^home$/i });
    expect(home.getAttribute('aria-current')).toBeNull();
  });

  it('opens a category dropdown on click', () => {
    render(<MegaNav />);
    const btns = screen.getAllByRole('button');
    // First button should be a service category
    const categoryBtn = btns[0]!;
    act(() => { fireEvent.click(categoryBtn); });
    expect(categoryBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes dropdown when clicking outside', () => {
    render(<MegaNav />);
    const btn = screen.getByRole('button', { name: /areas/i });
    act(() => { fireEvent.click(btn); });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    act(() => { fireEvent.mouseDown(document.body); });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });
});

// ── MobileNav ──────────────────────────────────────────────────────────────

describe('MobileNav', () => {
  it('renders the hamburger button', () => {
    render(<MobileNav />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeTruthy();
  });

  it('hamburger button has aria-expanded=false initially', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('sets aria-expanded=true after clicking the hamburger', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    act(() => { fireEvent.click(btn); });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('changes label to "Close menu" when open', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    act(() => { fireEvent.click(btn); });
    expect(screen.getByRole('button', { name: /close menu/i })).toBeTruthy();
  });

  it('closes the drawer on Escape', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    act(() => { fireEvent.click(btn); });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    act(() => { fireEvent.keyDown(window, { key: 'Escape' }); });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('locks body scroll when open', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    act(() => { fireEvent.click(btn); });
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    act(() => { fireEvent.click(btn); });
    act(() => { fireEvent.click(btn); });
    expect(document.body.style.overflow).toBe('');
  });

  it('marks the Home link as current when pathname is /', () => {
    mockPathname.mockReturnValue('/');
    render(<MobileNav />);
    // Links are inside the drawer — open it first.
    act(() => { fireEvent.click(screen.getByRole('button', { name: /open menu/i })); });
    const homeLink = screen.getByRole('link', { name: /^home$/i });
    expect(homeLink.getAttribute('aria-current')).toBe('page');
  });

  it('marks Service Areas as current when on /service-areas', () => {
    mockPathname.mockReturnValue('/service-areas');
    render(<MobileNav />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /open menu/i })); });
    const areasLink = screen.getByRole('link', { name: /service areas/i });
    expect(areasLink.getAttribute('aria-current')).toBe('page');
  });

  it('marks Service Areas as current when on /areas/burlington', () => {
    mockPathname.mockReturnValue('/areas/burlington');
    render(<MobileNav />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /open menu/i })); });
    const areasLink = screen.getByRole('link', { name: /service areas/i });
    expect(areasLink.getAttribute('aria-current')).toBe('page');
  });
});
