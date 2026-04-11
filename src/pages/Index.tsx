import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { useSiteData } from "@/hooks/useSiteData";

// Lazy load sections below the fold
const WeatherSection = lazy(() => import("@/components/WeatherSection").then(m => ({ default: m.WeatherSection })));
const ToursSection = lazy(() => import("@/components/ToursSection").then(m => ({ default: m.ToursSection })));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection").then(m => ({ default: m.ReviewsSection })));
const AboutSection = lazy(() => import("@/components/AboutSection").then(m => ({ default: m.AboutSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })));
const GallerySection = lazy(() => import("@/components/GallerySection").then(m => ({ default: m.GallerySection })));
const BlogCarousel = lazy(() => import("@/components/BlogCarousel").then(m => ({ default: m.BlogCarousel })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const SectionLoader = () => <div className="h-40 w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const Index = () => {
  const { siteSettings } = useSiteData();
  const siteTitle = siteSettings?.site_title || "Passeios Privativos Rio de Janeiro | Tocorime Rio";
  const siteDescription = siteSettings?.site_description || "Descubra passeios privativos no Rio de Janeiro com guias cariocas especializados. Cultura, história e ecoturismo em roteiros personalizados. Reserve sua experiência única hoje!";

  return (
    <main>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tocorimerio.com/" />
        <meta property="og:site_name" content="Tocorime Rio" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <link rel="canonical" href="https://tocorimerio.com/" />
      </Helmet>
      <Header />
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <WeatherSection />
        <ToursSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
        <GallerySection />
        <BlogCarousel />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
