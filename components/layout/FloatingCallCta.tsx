'use client';

import { usePathname } from 'next/navigation';
import { site } from '@/content/site';

export default function FloatingCallCta() {
  const pathname = usePathname();
  // Hidden on the contact page, where it would overlap the form's submit button.
  if (pathname.startsWith('/contact')) return null;

  return (
    <a
      href={`tel:${site.phoneE164}`}
      aria-label={`Call ${site.phone}`}
      // Offset by the iOS home-indicator / gesture-bar safe area so it never sits under OS chrome.
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-700 text-cream-50 shadow-card transition hover:bg-forest-900 md:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
      </svg>
    </a>
  );
}
