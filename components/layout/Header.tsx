import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/content/site';
import MegaNav from './MegaNav';
import MobileNav from './MobileNav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-moss-100 bg-cream-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl leading-none text-forest-900">A Cut Above</span>
            <span className="text-xs italic text-ink-500">Lawn Care Inc.</span>
          </div>
        </Link>
        <div className="hidden md:block">
          <MegaNav />
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phoneE164}`}
            className="hidden whitespace-nowrap rounded-full border border-forest-700 px-5 py-2 text-sm font-medium text-forest-700 transition hover:bg-forest-700 hover:text-cream-50 lg:inline-block"
          >
            {site.phone}
          </a>
          <Link
            href="/contact"
            className="hidden whitespace-nowrap rounded-full bg-forest-700 px-5 py-2 text-sm font-medium text-cream-50 transition hover:bg-forest-900 md:inline-block"
          >
            Free estimate
          </Link>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
