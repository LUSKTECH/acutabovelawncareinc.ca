import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getServiceBySlug, getServiceSlugs } from '@/lib/content';
import ServiceHero from '@/components/service/ServiceHero';
import RelatedServices from '@/components/service/RelatedServices';

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const s = getServiceBySlug(slug);
    return {
      title: s.frontmatter.title,
      description: s.blurb,
      openGraph: {
        title: s.frontmatter.title,
        description: s.blurb,
        images: [s.image],
      },
      alternates: { canonical: `/services/${s.slug}` },
    };
  } catch {
    return {};
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let service;
  try {
    service = getServiceBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: service.body,
    options: { parseFrontmatter: false },
  });

  return (
    <>
      <ServiceHero title={service.frontmatter.title} image={service.image} />
      <article className="container-prose px-4 py-16 lg:px-0">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
      <RelatedServices current={service} />
    </>
  );
}
