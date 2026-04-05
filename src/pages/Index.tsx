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

const Index = () => {
  return (
    <main>
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
