import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import GlobalError from '@/app/global-error';
import { site } from '@/content/site';

const noop = () => undefined;

describe('GlobalError', () => {
  it('shows a retry button and the phone number', () => {
    const html = renderToStaticMarkup(<GlobalError error={new Error('boom')} reset={noop} />);
    expect(html).toContain('Try again');
    expect(html).toContain(`tel:${site.phoneE164}`);
  });
});
