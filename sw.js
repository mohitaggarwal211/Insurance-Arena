// Insurance Arena Service Worker
// Strategy: NETWORK-FIRST for everything, falling back to cache when offline.
// This guarantees advisors always see the latest plan data when online,
// while still allowing the app to open offline with the last-known version.

const CACHE_NAME = 'insurance-arena-v1';

const PRECACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/data.js',
  '/js/annuity-data.js',
  '/js/anmol-data.js',
  '/js/nishchit-data.js',
  '/js/savings-income-data.js',
  '/js/ulip-data.js',
  '/js/learn-data.js',
  '/js/product-meta.js',
  '/js/avb-toolkit.js',
  '/js/new-features.js',
  '/js/arena-features.js',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests; let everything else pass through untouched
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Save a copy of successful responses for offline use
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
  );
});
