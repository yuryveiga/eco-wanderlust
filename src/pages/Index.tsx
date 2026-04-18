import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
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

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const { siteSettings } = useSiteData();
  const { language } = useLocale();
  const siteTitle = siteSettings?.site_title || (language === 'pt' ? "Passeios Privativos Exclusivos no Rio de Janeiro | Experiências Locais Autênticas" : language === 'es' ? "Tours Privados Exclusivos en Río de Janeiro | Experiencias Locales Auténticas" : "Exclusive Private Tours in Rio de Janeiro | Authentic Local Experiences");
  const siteDescription = siteSettings?.site_description || (language === 'pt' ? "Descubra o melhor do Rio de Janeiro com nossos guias especialistas. Tours privativos e personalizados para garantir segurança e exclusividade." : language === 'es' ? "Descubra lo mejor de Río de Janeiro con nuestros guías expertos. Tours privados y personalizados para garantizar seguridad y exclusividad." : "Discover the best of Rio de Janeiro with our expert guides. Private and personalized tours to ensure safety and exclusivity.");

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
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="pt_BR" />
        <meta property="og:locale:alternate" content="es_ES" />
        <link rel="canonical" href="https://tocorimerio.com/" />
      </Helmet>
      <Header />
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <FadeIn><WeatherSection /></FadeIn>
        <FadeIn><ToursSection /></FadeIn>
        <FadeIn><ReviewsSection /></FadeIn>
        <FadeIn><AboutSection /></FadeIn>
        <FadeIn><ContactSection /></FadeIn>
        <FadeIn><GallerySection /></FadeIn>
        <FadeIn><BlogCarousel /></FadeIn>
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
