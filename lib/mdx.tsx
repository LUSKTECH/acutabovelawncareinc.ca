import { compileMDX } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';

// Downshift MDX headings so the page's hero <h1> stays the single H1.
const components = {
  h1: ({ children, ...props }: ComponentProps<'h2'>) => <h2 {...props}>{children}</h2>,
  h2: ({ children, ...props }: ComponentProps<'h3'>) => <h3 {...props}>{children}</h3>,
  h3: ({ children, ...props }: ComponentProps<'h4'>) => <h4 {...props}>{children}</h4>,
};

export async function renderMdx(source: string) {
  try {
    const { content } = await compileMDX({
      source,
      options: { parseFrontmatter: false },
      components,
    });
    return content;
  } catch (err) {
    console.error('[mdx] compileMDX failed:', err);
    throw new Error('Failed to render page content — check MDX syntax.', { cause: err });
  }
}
