import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the current year in the copyright line', () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain(`© ${new Date().getFullYear()} A Cut Above Lawn Care Inc.`);
  });
});
