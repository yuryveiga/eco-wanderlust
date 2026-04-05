import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./pages/AdminLayout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminTours from "./pages/AdminTours.tsx";
import AdminPages from "./pages/AdminPages.tsx";
import AdminImages from "./pages/AdminImages.tsx";
import AdminSocial from "./pages/AdminSocial.tsx";
import AdminGallery from "./pages/AdminGallery";
import { TourDetail } from "./pages/TourDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocaleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/passeio/:id" element={<TourDetail />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tours" element={<AdminTours />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="social" element={<AdminSocial />} />
                <Route path="gallery" element={<AdminGallery />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocaleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
