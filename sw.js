/* Nexora · service worker: guarda la "carcasa" de la app para que abra rápido y funcione sin conexión.
   Nunca guarda chats, respuestas de la IA ni datos de Google: solo los archivos propios de la web. */
const V = 'nexora-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // APIs de Google, Firebase y el proxy van siempre directas
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
