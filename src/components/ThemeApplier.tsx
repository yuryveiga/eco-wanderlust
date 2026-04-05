import { useEffect } from "react";
import { useSiteData } from "@/hooks/useSiteData";

export function ThemeApplier() {
  const { siteSettings } = useSiteData();

  useEffect(() => {
    // Basic settings to fetch from DB
    const primary = siteSettings['theme_primary'];
    const accent = siteSettings['theme_accent'];
    
    if (primary || accent) {
      const styleId = 'dynamic-theme-style';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // We inject the :root and .dark rules
      // Primary and accent in HSL format "145 45% 28%"
      const css = `
        :root {
          ${primary ? `--primary: ${primary}; --ring: ${primary}; --sidebar-primary: ${primary};` : ''}
          ${accent ? `--accent: ${accent};` : ''}
        }
        .dark {
          ${primary ? `--primary: ${primary}; --ring: ${primary}; --sidebar-primary: ${primary};` : ''}
          ${accent ? `--accent: ${accent};` : ''}
        }
      `;
      styleElement.innerHTML = css;
    }
  }, [siteSettings]);

  return null;
}
