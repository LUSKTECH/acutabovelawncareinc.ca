import Hero from '@/components/home/Hero';
import ValueProps from '@/components/home/ValueProps';
import FeaturedServices from '@/components/home/FeaturedServices';
import ServiceAreasStrip from '@/components/home/ServiceAreasStrip';
import ClosingCta from '@/components/home/ClosingCta';
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <ValueProps />
      <FeaturedServices />
      <ServiceAreasStrip />
      <ClosingCta />
    </>
  );
}
