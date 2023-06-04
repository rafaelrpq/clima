var CACHE_NAME = 'clima-cache';
var urlsToCache = [
  './index.html',
  './index.css',
  './manifest.json',
  './index.js',
  './res/clima128.png',
];

self.addEventListener('install', function(event) {

//     event.waitUntil(
//         caches.open (CACHE_NAME)
//         .then(function(cache) {
//             console.log('Opened cache');
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener ('fetch', (event) => {
//     event.respondWith (
//         caches.match (event.request)
//         .then (cacheResponse => (cacheResponse || fetch (event).request))
//     )

    event.respondWith ((
        async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            const response = await fetch(event.request);

            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            if (urlsToCache) {
                const responseToCache = response.clone();
                const cache = await caches.open(CACHE_NAME)
                await cache.put(event.request, response.clone());
                // await cache.addAll(urlsToCache);
            }

        return response;
    }) ());

})
