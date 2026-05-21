import { describe, it, expect, vi } from 'vitest';

// Mock node:fs before importing content so the module picks up our interceptor.
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    readFileSync: vi.fn((p: unknown, enc?: unknown) => {
      if (typeof p === 'string' && p.includes('content/services/')) {
        // Return MDX with a non-string excerpt to exercise the else branch in
        // getServiceBySlug: `typeof data.excerpt === 'string' ? ... : ''`
        return '---\nexcerpt: 99\n---\nBody text for testing.';
      }
      return (actual.readFileSync as (p: unknown, enc?: unknown) => string)(p, enc);
    }),
  };
});

import { getServiceBySlug } from '@/lib/content';
import { services } from '@/content/services/_meta';

describe('getServiceBySlug excerpt fallback', () => {
  it('returns empty string excerpt when frontmatter excerpt is not a string', () => {
    const svc = getServiceBySlug(services[0]!.slug);
    expect(svc.excerpt).toBe('');
    expect(svc.body).toBe('Body text for testing.');
  });
});
