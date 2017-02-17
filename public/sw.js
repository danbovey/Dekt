const sw_version = 'v1';

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(sw_version)
            .then(cache => cache.addAll([
                '/',
                '/build/bundle.js',
                '/build/style.css',
                '/config.json',
                '/img/logo.svg',
                '/img/poster.png',
                '/img/poster-bg.jpg',
            ]))
    );
});
