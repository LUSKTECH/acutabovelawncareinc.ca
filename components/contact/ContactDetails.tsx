import { site } from '@/content/site';

export default function ContactDetails() {
  return (
    <div className="space-y-4 text-ink-700">
      <p className="font-display text-2xl text-forest-900">Contact</p>
      <p>
        <a href={`tel:${site.phoneE164}`} className="text-forest-700 hover:text-forest-900">
          {site.phone}
        </a>
        <br />
        <a href={`mailto:${site.email}`} className="text-forest-700 hover:text-forest-900">
          {site.email}
        </a>
      </p>
      <p>
        {site.address.locality}, {site.address.region}
        <br />
        {site.hours}
      </p>
    </div>
  );
}
