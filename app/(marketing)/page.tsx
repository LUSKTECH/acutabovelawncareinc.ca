import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import ValueProps from '@/components/home/ValueProps';
import FeaturedServices from '@/components/home/FeaturedServices';
import SocialProof from '@/components/home/SocialProof';
import ServiceAreasStrip from '@/components/home/ServiceAreasStrip';
import ClosingCta from '@/components/home/ClosingCta';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <FeaturedServices />
      <SocialProof />
      <ServiceAreasStrip />
      <ClosingCta />
    </>
  );
}
