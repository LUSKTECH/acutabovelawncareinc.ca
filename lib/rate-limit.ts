/**
 * Tiny in-memory sliding-window rate limiter. Single-server only — fine for the
 * landscaping site since contact submissions are infrequent and Vercel functions
 * frequently reuse the same instance. For higher traffic, swap for Upstash/Vercel KV.
 */
type Hit = { count: number; firstAt: number };

const store = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || now - hit.firstAt > windowMs) {
    store.set(key, { count: 1, firstAt: now });
    return { ok: true };
  }

  if (hit.count >= max) {
    return { ok: false, retryAfterMs: windowMs - (now - hit.firstAt) };
  }

  hit.count += 1;
  return { ok: true };
}
