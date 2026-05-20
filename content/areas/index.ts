import { services } from '@/content/services/_meta';

export type CityArea = {
  slug: string;
  name: string;
  region: string;
  heroImage: string;
  intro: string;
  localContext: string;
  highlights: string[];
  faq: Array<{ question: string; answer: string }>;
  featuredServiceSlugs: string[];
};

export const cities: CityArea[] = [
  {
    slug: 'burlington',
    name: 'Burlington',
    region: 'Halton Region, ON',
    heroImage: '/images/projects/landscaping-01.jpg',
    intro:
      'A Cut Above Lawn Care Inc. has served Burlington properties for years — from mature lakefront estates in Roseland and Aldershot to newer developments in Alton Village and Orchard. We know the city\'s clay-heavy soils, its microclimate in the shadow of the Niagara Escarpment, and the seasonal demands that come with it.',
    localContext:
      'Burlington\'s Niagara Escarpment geography creates significant soil variation across the city. Properties north of Upper Middle Road tend toward thin, rocky topsoil over limestone bedrock, while homes near the lake deal with dense, poorly-draining clay. We tailor every aeration, overseeding, and fertilization program to your specific microzone — not a one-size template.',
    highlights: [
      'Escarpment-zone expertise — rocky topsoil, compaction management',
      'Lakefront and heritage-district lawn restoration',
      'New-build sod and landscape installation in Alton Village and Millcroft',
      'Commercial grounds maintenance for condo corporations and retail plazas',
    ],
    faq: [
      {
        question: 'When is the best time to aerate a Burlington lawn?',
        answer:
          'Late August through mid-October is ideal for Burlington. The Escarpment zone cools earlier than the GTA core, so fall aeration paired with overseeding gives seed the best chance to establish before freeze. Spring aeration is an option but risks competing with rapid weed germination in our clay soils.',
      },
      {
        question: 'Do Burlington by-laws restrict water use during droughts?',
        answer:
          'Yes. Burlington follows Halton Region\'s Outdoor Water Use By-law, which limits lawn irrigation to alternate-day schedules during Stage 1 restrictions and bans it entirely during Stage 2. An automated drip-irrigation system with soil-moisture sensors keeps you compliant and avoids fines.',
      },
      {
        question: 'Why does my Burlington lawn have bare patches every spring?',
        answer:
          'The most common culprit is winter salt damage from road crews along Appleby Line, Walkers Line, and similar arterials. The second is European chafer grub damage — a significant problem in Halton since the chemical ban. We test for grubs every spring before recommending a treatment plan.',
      },
      {
        question: 'Can you work in Tyandaga or on steep Escarpment slopes?',
        answer:
          'Yes — slope work is something we do regularly in Tyandaga and Mount Nemo. We use retaining wall systems and deep-rooted ground cover to stabilize erosion-prone grades, and all crew members are trained in slope-safety protocols.',
      },
    ],
    featuredServiceSlugs: [
      'lawn-care', 'aeration', 'landscaping', 'hardscapes', 'retaining-walls', 'irrigation',
    ],
  },

  {
    slug: 'oakville',
    name: 'Oakville',
    region: 'Halton Region, ON',
    heroImage: '/images/projects/landscape-design-01.jpg',
    intro:
      'Oakville properties demand a higher standard — and we deliver it. Whether you\'re maintaining a century-old estate on Lakeshore Road, landscaping a new build in Joshua Creek, or managing commercial grounds for a Glen Abbey business plaza, A Cut Above brings the precision and reliability Oakville homeowners expect.',
    localContext:
      'Oakville\'s wide range of property ages and styles means no two projects are alike. Heritage lots along the old lake shore have decades of mature canopy that shapes every planting decision. In contrast, the newer communities north of Dundas Street offer blank-canvas opportunities for full landscape design and installation. We work across both contexts.',
    highlights: [
      'Design-forward landscape installation for new Oakville builds',
      'Mature-tree preservation and understory planting for heritage lots',
      'Premium hardscaping — natural stone patios, feature walls, pool surrounds',
      'Commercial property maintenance for condo corporations and retail',
    ],
    faq: [
      {
        question: 'What paving stone works best for Oakville patios?',
        answer:
          'Cambridge Cobble and Unilock Umbriano both hold up well to Oakville\'s freeze-thaw cycles and suit the neighbourhood aesthetic. For estate properties near the lake, natural Eramosa limestone from the local quarry system blends seamlessly with mature landscaping and adds long-term value.',
      },
      {
        question: 'How do you handle tree-root conflicts with hardscaping?',
        answer:
          'In older Oakville neighbourhoods, mature silver maples and oaks routinely lift conventional interlocking. We use root barriers, permeable paving systems, and raised-deck structures to resolve the conflict without harming the tree — removing a 60-year maple destroys irreplaceable curb appeal.',
      },
      {
        question: 'Can you maintain our commercial property in Glen Abbey or Bronte?',
        answer:
          'Yes — we carry full commercial liability insurance and WSIB clearance, and we service retail plazas, condo corporations, and industrial properties across Oakville year-round, including seasonal snow management and spring/fall cleanup contracts.',
      },
      {
        question: 'Do Oakville HOA communities have specific landscaping rules?',
        answer:
          'Many newer Oakville communities (Joshua Creek, Iroquois Ridge) have Architectural Control Committees that govern front-yard planting heights, sod types, and driveway materials. We review ACC guidelines before any proposal and can prepare documentation packages when HOA approval is required.',
      },
    ],
    featuredServiceSlugs: [
      'landscape-design', 'hardscapes', 'commercial-landscaping', 'lawn-care', 'irrigation', 'commercial-property-maintenance',
    ],
  },

  {
    slug: 'milton',
    name: 'Milton',
    region: 'Halton Region, ON',
    heroImage: '/images/projects/landscaping-03.jpg',
    intro:
      'Milton is one of Canada\'s fastest-growing communities, and we\'ve grown with it. From the established yards in Old Milton to the constant wave of new builds in Boyne Survey, Hawthorne Village, and Dempsey, we help Milton homeowners establish beautiful, resilient outdoor spaces from the ground up.',
    localContext:
      'New construction in Milton presents specific challenges: stripped, compacted topsoil, builder-grade sod laid over clay fill, and irrigations systems that often need upgrading. We specialize in getting these properties back to healthy soil profiles and dense turf within a season or two using aggressive aeration and overseeding programs.',
    highlights: [
      'New-build lawn rehabilitation — topsoil restoration, compaction reversal',
      'Full landscape installation for recently completed homes',
      'Escarpment Trail area — slope stabilization and naturalized planting',
      'Sodding, grading, and drainage solutions for low-lying lots',
    ],
    faq: [
      {
        question: 'My new Milton home has thin, patchy grass — what\'s wrong?',
        answer:
          'Almost certainly builder topsoil: builders typically strip and sell the natural topsoil, replace it with 2-4 inches of inconsistent fill, then lay sod on top. Within two years the sod roots hit compacted clay or gravel and fail. The fix is core aeration, top-dressing with quality compost, and overseeding with a turf blend suited to Milton\'s clay-loam base.',
      },
      {
        question: 'When should a new Milton homeowner start landscaping?',
        answer:
          'Spring of the first year is ideal for lawn rehab and grading. Landscape planting beds are best started in mid-spring once frost risk passes. Hardscaping — patios, walkways, retaining walls — can start as soon as the ground has drained and settled after the builder\'s work is complete, usually 12-18 months after possession.',
      },
      {
        question: 'Does Milton have watering restrictions like Burlington?',
        answer:
          'Yes — Milton follows Halton Region\'s outdoor water use restrictions, the same as Burlington and Oakville. New sod and seed are typically exempt for the first 30 days after installation if you register with the Town. We handle that paperwork as part of every new-installation project.',
      },
      {
        question: 'Can you do landscaping near the Niagara Escarpment Biosphere?',
        answer:
          'Yes, with care. Properties within or adjacent to the Escarpment Plan Area have restrictions on grading, vegetation removal, and impervious surface coverage. We are familiar with the Niagara Escarpment Commission\'s development permit requirements and can advise you before any project begins.',
      },
    ],
    featuredServiceSlugs: [
      'sodding', 'lawn-care', 'aeration', 'landscaping', 'landscape-design', 'irrigation',
    ],
  },
];

export function getCityBySlug(slug: string): CityArea {
  const city = cities.find((c) => c.slug === slug);
  if (!city) throw new Error(`Unknown city: ${slug}`);
  return city;
}

export function getCityServices(city: CityArea) {
  return city.featuredServiceSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean);
}
