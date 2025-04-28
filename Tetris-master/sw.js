const CACHE = "v17";
const urlsToCache =[

  '/',
  '/dist/tetris.js',
  '/css/styles.css',
  '/index.html',
  



]
self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(urlsToCache))
  );
});

