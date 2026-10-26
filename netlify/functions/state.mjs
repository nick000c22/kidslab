// Kids Lab family state, served at /api/state.
//   GET                                   -> { ok, roster, pets, scores, hasPin, at }
//   POST {action:"pet", player, pet}      -> a kid's iPad saving its teddy (newest updatedAt wins)
//   POST {action:"setPin", pin, oldPin}   -> create the grown-ups PIN (or change it with the old one)
//   POST {action:"checkPin", pin}         -> { ok } if the PIN is right
//   POST {action:"admin", pin, roster, pets, scores} -> grown-ups page saving everything
import { getStore } from "@netlify/blobs";
import { createHash, randomBytes } from "node:crypto";
import { emptyDoc, publicView, weekStart } from "./scores.mjs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const validId = (id) => typeof id === "string" && /^[a-z0-9_-]{1,40}$/.test(id);
const hash = (pin, salt) => createHash("sha256").update(salt + ":" + String(pin)).digest("hex");

const COLORS = ["grape", "leaf", "sun", "sky", "berry", "tang"];
function cleanPlayer(p) {
  if (!p || !validId(p.id)) return null;
  return {
    id: p.id,
    name: String(p.name || p.id).slice(0, 24),
    emoji: String(p.emoji || "🙂").slice(0, 8),
    color: COLORS.includes(p.color) ? p.color : "grape",
    age: p.age === "" || p.age == null ? null : Math.max(0, Math.min(99, Number(p.age) || 0)),
    hidden: !!p.hidden,
    gender: p.gender === "girl" || p.gender === "boy" ? p.gender : null
  };
}

// Keep teddy docs to known fields and sane sizes.
const PET_FIELDS = ["name", "hatched", "hatchedAt", "fur", "belly", "wear", "unlockAll", "fedUpTo", "grapesEaten",
  "weight", "tummy", "tummyAt", "happy", "happyAt", "dances", "lastSeen", "asleep", "seen", "stage", "updatedAt", "grapes", "grapesEarned", "owned", "ownedFurs", "done", "stats", "practice", "fit", "fitV", "tokens", "battleDay", "lastBattleSeen", "days", "mistakes", "fights", "locks", "car"];
function cleanPet(p) {
  const out = {};
  if (!p || typeof p !== "object") return out;
  for (const k of PET_FIELDS) if (p[k] !== undefined) out[k] = p[k];
  if (typeof out.name === "string") out.name = out.name.slice(0, 16);
  if (out.wear && typeof out.wear !== "object") delete out.wear;
  if (Array.isArray(out.seen)) out.seen = out.seen.slice(0, 50);
  return out;
}

async function verify(store, pin) {
  const a = await store.get("admin", { type: "json" });
  return !!(a && a.hash === hash(pin, a.salt));
}

export async function handle(req, store) {
  if (req.method === "GET") {
    const roster = await store.get("roster", { type: "json" });
    const admin = await store.get("admin", { type: "json" });
    const pets = {}, scores = {};
    const [petList, scoreList] = await Promise.all([store.list({ prefix: "pet/" }), store.list({ prefix: "player/" })]);
    await Promise.all(petList.blobs.map(async ({ key }) => { const d = await store.get(key, { type: "json" }); if (d) pets[key.slice(4)] = d; }));
    await Promise.all(scoreList.blobs.map(async ({ key }) => { const d = await store.get(key, { type: "json" }); if (d) scores[key.slice(7)] = publicView(d); }));
    const battles = ((await store.get("battles", { type: "json" })) || []).slice(-100);
    return json({ ok: true, roster: roster ? roster.players : null, pets, scores, battles, hasPin: !!admin, at: new Date().toISOString() });
  }
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let body;
  try { body = JSON.parse(await req.text()); } catch { return json({ ok: false, error: "Bad JSON" }, 400); }
  const action = body && body.action;

  if (action === "pet") {
    if (!validId(body.player)) return json({ ok: false, error: "Bad player" }, 400);
    const incoming = cleanPet(body.pet);
    const key = "pet/" + body.player;
    const current = await store.get(key, { type: "json" });
    if (current && (current.updatedAt || "") > (incoming.updatedAt || "")) return json({ ok: true, kept: "server", pet: current });
    await store.setJSON(key, incoming);
    return json({ ok: true, kept: "yours" });
  }

  // A teddy battle that already happened on one iPad: kept so the other kid can see it.
  if (action === "battle") {
    const b = body.battle || {};
    if (!validId(b.a) || !validId(b.b) || (b.winner !== b.a && b.winner !== b.b)) return json({ ok: false, error: "Bad battle" }, 400);
    const log = (await store.get("battles", { type: "json" })) || [];
    log.push({ id: String(b.id || Date.now()).slice(0, 40), at: new Date().toISOString(), a: b.a, b: b.b, winner: b.winner,
      aName: String(b.aName || "").slice(0, 16), bName: String(b.bName || "").slice(0, 16) });
    await store.setJSON("battles", log.slice(-300));
    return json({ ok: true });
  }

  if (action === "setPin") {
    const pin = String(body.pin || "");
    if (!/^\d{4,8}$/.test(pin)) return json({ ok: false, error: "PIN must be 4 to 8 digits" }, 400);
    const existing = await store.get("admin", { type: "json" });
    if (existing && !(await verify(store, body.oldPin))) return json({ ok: false, error: "Old PIN is wrong" }, 403);
    const salt = randomBytes(8).toString("hex");
    await store.setJSON("admin", { salt, hash: hash(pin, salt) });
    return json({ ok: true });
  }

  if (action === "checkPin") return json({ ok: await verify(store, body.pin) });

  if (action === "admin") {
    if (!(await verify(store, body.pin))) return json({ ok: false, error: "Wrong PIN" }, 403);
    const now = new Date();
    if (Array.isArray(body.roster)) {
      const seen = new Set();
      const players = body.roster.map(cleanPlayer).filter((p) => p && !seen.has(p.id) && seen.add(p.id));
      await store.setJSON("roster", { players, updatedAt: now.toISOString() });
    }
    for (const [id, pet] of Object.entries(body.pets || {})) {
      if (!validId(id)) continue;
      const p = cleanPet(pet); p.updatedAt = now.toISOString();
      await store.setJSON("pet/" + id, p);
    }
    for (const [id, s] of Object.entries(body.scores || {})) {
      if (!validId(id) || !s) continue;
      const key = "player/" + id;
      const doc = (await store.get(key, { type: "json" })) || emptyDoc();
      if (s.stars != null) doc.stars = Math.max(0, Math.round(Number(s.stars) || 0));
      if (s.week != null) doc.week = { start: weekStart(now), stars: Math.max(0, Math.round(Number(s.week) || 0)) };
      if (s.tests != null) doc.tests = Math.max(0, Math.round(Number(s.tests) || 0));
      await store.setJSON(key, doc);
    }
    return json({ ok: true });
  }

  return json({ ok: false, error: "Unknown action" }, 400);
}

export default async (req) => handle(req, getStore({ name: "kidslab-scores", consistency: "strong" }));

export const config = { path: "/api/state" };
