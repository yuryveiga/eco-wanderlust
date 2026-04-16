// Force clean build after dependency cleanup
import { lazy, Suspense, useEffect } from "react";
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
import { ThemeApplier } from "./components/ThemeApplier";
import { BUILD_ID } from "./version";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Pages
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const AdminLayout = lazy(() => import("./pages/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminTours = lazy(() => import("./pages/AdminTours"));
const AdminPages = lazy(() => import("./pages/AdminPages"));
const AdminImages = lazy(() => import("./pages/AdminImages"));
const AdminSocial = lazy(() => import("./pages/AdminSocial"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminHero = lazy(() => import("./pages/AdminHero"));
const AdminTheme = lazy(() => import("./pages/AdminTheme"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminSales = lazy(() => import("./pages/AdminSales"));
const AdminSimulator = lazy(() => import("./pages/AdminSimulator"));
const AdminCalendar = lazy(() => import("./pages/AdminCalendar"));
const AdminImagesOptimizer = lazy(() => import("./pages/AdminImagesOptimizer"));
const TourDetail = lazy(() => import("./pages/TourDetail").then(m => ({ default: m.TourDetail })));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Cart = lazy(() => import("./pages/Cart"));
const MaracanaCalendar = lazy(() => import("./pages/MaracanaCalendar"));
const GenericPage = lazy(() => import("./pages/GenericPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const MatchDetail = lazy(() => import("./pages/MatchDetail"));

const queryClient = new QueryClient();

const PageLoader = () => <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const App = () => {
  useEffect(() => {
    const lastVersion = localStorage.getItem("app_version");
    if (lastVersion && lastVersion !== BUILD_ID) {
      localStorage.setItem("app_version", BUILD_ID);
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
      <ErrorBoundary>
        <AuthProvider>
          <LocaleProvider>
            <CartProvider>
              <HelmetProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <ThemeApplier />
                  <BrowserRouter>
                    <FloatingButtons />
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/carrinho" element={<Cart />} />
                        <Route path="/confirmacao" element={<CheckoutSuccess />} />
                        <Route path="/maracana-calendario" element={<MaracanaCalendar />} />
                        <Route path="/maracanacalendar" element={<MaracanaCalendar />} />
                        <Route path="/passeio/:id" element={<TourDetail />} />
                        <Route path="/match/:id" element={<MatchDetail />} />
                        <Route path="/jogo/:id" element={<MatchDetail />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
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
                          <Route path="simulator" element={<AdminSimulator />} />
                          <Route path="calendar" element={<AdminCalendar />} />
                          <Route path="pages" element={<AdminPages />} />
                           <Route path="optimizer" element={<AdminImagesOptimizer />} />
                        </Route>
                        <Route path="/:slug" element={<GenericPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </TooltipProvider>
              </HelmetProvider>
            </CartProvider>
          </LocaleProvider>
        </AuthProvider>
      </ErrorBoundary>

    </QueryClientProvider>
  );
};

export default App;
