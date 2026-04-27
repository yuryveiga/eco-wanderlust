import { useEffect, useState } from "react";
import { Gift, X, Copy, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { toast } from "sonner";

const STORAGE_KEY = "exit_intent_shown_at";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const COUPON = "BEMVINDO10";

export function ExitIntentPopup() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Já foi mostrado recentemente?
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      if (last && Date.now() - Number(last) < COOLDOWN_MS) return;
    } catch {}

    let shown = false;
    const trigger = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
    };

    // Desktop: exit-intent (mouse sai pela borda superior)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && e.relatedTarget === null) trigger();
    };

    // Mobile: scroll rápido para cima depois de já ter rolado
    let lastY = window.scrollY;
    let maxY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      maxY = Math.max(maxY, y);
      // se já rolou >800px e voltou >400px subitamente, dispara
      if (maxY > 800 && lastY - y > 200) trigger();
      lastY = y;
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON);
      setCopied(true);
      toast.success(`${COUPON} ✓`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar");
    }
  };

  const goToTours = () => {
    setOpen(false);
    document.getElementById("tours")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-accent via-accent to-accent/80 text-accent-foreground p-8 text-center relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/15 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Gift className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            {t("exit_title")}
          </h2>
          <p className="text-base font-sans opacity-95 mb-6">
            {t("exit_subtitle")}
          </p>

          <div className="bg-white/95 text-foreground rounded-xl p-4 mb-5">
            <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
              {t("exit_code_label")}
            </div>
            <button
              onClick={copyCode}
              className="flex items-center justify-center gap-2 w-full text-2xl font-mono font-bold tracking-widest text-accent hover:opacity-80 transition-opacity"
            >
              {COUPON}
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 opacity-60" />}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={goToTours}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-bold h-12"
            >
              {t("exit_cta")}
            </Button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm opacity-80 hover:opacity-100 underline-offset-4 hover:underline"
            >
              {t("exit_dismiss")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}