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
      className="group shadow-card relative block overflow-clip rounded-2xl bg-white transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={service.image}
          alt={`${service.title} by A Cut Above Lawn Care Inc`}
          fill
          sizes={sizes}
          priority={priority}
          quality={75}
          className="object-cover"
        />
        <div className="from-forest-900/85 via-forest-900/30 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-5">
          <p className="font-display text-cream-50 text-xl">{service.title}</p>
          <p className="text-cream-50/80 mt-1 line-clamp-2 text-sm">{service.blurb}</p>
        </div>
      </div>
    </Link>
  );
}
