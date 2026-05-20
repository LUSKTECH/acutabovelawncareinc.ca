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

// LNM landing pages: /lnm_landing_pages/{city}-{service}/ → /areas/{city}
// These were the WP theme's auto-generated geo pages. We redirect to the rich city hub.
// Using a single regex to capture all three cities in one rule.
const lnmCityRedirects: R[] = [
  // /lnm_landing_pages/burlington-*/  → /areas/burlington
  { from: '/lnm_landing_pages/burlington:rest(.*)', to: '/areas/burlington' },
  { from: '/lnm_landing_pages/milton:rest(.*)', to: '/areas/milton' },
  { from: '/lnm_landing_pages/oakville:rest(.*)', to: '/areas/oakville' },
  // Catch-all for any other /lnm_landing_pages/* not city-prefixed
  { from: '/lnm_landing_pages/:rest*', to: '/service-areas' },
];

// Direct city-service slugs at root that may have been indexed
const areaRedirects: R[] = ['burlington', 'milton', 'oakville'].flatMap((city) =>
  services.map((s) => ({ from: `/${city}-${s.slug}`, to: `/areas/${city}` }))
);

const lnmRedirects = [...lnmCityRedirects, ...areaRedirects];

const all = [...explicit, ...fromServices, ...lnmRedirects].filter((r) => r.from !== r.to);

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
