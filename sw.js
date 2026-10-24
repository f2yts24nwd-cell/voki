// Service Worker: hält die App offline verfügbar.
// Strategie "zuerst online": Neue Versionen erscheinen sofort, die gespeicherten
// Dateien werden nur benutzt, wenn kein Internet da ist (oder es zu lange dauert).
// Bei Änderungen an den Dateien VERSION erhöhen (und APP_VERSION in js/app.js).
const VERSION = 'voki-v4';
const NETWORK_TIMEOUT = 4000;
const FILES = [
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/app.js',
  'js/pad.js',
  'js/recognizer.js',
  'js/check.js',
  'js/store.js',
  'js/vocab.js',
  'js/vocab-fr.js',
  'js/grammar.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' – immer frisch vom Server holen, nie aus dem Browser-Zwischenspeicher
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Nur eigene Dateien, die Handschrifterkennung läuft immer übers Netz
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  url.hash = '';

  const network = fetch(url.href, { cache: 'no-cache' }).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(url.href, copy));
    }
    return res;
  });
  e.waitUntil(network.catch(() => {}));

  e.respondWith((async () => {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT));
      return await Promise.race([network, timeout]);
    } catch {
      const cached = await caches.match(url.href, { ignoreSearch: true });
      return cached || network;
    }
  })());
});
