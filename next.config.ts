import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { redirects as wpRedirects } from './lib/redirects';

const withMDX = createMDX({ extension: /\.mdx?$/ });

const config: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  turbopack: { root: __dirname },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async redirects() {
    return wpRedirects;
  },
};

export default withMDX(config);
