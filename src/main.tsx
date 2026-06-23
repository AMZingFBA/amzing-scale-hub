import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Service Worker désactivé : on désinscrit toute ancienne installation
// et on purge les caches pour éviter les bundles obsolètes (erreurs
// "Invalid character: '#'" et MIME octet-stream sur les chunks JS).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length > 0) {
        // Charge la version kill-switch puis on la désinscrira au prochain tour.
        await navigator.serviceWorker.register('/sw.js').catch(() => {});
        await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      // silent
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
