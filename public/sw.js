// KILL SWITCH — Désinstallation automatique du Service Worker.
// Les anciennes versions servaient un index.html en cache pointant vers
// des chunks JS périmés (erreurs "Invalid character: '#'", MIME octet-stream).
// Ce SW se désinscrit lui-même et purge tous les caches dès qu'il s'active,
// puis recharge les pages ouvertes pour rétablir un état propre.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      // ignore
    }
    try {
      await self.registration.unregister();
    } catch (e) {
      // ignore
    }
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        try { client.navigate(client.url); } catch (_) {}
      });
    } catch (e) {
      // ignore
    }
  })());
});

// Ne jamais intercepter les requêtes — laisse le réseau gérer.
self.addEventListener('fetch', () => {});
