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

// Loading component for Suspense
const SectionLoader = () => <div className="h-40 w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const Index = () => {
  const { siteSettings } = useSiteData();
  const siteTitle = siteSettings?.site_title || "Eco-Wanderlust | Passeios Inesquecíveis no Rio de Janeiro";

  return (
    <main>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content="Explore o Rio de Janeiro com a Eco-Wanderlust. Oferecemos passeios personalizados, trilhas e experiências únicas na Cidade Maravilhosa." />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content="Explore o Rio de Janeiro com a Eco-Wanderlust. Oferecemos passeios personalizados, trilhas e experiências únicas." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://eco-wanderlust.com.br" />
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
