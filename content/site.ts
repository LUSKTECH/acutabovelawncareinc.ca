export const site = {
  name: 'A Cut Above Lawn Care Inc',
  tagline: 'Big enough to service you, small enough to care.',
  phone: '(905) 638-0884',
  phoneE164: '+19056380884',
  email: 'info@acutabovelawncareinc.ca',
  address: {
    locality: 'Burlington',
    region: 'ON',
    country: 'CA',
  },
  hours: 'Mon–Fri 8:00–18:00',
  // Schema.org OpeningHours format: https://schema.org/openingHours
  openingHours: 'Mo-Fr 08:00-18:00',
  social: { facebook: '', instagram: '' },
  // serviceAreas feeds JSON-LD structured data; cities (content/areas/index.ts) drives the /areas/[city] pages.
  // Keep both in sync when adding or removing served cities.
  serviceAreas: ['Burlington', 'Oakville', 'Milton', 'Halton Hills', 'Hamilton'],
  url: 'https://acutabovelawncareinc.ca',
} as const;
