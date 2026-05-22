import type { NextConfig } from 'next';
import { redirects as wpRedirects } from './lib/redirects';

// Allowed origins for script-src and connect-src:
//  - 'self'                         Next.js chunks and API routes
//  - 'unsafe-inline'                inline JSON-LD scripts (no nonce available for static export)
//  - us.i.posthog.com, app.posthog.com  PostHog analytics (direct)
//  - p.acutabovelawncareinc.ca      PostHog reverse proxy (config.js + XHR API calls)
//  - api.web3forms.com              contact form submission target
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://us.i.posthog.com https://app.posthog.com https://p.acutabovelawncareinc.ca",
  "connect-src 'self' https://us.i.posthog.com https://app.posthog.com https://p.acutabovelawncareinc.ca https://api.web3forms.com",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
];

const config: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    minimumCacheTTL: 31536000, // 1 year — sources are checked into the repo and stable
  },
  async redirects() {
    return [
      // Browsers that request /favicon.ico directly (ignoring <link rel="icon">) get
      // redirected to the app/icon.png that Next.js serves at /icon.png.
      { source: '/favicon.ico', destination: '/icon.png', permanent: false },
      ...wpRedirects,
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default config;
