/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * ⚠ KNOWN LIMITATION: In-memory state is **not shared across serverless
 * function instances** on Vercel. A cold-start resets the counter, so a
 * determined attacker can bypass this by triggering new containers.
 *
 * This is acceptable for a low-traffic landscaping site where honeypot +
 * HTML5 validation filter most bots. For stricter enforcement, replace
 * `store` with Vercel KV (Upstash) using the same interface.
 */
type Hit = { count: number; firstAt: number };

const store = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  // Prevent unbounded growth on long-lived processes (non-serverless deploys).
  // Prune expired entries rather than store.clear() — a full clear can be
  // triggered by flooding unique IPs to reset other callers' counters.
  if (store.size > 10_000) {
    for (const [k, v] of store) {
      if (now - v.firstAt > windowMs) store.delete(k);
    }
  }
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
