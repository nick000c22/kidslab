/* Kids Lab shared toolkit — used by the home screen and every lesson.
   In a lesson:  <script src="../config.js"></script><script src="../kit.js"></script>
   Then:  KidsLab.player()  KidsLab.say("Well done!")  KidsLab.addStars(1)
          KidsLab.celebrate()  KidsLab.home()  KidsLab.backButton()          */
(function () {
  var PREFIX = "kidslab.";

  function get(key, fallback) {
    try {
      var v = localStorage.getItem(PREFIX + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) {}
  }

  var cfg = window.KIDSLAB_CONFIG || { players: [], lessons: [] };
  cfg._basePlayers = (cfg.players || []).slice();

  // Friendly voice for non-readers. Prefers NZ, then GB/AU English.
  var voice = null;
  // Voices: girls get a warm female voice, boys a friendly male one. iPads name their voices,
  // so we pick by name, preferring the higher-quality "Enhanced"/"Premium" versions when installed.
  var FEMALE = ["Karen", "Kate", "Serena", "Martha", "Catherine", "Moira", "Tessa", "Fiona", "Samantha", "Allison", "Ava", "Susan", "Zoe", "Nicky", "Victoria", "Google UK English Female", "Female"];
  var MALE = ["Daniel", "Arthur", "Lee", "Gordon", "Oliver", "Aaron", "Rishi", "Fred", "Tom", "Alex", "Google UK English Male", "Male"];
  var voices = { female: null, male: null, any: null };
  function rank(v, names) {
    var nm = v.name || "", lang = (v.lang || "").replace("_", "-"), i = -1;
    for (var k = 0; k < names.length; k++) if (nm.indexOf(names[k]) !== -1) { i = k; break; }
    if (i === -1 || lang.indexOf("en") !== 0) return -1;
    var score = 100 - i;
    if (/Enhanced|Premium|Neural/i.test(nm)) score += 200;
    if (lang === "en-NZ" || lang === "en-AU") score += 40; else if (lang === "en-GB") score += 30;
    return score;
  }
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    var vs = speechSynthesis.getVoices();
    ["female", "male"].forEach(function (g) {
      var best = null, bs = -1, names = g === "female" ? FEMALE : MALE;
      vs.forEach(function (v) { var r = rank(v, names); if (r > bs) { bs = r; best = v; } });
      voices[g] = best;
    });
    var order = ["en-NZ", "en-GB", "en-AU", "en-US"];
    for (var i = 0; i < order.length && !voices.any; i++)
      for (var j = 0; j < vs.length; j++) if (vs[j].lang.replace("_", "-") === order[i]) { voices.any = vs[j]; break; }
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  // Girl or boy for the current kid: grown-ups page setting first, then config.js.
  function gender(p) {
    p = p || player();
    if (!p) return null;
    if (p.gender) return p.gender;
    var base = (window.KIDSLAB_CONFIG && KIDSLAB_CONFIG._basePlayers || []).filter(function (x) { return x.id === p.id; })[0];
    return base && base.gender || null;
  }

  function say(text) {
    if (!get("sound", true) || !("speechSynthesis" in window) || !text) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text), g = gender();
      var v = g === "girl" ? voices.female : g === "boy" ? voices.male : null;
      v = v || voices.any;
      if (v) { u.voice = v; u.lang = v.lang; }
      if (g === "girl") { u.rate = 0.95; u.pitch = 1.1; }
      else if (g === "boy") { u.rate = 0.95; u.pitch = 1.05; }
      else { u.rate = 0.95; u.pitch = 1.15; }
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  function playerId() { return get("player", null); }
  function player() {
    var id = playerId();
    for (var i = 0; i < cfg.players.length; i++) if (cfg.players[i].id === id) return cfg.players[i];
    return null;
  }
  function setPlayer(id) { set("player", id); }

  /* ---------- stars + family scoreboard (Google Sheet) ----------
     Every star is saved as an "event". Events wait in a queue on this iPad
     and are sent to the Sheet whenever we're online. The Sheet adds them up. */
  var URL_ = (cfg.scoreboardUrl || "").trim();

  function deviceId() {
    var d = get("device", null);
    if (!d) { d = "ipad-" + Math.random().toString(36).slice(2, 8); set("device", d); }
    return d;
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function lessonName() {
    var m = location.pathname.match(/lessons\/([^\/]+)\.html$/);
    return m ? m[1] : "home";
  }
  function queue() { return get("queue", []); }
  function board() { return get("board", { players: {} }); }

  function pendingFor(id, kind) {
    return queue().reduce(function (s, e) { return s + (e.player === id && (!kind || e.kind === kind) ? (kind ? 1 : e.stars) : 0); }, 0);
  }

  function localStars(id) { return get("stars." + id, 0); }

  function stars(id) {
    id = id || playerId();
    if (!URL_) return localStars(id);
    var b = board().players[id];
    return (b ? b.stars : 0) + pendingFor(id);
  }

  function pushEvent(kind, n, lesson) {
    var id = playerId(); if (!id) return;
    var q = queue();
    q.push({ id: uid(), t: new Date().toISOString(), player: id, stars: n || 0, lesson: lesson || lessonName(), kind: kind, device: deviceId() });
    set("queue", q.slice(-2000));
    flush();
  }

  function addStars(n, lesson) {
    var id = playerId(); if (!id) return 0;
    n = n || 1;
    set("stars." + id, localStars(id) + n);
    if (URL_) pushEvent("stars", n, lesson);
    return stars(id);
  }

  // Non-star moments worth counting on the leaderboard, e.g. record("test_passed")
  function record(kind, lesson) { if (URL_) pushEvent(kind, 0, lesson); }

  // First time a device is connected to the Sheet, send the stars it already earned.
  function carryOver() {
    if (!URL_ || get("carried", false)) return;
    (cfg.players || []).forEach(function (p) {
      var s = localStars(p.id);
      if (s > 0) {
        var q = queue();
        q.push({ id: uid(), t: new Date().toISOString(), player: p.id, stars: s, lesson: "carry-over", kind: "stars", device: deviceId() });
        set("queue", q);
      }
    });
    set("carried", true);
  }

  var flushing = false;
  function flush() {
    if (!URL_ || flushing || !navigator.onLine) return Promise.resolve();
    var q = queue(); if (!q.length) return Promise.resolve();
    var batch = q.slice(0, 200);
    flushing = true;
    return fetch(URL_, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ events: batch }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) return;
        var sent = {}; batch.forEach(function (e) { sent[e.id] = 1; });
        // Fold what we just sent into the cached board so totals don't dip before the next fetch.
        var b = board();
        batch.forEach(function (e) {
          var p = b.players[e.player] || (b.players[e.player] = { stars: 0, week: 0, tests: 0 });
          p.stars += e.stars; p.week += e.stars; if (e.kind === "test_passed") p.tests++;
        });
        set("board", b);
        set("queue", queue().filter(function (e) { return !sent[e.id]; }));
      })
      .catch(function () {})
      .then(function () { flushing = false; if (queue().length && queue().length !== q.length) flush(); });
  }

  // Leaderboard rows for every player in config, best first.
  // Uses the Sheet when connected; otherwise this iPad's own stars.
  function leaderboard() {
    function rows(b) {
      return visiblePlayers().map(function (p) {
        var s = b ? (b.players[p.id] || { stars: 0, week: 0, tests: 0 }) : { stars: localStars(p.id), week: null, tests: null };
        var pend = URL_ ? pendingFor(p.id) : 0;
        return {
          player: p, stars: s.stars + pend,
          week: s.week == null ? null : s.week + pend,
          tests: s.tests == null ? null : s.tests + (URL_ ? pendingFor(p.id, "test_passed") : 0)
        };
      });
    }
    if (!URL_) return Promise.resolve({ connected: false, rows: rows(null) });
    return flush().then(function () {
      return fetch(URL_ + (URL_.indexOf("?") === -1 ? "?" : "&") + "t=" + Date.now()).then(function (r) { return r.json(); });
    }).then(function (res) {
      if (res && res.ok) set("board", { players: res.players || {}, at: res.at });
      return { connected: true, live: true, rows: rows(board()), at: board().at };
    }).catch(function () {
      return { connected: true, live: false, rows: rows(board()), at: board().at };
    });
  }

  /* ---------- family state: roster + teddies (edited on the grown-ups page) ---------- */
  var STATE_URL = URL_ ? URL_.replace(/scores\/?$/, "state") : "";
  var cachedRoster = get("roster", null);
  if (cachedRoster && cachedRoster.length) cfg.players = cachedRoster;

  function visiblePlayers() { return (cfg.players || []).filter(function (p) { return !p.hidden; }); }

  // Pulls the roster, scores and teddies from the server. Resolves with the response, or null when offline.
  function fetchState() {
    if (!STATE_URL) return Promise.resolve(null);
    return flush().then(function () { return fetch(STATE_URL + "?t=" + Date.now()); })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) return null;
        if (res.roster && res.roster.length) { cfg.players = res.roster; set("roster", res.roster); }
        set("board", { players: res.scores || {}, at: res.at });
        set("srvpets", res.pets || {});
        set("battles", res.battles || []);
        return res;
      }).catch(function () { return null; });
  }
  function serverPet(id) { return (get("srvpets", {}) || {})[id] || null; }

  // Battles are fire-and-forget; if offline they're simply not shared.
  function postBattle(b) {
    var log = get("battles", []); log.push(b); set("battles", log.slice(-100));
    if (!STATE_URL) return;
    fetch(STATE_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "battle", battle: b }) }).catch(function () {});
  }

  // Teddy saves wait here until the server has them.
  var petTimer = null;
  function pushPet(id, pet) {
    var q = get("petq", {}); q[id] = pet; set("petq", q);
    var sp = get("srvpets", {}); sp[id] = pet; set("srvpets", sp);
    clearTimeout(petTimer); petTimer = setTimeout(flushPets, 800);
  }
  function flushPets() {
    if (!STATE_URL || !navigator.onLine) return;
    var q = get("petq", {});
    Object.keys(q).forEach(function (id) {
      fetch(STATE_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "pet", player: id, pet: q[id] }) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok) return;
          var now = get("petq", {});
          if (now[id] && now[id].updatedAt === q[id].updatedAt) { delete now[id]; set("petq", now); }
          if (res.kept === "server" && res.pet) { var sp = get("srvpets", {}); sp[id] = res.pet; set("srvpets", sp); }
        }).catch(function () {});
    });
  }

  // Grapes: earned only by finishing the prime test, kept on the kid's teddy, spent on food and the shop.
  function petDoc(id) {
    var local = get("pet." + id, null), srv = serverPet(id);
    return srv && (!local || (srv.updatedAt || "") > (local.updatedAt || "")) ? srv : (local || {});
  }
  function grapes(id) { var d = petDoc(id || playerId()); return Math.max(0, Number(d.grapes) || 0); }
  function addGrapes(n) {
    var id = playerId(); if (!id) return 0;
    var d = JSON.parse(JSON.stringify(petDoc(id)));
    d.grapes = Math.max(0, (Number(d.grapes) || 0) + n);
    d.grapesEarned = (Number(d.grapesEarned) || 0) + n;
    d.updatedAt = new Date().toISOString();
    set("pet." + id, d);
    if (URL_) pushPet(id, d);
    return d.grapes;
  }

  // Lesson ticks: a lesson is "done" once its quiz has been completed.
  function markDone(lessonId) {
    var id = playerId(); if (!id || !lessonId) return;
    var d = JSON.parse(JSON.stringify(petDoc(id)));
    d.done = Array.isArray(d.done) ? d.done : [];
    if (d.done.indexOf(lessonId) === -1) d.done.push(lessonId);
    d.updatedAt = new Date().toISOString();
    set("pet." + id, d);
    if (URL_) pushPet(id, d);
  }
  function isDone(lessonId, id) {
    var d = petDoc(id || playerId());
    return Array.isArray(d.done) && d.done.indexOf(lessonId) !== -1;
  }

  // Right/wrong tally per lesson, for the grown-ups' lesson report. Also notes the last time it was played.
  function recordAnswer(lessonId, right) {
    var id = playerId(); if (!id || !lessonId) return;
    var d = JSON.parse(JSON.stringify(petDoc(id)));
    d.stats = d.stats && typeof d.stats === "object" ? d.stats : {};
    var st = d.stats[lessonId] || { r: 0, w: 0 };
    if (right) st.r++; else st.w++;
    st.at = new Date().toISOString();
    d.stats[lessonId] = st;
    d.updatedAt = st.at;
    set("pet." + id, d);
    if (URL_) pushPet(id, d);
  }
  // Lessons a grown-up has flagged for this kid to practise.
  function isPractice(lessonId, id) {
    var d = petDoc(id || playerId());
    return Array.isArray(d.practice) && d.practice.indexOf(lessonId) !== -1;
  }

  carryOver();
  window.addEventListener("online", function () { flush(); flushPets(); });
  setTimeout(function () { flush(); flushPets(); }, 1500);

  // Per-lesson progress, e.g. KidsLab.progress("prime-grapes", {level: 3})
  function progress(lessonId, value) {
    var key = "progress." + playerId() + "." + lessonId;
    if (value === undefined) return get(key, null);
    set(key, value);
  }

  // Emoji burst from the middle of the screen (or from an element).
  function celebrate(fromEl, emojis) {
    var pool = emojis || ["⭐", "🎉", "✨", "🌟"];
    var r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (var i = 0; i < (reduce ? 4 : 18); i++) {
      var s = document.createElement("span");
      s.textContent = pool[i % pool.length];
      s.setAttribute("aria-hidden", "true");
      var a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 160;
      s.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;font-size:" + (28 + Math.random() * 22) +
        "px;pointer-events:none;z-index:9999;transition:transform .9s cubic-bezier(.2,.8,.3,1),opacity .9s ease-in;transform:translate(-50%,-50%)";
      document.body.appendChild(s);
      (function (el, dx, dy) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transform = "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) rotate(" + (Math.random() * 120 - 60) + "deg)";
            el.style.opacity = "0";
          });
        });
        setTimeout(function () { el.remove(); }, 1000);
      })(s, Math.cos(a) * d, Math.sin(a) * d - 40);
    }
  }

  function home() {
    var inLesson = /\/lessons\//.test(location.pathname);
    location.href = inLesson ? "../index.html" : "index.html";
  }

  // Adds a big round "home" button to the top-left of a lesson.
  function backButton() {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Home");
    b.textContent = "🏠";
    b.style.cssText = "position:fixed;z-index:50;top:calc(12px + env(safe-area-inset-top,0px));left:calc(12px + env(safe-area-inset-left,0px));" +
      "width:64px;height:64px;border-radius:50%;border:0;font-size:32px;background:#fff;box-shadow:0 5px 0 rgba(0,0,0,.18);cursor:pointer;touch-action:manipulation";
    b.addEventListener("click", home);
    document.body.appendChild(b);
    return b;
  }

  window.KidsLab = {
    config: cfg, get: get, set: set, say: say,
    player: player, playerId: playerId, setPlayer: setPlayer,
    stars: stars, addStars: addStars, record: record, leaderboard: leaderboard, flush: flush,
    connected: !!URL_, progress: progress, gender: gender,
    fetchState: fetchState, serverPet: serverPet, postBattle: postBattle, grapes: grapes, addGrapes: addGrapes, markDone: markDone, isDone: isDone, recordAnswer: recordAnswer, isPractice: isPractice, pushPet: pushPet, visiblePlayers: visiblePlayers,
    celebrate: celebrate, home: home, backButton: backButton
  };
})();
