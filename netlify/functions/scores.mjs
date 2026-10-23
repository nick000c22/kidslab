// Family leaderboard API for Kids Lab, served at /api/scores.
//   GET  /api/scores           -> { ok, players: { id: { stars, week, tests } }, at }
//   POST /api/scores {events}  -> saves star events from an iPad (safe to resend: duplicates are ignored)
// Scores live in Netlify Blobs, one small JSON document per player.
import { getStore } from "@netlify/blobs";

const TZ = "Pacific/Auckland";
const KEEP_IDS = 3000; // recent event ids remembered per player, to ignore resends

// Monday (NZ time) of the week containing `date`, as "YYYY-MM-DD".
export function weekStart(date) {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const [y, m, d] = ymd.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
  return day.toISOString().slice(0, 10);
}

export function emptyDoc() {
  return { stars: 0, tests: 0, week: { start: "", stars: 0 }, ids: [] };
}

// Apply events to a player's document. Returns how many were new.
export function applyEvents(doc, events) {
  const seen = new Set(doc.ids);
  let added = 0;
  for (const ev of events) {
    if (!ev || typeof ev.id !== "string" || seen.has(ev.id)) continue;
    const stars = Math.max(0, Math.min(50, Number(ev.stars) || 0)); // sanity cap per event
    const t = new Date(ev.t);
    const when = isNaN(t) ? new Date() : t;
    const ws = weekStart(when);
    if (stars) {
      doc.stars += stars;
      if (ws === doc.week.start) doc.week.stars += stars;
      else if (ws > doc.week.start) doc.week = { start: ws, stars };
      // events from an earlier week only count towards all-time
    }
    if (ev.kind === "test_passed") doc.tests += 1;
    seen.add(ev.id);
    doc.ids.push(ev.id);
    added++;
  }
  if (doc.ids.length > KEEP_IDS) doc.ids = doc.ids.slice(-KEEP_IDS);
  return added;
}

export function publicView(doc, now = new Date()) {
  return { stars: doc.stars, tests: doc.tests, week: doc.week.start === weekStart(now) ? doc.week.stars : 0 };
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const validId = (id) => typeof id === "string" && /^[a-z0-9_-]{1,40}$/.test(id);

export default async (req) => {
  const store = getStore({ name: "kidslab-scores", consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "player/" });
    const players = {};
    await Promise.all(blobs.map(async ({ key }) => {
      const doc = await store.get(key, { type: "json" });
      if (doc) players[key.slice(7)] = publicView(doc);
    }));
    return json({ ok: true, players, at: new Date().toISOString() });
  }

  if (req.method === "POST") {
    let body;
    try { body = JSON.parse(await req.text()); } catch { return json({ ok: false, error: "Bad JSON" }, 400); }
    const events = Array.isArray(body && body.events) ? body.events.slice(0, 500) : [];
    const byPlayer = {};
    for (const ev of events) if (ev && validId(ev.player)) (byPlayer[ev.player] ||= []).push(ev);
    let saved = 0;
    for (const [id, evs] of Object.entries(byPlayer)) {
      const key = "player/" + id;
      const doc = (await store.get(key, { type: "json" })) || emptyDoc();
      const n = applyEvents(doc, evs);
      if (n) { await store.setJSON(key, doc); saved += n; }
    }
    return json({ ok: true, saved });
  }

  return json({ ok: false, error: "Method not allowed" }, 405);
};

export const config = { path: "/api/scores" };
