// Service Worker pour cache et performance optimale
// Bump this version whenever we need to force clients to refresh cached assets.
const CACHE_VERSION = 'amzing-fba-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
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

// Stratégie de cache: Network First avec fallback sur cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;
  
  // Ignorer les requêtes vers des domaines externes sauf images
  const url = new URL(request.url);
  if (url.origin !== location.origin && request.destination !== 'image') {
    return;
  }

  // IMPORTANT: éviter de servir un JS/HTML obsolète (problème de filtres non appliqués)
  // - Navigation (HTML) : Network-first sans fallback sur cache (sauf si offline -> cache)
  // - Scripts/styles : Network-only (pas de cache)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

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
