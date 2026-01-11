const CACHE_NAME = 'crodyto-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching essential assets');
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('Precache failed for some files', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (request.url.includes('firebaseapp.com') || request.url.includes('googleapis.com')) {
    // Network-first for Firebase/API calls
    event.respondWith(
      fetch(request)
        .then(res => {
          if (!res || res.status !== 200) return res;
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, resClone);
          });
          return res;
        })
        .catch(() => caches.match(request) || caches.match('/index.html'))
    );
    return;
  }
  
  // Cache-first for static assets, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type === 'error') return res;
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, resClone);
          });
          return res;
        })
        .catch(() => {
          // Offline fallback
          if (request.destination === 'image') {
            return caches.match('/icons/icon-192.svg');
          }
          return caches.match('/index.html');
        });
    })
  );
});
