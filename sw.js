// Service Worker: hält die App offline verfügbar.
// Strategie "zuerst online": Neue Versionen erscheinen sofort, die gespeicherten
// Dateien werden nur benutzt, wenn kein Internet da ist (oder es zu lange dauert).
// Bei Änderungen an den Dateien VERSION erhöhen (und APP_VERSION in js/app.js).
const VERSION = 'voki-v15';
// Texterkennung für Fotos (vendor/tesseract, ca. 5–7 MB): wird erst beim ersten Benutzen geladen
// und dann in einem eigenen Speicher behalten. Die Dateien ändern sich nie – bei einem Update
// von Tesseract.js den Ordner umbenennen oder OCR_CACHE erhöhen.
const OCR_CACHE = 'voki-ocr-1';
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
  'js/comic.js',
  'js/lernen.js',
  'js/lernen-data.js',
  'js/quiz.js',
  'js/figures.js',
  'js/fach.js',
  'js/mathe-data.js',
  'js/bio-data.js',
  'js/geo-data.js',
  'js/maps.js',
  'js/photo-import.js',
  'js/ocr-table.js',
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
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== OCR_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Nur eigene Dateien
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  url.hash = '';

  // Texterkennung: zuerst aus dem Speicher, sonst laden und merken
  if (url.pathname.includes('/vendor/tesseract/')) {
    e.respondWith((async () => {
      const cache = await caches.open(OCR_CACHE);
      const hit = await cache.match(url.href, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(url.href);
      if (res.ok) await cache.put(url.href, res.clone());
      return res;
    })());
    return;
  }

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
