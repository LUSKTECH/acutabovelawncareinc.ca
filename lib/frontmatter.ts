import { load } from 'js-yaml';

export type Frontmatter = {
  data: Record<string, unknown>;
  content: string;
};

const OPEN = '---';
const CLOSE = '\n---\n';

/**
 * Minimal frontmatter parser for this codebase's content files: always a
 * '---' delimited YAML block followed by an MDX body, no custom delimiters,
 * no excerpts/sections. Exists so we can call js-yaml's modern `load()`
 * directly instead of depending on gray-matter, which is unmaintained and
 * calls js-yaml's removed `safeLoad`/`safeDump` API -- pinning js-yaml to a
 * patched version breaks it outright.
 */
export function parseFrontmatter(raw: string): Frontmatter {
  const rest = raw.slice(OPEN.length);
  const closeIndex = rest.indexOf(CLOSE);
  const data = load(rest.slice(0, closeIndex)) as Record<string, unknown>;
  const content = rest.slice(closeIndex + CLOSE.length);
  return { data, content };
}
