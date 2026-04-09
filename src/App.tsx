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
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
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
import { ThemeApplier } from "./components/ThemeApplier";

const queryClient = new QueryClient();

// Track online visitors
const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const visitorId = localStorage.getItem('visitor_id') || Math.random().toString(36).substring(2);
        localStorage.setItem('visitor_id', visitorId);
        
        await supabase.from('site_visitors').upsert({
          id: visitorId,
          last_seen: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch (e) { console.error('Visitor tracking error:', e); }
    };
    
    trackVisitor();
    const interval = setInterval(trackVisitor, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocaleProvider>
        <CartProvider>
          <HelmetProvider>
            <TooltipProvider>
              <VisitorTracker />
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
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/passeio/:id" element={<TourDetail />} />
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
                  </Route>
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

export default App;
