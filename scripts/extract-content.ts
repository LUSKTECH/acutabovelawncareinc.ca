/**
 * Convert WordPress posts-detailed.json into MDX files with frontmatter.
 * Strips theme shortcodes ([contentwrapper], [main], [article], [Form], etc.),
 * expands %TOKEN% placeholders, and downgrades HTML to markdown.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

type WpPost = {
  ID: number;
  post_title: string;
  post_name: string;
  post_status: string;
  post_content: string;
  post_excerpt?: string;
};

const TOKENS: Record<string, string> = {
  '%COMPANY%': 'A Cut Above Lawn Care Inc',
  '%CITY%': 'Burlington',
  '%STATE%': 'Ontario',
  '%POSTALCODE%': '',
  '%PHONE1%': '(905) 638-0884',
  '%FAX1%': '',
  '%TOWNORDER%': 'Burlington, Oakville, and Milton',
  '%SERVICEORDER%': 'Landscaping, Hardscaping & Lawn Care',
  '%THEME%': '',
};

// Strip self-closing and paired shortcodes — multiple passes handle nesting.
function stripShortcodes(s: string): string {
  let prev = '';
  let cur = s;
  while (prev !== cur) {
    prev = cur;
    cur = cur.replace(/\[\/?[a-zA-Z][^\]]*\]/g, '');
  }
  return cur;
}

function expandTokens(s: string): string {
  for (const [k, v] of Object.entries(TOKENS)) s = s.split(k).join(v);
  return s;
}

function collapseWhitespace(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

// Minimal HTML → Markdown.
function htmlToMarkdown(html: string): string {
  const $ = cheerio.load(`<root>${html}</root>`, null, false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(node: any): string {
    if (node.type === 'text') return node.data as string;
    if (node.type !== 'tag') return '';

    const el = node;
    const tag = String(el.tagName).toLowerCase();
    const inner = $(el)
      .contents()
      .map((_, c) => walk(c))
      .get()
      .join('');

    switch (tag) {
      case 'h1': return `\n\n# ${inner.trim()}\n\n`;
      case 'h2': return `\n\n## ${inner.trim()}\n\n`;
      case 'h3': return `\n\n### ${inner.trim()}\n\n`;
      case 'h4': return `\n\n#### ${inner.trim()}\n\n`;
      case 'p':  return `\n\n${inner.trim()}\n\n`;
      case 'strong':
      case 'b': return `**${inner}**`;
      case 'em':
      case 'i': return `*${inner}*`;
      case 'a': {
        const href = $(el).attr('href') ?? '#';
        return `[${inner}](${href})`;
      }
      case 'ul': {
        const items = $(el)
          .children('li')
          .map((_, li) => `- ${walk(li).trim()}`)
          .get()
          .join('\n');
        return `\n\n${items}\n\n`;
      }
      case 'ol': {
        const items = $(el)
          .children('li')
          .map((i, li) => `${i + 1}. ${walk(li).trim()}`)
          .get()
          .join('\n');
        return `\n\n${items}\n\n`;
      }
      case 'li': return inner;
      case 'br': return '\n';
      case 'img': return '';
      case 'script':
      case 'style':
      case 'iframe': return '';
      default: return inner; // unwrap unknown tags
    }
  }

  return $('root')
    .children()
    .map((_, e) => walk(e))
    .get()
    .join('');
}

// Map legacy WordPress permalinks onto the new Next.js routes so MDX bodies
// don't ship internal 308 redirect hops.
const LEGACY_LINKS: Record<string, string> = {
  '/contact-us/': '/contact',
  '/about-us/': '/about',
};
function rewriteLegacyLinks(s: string): string {
  for (const [from, to] of Object.entries(LEGACY_LINKS)) s = s.split(from).join(to);
  return s;
}

function cleanContent(raw: string): string {
  let s = stripShortcodes(raw);
  s = expandTokens(s);
  s = htmlToMarkdown(s);
  s = rewriteLegacyLinks(s);
  s = collapseWhitespace(s);
  return s;
}

const SERVICE_SLUGS = new Set([
  'commercial-garden-design', 'commercial-landscaping', 'landscape-construction',
  'landscape-design', 'landscaping', 'aeration', 'commercial-lawn-mowing', 'lawn-mowing',
  'lawn-care', 'hardscapes', 'retaining-walls', 'commercial-property-maintenance',
  'fertilization', 'lawn-pest-control', 'mulching', 'shrubs-and-hedges', 'sodding',
  'sprinklers', 'xeriscaping', 'irrigation', 'tree-removal', 'commercial-snow-removal',
]);

const PAGE_MAP: Record<string, string> = {
  'about-us': 'about',
  'service-areas': 'service-areas',
};

function main() {
  const posts: WpPost[] = JSON.parse(
    readFileSync('wordpress-export/latest/posts-detailed.json', 'utf8'),
  );

  mkdirSync('content/services', { recursive: true });
  mkdirSync('content/pages', { recursive: true });

  // Pick best (longest) published copy when WP has duplicates.
  const bySlug = new Map<string, WpPost>();
  for (const p of posts) {
    if (p.post_status !== 'publish') continue;
    const existing = bySlug.get(p.post_name);
    if (!existing || (p.post_content?.length ?? 0) > (existing.post_content?.length ?? 0)) {
      bySlug.set(p.post_name, p);
    }
  }

  let written = 0;
  for (const p of bySlug.values()) {
    const isService = SERVICE_SLUGS.has(p.post_name);
    const isPage = p.post_name in PAGE_MAP;
    if (!isService && !isPage) continue;

    const body = cleanContent(p.post_content);
    const title = p.post_title.replace(/&amp;/g, '&').trim();

    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `slug: ${p.post_name}`,
      `wpId: ${p.ID}`,
      `excerpt: ${JSON.stringify((p.post_excerpt ?? '').trim().slice(0, 200))}`,
      '---',
      '',
    ].join('\n');

    const dir = isService ? 'content/services' : 'content/pages';
    const filename = isService ? `${p.post_name}.mdx` : `${PAGE_MAP[p.post_name]}.mdx`;

    writeFileSync(join(dir, filename), frontmatter + body + '\n');
    written++;
  }

  console.log(`Wrote ${written} MDX files.`);
}

main();
