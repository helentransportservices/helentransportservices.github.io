/* Guarda a "casca" do app para abrir rápido. Os dados sempre vêm da internet. */
const C = 'hts-v2';
const SHELL = ['./', 'index.html', 'core.js', 'admin.js', 'driver.js', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (e.request.headers.has('range') || /\.(mp4|mov|jpg|jpeg|png|pdf)$/i.test(u.pathname)) return; /* vídeos e fotos: direto da internet */
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r }).catch(() => caches.match(e.request)));
});
