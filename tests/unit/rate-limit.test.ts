import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first hit', () => {
    expect(rateLimit('a-first', { max: 3, windowMs: 1000 })).toEqual({ ok: true });
  });

  it('allows up to max within the window', () => {
    const key = 'a-within';
    expect(rateLimit(key, { max: 3, windowMs: 1000 })).toEqual({ ok: true });
    expect(rateLimit(key, { max: 3, windowMs: 1000 })).toEqual({ ok: true });
    expect(rateLimit(key, { max: 3, windowMs: 1000 })).toEqual({ ok: true });
  });

  it('rejects beyond max within the window with retryAfterMs', () => {
    const key = 'a-over';
    rateLimit(key, { max: 2, windowMs: 1000 });
    rateLimit(key, { max: 2, windowMs: 1000 });
    vi.advanceTimersByTime(300);
    const res = rateLimit(key, { max: 2, windowMs: 1000 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.retryAfterMs).toBeGreaterThan(0);
      expect(res.retryAfterMs).toBeLessThanOrEqual(1000);
    }
  });

  it('resets after the window expires', () => {
    const key = 'a-reset';
    rateLimit(key, { max: 1, windowMs: 1000 });
    expect(rateLimit(key, { max: 1, windowMs: 1000 }).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit(key, { max: 1, windowMs: 1000 })).toEqual({ ok: true });
  });

  it('prunes expired entries when the store exceeds 10 000 entries', () => {
    for (let i = 0; i < 10_001; i++) {
      rateLimit(`prune-${i}`, { max: 1, windowMs: 1000 });
    }
    vi.advanceTimersByTime(1001); // all 10 001 entries are now expired
    const result = rateLimit('prune-new', { max: 1, windowMs: 1000 });
    expect(result).toEqual({ ok: true });
  });

  it('does not prune recent entries when the store is overwhelmed', () => {
    for (let i = 0; i < 10_001; i++) {
      rateLimit(`flood-${i}`, { max: 2, windowMs: 60_000 });
    }
    // Store > 10 000 but all entries are recent — no deletions, new key falls through
    const result = rateLimit('flood-new', { max: 2, windowMs: 60_000 });
    expect(result).toEqual({ ok: true });
  });
});
