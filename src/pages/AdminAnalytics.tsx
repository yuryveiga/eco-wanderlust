
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Loader2, Users, Eye, Globe, MousePointer2 } from "lucide-react";

type Visit = {
  id: string;
  page_url: string;
  referrer: string;
  user_agent: string;
  session_id: string;
  country: string;
  created_at: string;
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Visit[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    topPages: [] as any[],
    visitsByDay: [] as any[],
    visitsByCountry: [] as any[],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const { data: visits, error } = await supabase
        .from("site_visits")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching analytics:", error);
      } else {
        setData(visits || []);
        processData(visits || []);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const processData = (visits: Visit[]) => {
    const totalVisits = visits.length;
    const uniqueSessionIds = new Set(visits.map(v => v.session_id));
    const uniqueVisitors = uniqueSessionIds.size;

    // Process Top Pages
    const pagesMap: Record<string, number> = {};
    visits.forEach(v => {
      try {
        const url = new URL(v.page_url);
        // Clean up URL (remove domain, keep path)
        const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
        pagesMap[path] = (pagesMap[path] || 0) + 1;
      } catch (e) {
        pagesMap[v.page_url] = (pagesMap[v.page_url] || 0) + 1;
      }
    });
    const topPages = Object.entries(pagesMap)
      .map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    // Process Visits by Day (last 30 days)
    const daysMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      daysMap[dayStr] = 0;
    }
    
    visits.forEach(v => {
      const dayStr = v.created_at.split("T")[0];
      if (daysMap[dayStr] !== undefined) {
        daysMap[dayStr]++;
      }
    });
    const visitsByDay = Object.entries(daysMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }),
      count
    }));

    // Process Visits by Country
    const countryMap: Record<string, number> = {};
    visits.forEach(v => {
      const country = v.country || "Unknown";
      countryMap[country] = (countryMap[country] || 0) + 1;
    });
    const visitsByCountry = Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    setStats({
      totalVisits,
      uniqueVisitors,
      topPages,
      visitsByDay,
      visitsByCountry
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Análise de Visitas</h1>
        <p className="text-muted-foreground mt-2">Monitore o desempenho e o tráfego do seu site.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">Visualizações de página totais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">Baseado em IDs de sessão</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top País</CardTitle>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitsByCountry[0]?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Maior origem de tráfego</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Página Principal</CardTitle>
            <MousePointer2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topPages[0]?.name || "/"}</div>
            <p className="text-xs text-muted-foreground">URL mais acessada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visitas por Dia (Últimos 30 dias)</CardTitle>
            <CardDescription>Volume de tráfego diário no site</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.visitsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
            <CardDescription>Ranking das URLs com mais acessos</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topPages} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por País</CardTitle>
            <CardDescription>Principais origens internacionais</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.visitsByCountry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.visitsByCountry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
