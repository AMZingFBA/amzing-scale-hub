// Service Worker pour cache et performance optimale
// Bump this version whenever we need to force clients to refresh cached assets.
const CACHE_VERSION = 'amzing-fba-v6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.png',
  '/amzing-logo-checkout.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes vers des domaines externes sauf images
  const url = new URL(request.url);
  if (url.origin !== location.origin && request.destination !== 'image') {
    return;
  }

  // Navigation (HTML) : Network-first, pas de cache pour éviter les bundles obsolètes
  // Un index.html en cache pointant vers un chunk JS supprimé déclenche des erreurs aléatoires.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Scripts/styles : Network-only (les noms sont hashés, pas de risque de stale)
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        // Met en cache uniquement les assets "stables" (images, fonts)
        if (response.status === 200 && (request.destination === 'image' || request.destination === 'font')) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});

  // Scripts/styles : Network-only (les noms sont hashés, pas de risque de stale)
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        // Met en cache uniquement les assets "stables" (images, fonts)
        if (response.status === 200 && (request.destination === 'image' || request.destination === 'font')) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});
