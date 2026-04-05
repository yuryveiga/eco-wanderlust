import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { WeatherSection } from "@/components/WeatherSection";
import { ToursSection } from "@/components/ToursSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { GallerySection } from "@/components/GallerySection";
import { BlogCarousel } from "@/components/BlogCarousel";
import { Footer } from "@/components/Footer";
import { useSiteData } from "@/hooks/useSiteData";

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
      <WeatherSection />
      <ToursSection />
      <ReviewsSection />
      <AboutSection />
      <ContactSection />
      <GallerySection />
      <BlogCarousel />
      <Footer />
    </main>
  );
};

export default Index;
