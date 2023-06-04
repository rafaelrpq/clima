var CACHE_NAME = 'clima-cache';
var urlsToCache = [
  './index.html',
  './index.css',
  './manifest.json',
  './index.js',
  './res/clima128.png',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open (CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener ('fetch', (event) => {
    event.respondWith (
        caches.match (event.request)
        .then (cacheResponse => (cacheResponse || fetch (event).request))
    )
})
