
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get or create session_id
        let sessionId = sessionStorage.getItem("site_session_id");
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem("site_session_id", sessionId);
        }

        const payload = {
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: sessionId,
        };

        // Call our Edge Function
        await supabase.functions.invoke("track-visit", {
          body: payload,
        });
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, [location.pathname, location.search]); // Track on path or query param changes
};
