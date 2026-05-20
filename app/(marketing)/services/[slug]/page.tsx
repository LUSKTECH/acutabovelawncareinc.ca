import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceBySlug, getServiceSlugs, UnknownServiceError } from '@/lib/content';
import { renderMdx } from '@/lib/mdx';
import ServiceHero from '@/components/service/ServiceHero';
import ServiceGallery from '@/components/service/ServiceGallery';
import RelatedServices from '@/components/service/RelatedServices';
import ServiceJsonLd from '@/components/seo/ServiceJsonLd';

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
      title: s.title,
      description: s.blurb,
      openGraph: {
        type: 'website',
        title: s.title,
        description: s.blurb,
        images: [{ url: s.image, alt: `${s.title} — A Cut Above Lawn Care Inc` }],
        url: `/services/${s.slug}`,
      },
      twitter: { card: 'summary_large_image', images: [s.image] },
      alternates: { canonical: `/services/${s.slug}` },
    };
  } catch (err) {
    if (err instanceof UnknownServiceError) return {};
    throw err;
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
  } catch (err) {
    if (err instanceof UnknownServiceError) notFound();
    throw err;
  }

  const content = await renderMdx(service.body);

  return (
    <>
      <ServiceJsonLd
        title={service.title}
        description={service.blurb}
        slug={service.slug}
        image={service.image}
      />
      <ServiceHero title={service.title} image={service.image} />
      <article className="container-prose px-4 py-16 lg:px-0">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest-900 prose-a:text-forest-700">
          {content}
        </div>
      </article>
      {service.gallery && service.gallery.length > 0 && (
        <ServiceGallery images={service.gallery} title={service.title} />
      )}
      <RelatedServices category={service.category} slug={service.slug} />
    </>
  );
}
