import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to the element matching the URL hash.
 * Handles both initial load and hash changes during navigation.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to allow lazy-loaded components to render
      const timeoutId = setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // 300ms is usually enough for lazy loading and layout shifts

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, hash]);

  return null;
}
