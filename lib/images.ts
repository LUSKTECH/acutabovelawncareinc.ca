import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

function humanize(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b\d+\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const dir = join(process.cwd(), 'public/images/gallery');
  if (!existsSync(dir)) {
    throw new Error(`Gallery directory not found: ${dir}`);
  }
  const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const items = await Promise.all(
    files.map(async (f) => {
      const meta = await sharp(join(dir, f)).metadata();
      if (!meta.width || !meta.height) {
        throw new Error(`Could not read dimensions for gallery image: ${f}`);
      }
      return {
        src: `/images/gallery/${f}`,
        width: meta.width,
        height: meta.height,
        alt: humanize(f) || 'Landscaping project',
      };
    }),
  );
  return items.sort((a, b) => a.src.localeCompare(b.src));
}
