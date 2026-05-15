/**
 * Generate lib/redirects.ts mapping legacy WordPress URLs to the new
 * Next.js route structure. WP permalinks were /<post_name>/ at the root.
 */
import { writeFileSync } from 'node:fs';
import { services } from '../content/services/_meta';

type R = { from: string; to: string };

const explicit: R[] = [
  { from: '/home', to: '/' },
  { from: '/about-us', to: '/about' },
  { from: '/contact-us', to: '/contact' },
  { from: '/landscaping-services', to: '/services' },
  { from: '/lawn-services', to: '/services' },
  { from: '/other-services', to: '/services' },
  { from: '/hardscaping', to: '/services' },
];

const fromServices: R[] = services.map((s) => ({
  from: `/${s.slug}`,
  to: `/services/${s.slug}`,
}));

const all = [...explicit, ...fromServices].filter((r) => r.from !== r.to);

const body = all
  .map((m) => `  { source: '${m.from}', destination: '${m.to}', permanent: true },`)
  .join('\n');

const out = `import type { Redirect } from 'next/dist/lib/load-custom-routes';

export const redirects: Redirect[] = [
${body}
];
`;

writeFileSync('lib/redirects.ts', out);
console.log(`Wrote lib/redirects.ts with ${all.length} entries.`);
