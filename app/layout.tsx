import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import PostHogProvider from '@/components/analytics/PostHogProvider';
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500'],
  style: ['normal'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#1E4D33',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acutabovelawncareinc.ca'),
  title: {
    default: 'A Cut Above Lawn Care — Landscaping in Burlington, Oakville & Milton',
    template: '%s — A Cut Above Lawn Care Inc',
  },
  description:
    'Full-service landscaping, hardscaping, lawn care, and snow management serving Burlington, Oakville, Milton, and the Halton Region. Free estimates, local crews.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'A Cut Above Lawn Care Inc',
    url: '/',
    images: [
      {
        url: '/images/hero/hero.jpg',
        width: 1024,
        height: 683,
        alt: 'Professional landscaping by A Cut Above Lawn Care Inc — Burlington, Ontario',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero/hero.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <LocalBusinessJsonLd />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
