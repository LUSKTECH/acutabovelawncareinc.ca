/**
 * Safely serialize structured data for use in `<script type="application/ld+json">`.
 *
 * JSON.stringify alone is insufficient — if any string value contains `</script>`,
 * the tag closes early and the remaining JSON executes as HTML. We escape `<` to its
 * Unicode escape sequence `<`, which is valid JSON and invisible to parsers.
 *
 * This is the same approach React uses internally for SSR inline data.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
