import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers to return a controlled IP.
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (k: string) => (k === 'x-forwarded-for' ? '1.2.3.4' : null),
  })),
}));

// Mock global fetch.
const fetchMock = vi.hoisted(() => vi.fn());
vi.stubGlobal('fetch', fetchMock);

import { submitContact } from '@/lib/contact-action';
import { headers } from 'next/headers';

function fd(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  return f;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.mocked(headers).mockImplementation(async () =>
    ({
      get: (k: string) => (k === 'x-forwarded-for' ? `ip-${Math.random()}` : null),
    }) as unknown as Awaited<ReturnType<typeof headers>>,
  );
});

describe('submitContact', () => {
  it('returns field errors when required fields are missing', async () => {
    const res = await submitContact(
      { status: 'idle' },
      fd({ name: '', email: 'not-an-email', message: '' }),
    );
    expect(res.status).toBe('error');
    if (res.status === 'error') {
      expect(res.fieldErrors).toBeDefined();
      expect(Object.keys(res.fieldErrors ?? {}).length).toBeGreaterThan(0);
    }
  });

  it('silently succeeds when the honeypot is tripped (does not call fetch)', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    const res = await submitContact(
      { status: 'idle' },
      fd({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'I am a robot here to spam you',
        company: 'spammy-corp',
      }),
    );
    expect(res).toEqual({ status: 'success' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('errors with a phone-number fallback when WEB3FORMS_ACCESS_KEY is missing', async () => {
    delete process.env.WEB3FORMS_ACCESS_KEY;
    const res = await submitContact(
      { status: 'idle' },
      fd({
        name: 'Real Person',
        email: 'real@example.com',
        message: 'Please call me about lawn aeration this spring',
      }),
    );
    expect(res.status).toBe('error');
    if (res.status === 'error') {
      expect(res.message).toMatch(/\(905\) 638-0884/);
    }
  });

  it('returns success when Web3Forms accepts the submission', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });
    const res = await submitContact(
      { status: 'idle' },
      fd({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'I would like a quote for my front yard, about 1000 sqft.',
        phone: '905-555-1234',
      }),
    );
    expect(res).toEqual({ status: 'success' });
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(body.replyto).toBe('alice@example.com');
    expect(body.subject).toMatch(/Alice/);
    expect(body.phone).toBe('905-555-1234');
  });

  it('strips control characters from the name before composing the subject', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    fetchMock.mockResolvedValueOnce({ json: async () => ({ success: true }) });
    await submitContact(
      { status: 'idle' },
      fd({
        name: 'Alice\r\nBcc: evil@example.com',
        email: 'alice@example.com',
        message: 'Quote please for the back yard near Mountain Brow.',
      }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(body.subject).not.toMatch(/[\r\n]/);
  });

  it('falls back to the phone message when Web3Forms returns success=false', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    fetchMock.mockResolvedValueOnce({
      status: 422,
      json: async () => ({ success: false, message: 'Invalid access key' }),
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await submitContact(
      { status: 'idle' },
      fd({
        name: 'Bob',
        email: 'bob@example.com',
        message: 'Anyone home? I need a quote for retaining wall work.',
      }),
    );
    expect(res.status).toBe('error');
    expect(errSpy).toHaveBeenCalled();
  });

  it('falls back to the phone message when fetch throws', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await submitContact(
      { status: 'idle' },
      fd({
        name: 'Carol',
        email: 'carol@example.com',
        message: 'Looking for hedge trimming in early June. Available?',
      }),
    );
    expect(res.status).toBe('error');
    if (res.status === 'error') expect(res.message).toMatch(/please call us/i);
    expect(errSpy).toHaveBeenCalled();
  });

  it('blocks requests once the per-IP rate limit is exceeded', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-key';
    vi.mocked(headers).mockResolvedValue({
      get: (k: string) => (k === 'x-forwarded-for' ? '9.9.9.9' : null),
    } as unknown as Awaited<ReturnType<typeof headers>>);
    fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });

    const valid = {
      name: 'Dana',
      email: 'dana@example.com',
      message: 'Please send me a quote, I need lawn aeration this April.',
    };

    const results = [];
    for (let i = 0; i < 6; i++) {
      // oxlint-disable-next-line no-await-in-loop
      results.push(await submitContact({ status: 'idle' }, fd(valid)));
    }
    expect(results[5]?.status).toBe('error');
  });
});
