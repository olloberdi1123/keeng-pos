const CACHE_NAME = 'keeng-saas-cache-v1';

// Oflayn ishlashi uchun telefon xotirasiga saqlab olinadigan fayllar ro'yxati
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    // Tashqi kutubxonalar (Siz ishlatgan Firebase, QR skaner va Ikonkalar)
    'https://telegram.org/js/telegram-web-app.js',
    'https://unpkg.com/html5-qrcode',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. O'rnatish bosqichi (Fayllarni keshga yozish)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Fayllar xotiraga keshlandi (Oflayn ishlashga tayyor)');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Yangilanish bosqichi (Eski keshni tozalash)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski kesh tozalandi');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. So'rovlarni tutib olish (Internet yo'q bo'lsa keshdan berish)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Agar fayl keshda (telefonda) bor bo'lsa, o'shani qaytaramiz
                if (response) {
                    return response;
                }
                // Yo'q bo'lsa, odatiy tarzda internetdan yuklashga harakat qilamiz
                return fetch(event.request).catch(() => {
                    console.log("Internet yo'q, xotirada ham topilmadi: ", event.request.url);
                });
            })
    );
});