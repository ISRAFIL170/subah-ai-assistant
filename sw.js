const CACHE='subah-v4'; const ASSETS=['/','/manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>{ if(e.request.method==='GET' && new URL(e.request.url).origin===location.origin) e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
