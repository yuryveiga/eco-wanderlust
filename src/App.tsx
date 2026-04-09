import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CartProvider } from "@/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import { FloatingButtons } from "./components/FloatingButtons";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTours from "./pages/AdminTours";
import AdminPages from "./pages/AdminPages";
import AdminImages from "./pages/AdminImages";
import AdminSocial from "./pages/AdminSocial";
import AdminGallery from "./pages/AdminGallery";
import AdminBlog from "./pages/AdminBlog";
import AdminHero from "./pages/AdminHero";
import AdminTheme from "./pages/AdminTheme";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews";
import AdminSales from "./pages/AdminSales";
import { TourDetail } from "./pages/TourDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Cart from "./pages/Cart";
import MaracanaCalendar from "./pages/MaracanaCalendar";
import GenericPage from "./pages/GenericPage";
import { ThemeApplier } from "./components/ThemeApplier";
import { BUILD_ID } from "./version";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Cache busting logic
    const lastVersion = localStorage.getItem("app_version");
    if (lastVersion && lastVersion !== BUILD_ID) {
      console.log("New version detected. Clearing cache and reloading...");
      localStorage.setItem("app_version", BUILD_ID);
      // Clear all caches if possible
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => caches.delete(name));
        });
      }
      window.location.reload();
    } else if (!lastVersion) {
      localStorage.setItem("app_version", BUILD_ID);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocaleProvider>
        <CartProvider>
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ThemeApplier />
              <FloatingButtons />
              <BrowserRouter>
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/maracanã-calendário" element={<MaracanaCalendar />} />
            <Route path="/maracana-calendario" element={<MaracanaCalendar />} />
            <Route path="/maracanacalendar" element={<MaracanaCalendar />} />
            <Route path="/passeio/:id" element={<TourDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="theme" element={<AdminTheme />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="tours" element={<AdminTours />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="social" element={<AdminSocial />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="sales" element={<AdminSales />} />
                <Route path="pages" element={<AdminPages />} />
            </Route>
            <Route path="/:slug" element={<GenericPage />} />
            <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </HelmetProvider>
        </CartProvider>
      </LocaleProvider>
    </AuthProvider>
  </QueryClientProvider>
      );
};

export default App;
