import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCallCta from '@/components/layout/FloatingCallCta';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <FloatingCallCta />
    </>
  );
}
