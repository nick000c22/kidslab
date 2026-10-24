/* Kids Lab service worker.
   Network-first: when online, the iPad always gets your latest upload.
   When offline, it falls back to the last copy it saw. No version bumping needed. */
const CACHE = "kidslab-v4";
const CORE = [
  "./", "./index.html", "./config.js", "./kit.js", "./items.js", "./pet.js", "./pet.css", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Fonts: cache-first (they never change).
  if (url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com")) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res;
      }))
    );
    return;
  }

  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // leaderboard: always live, never cached

  // Own files: network-first, cache as fallback.
  e.respondWith(
    fetch(req, { cache: "no-store" }).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html")))
  );
});
