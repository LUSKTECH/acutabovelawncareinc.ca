import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';

export const metadata: Metadata = {
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
        <ContactDetails />
      </div>
    </section>
  );
}
