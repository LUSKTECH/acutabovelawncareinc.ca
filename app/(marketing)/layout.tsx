import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCallCta from '@/components/layout/FloatingCallCta';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-cream-50"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <FloatingCallCta />
    </>
  );
}
