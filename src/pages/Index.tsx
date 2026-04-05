import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ToursSection } from "@/components/ToursSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <ToursSection />
      <ReviewsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
