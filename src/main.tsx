import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Check if the root has real content (not just comments or empty whitespace)
const hasSSRContent = rootElement.innerHTML.trim().length > 0 && !rootElement.innerHTML.includes('<!--ssr-outlet-->');

if (hasSSRContent) {
  hydrateRoot(rootElement, (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  ));
} else {
  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
