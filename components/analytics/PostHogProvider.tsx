'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { PostHog } from 'posthog-js';

// Shared, memoized init. The dynamic import keeps posthog-js out of the initial
// bundle; the cached promise guarantees init runs once and lets pageview capture
// await it — capturing before init() isn't supported with the npm import.
let initPromise: Promise<PostHog> | null = null;

function ensurePostHog(): Promise<PostHog> | null {
  if (initPromise) return initPromise;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  initPromise = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      session_recording: { maskAllInputs: true },
      persistence: 'localStorage+cookie',
    });
    return posthog;
  });
  return initPromise;
}

export default function PostHogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    void ensurePostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}

function PageviewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = search?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    void (async () => {
      const posthog = await ensurePostHog();
      posthog?.capture('$pageview', { $current_url: url });
    })();
  }, [pathname, search]);

  return null;
}
