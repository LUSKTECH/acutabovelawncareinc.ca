import type { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from '@/components/contact/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: 'Request a free landscaping estimate from A Cut Above Lawn Care Inc.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-20 pb-24 lg:px-8">
      <p className="text-sm uppercase tracking-widest text-sage-500">Get in touch</p>
      <h1 className="mt-2 font-display text-5xl text-forest-900">Free estimate</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-700">
        Tell us about your property — yard size, what you need, and the best way to reach you.
      </p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_minmax(260px,1fr)]">
        <ContactForm />
        <div className="space-y-8">
          <ContactDetails />
          {/* Project photo panel */}
          <div className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/projects/landscape-design-03.jpg"
                alt="A completed landscaping project by A Cut Above Lawn Care"
                fill
                quality={75}
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="bg-moss-100 px-4 py-3 text-sm text-ink-700 italic">
              &ldquo;We love transforming outdoor spaces — let&rsquo;s talk about yours.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
