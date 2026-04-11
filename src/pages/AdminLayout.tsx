import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h2 className="font-sans font-medium text-foreground">Painel Admin</h2>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer">
                Ver Site <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-muted-foreground animate-in fade-in duration-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando...
              </div>
            }>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
