import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { Save, RotateCcw, Palette, CreditCard, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper to convert HEX to HSL numbers string (e.g. "145 45% 28%")
function hexToHslNumbers(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Helper to convert HSL numbers string back to HEX
function hslNumbersToHex(hslStr: string): string {
  const parts = hslStr.split(" ");
  if (parts.length < 3) return "#000000";
  const h = parseInt(parts[0]) / 360;
  const s = parseInt(parts[1]) / 100;
  const l = parseInt(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const AdminTheme = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await fetchLovable<LovableSiteSetting>("site_settings");
    const settingsMap: Record<string, string> = {};
    data.forEach(s => settingsMap[s.key] = s.value);
    
    if (!settingsMap['theme_primary']) settingsMap['theme_primary'] = "145 45% 28%"; 
    if (!settingsMap['theme_accent']) settingsMap['theme_accent'] = "42 80% 55%";
    if (!settingsMap['stripe_payment_link']) settingsMap['stripe_payment_link'] = "";
    
    setSettings(settingsMap);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const keys = Object.keys(settings);
      for (const key of keys) {
        await updateLovable("site_settings", key, { value: settings[key] });
      }
      toast({ title: "Configurações atualizadas!", description: "As mudanças foram salvas com sucesso." });
      // Reload on color change or wait
      if (settings['theme_primary'] !== settings['theme_primary_old']) {
         // window.location.reload();
      }
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateColor = (key: string, hex: string) => {
    const hsl = hexToHslNumbers(hex);
    setSettings(prev => ({ ...prev, [key]: hsl }));
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Carregando configurações...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
            Configurações do Site
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie a aparência e integrações do seu site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4 mr-2" />Descartar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="font-bold">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Tudo"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-48 grid-cols-1 mb-8">
          <TabsTrigger value="visual" className="font-bold flex gap-2">
            <Palette className="w-4 h-4" /> Cores do Site
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-8 mt-0 border-none p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Color */}
            <div className="bg-card rounded-2xl border p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Cor Principal</Label>
                <div 
                  className="w-12 h-12 rounded-full border-4 border-white shadow-lg" 
                  style={{ backgroundColor: `hsl(${settings['theme_primary']})` }}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Botões de ação principal, ícones de destaque e identidade da marca.</p>
              <input 
                type="color" 
                value={hslNumbersToHex(settings['theme_primary'] || "145 45% 28%")} 
                onChange={(e) => updateColor('theme_primary', e.target.value)}
                className="w-full h-14 rounded-xl cursor-pointer border-none p-1 bg-muted/20"
              />
            </div>

            {/* Accent Color */}
            <div className="bg-card rounded-2xl border p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Cor de Destaque</Label>
                <div 
                  className="w-12 h-12 rounded-full border-4 border-white shadow-lg" 
                  style={{ backgroundColor: `hsl(${settings['theme_accent']})` }}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Elementos que chamam atenção, alertas e botões secundários.</p>
              <input 
                type="color" 
                value={hslNumbersToHex(settings['theme_accent'] || "42 80% 55%")} 
                onChange={(e) => updateColor('theme_accent', e.target.value)}
                className="w-full h-14 rounded-xl cursor-pointer border-none p-1 bg-muted/20"
              />
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
               <Palette className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg mb-1">Harmonia Visual</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As mudanças de cor são aplicadas globalmente. O verde escuro (#2A9D8F) e o coral (#E76F51) são sugeridos para manter o tema ecológico e vibrante do Rio.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTheme;

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
