/**
 * Sort deduped source images into hero/services/gallery folders and pick
 * featured imagery per service. Idempotent — safe to re-run.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'public/images/source';
const HERO = 'public/images/hero';
const SVC = 'public/images/services';
const GAL = 'public/images/gallery';

function ensure(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function pickFirst(...candidates: string[]): string | null {
  for (const c of candidates) {
    if (existsSync(join(SRC, c))) return c;
  }
  return null;
}

function copyTo(srcFile: string, dstDir: string, dstName: string) {
  copyFileSync(join(SRC, srcFile), join(dstDir, dstName));
}

const serviceImageMap: Record<string, string[]> = {
  'aeration': ['lawncare-thumb.jpg', 'lawncare-02.jpg'],
  'commercial-garden-design': ['landscape-design-01.jpg', 'landscape-design-01-1.jpg'],
  'commercial-landscaping': ['landscaping-01.jpg', 'landscaping-01-1.jpg'],
  'commercial-lawn-mowing': ['lawncare-02.jpg', 'lawncare-02-1.jpg'],
  'commercial-property-maintenance': ['landscaping-02.jpg', 'landscaping-02-1.jpg'],
  'commercial-snow-removal': ['landscaping-03.jpg', 'landscaping-03-1.jpg'],
  'fertilization': ['fertilization-01.jpg', 'fertilization-01-1.jpg'],
  'hardscapes': ['hardscapes-01.jpg', 'hardscapes-01-1.jpg'],
  'irrigation': ['fertilization-02.jpg', 'fertilization-02-1.jpg'],
  'landscape-construction': ['landscape-design-02.jpg', 'landscape-design-02-1.jpg'],
  'landscape-design': ['landscape-design-03.jpg', 'landscape-design-03-1.jpg'],
  'landscaping': ['landscaping-01.jpg', 'landscaping-01-1.jpg'],
  'lawn-care': ['lawncare-01.jpg', 'lawncare-01-1.jpg'],
  'lawn-mowing': ['lawncare-02.jpg', 'lawncare-02-1.jpg'],
  'lawn-pest-control': ['fertilization-thumb.jpg', 'fertilization-01.jpg'],
  'mulching': ['landscaping-02.jpg', 'landscaping-02-1.jpg'],
  'retaining-walls': ['hardscapes-02.jpg', 'hardscapes-02-1.jpg'],
  'shrubs-and-hedges': ['landscaping-03.jpg', 'landscaping-03-1.jpg'],
  'sodding': ['lawncare-01.jpg', 'lawncare-01-1.jpg'],
  'sprinklers': ['fertilization-01.jpg', 'fertilization-01-1.jpg'],
  'tree-removal': ['tree-service-01.jpg', 'tree-service-01-1.jpg'],
  'xeriscaping': ['landscape-design-02.jpg', 'landscape-design-02-1.jpg'],
};

const galleryFiles = [
  'landscaping-01.jpg', 'landscaping-02.jpg', 'landscaping-03.jpg',
  'landscape-design-01.jpg', 'landscape-design-02.jpg', 'landscape-design-03.jpg',
  'hardscapes-01.jpg', 'hardscapes-02.jpg', 'hardscapes-03.jpg',
  'lawncare-01.jpg', 'lawncare-02.jpg',
  'fertilization-01.jpg', 'fertilization-02.jpg',
  'tree-service-01.jpg', 'tree-service-02.jpg',
];

function main() {
  if (!existsSync(SRC)) {
    console.error(`Source not found: ${SRC}. Run 'npm run content:images' first.`);
    process.exit(1);
  }

  ensure(HERO);
  ensure(SVC);
  ensure(GAL);

  // Hero: largest landscape photo
  const heroCandidate = pickFirst('landscape-design-01.jpg', 'landscaping-01.jpg', 'hardscapes-02.jpg');
  if (heroCandidate) {
    copyTo(heroCandidate, HERO, 'hero.jpg');
    console.log(`hero → ${heroCandidate}`);
  } else {
    console.warn('! no hero candidate found');
  }

  // Per-service featured images
  let serviceCount = 0;
  for (const [slug, candidates] of Object.entries(serviceImageMap)) {
    const pick = pickFirst(...candidates);
    if (pick) {
      copyTo(pick, SVC, `${slug}.jpg`);
      serviceCount++;
    } else {
      console.warn(`! no image found for ${slug}`);
    }
  }
  console.log(`services → ${serviceCount} mapped`);

  // Gallery: copy curated non-thumb photos
  let galleryCount = 0;
  for (const f of galleryFiles) {
    if (existsSync(join(SRC, f))) {
      copyTo(f, GAL, f);
      galleryCount++;
    }
  }
  console.log(`gallery → ${galleryCount} images`);

  // Logo
  const logo = pickFirst('logo_512.png', 'cropped-logo_512.png', 'logo.png');
  if (logo) {
    copyTo(logo, 'public/images', 'logo.png');
    console.log(`logo → ${logo}`);
  }
}

main();
