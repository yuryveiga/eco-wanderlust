import { 
  Map, 
  FileText, 
  Image, 
  Share2, 
  LayoutDashboard, 
  LogOut, 
  Images, 
  PenTool, 
  LayoutTemplate, 
  Palette, 
  Users, 
  MessageSquare, 
  DollarSign,
  Calculator,
  Layout,
  CalendarDays
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuGroups = [
  {
    label: "Dashboard",
    items: [
      { title: "Início", url: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    label: "Gestão Comercial",
    items: [
      { title: "Vendas", url: "/admin/sales", icon: DollarSign },
      { title: "Simulador", url: "/admin/simulator", icon: Calculator },
      { title: "Calendário", url: "/admin/calendar", icon: CalendarDays },
      { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
    ]
  },
  {
    label: "Catálogo & Conteúdo",
    items: [
      { title: "Passeios", url: "/admin/tours", icon: Map },
      { title: "Blog", url: "/admin/blog", icon: PenTool },
      { title: "Galeria", url: "/admin/gallery", icon: Images },
      { title: "Páginas CMS", url: "/admin/pages", icon: FileText },
    ]
  },
  {
    label: "Design & Estilo",
    items: [
      { title: "Estilo do Hero", url: "/admin/hero", icon: LayoutTemplate },
      { title: "Cores do Site", url: "/admin/theme", icon: Palette },
      { title: "Imagens do Site", url: "/admin/images", icon: Image },
      { title: "Otimizador", url: "/admin/optimizer", icon: Zap },
      { title: "Redes Sociais", url: "/admin/social", icon: Share2 },
    ]
  },
  {
    label: "Configurações",
    items: [
      { title: "Usuários", url: "/admin/users", icon: Users },
    ]
  }
];


export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="gap-0 py-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 mt-1 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className="hover:bg-muted/50 transition-colors"
                        activeClassName="bg-muted text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {!collapsed && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Logado como</p>
            <p className="text-xs text-foreground font-medium truncate">
              {user?.email}
            </p>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && <span className="font-semibold">Sair do Painel</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

