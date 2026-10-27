import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/content/site';

export default function Hero() {
  return (
    <section className="relative isolate">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-clip">
        <Image
          src="/images/hero/hero.jpg"
          alt="Professionally landscaped property by A Cut Above Lawn Care Inc in Burlington, Ontario"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="hero-parallax object-cover"
        />
        <div className="from-forest-900/75 via-forest-900/40 absolute inset-0 bg-gradient-to-tr to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 lg:px-8 lg:pb-24">
          <p className="hero-rise hero-rise-1 text-moss-100/80 text-sm tracking-wide">
            Burlington · Oakville · Milton
          </p>
          <h1 className="hero-rise hero-rise-2 font-display mt-3 max-w-3xl text-4xl text-balance text-white sm:text-5xl md:text-[3.5rem]">
            Landscapes built with care, season after season.
          </h1>
          <p className="hero-rise hero-rise-3 font-display mt-4 max-w-xl text-lg text-white/90">
            {site.tagline}
          </p>
          <div className="hero-rise hero-rise-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-cream-50 text-forest-900 rounded-full px-6 py-3 text-base font-medium hover:bg-white"
            >
              Get a free estimate
            </Link>
            <a
              href={`tel:${site.phoneE164}`}
              className="border-cream-50/70 text-cream-50 hover:bg-cream-50/10 rounded-full border px-6 py-3 text-base font-medium"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
