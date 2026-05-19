import { describe, it, expect, vi } from 'vitest';
import { renderMdx } from '@/lib/mdx';
import { renderToString } from 'react-dom/server';

describe('renderMdx', () => {
  it('downshifts H1 → H2, H2 → H3, H3 → H4 to preserve a single H1 per page', async () => {
    const node = await renderMdx(`# Top\n\n## Mid\n\n### Low\n\nbody`);
    const html = renderToString(node as React.ReactElement);
    expect(html).toContain('<h2>Top</h2>');
    expect(html).toContain('<h3>Mid</h3>');
    expect(html).toContain('<h4>Low</h4>');
    expect(html).not.toContain('<h1>');
  });

  it('renders plain prose unchanged', async () => {
    const node = await renderMdx('This is just **bold** text.');
    const html = renderToString(node as React.ReactElement);
    expect(html).toContain('<strong>bold</strong>');
  });

  it('throws a descriptive error with cause when MDX is invalid', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Unclosed JSX element is invalid MDX and causes compileMDX to throw.
    await expect(renderMdx('<InvalidUnclosed')).rejects.toThrow('Failed to render');
    expect(errSpy).toHaveBeenCalled();
  });
});
