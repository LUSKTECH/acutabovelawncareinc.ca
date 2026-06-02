import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/content/site';

export default function Hero() {
  return (
    <section className="relative isolate">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/images/hero/hero.jpg"
          alt="Professionally landscaped property by A Cut Above Lawn Care Inc in Burlington, Ontario"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-forest-900/75 via-forest-900/40 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 lg:px-8 lg:pb-24">
          <p className="text-sm uppercase tracking-[0.3em] text-moss-100/80">
            Burlington · Oakville · Milton
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-5xl text-cream-50 sm:text-6xl md:text-7xl">
            Landscapes built with care, season after season.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-cream-50/85">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-cream-50 px-6 py-3 text-base font-medium text-forest-900 hover:bg-white"
            >
              Get a free estimate
            </Link>
            <a
              href={`tel:${site.phoneE164}`}
              className="rounded-full border border-cream-50/70 px-6 py-3 text-base font-medium text-cream-50 hover:bg-cream-50/10"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
