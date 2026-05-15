import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1E4D33',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acutabovelawncareinc.ca'),
  title: {
    default: 'A Cut Above Lawn Care Inc — Landscaping in Burlington, Oakville, Milton',
    template: '%s — A Cut Above Lawn Care Inc',
  },
  description:
    'Full-service landscaping, hardscaping, and lawn care serving Burlington, Oakville, Milton, and the Halton Region.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'A Cut Above Lawn Care Inc',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
