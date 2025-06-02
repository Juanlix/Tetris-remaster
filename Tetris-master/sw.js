// Nombre y versión del caché
const CACHE_NAME = "v19.4";
const urlsToCache = [
  './',
  './dist/tetris.js',
  './css/styles.css',
  './index.html',
  './manifest.json',
  './icons/192.png',
  './icons/512.png'
];

// Instalación del Service Worker y cacheo de archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage("SW instalado y cacheado"));
  });
});

// Intercepta las peticiones y sirve desde el caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en cache, intenta buscar en la red
        return fetch(event.request)
          .then((networkResponse) => {
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fallo de red:', error);
            return new Response('Offline y sin cache disponible', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
      .catch((error) => {
        console.error('Error general en fetch handler:', error);
        return new Response('Error en el SW', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Limpieza de cachés antiguos al activar un nuevo Service Worker
self.addEventListener('activate', (event) => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!whitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage("SW activado y cachés antiguos eliminados"));
  });
});
