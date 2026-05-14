// Empty service worker placeholder. This prevents old cache logic from breaking Vite assets.
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
