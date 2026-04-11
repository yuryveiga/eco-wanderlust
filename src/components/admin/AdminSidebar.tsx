import { Map, FileText, Image, Share2, LayoutDashboard, LogOut, Images, PenTool, LayoutTemplate, Palette, Users, MessageSquare, DollarSign, CalendarDays } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Blog", url: "/admin/blog", icon: PenTool },
  { title: "Estilo do Hero", url: "/admin/hero", icon: LayoutTemplate },
  { title: "Cores do Site", url: "/admin/theme", icon: Palette },
  { title: "Passeios", url: "/admin/tours", icon: Map },
  { title: "Imagens do Site", url: "/admin/images", icon: Image },
  { title: "Galeria", url: "/admin/gallery", icon: Images },
  { title: "Redes Sociais", url: "/admin/social", icon: Share2 },
  { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
  { title: "Vendas", url: "/admin/sales", icon: DollarSign },
  { title: "Usuários", url: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Administração"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <p className="text-xs text-muted-foreground px-2 mb-2 truncate">
            {user?.email}
          </p>
        )}
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
