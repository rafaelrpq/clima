var CACHE_NAME = 'notas-cache';
var urlsToCache = [
  './',
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
