import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers to return a controlled IP.
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (k: string) => (k === 'x-forwarded-for' ? '1.2.3.4' : null),
  })),
}));

// Hoisted send mock so we can re-wire return values per test.
const sendMock = vi.hoisted(() => vi.fn());
vi.mock('resend', () => ({
  // vitest 4 requires regular function (not arrow) for `new` constructors.
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

// Use distinct IPs/keys per test by passing different forwarded-for values
// via the mocked headers (we override per-test below where needed).
import { submitContact } from '@/lib/contact-action';
import { headers } from 'next/headers';

function fd(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  return f;
}

beforeEach(() => {
  sendMock.mockReset();
  vi.mocked(headers).mockImplementation(async () =>
    ({ get: (k: string) => (k === 'x-forwarded-for' ? `ip-${Math.random()}` : null) }) as unknown as Awaited<ReturnType<typeof headers>>,
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

  it('silently succeeds when the honeypot is tripped (does not call Resend)', async () => {
    process.env.RESEND_API_KEY = 'test';
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
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('errors with a phone-number fallback when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;
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
      expect(res.message).toMatch(/please call us/i);
      expect(res.message).toMatch(/\(905\) 638-0884/);
    }
  });

  it('returns success when Resend accepts the email', async () => {
    process.env.RESEND_API_KEY = 'test';
    sendMock.mockResolvedValueOnce({ data: { id: 'mocked' }, error: null });
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
    expect(sendMock).toHaveBeenCalledOnce();
    const call = sendMock.mock.calls[0]?.[0];
    expect(call?.to).toEqual([expect.any(String)]);
    expect(call?.replyTo).toBe('alice@example.com');
    expect(call?.subject).toMatch(/Alice/);
    expect(call?.text).toMatch(/Phone: 905-555-1234/);
  });

  it('strips control characters from the name before composing the subject', async () => {
    process.env.RESEND_API_KEY = 'test';
    sendMock.mockResolvedValueOnce({ data: { id: 'x' }, error: null });
    await submitContact(
      { status: 'idle' },
      fd({
        name: 'Alice\r\nBcc: evil@example.com',
        email: 'alice@example.com',
        message: 'Quote please for the back yard near Mountain Brow.',
      }),
    );
    const subj = sendMock.mock.calls[0]?.[0]?.subject as string | undefined;
    expect(subj).toBeDefined();
    expect(subj).not.toMatch(/[\r\n]/);
  });

  it('falls back to the phone message when Resend returns an error', async () => {
    process.env.RESEND_API_KEY = 'test';
    sendMock.mockResolvedValueOnce({ data: null, error: { name: 'rate_limit', message: 'too many' } });
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

  it('falls back to the phone message when the Resend SDK throws', async () => {
    process.env.RESEND_API_KEY = 'test';
    sendMock.mockRejectedValueOnce(new Error('network down'));
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
    if (res.status === 'error') {
      expect(res.message).toMatch(/please call us/i);
    }
    expect(errSpy).toHaveBeenCalled();
  });

  it('blocks requests once the per-IP rate limit is exceeded', async () => {
    process.env.RESEND_API_KEY = 'test';
    // Lock the IP for the next 6 submissions.
    vi.mocked(headers).mockResolvedValue({
      get: (k: string) => (k === 'x-forwarded-for' ? '9.9.9.9' : null),
    } as unknown as Awaited<ReturnType<typeof headers>>);

    sendMock.mockResolvedValue({ data: { id: 'x' }, error: null });
    const valid = {
      name: 'Dana',
      email: 'dana@example.com',
      message: 'Please send me a quote, I need lawn aeration this April.',
    };

    // Rate limit is sequential by design — each call must consume its slot before
    // the next checks the counter, so Promise.all would bypass the limiter logic.
    // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unused-expressions
    const results = [];
    for (let i = 0; i < 6; i++) {
      // oxlint: disable-next-line no-await-in-loop
      results.push(await submitContact({ status: 'idle' }, fd(valid)));
    }
    // 5 allowed + 1 blocked
    expect(results[5]?.status).toBe('error');
  });
});
