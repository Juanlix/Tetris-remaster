// 🔹 [PWA] Archivos a cachear
const CACHE_NAME = "v19.9";
const urlsToCache = [
  './',
  './dist/tetris.js',
  './css/styles.css',
  './index.html',
  './manifest.json',
  './icons/192.png',
  './icons/512.png'
];

// 🔹 [PWA] Al instalar el SW, se guarda en caché todo lo necesario
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

// 🔹 [PWA] Interceptar peticiones y servir desde caché si está disponible
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

// 🔹 [PWA] Limpieza de versiones antiguas del caché
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

// 🔹 [PWA] Notificaciones
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || '🔔 Notificación';
  const options = {
    body: data.body || '¡Volvé a jugar Tetris!',
    icon: 'icons/192.png',
    badge: 'icons/192.png'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
