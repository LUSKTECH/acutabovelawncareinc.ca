// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import ContactForm from '@/components/contact/ContactForm';
import PostHogProvider from '@/components/analytics/PostHogProvider';

// Prevent the server-action from loading next/headers in jsdom.
vi.mock('@/lib/contact-action', () => ({
  submitContact: vi.fn(),
}));

// Prevent posthog-js from being loaded in tests.
vi.mock('posthog-js', () => ({
  default: { init: vi.fn(), capture: vi.fn() },
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => null),
}));

// ── ContactForm ─────────────────────────────────────────────────────────────

describe('ContactForm', () => {
  it('renders the form element', () => {
    const { container } = render(<ContactForm />);
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('renders the Name field', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeTruthy();
  });

  it('renders the Email field', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });

  it('renders the Phone field', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/phone/i)).toBeTruthy();
  });

  it('renders the message textarea', () => {
    render(<ContactForm />);
    expect(screen.getByRole('textbox', { name: /how can we help/i })).toBeTruthy();
  });

  it('renders a hidden honeypot input', () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).toBeTruthy();
    expect((honeypot as HTMLInputElement).tabIndex).toBe(-1);
  });

  it('renders the submit button', () => {
    render(<ContactForm />);
    expect(screen.getByRole('button', { name: /send request/i })).toBeTruthy();
  });

  it('required fields have aria-required', () => {
    render(<ContactForm />);
    const name = screen.getByLabelText(/^name/i);
    expect(name.getAttribute('aria-required')).toBe('true');
  });
});

// ── PostHogProvider ─────────────────────────────────────────────────────────

describe('PostHogProvider', () => {
  it('renders its children', () => {
    render(
      <PostHogProvider>
        <p>hello from child</p>
      </PostHogProvider>,
    );
    expect(screen.getByText('hello from child')).toBeTruthy();
  });

  it('does not throw when NEXT_PUBLIC_POSTHOG_KEY is absent', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    expect(() =>
      render(
        <PostHogProvider>
          <span>safe</span>
        </PostHogProvider>,
      ),
    ).not.toThrow();
  });
});
