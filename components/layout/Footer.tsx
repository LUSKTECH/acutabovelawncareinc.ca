import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/content/site';
import { getCategorizedServices } from '@/content/services/_meta';
import { cities } from '@/content/areas';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const groups = getCategorizedServices();
  return (
    <footer className="border-moss-100 bg-forest-900 text-moss-100 mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.2fr_3fr] lg:px-8">
        {/* Brand + contact */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover opacity-90 brightness-0 invert"
            />
            <p className="font-display text-cream-50 text-2xl">A Cut Above Lawn Care</p>
          </div>
          <p className="text-moss-100/70 mt-2 italic">{site.tagline}</p>
          <p className="mt-6 text-sm">
            {site.address.locality}, {site.address.region}
            <br />
            <a href={`tel:${site.phoneE164}`} className="hover:text-cream-50 inline-block py-1">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-cream-50 inline-block py-1">
              {site.email}
            </a>
          </p>
        </div>

        {/* Link groups: 4 service categories + Service areas, evenly columned
            so no single column is left dangling below the others. */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {groups.map((g) => (
            <div key={g.category}>
              <p className="text-cream-50 font-medium">{g.label}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {g.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="hover:text-cream-50">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-cream-50 font-medium">Service areas</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/areas/${c.slug}`} className="hover:text-cream-50">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-areas" className="hover:text-cream-50">
                  All areas →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-forest-700/40 border-t">
        <div className="text-moss-100/70 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs lg:px-8">
          <p>© {currentYear} A Cut Above Lawn Care Inc.</p>
          <p>Serving {site.serviceAreas.slice(0, 3).join(', ')} & the Halton Region</p>
        </div>
      </div>
    </footer>
  );
}
