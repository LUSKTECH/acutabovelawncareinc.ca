import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/content';
import { renderMdx } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'About',
  description: 'A Cut Above Lawn Care Inc — local landscaping in Burlington and the Halton Region.',
};

export default async function AboutPage() {
  const { content: raw, data } = getPageBySlug('about');
  const content = await renderMdx(raw);

  const title = typeof data.title === 'string' ? data.title : 'About us';

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-12 lg:px-8">
        <p className="text-sm uppercase tracking-widest text-sage-500">Who we are</p>
        <h1 className="mt-2 font-display text-5xl text-forest-900">{title}</h1>
      </section>
      <article className="container-prose px-4 pb-24 lg:px-0">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
    </>
  );
}
