import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';

const SRC = 'wordpress-export/latest/media-files';
const DST = 'public/images/source';

// "landscaping-01-300x200.jpg" -> "landscaping-01.jpg"
// "Logo_512-150x150.png.webp"  -> "Logo_512.png"
function canonicalName(file: string): string {
  let f = file.replace(/\.webp$/i, '');
  f = f.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
  return f;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function main() {
  if (!existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  const files = walk(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  // Pick the largest non-thumb file per canonical name.
  // Prefer non-webp originals so next/image can re-encode optimally.
  const byCanonical = new Map<string, { path: string; size: number }>();

  for (const path of files) {
    const key = canonicalName(basename(path)).toLowerCase();
    const size = statSync(path).size;
    const isWebp = /\.webp$/i.test(path);
    const existing = byCanonical.get(key);

    if (!existing) {
      byCanonical.set(key, { path, size });
      continue;
    }
    const existingIsWebp = /\.webp$/i.test(existing.path);
    if (existingIsWebp && !isWebp) byCanonical.set(key, { path, size });
    else if (existingIsWebp === isWebp && size > existing.size) {
      byCanonical.set(key, { path, size });
    }
  }

  mkdirSync(DST, { recursive: true });
  let copied = 0;
  for (const { path } of byCanonical.values()) {
    const out = join(DST, canonicalName(basename(path)).toLowerCase());
    mkdirSync(dirname(out), { recursive: true });
    copyFileSync(path, out);
    copied++;
  }
  console.log(`Copied ${copied} unique images to ${DST}/`);
}

main();
