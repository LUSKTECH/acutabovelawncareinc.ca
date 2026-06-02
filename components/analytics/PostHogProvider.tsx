'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Module-level guard so init runs at most once across mounts.
let initialized = false;

export default function PostHogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || initialized) return;
    let cancelled = false;
    // Dynamic import keeps posthog-js out of the initial client bundle; it loads
    // after hydration when the main thread is free.
    void (async () => {
      const { default: posthog } = await import('posthog-js');
      if (cancelled || initialized) return;
      initialized = true;
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
    })();
    return () => {
      cancelled = true;
    };
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
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (!pathname) return;
    const qs = search?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    void (async () => {
      const { default: posthog } = await import('posthog-js');
      posthog.capture('$pageview', { $current_url: url });
    })();
  }, [pathname, search]);

  return null;
}
