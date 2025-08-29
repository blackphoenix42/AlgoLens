/* service-worker.js
   Scope: "/" (place this file in /public so it's served at /service-worker.js)
   Register from your app (early): navigator.serviceWorker.register("/service-worker.js");
*/

const APP_VERSION = "v0.1.0"; // update on deploys (or replace at build time)
const PREFIX = "algolens";
const STATIC_CACHE = `${PREFIX}-static-${APP_VERSION}`;
const PAGE_CACHE = `${PREFIX}-pages-${APP_VERSION}`;
const ASSET_CACHE = `${PREFIX}-assets-${APP_VERSION}`;
const IMAGE_CACHE = `${PREFIX}-images-${APP_VERSION}`;
const FONT_CACHE = `${PREFIX}-fonts-${APP_VERSION}`;
const MAX_IMAGE_ENTRIES = 80;
const MAX_FONT_ENTRIES = 20;

const OFFLINE_URL = "/offline.html";

// Minimal precache. (Avoid listing hashed assets; handle those at runtime.)
const PRECACHE_URLS = [
    "/",               // boot route
    "/index.html",
    "/manifest.json",
    OFFLINE_URL,
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/maskable-512.png"
];

// Enable Navigation Preload (if available) for faster navigations
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        if ("navigationPreload" in self.registration) {
            await self.registration.navigationPreload.enable();
        }
        // Clean old caches
        const keep = new Set([STATIC_CACHE, PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE, FONT_CACHE]);
        const names = await caches.keys();
        await Promise.all(names.map((n) => (keep.has(n) ? null : caches.delete(n))));
        await self.clients.claim();
    })());
});

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(PRECACHE_URLS);
    })());
    // Activate immediately on install (you can remove if you prefer a softer update)
    self.skipWaiting();
});

self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") self.skipWaiting();
});

// Main fetch strategy router
self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);

    // Only handle same-origin by default; let cross-origin pass through
    const sameOrigin = url.origin === self.location.origin;

    // Don’t try to cache analytics/telemetry; fail fast for speed/stability
    if (/google-analytics|googletagmanager|sentry|percy|stats|vitals/.test(url.hostname)) {
        return;
    }

    // Navigation requests: network-first with offline fallback
    if (req.mode === "navigate") {
        event.respondWith(handleNavigation(event));
        return;
    }

    // Static assets by extension
    if (sameOrigin) {
        const pathname = url.pathname;
        if (/\.(?:js|mjs|css|map)$/.test(pathname)) {
            event.respondWith(staleWhileRevalidate(req, ASSET_CACHE));
            return;
        }
        if (/\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$/.test(pathname)) {
            event.respondWith(cacheFirstWithLimit(req, IMAGE_CACHE, MAX_IMAGE_ENTRIES));
            return;
        }
        if (/\.(?:woff2?|ttf|otf|eot)$/.test(pathname)) {
            event.respondWith(cacheFirstWithLimit(req, FONT_CACHE, MAX_FONT_ENTRIES));
            return;
        }
        if (/\.(?:json|txt)$/.test(pathname)) {
            event.respondWith(staleWhileRevalidate(req, STATIC_CACHE));
            return;
        }
    }

    // Fallback: try cache, then network
    event.respondWith(cacheFallingBackToNetwork(req, STATIC_CACHE));
});

// --- Strategies ---

async function handleNavigation(event) {
    // Try navigation preload if available (faster HTML)
    let preload = undefined;
    if ("navigationPreload" in self.registration) {
        preload = event.preloadResponse;
    }

    try {
        const response = await (preload || fetch(event.request));
        const copy = response.clone();
        // Cache page HTML for offline
        const pageCache = await caches.open(PAGE_CACHE);
        pageCache.put(event.request, copy);
        return response;
    } catch {
        // Network failed — serve last cached page or offline fallback
        const pageCache = await caches.open(PAGE_CACHE);
        const cached = await pageCache.match(event.request, { ignoreSearch: true }) ||
            await caches.match(OFFLINE_URL, { ignoreSearch: true });
        return cached || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((res) => {
            if (res && res.status === 200) cache.put(request, res.clone());
            return res;
        })
        .catch(() => null);

    // Return cache immediately if present; else wait for network
    return cached || (await networkPromise) || fetch(request);
}

async function cacheFirstWithLimit(request, cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const res = await fetch(request);
        if (res && res.status === 200) {
            await cache.put(request, res.clone());
            trimCache(cache, maxEntries).catch(() => { });
        }
        return res;
    } catch {
        // If fetch fails and we have nothing cached, propagate
        return new Response("", { status: 504 });
    }
}

async function cacheFallingBackToNetwork(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
        const res = await fetch(request);
        if (res && res.status === 200) cache.put(request, res.clone());
        return res;
    } catch {
        return new Response("", { status: 504 });
    }
}

// Keep cache sizes in check (oldest entries pruned)
async function trimCache(cache, maxEntries) {
    const keys = await cache.keys();
    if (keys.length <= maxEntries) return;
    const toDelete = keys.length - maxEntries;
    for (let i = 0; i < toDelete; i++) {
        await cache.delete(keys[i]);
    }
}
