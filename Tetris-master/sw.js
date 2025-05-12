// Nombre y versión del caché
const CACHE_NAME = "v18";
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
      .then((response) => {
        if (response) {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage(`Recurso cargado desde caché: ${event.request.url}`));
          });
          return response;
        }
        return fetch(event.request);
      })
      .catch((err) => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage(`Error al cargar el recurso: ${event.request.url}`));
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
