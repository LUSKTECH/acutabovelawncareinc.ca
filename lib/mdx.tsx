import { compileMDX } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';

// Downshift MDX headings so the page's hero <h1> stays the single H1.
const components = {
  h1: (props: ComponentProps<'h2'>) => <h2 {...props} />,
  h2: (props: ComponentProps<'h3'>) => <h3 {...props} />,
  h3: (props: ComponentProps<'h4'>) => <h4 {...props} />,
};

export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: false },
    components,
  });
  return content;
}
