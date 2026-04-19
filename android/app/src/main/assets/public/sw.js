// Service Worker pour cache et performance optimale
const CACHE_VERSION = 'amzing-fba-v1';
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
  if (url.origin !== location.origin && !request.destination === 'image') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone la réponse car elle ne peut être consommée qu'une fois
        const responseClone = response.clone();
        
        // Met en cache les réponses réussies
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, retourne depuis le cache
        return caches.match(request);
      })
  );
});
