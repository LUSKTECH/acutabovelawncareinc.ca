export type ServiceCategory = 'landscaping' | 'lawn' | 'hardscaping' | 'other';

export type ServiceMeta = {
  slug: string;
  title: string;
  category: ServiceCategory;
  image: string;
  blurb: string;
  order: number;
  featured?: boolean;
};

export const services: ServiceMeta[] = [
  // Landscaping
  { slug: 'landscaping', title: 'Landscaping', category: 'landscaping',
    image: '/images/services/landscaping.jpg',
    blurb: 'Full-service landscape design and installation for residential and commercial properties.',
    order: 1, featured: true },
  { slug: 'landscape-design', title: 'Landscape Design', category: 'landscaping',
    image: '/images/services/landscape-design.jpg',
    blurb: 'Custom-tailored designs that transform your outdoor space.',
    order: 2, featured: true },
  { slug: 'landscape-construction', title: 'Landscape Construction', category: 'landscaping',
    image: '/images/services/landscape-construction.jpg',
    blurb: 'Skilled installation from grading to planting.',
    order: 3 },
  { slug: 'commercial-landscaping', title: 'Commercial Landscaping', category: 'landscaping',
    image: '/images/services/commercial-landscaping.jpg',
    blurb: 'Polished, professional grounds for offices, retail, and condominiums.',
    order: 4 },
  { slug: 'commercial-garden-design', title: 'Commercial Garden Design', category: 'landscaping',
    image: '/images/services/commercial-garden-design.jpg',
    blurb: 'Designs that elevate first impressions for commercial spaces.',
    order: 5 },

  // Lawn
  { slug: 'lawn-care', title: 'Lawn Care', category: 'lawn',
    image: '/images/services/lawn-care.jpg',
    blurb: 'Year-round lawn health programs tailored to Halton soils and climate.',
    order: 1, featured: true },
  { slug: 'lawn-mowing', title: 'Lawn Mowing', category: 'lawn',
    image: '/images/services/lawn-mowing.jpg',
    blurb: 'Weekly and bi-weekly mowing on a schedule that fits your property.',
    order: 2 },
  { slug: 'commercial-lawn-mowing', title: 'Commercial Lawn Mowing', category: 'lawn',
    image: '/images/services/commercial-lawn-mowing.jpg',
    blurb: 'Reliable scheduled mowing for commercial properties.',
    order: 3 },
  { slug: 'aeration', title: 'Aeration', category: 'lawn',
    image: '/images/services/aeration.jpg',
    blurb: 'Core aeration to relieve compaction and boost root growth.',
    order: 4 },
  { slug: 'fertilization', title: 'Fertilization', category: 'lawn',
    image: '/images/services/fertilization.jpg',
    blurb: 'Season-matched fertilization for thick, healthy turf.',
    order: 5 },
  { slug: 'sodding', title: 'Sodding', category: 'lawn',
    image: '/images/services/sodding.jpg',
    blurb: 'Professional sod installation with proper site prep.',
    order: 6 },
  { slug: 'lawn-pest-control', title: 'Lawn Pest Control', category: 'lawn',
    image: '/images/services/lawn-pest-control.jpg',
    blurb: 'Targeted control of grubs, chinch bugs, and other lawn pests.',
    order: 7 },

  // Hardscaping
  { slug: 'hardscapes', title: 'Hardscapes', category: 'hardscaping',
    image: '/images/services/hardscapes.jpg',
    blurb: 'Patios, walkways, and feature walls that anchor your landscape.',
    order: 1, featured: true },
  { slug: 'retaining-walls', title: 'Retaining Walls', category: 'hardscaping',
    image: '/images/services/retaining-walls.jpg',
    blurb: 'Engineered retaining walls that perform and look the part.',
    order: 2 },

  // Other
  { slug: 'irrigation', title: 'Irrigation', category: 'other',
    image: '/images/services/irrigation.jpg',
    blurb: 'Efficient irrigation systems that save water and time.',
    order: 1, featured: true },
  { slug: 'sprinklers', title: 'Sprinklers', category: 'other',
    image: '/images/services/sprinklers.jpg',
    blurb: 'Sprinkler installation, repair, and seasonal service.',
    order: 2 },
  { slug: 'mulching', title: 'Mulching', category: 'other',
    image: '/images/services/mulching.jpg',
    blurb: 'Bed mulching for moisture retention, weed control, and clean lines.',
    order: 3 },
  { slug: 'shrubs-and-hedges', title: 'Shrubs and Hedges', category: 'other',
    image: '/images/services/shrubs-and-hedges.jpg',
    blurb: 'Pruning, shaping, and seasonal care for shrubs and hedges.',
    order: 4 },
  { slug: 'tree-removal', title: 'Tree Removal', category: 'other',
    image: '/images/services/tree-removal.jpg',
    blurb: 'Safe tree and stump removal by experienced crews.',
    order: 5 },
  { slug: 'xeriscaping', title: 'Xeriscaping', category: 'other',
    image: '/images/services/xeriscaping.jpg',
    blurb: 'Drought-tolerant designs that stay beautiful with less water.',
    order: 6 },
  { slug: 'commercial-property-maintenance', title: 'Commercial Property Maintenance', category: 'other',
    image: '/images/services/commercial-property-maintenance.jpg',
    blurb: 'Full-season grounds maintenance for commercial properties.',
    order: 7 },
  { slug: 'commercial-snow-removal', title: 'Commercial Snow Removal', category: 'other',
    image: '/images/services/commercial-snow-removal.jpg',
    blurb: 'Dependable snow & ice management for commercial properties.',
    order: 8 },
];

export const categories: Record<ServiceCategory, string> = {
  landscaping: 'Landscaping',
  lawn: 'Lawn',
  hardscaping: 'Hardscaping',
  other: 'Other Services',
};

export function getCategorizedServices() {
  const order: ServiceCategory[] = ['landscaping', 'lawn', 'hardscaping', 'other'];
  return order.map((cat) => ({
    category: cat,
    label: categories[cat],
    services: services.filter((s) => s.category === cat).sort((a, b) => a.order - b.order),
  }));
}
