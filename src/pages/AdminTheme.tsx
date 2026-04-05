import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { Save, RotateCcw, Palette } from "lucide-react";

// Helper to convert HEX to HSL numbers string (e.g. "145 45% 28%")
function hexToHslNumbers(hex: string): string {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
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

// Helper to convert HSL numbers string back to HEX (rough approximation for input value)
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
    
    // Set defaults if not present
    if (!settingsMap['theme_primary']) settingsMap['theme_primary'] = "145 45% 28%"; 
    if (!settingsMap['theme_accent']) settingsMap['theme_accent'] = "42 80% 55%";
    
    setSettings(settingsMap);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const keys = ['theme_primary', 'theme_accent'];
      for (const key of keys) {
        await updateLovable("site_settings", key, { value: settings[key] });
      }
      toast({ title: "Cores atualizadas!", description: "As novas cores foram aplicadas ao site." });
      // Force reload to apply styles immediately (or we can use the applier)
      window.location.reload();
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

  if (isLoading) return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            Cores do Site
          </h1>
          <p className="text-muted-foreground font-sans mt-1">Personalize a identidade visual do seu site em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4 mr-2" />Descartar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Color */}
        <div className="bg-card rounded-2xl border p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-bold">Cor Principal (Verde/Marca)</Label>
            <div 
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg" 
              style={{ backgroundColor: `hsl(${settings['theme_primary']})` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Usada em botões principais, ícones de destaque e elementos da marca.</p>
          <input 
            type="color" 
            value={hslNumbersToHex(settings['theme_primary'] || "145 45% 28%")} 
            onChange={(e) => updateColor('theme_primary', e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        {/* Accent Color */}
        <div className="bg-card rounded-2xl border p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-bold">Cor de Destaque (Laranja/Coral)</Label>
            <div 
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg" 
              style={{ backgroundColor: `hsl(${settings['theme_accent']})` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Usada para chamar atenção, como no banner do blog e botões de ação secundários.</p>
          <input 
            type="color" 
            value={hslNumbersToHex(settings['theme_accent'] || "42 80% 55%")} 
            onChange={(e) => updateColor('theme_accent', e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
        <h3 className="font-bold text-primary mb-2">Dica de Design</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tente manter um contraste harmônico. Cores muito claras podem dificultar a leitura de textos brancos sobrepostos. 
          O verde escuro e o laranja coral são a base da identidade do Eco-Wanderlust.
        </p>
      </div>
    </div>
  );
};

export default AdminTheme;
