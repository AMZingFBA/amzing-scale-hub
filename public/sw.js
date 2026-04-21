// Service Worker pour cache et performance optimale
// Bump this version whenever we need to force clients to refresh cached assets.
const CACHE_VERSION = 'amzing-fba-v4';
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

  // Navigation (HTML) : Stale-while-revalidate
  // -> Sert immédiatement /index.html depuis le cache (retour onglet instantané, pas de reload visible)
  // -> Met à jour le cache en arrière-plan
  // Le hash dans les noms de fichiers JS/CSS (Vite) garantit que les nouveaux assets sont chargés.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
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
