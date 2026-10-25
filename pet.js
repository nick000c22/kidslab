/* Math Teddy: each kid's tamagotchi-style pet.
   Egg -> hatches at 10 stars -> Baby -> Little (60) -> Big (150).
   Tummy and Happy hearts drift down slowly but never below one heart. If he's full he says "maybe later".
   Asleep after 2 days without play; tapping wakes him. Teddies sync to the server, and grown-ups can edit everything. */
(function () {
  var K = window.KidsLab;
  var HATCH = 10, SLEEP_AFTER = 2 * 864e5, TUMMY_EVERY = 8 * 36e5, HAPPY_EVERY = 12 * 36e5;
  var STAGES = [
    { id: 1, name: "Baby teddy", at: HATCH, scale: 0.62 },
    { id: 2, name: "Little teddy", at: 60, scale: 0.8 },
    { id: 3, name: "Big teddy", at: 150, scale: 1 }
  ];
  var T = window.TeddyItems, FURS = T.FURS, ITEMS = T.ITEMS;
  var PRIZES = ITEMS.filter(function (i) { return i.stars; });          // free, unlock with stars
  var SHOP = ITEMS.filter(function (i) { return i.price; });            // bought with grapes
  var SHOP_FURS = Object.keys(FURS).filter(function (k) { return FURS[k].price; });
  var BELLIES = ["+", "−", "×", "÷", "★", "♥", "7", "π"];
  var NAMES = ["Teddy", "Biscuit", "Grapey", "Honey", "Mr Bear", "Bubbles", "Cuddles", "Professor"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- state (local copy + server copy; newest wins) ---------- */
  function blank() {
    return { name: "", hatched: false, hatchedAt: null, fur: "brown", belly: "+", wear: {}, unlockAll: false,
      fedUpTo: null, grapes: null, grapesEarned: 0, grapesEaten: 0, weight: 0.5, tummy: 3, tummyAt: null, happy: 3, happyAt: null, dances: 0,
      lastSeen: null, asleep: false, seen: [], stage: 0, owned: [], ownedFurs: [], done: [], fit: { str: 0, end: 0, spd: 0, brn: 0 }, fitV: 2, tokens: 0, battleDay: null, lastBattleSeen: null, updatedAt: "" };
  }
  function load(id) {
    var local = K.get("pet." + id, null), srv = K.serverPet ? K.serverPet(id) : null;
    var pick = local;
    if (srv && (!local || (srv.updatedAt || "") > (local.updatedAt || ""))) pick = srv;
    var s = blank();
    if (pick) for (var k in pick) if (pick[k] !== undefined && pick[k] !== null) s[k] = pick[k];
    if (!s.wear || typeof s.wear !== "object") s.wear = {};
    if (!Array.isArray(s.owned)) s.owned = [];
    if (!Array.isArray(s.ownedFurs)) s.ownedFurs = [];
    if (!s.fit || typeof s.fit !== "object") s.fit = { str: 0, end: 0, spd: 0, brn: 0 };
    ["str", "end", "spd", "brn"].forEach(function (k) { s.fit[k] = Math.max(0, Number(s.fit[k]) || 0); });
    // Stats used to go to 30; now they go to 1000. Old teddies get theirs multiplied by 10 once.
    if (pick && pick.fit && pick.fitV !== 2) ["str", "end", "spd", "brn"].forEach(function (k) { s.fit[k] = Math.min(1000, s.fit[k] * 10); });
    s.fitV = 2;
    if (!FURS[s.fur]) s.fur = "brown";
    // Older teddies kept grapes as "stars since hatching"; carry up to 12 of those across once.
    if (s.grapes == null) s.grapes = s.hatched && s.fedUpTo != null ? Math.max(0, Math.min(12, K.stars(id) - s.fedUpTo)) : 0;
    return s;
  }
  function save(id, s) {
    s.updatedAt = new Date().toISOString();
    K.set("pet." + id, s);
    if (K.pushPet && K.connected) K.pushPet(id, s);
  }

  function hearts(s, k, every) {
    var v = s[k] == null ? 3 : s[k];
    var at = s[k + "At"] ? new Date(s[k + "At"]).getTime() : Date.now();
    return Math.max(1, Math.min(4, v - Math.floor((Date.now() - at) / every)));
  }
  function tummy(s) { return hearts(s, "tummy", TUMMY_EVERY); }
  function happy(s) { return hearts(s, "happy", HAPPY_EVERY); }
  function setHearts(s, k, v) { s[k] = Math.max(1, Math.min(4, v)); s[k + "At"] = new Date().toISOString(); }
  function heartRow(n) { var o = ""; for (var i = 0; i < 4; i++) o += i < n ? "♥" : "♡"; return o; }

  function stageFor(stars) { var st = 0; STAGES.forEach(function (S) { if (stars >= S.at) st = S.id; }); return st; }
  // Can he wear it? Star prizes unlock by stars; shop items must be bought. "unlockAll" (grown-ups) frees everything.
  function has(o, stars, s) { return !!(s.unlockAll || o.gift || (o.stars ? stars >= o.stars : s.owned.indexOf(o.id) !== -1)); }
  function hasFur(k, s) { return !FURS[k].price || s.unlockAll || s.ownedFurs.indexOf(k) !== -1; }
  var GIFTS = ITEMS.filter(function (i) { return i.gift; });            // free seasonal things (Halloween)
  function unlocked(stars, s) { return PRIZES.concat(GIFTS).filter(function (o) { return has(o, stars, s); }); }
  function nextGoal(stars, s) {
    if (!s.hatched) return { at: HATCH, from: 0, text: stars >= HATCH ? "Ready to hatch!" : "Hatch at " + HATCH + " ⭐" };
    var goals = STAGES.filter(function (S) { return S.at > HATCH; }).map(function (S) { return { at: S.at, text: "Grows into a " + S.name.toLowerCase() }; })
      .concat(PRIZES.filter(function (o) { return !s.unlockAll; }).map(function (o) { return { at: o.stars, text: "Unlocks the " + o.name.toLowerCase() + " " + o.icon }; }))
      .sort(function (a, b) { return a.at - b.at; });
    var prev = HATCH;
    for (var i = 0; i < goals.length; i++) { if (goals[i].at > stars) { goals[i].from = prev; return goals[i]; } prev = goals[i].at; }
    return null;
  }
  // Grapes are earned only by finishing the prime test (5 each time) and spent on food and the shop.
  function grapesWaiting(id, s) { return Math.max(0, Number(s.grapes) || 0); }
  function spend(s, n) { s.grapes = Math.max(0, (Number(s.grapes) || 0) - n); }
  function ageDays(s) { return s.hatchedAt ? Math.max(0, Math.floor((Date.now() - new Date(s.hatchedAt).getTime()) / 864e5)) : 0; }

  /* ---------- sound ---------- */
  var ac = null;
  function tone(freq, at, len, vol) {
    if (!K.get("sound", true)) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + (at || 0);
      o.type = "square"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.15));
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + (len || 0.15) + 0.05);
    } catch (e) {}
  }
  function jingle() { [523, 659, 784, 659, 880, 784, 1047].forEach(function (f, i) { tone(f, i * 0.14, 0.13); }); }
  function beep() { tone(1046, 0, 0.06); }
  function munchSound() { tone(220, 0, 0.07); tone(180, 0.12, 0.07); tone(240, 0.24, 0.07); }

  /* ---------- drawings ---------- */
  var INK = "#2B1A10", svgUid = 0;
  function teddySVG(stage, s) {
    s = s || {};
    var S = STAGES[(stage || 1) - 1] || STAGES[0], wear = s.wear || {}, F = FURS[s.fur] || FURS.brown;
    var belly = BELLIES.indexOf(s.belly) >= 0 ? s.belly : "+";
    var eye = s.fur === "cocoa" ? "#120A05" : INK;
    var head = stage === 1 ? ' transform="translate(100 132) scale(1.14) translate(-100 -132)"' : "";
    function item(slot) { var it = wear[slot] && T.BY_ID[wear[slot]]; return it && it.slot === slot ? it.svg : ""; }
    var defs = "", fur = F.fur;
    if (F.fur === "rainbow") {
      var gid = "rb" + (++svgUid);
      defs = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8A8A"/><stop offset=".2" stop-color="#FFC56B"/><stop offset=".4" stop-color="#FFF07A"/><stop offset=".6" stop-color="#8FE3A8"/><stop offset=".8" stop-color="#8CC8FF"/><stop offset="1" stop-color="#C9A2FF"/></linearGradient></defs>';
      fur = "url(#" + gid + ")";
    }
    var outline = F.outline ? ' stroke="' + F.outline + '" stroke-width="2"' : "";
    var sparkle = F.sparkle ? '<g class="sparkle" fill="#FFFFFF"><path d="M30 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"/><path d="M170 150 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z"/><path d="M36 196 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z"/></g>' : "";

    return '<svg class="teddy-svg" viewBox="0 -20 200 260" aria-hidden="true">' + defs +
      '<g transform="translate(100 236) scale(' + S.scale + ') translate(-100 -236)"><g class="rig">' +
      item("back") +
      '<ellipse cx="72" cy="222" rx="24" ry="15" fill="' + F.dark + '"/><ellipse cx="128" cy="222" rx="24" ry="15" fill="' + F.dark + '"/>' +
      '<ellipse cx="72" cy="224" rx="12" ry="7" fill="' + F.light + '"/><ellipse cx="128" cy="224" rx="12" ry="7" fill="' + F.light + '"/>' +
      '<ellipse cx="52" cy="168" rx="15" ry="28" fill="' + F.dark + '" transform="rotate(22 52 168)"/>' +
      '<ellipse cx="100" cy="178" rx="52" ry="47" fill="' + fur + '"' + outline + '/>' +
      '<ellipse cx="100" cy="184" rx="32" ry="30" fill="' + F.light + '"/>' +
      '<text x="100" y="186" text-anchor="middle" dominant-baseline="central" font-family="Baloo 2, Arial Rounded MT Bold, sans-serif" font-weight="800" font-size="36" fill="#6E44A8">' + belly + "</text>" +
      item("body") + item("feet") + item("neck") +
      '<g class="arm-r"><ellipse cx="148" cy="168" rx="15" ry="28" fill="' + F.dark + '" transform="rotate(-22 148 168)"/>' + item("hand") + "</g>" +
      "<g" + head + ">" +
      '<circle cx="56" cy="50" r="22" fill="' + fur + '"' + outline + '/><circle cx="56" cy="50" r="11" fill="' + F.light + '"/>' +
      '<circle cx="144" cy="50" r="22" fill="' + fur + '"' + outline + '/><circle cx="144" cy="50" r="11" fill="' + F.light + '"/>' +
      '<circle cx="100" cy="84" r="51" fill="' + fur + '"' + outline + '/>' +
      '<ellipse cx="100" cy="104" rx="26" ry="20" fill="' + F.light + '"/>' +
      '<ellipse cx="100" cy="95" rx="10" ry="7" fill="' + INK + '"/>' +
      '<path class="mouth-smile" d="M88 108 Q100 119 112 108" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse class="mouth-open" cx="100" cy="111" rx="9" ry="8" fill="#5A2A1A"/>' +
      '<g class="eye-open"><circle cx="82" cy="78" r="7" fill="' + eye + '"/><circle cx="118" cy="78" r="7" fill="' + eye + '"/><circle cx="84.5" cy="75.5" r="2.4" fill="#fff"/><circle cx="120.5" cy="75.5" r="2.4" fill="#fff"/></g>' +
      '<g class="eye-shut" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"><path d="M74 79 Q82 85 90 79"/><path d="M110 79 Q118 85 126 79"/></g>' +
      '<g class="eye-happy" stroke="' + INK + '" stroke-width="4.5" fill="none" stroke-linecap="round"><path d="M74 82 Q82 70 90 82"/><path d="M110 82 Q118 70 126 82"/></g>' +
      '<circle cx="66" cy="102" r="8" fill="#E89BA8" opacity=".75"/><circle cx="134" cy="102" r="8" fill="#E89BA8" opacity=".75"/>' +
      item("face") + item("hat") +
      "</g>" + sparkle + "</g></g></svg>";
  }

  var eggUid = 0;
  function eggSVG(cracks) {
    var u = "eg" + (++eggUid);
    var zig = "200,124 182,114 164,132 146,112 128,132 110,112 92,132 74,112 56,132 38,112 18,128 0,118";
    var shell =
      '<ellipse cx="100" cy="150" rx="62" ry="78" fill="#FFF4DE" stroke="#E8D5B5" stroke-width="4"/>' +
      '<g fill="#C3A2EC"><circle cx="72" cy="112" r="9"/><circle cx="124" cy="96" r="7"/><circle cx="132" cy="160" r="11"/><circle cx="80" cy="182" r="8"/><circle cx="104" cy="136" r="6"/><circle cx="110" cy="204" r="7"/></g>' +
      '<g stroke="#8A6A40" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="crack c1" d="M58 128 L72 120 L80 134 L92 122"/>' +
      '<path class="crack c2" d="M92 122 L104 136 L116 120 L126 134"/>' +
      '<path class="crack c3" d="M126 134 L136 118 L148 128 L160 120"/></g>';
    return '<svg class="egg-svg ' + (cracks ? "cr" + cracks : "") + '" viewBox="0 -20 200 260" aria-hidden="true">' +
      '<defs><clipPath id="' + u + 't"><polygon points="0,-20 200,-20 ' + zig + '"/></clipPath>' +
      '<clipPath id="' + u + 'b"><polygon points="' + zig + ' 0,260 200,260"/></clipPath></defs>' +
      '<g class="egg-rig"><g class="shell-bot" clip-path="url(#' + u + 'b)">' + shell + "</g>" +
      '<g class="shell-top" clip-path="url(#' + u + 't)">' + shell + "</g></g></svg>";
  }
  function zzz() { return '<div class="zzz" aria-hidden="true"><span>Z</span><span>z</span><span>z</span></div>'; }

  /* ---------- moves ---------- */
  var DANCES = ["d-wiggle", "d-jump", "d-spin", "d-groove", "d-wave"];
  function dance(holder, which) {
    if (!holder) return;
    var d = which || DANCES[Math.floor(Math.random() * DANCES.length)];
    DANCES.forEach(function (c) { holder.classList.remove(c); });
    void holder.offsetWidth;
    holder.classList.add(d, "happy");
    clearTimeout(holder._danceT);
    holder._danceT = setTimeout(function () { holder.classList.remove(d, "happy"); }, reduce ? 600 : 2000);
  }
  function startBlinking(holder) {
    clearInterval(holder._blinkT);
    holder._blinkT = setInterval(function () {
      if (!document.body.contains(holder)) return clearInterval(holder._blinkT);
      if (holder.classList.contains("sleeping") || holder.classList.contains("happy")) return;
      holder.classList.add("blink"); setTimeout(function () { holder.classList.remove("blink"); }, 150);
    }, 3800);
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var TAP_LINES = ["Hee hee! That tickles!", "Wanna see me dance?", "I love grapes!", "Let's find a prime number!", "You're my best friend!", "Boop!"];
  var EAT_LINES = ["Yum!", "Munch munch!", "Delicious grapes!", "Mmm, juicy!"];

  /* ---------- home-screen card ---------- */
  var cardEl = null;

  function arrive(id) {
    var s = load(id);
    if (s.hatched && s.lastSeen && Date.now() - new Date(s.lastSeen).getTime() > SLEEP_AFTER) s.asleep = true;
    s.lastSeen = new Date().toISOString();
    save(id, s);
  }

  function renderCard(el) {
    cardEl = el;
    var p = K.player(); if (!p || !el) return;
    var stars = K.stars(p.id), s = load(p.id), g = nextGoal(stars, s);
    var newThings = s.hatched && unlocked(stars, s).some(function (o) { return s.seen.indexOf(o.id) === -1; });
    var waiting = grapesWaiting(p.id, s);
    var bubble, sub;
    if (!s.hatched) {
      bubble = stars >= HATCH ? "Your egg is hatching! Tap it!" : "Hi " + p.name + "! Your egg needs " + (HATCH - stars) + " more ⭐";
      sub = "Mystery egg";
    } else {
      sub = s.name + " · " + STAGES[Math.max(1, stageFor(stars)) - 1].name + "  ·  Tummy " + heartRow(tummy(s)) + "  Happy " + heartRow(happy(s));
      bubble = s.asleep ? "Zzz… " + s.name + " is asleep. Tap to wake him!" : (waiting && tummy(s) <= 2 ? "Hi " + p.name + "! I'm hungry for grapes!" : "Hi " + p.name + "! 🍇 " + waiting + " grapes");
    }
    el.innerHTML = "";
    var b = document.createElement("button");
    b.type = "button"; b.className = "pet-card"; b.setAttribute("aria-label", "Open your teddy");
    var pet = document.createElement("div");
    pet.className = "pc-pet idle" + (!s.hatched && stars >= HATCH ? " ready" : "") + (s.asleep ? " sleeping" : "");
    pet.innerHTML = s.hatched ? teddySVG(stageFor(stars), s) + (s.asleep ? zzz() : "") : eggSVG(Math.min(3, Math.floor(stars / 4)));
    var txt = document.createElement("div"); txt.className = "pc-text";
    txt.innerHTML = '<div class="pc-bubble"></div><div class="pc-name"></div>';
    txt.querySelector(".pc-bubble").textContent = bubble;
    txt.querySelector(".pc-name").textContent = sub;
    if (g) {
      var pct = Math.max(0, Math.min(100, ((stars - g.from) / (g.at - g.from)) * 100));
      var bar = document.createElement("div"); bar.className = "goal-bar"; bar.innerHTML = "<span></span>";
      bar.firstChild.style.width = pct + "%";
      var gt = document.createElement("div"); gt.className = "goal-txt";
      gt.textContent = stars >= g.at ? g.text : "⭐ " + stars + " / " + g.at + "  ·  " + g.text;
      txt.appendChild(bar); txt.appendChild(gt);
    }
    b.appendChild(pet); b.appendChild(txt);
    if (newThings) { var n = document.createElement("span"); n.className = "pc-new"; n.textContent = "NEW!"; b.appendChild(n); }
    b.addEventListener("click", openRoom);
    el.appendChild(b);
    if (s.hatched && !s.asleep) startBlinking(pet);
  }

  /* ---------- the room: a tamagotchi on the table ---------- */
  var room = null, R = null;

  function openRoom() {
    var p = K.player(); if (!p) return;
    closeRoom(true);
    room = document.createElement("div");
    room.className = "pet-room";
    room.innerHTML =
      '<div class="pr-inner">' +
      '<div class="bar"><button class="round small pr-back" type="button" aria-label="Back">⬅️</button>' +
      '<button class="pr-title" type="button" aria-label="Rename"></button>' +
      '<div class="stars"><span>⭐</span><span class="pr-stars"></span></div></div>' +
      '<div class="tama c-' + (p.color || "grape") + '">' +
      '<div class="tama-screen"><div class="lcd-top"><span class="lcd-tummy"></span><span class="lcd-happy"></span></div>' +
      '<div class="lcd-bubble" aria-live="polite"></div><div class="pr-pet idle"></div><div class="lcd-floor"></div></div>' +
      '<div class="tama-btns"></div></div>' +
      '<div class="pr-goal"></div></div>';
    document.body.appendChild(room);
    room.querySelector(".pr-back").addEventListener("click", function () { closeRoom(); });
    room.querySelector(".pr-title").addEventListener("click", function () { if (load(R.p.id).hatched) openNaming(false); });
    R = { p: p, petEl: room.querySelector(".pr-pet"), bubble: room.querySelector(".lcd-bubble"), taps: 0, pats: 0, busy: false, dressed: false };
    R.petEl.addEventListener("click", tapPet);
    drawRoom(true);
    if (window.KidsGym) setTimeout(function () { if (R) KidsGym.notices(R.p); }, 1600);
    // pick up any grown-up changes made since the app opened
    if (K.fetchState) K.fetchState().then(function (res) { if (res && R && room) drawRoom(false); });
  }

  function closeRoom(silent) {
    if (room) { room.remove(); room = null; R = null; }
    if (!silent && cardEl) renderCard(cardEl);
  }

  function say(text) { if (R) R.bubble.textContent = text; K.say(text); }

  function drawStatus(s) {
    room.querySelector(".lcd-tummy").textContent = s.hatched ? "TUMMY " + heartRow(tummy(s)) : "";
    room.querySelector(".lcd-happy").textContent = s.hatched ? "HAPPY " + heartRow(happy(s)) : "HATCH " + Math.min(K.stars(R.p.id), HATCH) + "/" + HATCH + " ⭐";
  }

  function drawRoom(first) {
    var p = R.p, s = load(p.id), stars = K.stars(p.id), stage = stageFor(stars);
    room.querySelector(".pr-title").textContent = s.hatched ? s.name + " ✏️" : "Your egg";
    room.querySelector(".pr-stars").textContent = stars;
    drawStatus(s);
    if (s.hatched) {
      R.petEl.className = "pr-pet idle" + (s.asleep ? " sleeping" : "");
      R.petEl.innerHTML = teddySVG(stage, s) + (s.asleep ? zzz() : "");
      startBlinking(R.petEl);
    } else {
      R.petEl.className = "pr-pet" + (stars >= HATCH ? " ready" : "");
      R.petEl.innerHTML = eggSVG(Math.min(3, Math.floor(stars / 4)));
    }
    var g = nextGoal(stars, s), goal = room.querySelector(".pr-goal");
    goal.innerHTML = "";
    if (g && stars < g.at) {
      var pct = Math.max(0, Math.min(100, ((stars - g.from) / (g.at - g.from)) * 100));
      goal.innerHTML = '<div class="goal-bar"><span></span></div><div class="goal-txt"></div>';
      goal.querySelector("span").style.width = pct + "%";
      goal.querySelector(".goal-txt").textContent = "⭐ " + stars + " / " + g.at + "  ·  " + g.text;
    }
    drawButtons(s, stars);

    if (first) {
      if (!s.hatched) say(stars >= HATCH ? "Your egg is wiggling! Tap it three times!" : "Your egg needs " + (HATCH - stars) + " more stars to hatch. Play a game!");
      else if (s.asleep) say("Shh… " + s.name + " is sleeping. Tap him to wake him up!");
      else if (stage > s.stage) { s.stage = stage; save(p.id, s); say("Look! I grew into a " + STAGES[stage - 1].name.toLowerCase() + "!"); dance(R.petEl, "d-jump"); jingle(); K.celebrate(R.petEl); }
      else if (tummy(s) <= 2 && grapesWaiting(p.id, s)) say("Hi " + p.name + "! My tummy is rumbling. Grapes please!");
      else if (happy(s) <= 2) say("Hi " + p.name + "! Will you play with me?");
      else { say(pick(["Hi " + p.name + "!", "Yay, " + p.name + " is here!", "Hello " + p.name + "! Let's play!"])); dance(R.petEl, "d-wave"); }
    }
  }

  function drawButtons(s, stars) {
    var a = room.querySelector(".tama-btns"); a.innerHTML = "";
    if (!s.hatched) return;
    function btn(icon, label, fn, badge, isNew) {
      var b = document.createElement("button"); b.type = "button"; b.className = "tama-btn";
      b.innerHTML = '<span class="tb-face" aria-hidden="true"></span><span class="tb-label"></span>';
      b.querySelector(".tb-face").textContent = icon; b.querySelector(".tb-label").textContent = label;
      if (badge) { var c = document.createElement("span"); c.className = "tb-count"; c.textContent = badge; b.appendChild(c); }
      if (isNew) { var n = document.createElement("span"); n.className = "tb-count new"; n.textContent = "NEW"; b.appendChild(n); }
      b.addEventListener("click", function () { if (!R.busy) { beep(); fn(b); } });
      a.appendChild(b);
    }
    var hasNew = unlocked(stars, s).some(function (o) { return s.seen.indexOf(o.id) === -1; });
    btn("🍇", "Feed", feed, grapesWaiting(R.p.id, s) || "");
    btn("💃", "Play", play);
    if (window.KidsGym) btn("🏋️", "Gym", function () { KidsGym.open(R.p, function () { if (R && room) drawRoom(false); }); }, "", KidsGym.unseen(R.p.id));
    if (window.KidsAdventure) btn("🗺️", "Explore", function () { KidsAdventure.open(R.p, function () { if (R && room) drawRoom(false); }); });
    btn("🛍️", "Shop", openShop);
    btn("🚪", "Cupboard", openWardrobe, "", hasNew);
    btn("📋", "Stats", openStats);
  }

  // Returns false if the tap was used to wake him up.
  function wake() {
    var s = load(R.p.id);
    if (!s.asleep) return true;
    s.asleep = false; s.lastSeen = new Date().toISOString(); setHearts(s, "happy", happy(s) + 1); save(R.p.id, s);
    R.petEl.classList.remove("sleeping");
    var z = R.petEl.querySelector(".zzz"); if (z) z.remove();
    startBlinking(R.petEl); drawStatus(s);
    say("Oh! " + R.p.name + "! You're back! I missed you!");
    dance(R.petEl, "d-jump"); jingle();
    return false;
  }

  function play() {
    if (!wake()) return;
    var s = load(R.p.id); s.dances = (s.dances || 0) + 1; setHearts(s, "happy", happy(s) + 1); save(R.p.id, s); drawStatus(s);
    dance(R.petEl); jingle();
    say(happy(s) >= 4 ? pick(["Best day ever!", "I'm SO happy!", "Dance party!"]) : pick(["Watch me dance!", "Wheee!", "Can you dance too?"]));
  }

  function tapPet() {
    if (!R || R.busy) return;
    var s = load(R.p.id), stars = K.stars(R.p.id);
    if (!s.hatched) {
      if (stars < HATCH) { R.petEl.classList.remove("shake"); void R.petEl.offsetWidth; R.petEl.classList.add("shake"); say("Not yet! " + (HATCH - stars) + " more stars to hatch."); return; }
      return crack();
    }
    if (!wake()) return;
    R.pats++;
    if (R.pats % 3 === 0) { setHearts(s, "happy", happy(s) + 1); save(R.p.id, s); drawStatus(s); }
    dance(R.petEl, pick(DANCES)); tone(660, 0, 0.08); tone(880, 0.09, 0.1);
    say(pick(TAP_LINES));
  }

  function crack() {
    R.taps++;
    R.petEl.querySelector(".egg-svg").setAttribute("class", "egg-svg cr" + Math.min(3, R.taps));
    R.petEl.classList.remove("shake"); void R.petEl.offsetWidth; R.petEl.classList.add("shake");
    tone(300 + R.taps * 120, 0, 0.12, 0.1);
    if (R.taps < 3) { say(R.taps === 1 ? "Crack! Keep tapping!" : "It's coming! One more!"); return; }
    R.busy = true;
    R.petEl.classList.remove("ready"); R.petEl.classList.add("hatching");
    say("Here it comes…");
    setTimeout(function () {
      var s = load(R.p.id), stars = K.stars(R.p.id), now = new Date().toISOString();
      s.hatched = true; s.hatchedAt = now; s.stage = stageFor(stars); s.lastSeen = now;
      setHearts(s, "tummy", 2); setHearts(s, "happy", 4);
      save(R.p.id, s);
      R.petEl.className = "pr-pet idle";
      R.petEl.innerHTML = teddySVG(s.stage, s);
      R.petEl.firstChild.classList.add("pop-out");
      drawStatus(s);
      K.celebrate(R.petEl, ["🧸", "⭐", "🎉", "✨"]); jingle();
      say("Hello " + R.p.name + "! I'm your Math Teddy!");
      setTimeout(function () { dance(R.petEl, "d-wave"); }, 700);
      setTimeout(function () { R.busy = false; openNaming(true); }, 2400);
    }, reduce ? 200 : 750);
  }

  function feed(btnEl) {
    if (!wake()) return;
    var s = load(R.p.id);
    if (!grapesWaiting(R.p.id, s)) { say("No grapes! Finish the prime test to earn 5 grapes."); return; }
    if (tummy(s) >= 4) { say(pick(["I'm full! Maybe later.", "My tummy is full! Let's play instead!", "No thank you, I'm stuffed!"])); dance(R.petEl, "d-wiggle"); return; }
    var mouth = R.petEl.querySelector(".mouth-smile") || R.petEl;
    var a = btnEl.getBoundingClientRect(), b = mouth.getBoundingClientRect();
    var ghost = document.createElement("span");
    ghost.className = "pet-grape";
    ghost.style.cssText = "position:fixed;z-index:80;pointer-events:none;left:" + (a.left + a.width / 2 - 21) + "px;top:" + (a.top) + "px;transition:transform .45s cubic-bezier(.4,.1,.3,1)";
    document.body.appendChild(ghost);
    R.busy = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      ghost.style.transform = "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + b.height / 2 - a.top - 21) + "px) scale(.4)";
    }); });
    setTimeout(function () {
      ghost.remove();
      var st = load(R.p.id);
      spend(st, 1); st.grapesEaten = (st.grapesEaten || 0) + 1;
      st.weight = Math.round(((st.weight || 0.5) + 0.05) * 100) / 100;
      setHearts(st, "tummy", tummy(st) + 1);
      save(R.p.id, st);
      R.petEl.classList.add("munch"); munchSound(); drawStatus(st);
      say(tummy(st) >= 4 ? "Yum! My tummy is full! Thank you " + R.p.name + "!" : pick(EAT_LINES));
      setTimeout(function () {
        if (!R) return;
        R.petEl.classList.remove("munch"); R.busy = false;
        drawButtons(st, K.stars(R.p.id));
        if (tummy(st) >= 4) { dance(R.petEl, "d-groove"); jingle(); }
      }, 650);
    }, 470);
  }

  /* ---------- stats (the tamagotchi status screen) ---------- */
  function openStats() {
    var p = R.p, s = load(p.id), stars = K.stars(p.id);
    var rows = [
      ["NAME", s.name], ["OWNER", p.name], ["AGE", ageDays(s) === 1 ? "1 day" : ageDays(s) + " days"],
      ["WEIGHT", (s.weight || 0.5).toFixed(2) + " kg"], ["SIZE", STAGES[Math.max(1, stageFor(stars)) - 1].name.replace(" teddy", "")],
      ["TUMMY", heartRow(tummy(s))], ["HAPPY", heartRow(happy(s))], ["GRAPES", grapesWaiting(p.id, s) + " spare"], ["EATEN", String(s.grapesEaten || 0)], ["THINGS", s.owned.length + " bought"],
      ["DANCES", String(s.dances || 0)], ["STARS", String(stars)]
    ];
    var wrap = document.createElement("div"); wrap.className = "pet-sheet-wrap";
    wrap.innerHTML = '<div class="pet-sheet lcd-sheet" role="dialog" aria-modal="true"><div class="lcd-stats"></div><button class="block c-leaf" type="button">OK</button></div>';
    var box = wrap.querySelector(".lcd-stats");
    rows.forEach(function (r) {
      var d = document.createElement("div"); d.className = "lcd-row";
      d.innerHTML = "<span></span><span></span>"; d.children[0].textContent = r[0]; d.children[1].textContent = r[1];
      box.appendChild(d);
    });
    wrap.querySelector(".block").addEventListener("click", function () { beep(); wrap.remove(); });
    wrap.addEventListener("click", function (e) { if (e.target === wrap) wrap.remove(); });
    document.body.appendChild(wrap);
    K.say(s.name + " is " + (ageDays(s) === 1 ? "1 day" : ageDays(s) + " days") + " old and weighs " + (s.weight || 0.5).toFixed(1) + " kilos!");
  }

  /* ---------- cupboard: everything he owns (bought things + star prizes), fur, tummy badge ---------- */
  function sheet(html) {
    var wrap = document.createElement("div"); wrap.className = "pet-sheet-wrap";
    wrap.innerHTML = '<div class="pet-sheet wide" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(wrap);
    return wrap;
  }
  function itemTile(it, sub, cls) {
    var b = document.createElement("button"); b.type = "button"; b.className = "w-item " + (cls || "");
    b.innerHTML = '<span class="wi" aria-hidden="true"></span><span class="wn"></span><span class="wl"></span>';
    b.querySelector(".wi").textContent = it.icon; b.querySelector(".wn").textContent = it.name; b.querySelector(".wl").textContent = sub;
    return b;
  }
  function slotName(slot) { for (var i = 0; i < T.SLOTS.length; i++) if (T.SLOTS[i].id === slot) return T.SLOTS[i].name; return slot; }

  function openWardrobe() {
    if (!R) return;
    var p = R.p, stars = K.stars(p.id), s0 = load(p.id);
    var wrap = sheet('<div class="ward-preview"></div><h2>Cupboard</h2><div class="cupboard"></div>' +
      '<h3 class="ward-h">Fur colour</h3><div class="swatches"></div>' +
      '<h3 class="ward-h">Tummy badge</h3><div class="bellies"></div>' +
      '<div class="sheet-btns"><button class="block c-sky shop-link" type="button">🛍️ Shop</button><button class="block c-leaf done" type="button">Done</button></div>');
    function refresh() { wrap.querySelector(".ward-preview").innerHTML = teddySVG(stageFor(stars), load(p.id)); }
    function change(fn, line) {
      var st = load(p.id); fn(st);
      if (!R.dressed) { setHearts(st, "happy", happy(st) + 1); R.dressed = true; }
      save(p.id, st); refresh(); build();
      if (line) K.say(line);
    }
    function build() {
      var st = load(p.id), box = wrap.querySelector(".cupboard"); box.innerHTML = "";
      var groups = [{ name: "🎃 Halloween", items: GIFTS.filter(function (it) { return it.gift === "halloween"; }) }].concat(T.SLOTS.map(function (slot) {
        return { slot: slot, name: slot.name, items: ITEMS.filter(function (it) { return it.slot === slot.id && !it.gift && has(it, stars, st); }) };
      }));
      groups.forEach(function (G) {
        var slot = G.slot || null;
        var mine = G.items;
        var lockedPrizes = slot ? PRIZES.filter(function (it) { return it.slot === slot.id && !has(it, stars, st); }) : [];
        if (!mine.length && !lockedPrizes.length) return;
        var h = document.createElement("h3"); h.className = "ward-h"; h.textContent = G.name; box.appendChild(h);
        var grid = document.createElement("div"); grid.className = "wardrobe"; box.appendChild(grid);
        mine.forEach(function (it) {
          var on = st.wear[it.slot] === it.id;
          var b = itemTile(it, on ? "Wearing" : "Tap to wear", on ? "on" : "");
          if ((it.stars || it.gift) && st.seen.indexOf(it.id) === -1) { var n = document.createElement("span"); n.className = "badge-new"; n.textContent = "NEW"; b.appendChild(n); }
          b.addEventListener("click", function () {
            change(function (x) { if (x.wear[it.slot] === it.id) delete x.wear[it.slot]; else x.wear[it.slot] = it.id; },
              on ? "Okay, off it comes." : pick(["Ooh, I love my " + it.name.toLowerCase() + "!", "Do I look fancy?", "So stylish!"]));
          });
          grid.appendChild(b);
        });
        lockedPrizes.forEach(function (it) {
          var b = itemTile(it, "🔒 " + it.stars + " ⭐", "locked");
          b.addEventListener("click", function () { K.say("Earn " + (it.stars - stars) + " more stars to unlock the " + it.name); });
          grid.appendChild(b);
        });
      });
      if (!st.owned.length) {
        var tip = document.createElement("p"); tip.className = "fine-tip"; tip.textContent = "Things you buy in the shop go in here.";
        box.appendChild(tip);
      }
      var sw = wrap.querySelector(".swatches"); sw.innerHTML = "";
      Object.keys(FURS).forEach(function (k) {
        if (!hasFur(k, st)) return;
        var b = document.createElement("button"); b.type = "button"; b.className = "swatch" + (st.fur === k ? " on" : "") + (FURS[k].fur === "rainbow" ? " rainbow" : "");
        if (FURS[k].fur !== "rainbow") b.style.background = FURS[k].fur;
        b.setAttribute("aria-label", FURS[k].name); b.title = FURS[k].name;
        b.addEventListener("click", function () { change(function (x) { x.fur = k; }, FURS[k].name + "!"); });
        sw.appendChild(b);
      });
      var be = wrap.querySelector(".bellies"); be.innerHTML = "";
      BELLIES.forEach(function (sym) {
        var b = document.createElement("button"); b.type = "button"; b.className = "belly-btn" + (st.belly === sym ? " on" : "");
        b.textContent = sym;
        b.addEventListener("click", function () { change(function (x) { x.belly = sym; }); });
        be.appendChild(b);
      });
    }
    refresh(); build();
    s0.seen = unlocked(stars, s0).map(function (o) { return o.id; }); save(p.id, s0);
    function done() { wrap.remove(); drawRoom(false); dance(R.petEl, "d-spin"); say(pick(["How do I look?", "I feel fancy!", "Thank you!"])); }
    wrap.querySelector(".done").addEventListener("click", done);
    wrap.querySelector(".shop-link").addEventListener("click", function () { wrap.remove(); drawRoom(false); openShop(); });
    wrap.addEventListener("click", function (e) { if (e.target === wrap) done(); });
    K.say("Cupboard!");
  }

  /* ---------- shop: spend spare grapes. Tap anything to try it on first. ---------- */
  function openShop() {
    if (!R) return;
    var p = R.p, stars = K.stars(p.id);
    var trying = null; // { kind: "item"|"fur", it }
    var wrap = sheet('<div class="shop-top"><div class="ward-preview"></div><div class="shop-side">' +
      '<h2>Teddy Shop</h2><div class="wallet">🍇 <span class="w-n"></span> grapes</div>' +
      '<p class="shop-msg" aria-live="polite">Tap something to try it on!</p>' +
      '<button class="block c-sun buy" type="button" hidden>Buy</button></div></div>' +
      '<div class="shop-list"></div>' +
      '<div class="sheet-btns"><button class="block c-sky cup-link" type="button">🚪 Cupboard</button><button class="block c-leaf done" type="button">Done</button></div>');
    var msg = wrap.querySelector(".shop-msg"), buyBtn = wrap.querySelector(".buy");

    function preview() {
      var st = JSON.parse(JSON.stringify(load(p.id)));
      if (trying && trying.kind === "item") st.wear[trying.it.slot] = trying.it.id;
      if (trying && trying.kind === "fur") st.fur = trying.key;
      wrap.querySelector(".ward-preview").innerHTML = teddySVG(stageFor(stars) || 1, st);
      wrap.querySelector(".w-n").textContent = grapesWaiting(p.id, load(p.id));
    }
    function priceOf(t) { return t.kind === "fur" ? FURS[t.key].price : t.it.price; }
    function nameOf(t) { return t.kind === "fur" ? FURS[t.key].name + " fur" : t.it.name; }
    function owned(t, st) { return t.kind === "fur" ? hasFur(t.key, st) : has(t.it, stars, st); }

    function tryOn(t) {
      trying = t; preview(); build();
      var st = load(p.id), have = grapesWaiting(p.id, st), price = priceOf(t);
      if (owned(t, st)) { msg.textContent = "You already have the " + nameOf(t).toLowerCase() + "! It's in your cupboard."; buyBtn.hidden = true; K.say(msg.textContent); return; }
      buyBtn.hidden = false;
      if (have >= price) {
        buyBtn.disabled = false; buyBtn.textContent = "Buy for 🍇 " + price;
        msg.textContent = nameOf(t) + "! Want to buy it?";
      } else {
        buyBtn.disabled = true; buyBtn.textContent = "Need 🍇 " + price;
        msg.textContent = "You need " + (price - have) + " more grapes. Finish the prime test to earn 5!";
      }
      K.say(msg.textContent);
      dance(wrap.querySelector(".ward-preview"), "d-wiggle");
    }

    buyBtn.addEventListener("click", function () {
      if (!trying) return;
      var st = load(p.id), price = priceOf(trying);
      if (owned(trying, st) || grapesWaiting(p.id, st) < price) return;
      spend(st, price);
      if (trying.kind === "fur") { st.ownedFurs.push(trying.key); st.fur = trying.key; }
      else { st.owned.push(trying.it.id); st.wear[trying.it.slot] = trying.it.id; }
      setHearts(st, "happy", happy(st) + 1);
      save(p.id, st);
      jingle(); K.celebrate(wrap.querySelector(".ward-preview"), ["🍇", "⭐", "🎉", "✨"]);
      msg.textContent = "Yay! " + nameOf(trying) + " is mine! I'm wearing it now."; K.say(msg.textContent);
      buyBtn.hidden = true; trying = null; preview(); build();
      dance(wrap.querySelector(".ward-preview"), "d-jump");
    });

    function build() {
      var st = load(p.id), have = grapesWaiting(p.id, st), list = wrap.querySelector(".shop-list"); list.innerHTML = "";
      function section(title, tiles) {
        if (!tiles.length) return;
        var h = document.createElement("h3"); h.className = "ward-h"; h.textContent = title; list.appendChild(h);
        var g = document.createElement("div"); g.className = "wardrobe"; tiles.forEach(function (t) { g.appendChild(t); }); list.appendChild(g);
      }
      function tile(it) {
        var mine = has(it, stars, st), t = { kind: "item", it: it };
        var b = itemTile(it, mine ? "✓ Yours" : "🍇 " + it.price, (mine ? "mine" : have >= it.price ? "afford" : "dear") + (trying && trying.it === it ? " trying" : ""));
        b.addEventListener("click", function () { tryOn(t); });
        return b;
      }
      function byPrice(a, b) { return a.price - b.price; }
      // This kid's style first (sparkle & princess for girls, action & adventure for boys), then everything by body part.
      var g = K.gender ? K.gender(p) : null;
      if (g) section(g === "girl" ? "✨ Picked for you: sparkle and princess" : "⚡ Picked for you: action and adventure",
        SHOP.filter(function (it) { return it.style === g; }).sort(byPrice).map(tile));
      T.SLOTS.forEach(function (slot) {
        section(slot.name, SHOP.filter(function (it) { return it.slot === slot.id && (!g || it.style !== g); }).sort(byPrice).map(tile));
      });
      section("Special fur", SHOP_FURS.map(function (k) {
        var mine = hasFur(k, st), t = { kind: "fur", key: k };
        var b = itemTile({ icon: k === "gold" ? "✨" : "🌈", name: FURS[k].name + " fur" }, mine ? "✓ Yours" : "🍇 " + FURS[k].price,
          (mine ? "mine" : have >= FURS[k].price ? "afford" : "dear") + (trying && trying.key === k ? " trying" : ""));
        b.addEventListener("click", function () { tryOn(t); });
        return b;
      }));
    }

    preview(); build();
    function done() { wrap.remove(); drawRoom(false); }
    wrap.querySelector(".done").addEventListener("click", done);
    wrap.querySelector(".cup-link").addEventListener("click", function () { wrap.remove(); drawRoom(false); openWardrobe(); });
    wrap.addEventListener("click", function (e) { if (e.target === wrap) done(); });
    K.say("Welcome to the Teddy Shop! You have " + grapesWaiting(p.id, load(p.id)) + " grapes.");
  }

  /* ---------- naming ---------- */
  function openNaming(isNew) {
    if (!R) return;
    var p = R.p, s = load(p.id);
    var wrap = document.createElement("div"); wrap.className = "pet-sheet-wrap";
    wrap.innerHTML = '<div class="pet-sheet" role="dialog" aria-modal="true"><div class="ward-preview"></div><h2>What\'s my name?</h2>' +
      '<div class="name-chips"></div><input class="name-input" id="pet-name" maxlength="16" autocomplete="off" placeholder="Or type a name">' +
      '<button class="block c-leaf" type="button">That\'s my name!</button></div>';
    wrap.querySelector(".ward-preview").innerHTML = teddySVG(stageFor(K.stars(p.id)), s);
    var input = wrap.querySelector(".name-input");
    input.value = s.name || "";
    var chips = wrap.querySelector(".name-chips");
    NAMES.forEach(function (nm) {
      var c = document.createElement("button"); c.type = "button"; c.textContent = nm;
      c.setAttribute("aria-pressed", input.value === nm);
      c.addEventListener("click", function () {
        input.value = nm; K.say(nm + "?");
        chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === c); });
      });
      chips.appendChild(c);
    });
    wrap.querySelector(".block").addEventListener("click", function () {
      var nm = input.value.trim().slice(0, 16) || "Teddy";
      var st = load(p.id); st.name = nm; save(p.id, st);
      wrap.remove(); drawRoom(false);
      say("Yay! My name is " + nm + "!"); dance(R.petEl, "d-groove"); jingle();
    });
    document.body.appendChild(wrap);
    K.say(isNew ? "What should my name be?" : "What's my name?");
  }

  window.KidsPet = {
    renderCard: renderCard, openRoom: openRoom, arrive: arrive, teddySVG: teddySVG, eggSVG: eggSVG,
    load: load, save: save, spend: spend, setHearts: setHearts, blank: blank, tummy: tummy, happy: happy, stageFor: stageFor, ageDays: ageDays, grapesWaiting: grapesWaiting,
    STAGES: STAGES, ITEMS: ITEMS, SLOTS: T.SLOTS, FURS: FURS, BELLIES: BELLIES, HATCH: HATCH
  };
})();
