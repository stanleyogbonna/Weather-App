const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  'styles.css',
  'main.js',
  'asset/icons/01d.png',
  'asset/icons/01n.png',
  'asset/icons/02d.png',
  'asset/icons/02n.png',
  'asset/icons/03d.png',
  'asset/icons/03n.png',
  'asset/icons/04d.png',
  'asset/icons/04n.png',
  'asset/icons/09d.png',
  'asset/icons/09n.png',
  'asset/icons/10d.png',
  'asset/icons/10n.png',
  'asset/icons/11d.png',
  'asset/icons/11n.png',
  'asset/icons/13d.png',
  'asset/icons/13n.png',
  'asset/icons/50d.png',
  'asset/icons/50n.png',
  'asset/icons/unknown.png',
  'asset/weather.jpg'
];

// Call Install Event
self.addEventListener('install', (e) => {
  console.log('Service Worker Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
  console.log('Service Worker Activated');

  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
  console.log('service Worker: Fetching');
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request)));
})
