const CACHE_NAME = 'keeng-saas-cache-v5';

// Oflayn ishlashi uchun xotiraga olinadigan fayllar ro'yxati
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://telegram.org/js/telegram-web-app.js',
    'https://unpkg.com/html5-qrcode',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// O'rnatish va xotiraga yuklash
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Fayllar oflayn ishlash uchun keshlandi');
            return cache.addAll(urlsToCache);
        })
    );
});

// Eski keshni tozalash (Yangi versiya chiqqanda)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Internet yo'q bo'lsa xotiradan (oflayn) ochish
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            console.log("Internet yo'q, xotirada ham topilmadi.");
        })
    );
});