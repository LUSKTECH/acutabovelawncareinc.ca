import Link from 'next/link';
import Image from 'next/image';
import type { ServiceMeta } from '@/content/services/_meta';

/** Default sizes match the densest grid (4-col at lg+) so we don't under-fetch. */
const DEFAULT_SIZES =
  '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

export default function ServiceCard({
  service,
  sizes = DEFAULT_SIZES,
  priority = false,
}: Readonly<{
  service: ServiceMeta;
  sizes?: string;
  priority?: boolean;
}>) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={service.image}
          alt={`${service.title} by A Cut Above Lawn Care Inc`}
          fill
          sizes={sizes}
          priority={priority}
          quality={75}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/85 via-forest-900/30 to-transparent p-5">
          <p className="font-display text-xl text-cream-50">{service.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-cream-50/80">{service.blurb}</p>
        </div>
      </div>
    </Link>
  );
}
