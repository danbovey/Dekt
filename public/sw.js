const sw_version = 'v1';

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(sw_version)
            .then(cache => cache.addAll([
                '/',
                '/build/bundle.js',
                '/build/style.css',

                '/build/BlackTie-Bold-webfont.eot',
                '/build/BlackTie-Bold-webfont.svg',
                '/build/BlackTie-Bold-webfont.ttf',
                '/build/BlackTie-Bold-webfont.woff',
                '/build/BlackTie-Bold-webfont.woff2',

                '/config.json',
                '/img/logo.svg',
                '/img/poster.png',
                '/img/poster-bg.jpg',
            ]))
    );
});

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if(response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
