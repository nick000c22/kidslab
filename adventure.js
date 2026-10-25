/* Teddy Adventure: a world map of five lands, each with small monsters and a big boss.
   Every attack is a times-table question:
     right  -> your teddy hits (fast answers are SUPER hits, 3 in a row is a COMBO)
     wrong  -> the monster hits you (and you see the right answer)
     too slow (where there's a timer) -> the monster hits you
   Gym stats matter: Strength = how hard you hit, Endurance = how much health you have,
   Speed = extra seconds on the timer, Brains = sometimes a wrong answer fades away.
   Bosses also do a "big attack" every few turns: answer FAST to block it.
   It's a grind on purpose: losing gives nothing (and costs nothing). Win small monsters for
   grapes and gym tokens, train in the gym, then come back for the boss.
   Rewards: monster win 🍇1 + 🎟️1 (first 12 wins a day). Boss: big loot the first time,
   🍇5 + 🎟️2 once a day after that. Progress lives on the teddy (pet.adv), so it syncs. */
(function () {
  var K = window.KidsLab, P = window.KidsPet;
  if (!K || !P) return;

  var DAILY_MONSTERS = 12;
  var LESSON = "timesmix"; // answers show up under Multiplication on the grown-ups page

  /* ---------- the lands ---------- */
  // tables: which times tables the questions use. timer: seconds per question (0 = no timer).
  // rage: boss big attack every N questions (0 = never). hp/hit: monster health and damage.
  var WORLDS = [
    { id: "island", name: "Teddy Island", icon: "🏝️", sky: "island", tables: [2, 10], opts: 3, x: 16, y: 74,
      intro: "Home sweet home. The 2s and 10s live here.",
      monsters: [
        { id: "snail", name: "Slow Snail", face: "🐌", hp: 40, hit: 8, timer: 0 },
        { id: "bee", name: "Buzzy Bee", face: "🐝", hp: 55, hit: 10, timer: 0 },
        { id: "seagull", name: "Cheeky Seagull", face: "🐦", hp: 70, hit: 12, timer: 0 }
      ],
      boss: { id: "crab", name: "Grumpy Crab", face: "🦀", hp: 170, hit: 14, timer: 0, rage: 0, level: 1,
        loot: { grapes: 15, tokens: 4 }, taunt: "Snip snap! Nobody gets past my beach!", power: "Snappy claws" } },
    { id: "forest", name: "Whispering Forest", icon: "🌲", sky: "forest", tables: [5, 3], opts: 3, x: 36, y: 44,
      intro: "Tall trees and sneaky creatures. The 5s and 3s live here.",
      monsters: [
        { id: "spider", name: "Wiggly Spider", face: "🕷️", hp: 80, hit: 14, timer: 14 },
        { id: "wolf", name: "Howly Wolf", face: "🐺", hp: 110, hit: 17, timer: 14 },
        { id: "boar", name: "Grumbly Boar", face: "🐗", hp: 140, hit: 20, timer: 13 }
      ],
      boss: { id: "troll", name: "Forest Troll", face: "🧌", hp: 500, hit: 32, timer: 13, rage: 4, level: 2,
        loot: { grapes: 25, tokens: 6 }, taunt: "TROLL SMASH! You are tiny!", power: "Big slow SMASH" } },
    { id: "caves", name: "Goblin Caves", icon: "🕳️", sky: "caves", tables: [4, 8], opts: 4, x: 64, y: 74,
      intro: "Dark tunnels full of goblins. The 4s and 8s live here.",
      monsters: [
        { id: "bat", name: "Flappy Bat", face: "🦇", hp: 130, hit: 20, timer: 11 },
        { id: "rat", name: "Cave Rat", face: "🐀", hp: 170, hit: 24, timer: 11 },
        { id: "skeleton", name: "Rattly Skeleton", face: "💀", hp: 210, hit: 27, timer: 10 }
      ],
      boss: { id: "goblin", name: "Goblin King", face: "👺", crown: true, hp: 750, hit: 36, timer: 8, rage: 4, level: 3,
        loot: { grapes: 35, tokens: 8 }, taunt: "Hee hee! I'm too FAST for you!", power: "Super speedy" } },
    { id: "mountains", name: "Frozen Mountains", icon: "🏔️", sky: "snow", tables: [9, 6], opts: 4, x: 58, y: 22,
      intro: "Brrr! Snow and ice. The 9s and 6s live here.",
      monsters: [
        { id: "snowman", name: "Snowman", face: "⛄", hp: 190, hit: 27, timer: 11 },
        { id: "yeti", name: "Grumpy Goat", face: "🐐", hp: 240, hit: 31, timer: 11 },
        { id: "owl", name: "Snow Owl", face: "🦉", hp: 290, hit: 34, timer: 10 }
      ],
      boss: { id: "icegiant", name: "Ice Giant", face: "👹", ice: true, hp: 1100, hit: 44, timer: 10, rage: 4, level: 4, freeze: true,
        loot: { grapes: 45, tokens: 10 }, taunt: "Get one wrong and I'll FREEZE you!", power: "Wrong answers freeze you" } },
    { id: "volcano", name: "Dragon Volcano", icon: "🌋", sky: "volcano", tables: [2, 3, 4, 5, 6, 7, 8, 9, 10], opts: 4, x: 86, y: 44,
      intro: "The hottest place of all. Every table lives here, even the tricky 7s.",
      monsters: [
        { id: "imp", name: "Fire Imp", face: "😈", hp: 260, hit: 34, timer: 10 },
        { id: "lizard", name: "Lava Lizard", face: "🦎", hp: 320, hit: 38, timer: 10 },
        { id: "golem", name: "Rock Golem", face: "🗿", hp: 380, hit: 42, timer: 9 }
      ],
      boss: { id: "dragon", name: "Fire Dragon", face: "🐉", hp: 1700, hit: 58, timer: 9, rage: 3, level: 5, fire: true,
        loot: { grapes: 70, tokens: 15 }, taunt: "ROAAAR! Only a mighty teddy can beat me!", power: "Fire breath every 3 turns" } }
  ];

  /* ---------- helpers ---------- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function txt(node, sel, t) { node.querySelector(sel).textContent = t; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function stageOf(id) { return Math.max(1, P.stageFor(K.stars(id))); }
  function overlay(cls) { var w = document.createElement("div"); w.className = "gym-wrap adv-wrap " + (cls || ""); document.body.appendChild(w); return w; }
  function advOf(pet) {
    var a = pet.adv && typeof pet.adv === "object" ? pet.adv : {};
    a.beaten = a.beaten && typeof a.beaten === "object" ? a.beaten : {};
    a.wins = Number(a.wins) || 0;
    return a;
  }

  // What the teddy brings to a fight, from its gym stats (each 0-1000).
  function kit(pet) {
    var f = pet.fit || {};
    return {
      hp: Math.round(80 + (f.end || 0) * 0.6),           // 80 .. 680
      dmg: Math.round(10 + (f.str || 0) * 0.11),         // 10 .. 120
      extra: Math.min(4, (f.spd || 0) * 0.004),          // +0 .. +4 seconds on timers
      fade: Math.min(0.7, (f.brn || 0) / 1000 * 0.7)     // chance a wrong answer fades out
    };
  }

  /* ---------- sound (same little synth as the gym) ---------- */
  var ac = null;
  function tone(f, at, len, type, vol) {
    if (!K.get("sound", true)) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + (at || 0);
      o.type = type || "square"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.12));
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + (len || 0.12) + 0.05);
    } catch (e) {}
  }
  function bonk() { tone(140, 0, 0.12, "sawtooth", 0.1); tone(90, 0.06, 0.14, "sawtooth", 0.08); }
  function zap() { [600, 900, 1200, 1500].forEach(function (f, i) { tone(f, i * 0.05, 0.08, "square", 0.06); }); }
  function ding() { tone(990, 0, 0.08, "square", 0.06); tone(1320, 0.07, 0.1, "square", 0.06); }
  function buzz() { tone(180, 0, 0.18, "sawtooth", 0.08); }
  function roar() { tone(110, 0, 0.35, "sawtooth", 0.11); tone(80, 0.1, 0.4, "sawtooth", 0.09); }
  function fanfare() { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.14, "square", 0.07); }); }
  function sad() { [392, 349, 311, 262].forEach(function (f, i) { tone(f, i * 0.2, 0.22, "triangle", 0.07); }); }

  /* ---------- questions: weak facts come back more often ---------- */
  function factKey(a, b) { return Math.min(a, b) + "x" + Math.max(a, b); }
  function facts(id) { return K.get("advfacts." + id, {}); }
  function noteFact(id, a, b, right) {
    var all = facts(id), k = factKey(a, b), f = all[k] || { r: 0, w: 0 };
    if (right) f.r++; else f.w++;
    all[k] = f; K.set("advfacts." + id, all);
  }
  function question(id, world, last) {
    var all = facts(id), pool = [];
    world.tables.forEach(function (t) {
      for (var n = 1; n <= 10; n++) {
        var f = all[factKey(t, n)] || { r: 0, w: 0 };
        var w = Math.max(0.4, Math.min(8, 1 + f.w * 2.5 - f.r * 0.25));
        if (n === 1 || t === 10 && world.id !== "island") w *= 0.4; // the easy ones less often
        pool.push({ t: t, n: n, w: w });
      }
    });
    var tot = pool.reduce(function (s, p) { return s + p.w; }, 0), r = Math.random() * tot, q = pool[0];
    for (var i = 0; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) { q = pool[i]; break; } }
    if (last && factKey(q.t, q.n) === last && pool.length > 1) return question(id, world, last);
    var a = q.t, b = q.n;
    if (Math.random() < 0.5) { var s = a; a = b; b = s; }   // 3 × 7 and 7 × 3 are the same fact
    var ans = a * b, opts = [ans];
    // Wrong answers that look right: a neighbour in the same table, or off by a little.
    var tries = [ans + q.t, ans - q.t, ans + q.n, ans - q.n, ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10];
    tries.sort(function () { return Math.random() - 0.5; });
    tries.forEach(function (v) { if (opts.length < world.opts && v > 0 && opts.indexOf(v) === -1) opts.push(v); });
    while (opts.length < world.opts) { var v = ans + rnd(-9, 9); if (v > 0 && opts.indexOf(v) === -1) opts.push(v); }
    opts.sort(function (m, n) { return m - n; });
    return { a: a, b: b, ans: ans, opts: opts, key: factKey(a, b) };
  }

  /* ---------- the map ---------- */
  var onClose = null;
  function open(player, after) {
    onClose = after || null;
    var pet = P.load(player.id);
    if (!pet.hatched) { K.say("Hatch your egg first!"); return; }
    var w = overlay("adv-map-wrap");
    w.innerHTML =
      '<div class="adv">' +
      '<div class="g-top"><button class="round small adv-back" type="button" aria-label="Back">⬅️</button><h2>🗺️ Teddy Adventure</h2>' +
      '<div class="stars" title="Grapes and gym tokens"><span>🍇</span><span class="adv-grapes"></span><span>🎟️</span><span class="adv-tokens"></span></div></div>' +
      '<div class="adv-map"><svg class="adv-sea" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="adv-path" d=""/></svg></div>' +
      '<p class="g-tip adv-tip"></p>' +
      "</div>";
    var map = w.querySelector(".adv-map"), path = w.querySelector(".adv-path");
    function draw() {
      var p2 = P.load(player.id), adv = advOf(p2);
      txt(w, ".adv-grapes", Math.max(0, Number(p2.grapes) || 0));
      txt(w, ".adv-tokens", Math.max(0, Number(p2.tokens) || 0));
      map.querySelectorAll(".adv-node").forEach(function (n) { n.remove(); });
      path.setAttribute("d", WORLDS.map(function (W, i) { return (i ? "L" : "M") + W.x + " " + W.y; }).join(" "));
      WORLDS.forEach(function (W) {
        var beat = adv.beaten[W.boss.id] || 0;
        var n = el('<button type="button" class="adv-node adv-' + W.sky + '"><span class="adv-land"></span><span class="adv-boss"></span><span class="adv-name"></span><span class="adv-lvl"></span></button>');
        n.style.left = W.x + "%"; n.style.top = W.y + "%";
        txt(n, ".adv-land", W.icon); txt(n, ".adv-name", W.name);
        var bossEl = n.querySelector(".adv-boss"); bossEl.textContent = W.boss.face; if (W.boss.ice) bossEl.classList.add("icy");
        txt(n, ".adv-lvl", beat ? "🏆 Boss beaten" + (beat > 1 ? " ×" + beat : "") : new Array(W.boss.level + 1).join("💀"));
        if (beat) n.classList.add("won");
        n.setAttribute("aria-label", W.name + ". Boss: " + W.boss.name + (beat ? ". Beaten!" : ""));
        n.addEventListener("click", function () { openWorld(player, W, draw); });
        map.appendChild(n);
      });
      var won = WORLDS.filter(function (W) { return adv.beaten[W.boss.id]; }).length;
      txt(w, ".adv-tip", won === WORLDS.length ? "You beat every boss! You're a legend. Keep fighting to stay strong!" :
        won ? won + " of 5 bosses beaten. The 💀 skulls show how tough each boss is." :
        "Go anywhere you like! The 💀 skulls show how tough each boss is. Start on Teddy Island.");
    }
    draw();
    w.querySelector(".adv-back").addEventListener("click", function () { w.remove(); if (onClose) onClose(); });
    K.say("Where shall we go on our adventure?");
  }

  /* ---------- a land ---------- */
  function openWorld(player, W, redrawMap) {
    var w = overlay("adv-world-wrap sky-" + W.sky);
    w.innerHTML =
      '<div class="adv">' +
      '<div class="g-top"><button class="round small adv-back" type="button" aria-label="Back to the map">🗺️</button><h2></h2></div>' +
      '<p class="adv-intro"></p>' +
      '<div class="adv-me"><div class="adv-me-bear"></div><div class="adv-me-stats"></div></div>' +
      '<h3 class="ward-h">Monsters (win 🍇 1 + 🎟️ 1)</h3><div class="adv-foes"></div>' +
      '<h3 class="ward-h">The Boss</h3><div class="adv-bossbox"></div>' +
      '<p class="g-tip adv-daily"></p>' +
      "</div>";
    txt(w, "h2", W.icon + " " + W.name);
    txt(w, ".adv-intro", W.intro);
    function draw() {
      var pet = P.load(player.id), k = kit(pet), adv = advOf(pet);
      w.querySelector(".adv-me-bear").innerHTML = P.teddySVG(stageOf(player.id), pet);
      w.querySelector(".adv-me-stats").innerHTML =
        '<div><b>❤️ ' + k.hp + '</b> health</div><div><b>💪 ' + k.dmg + '</b> per hit</div>' +
        (k.extra >= 0.5 ? '<div><b>⚡ +' + k.extra.toFixed(1) + 's</b> on timers</div>' : '') +
        (k.fade >= 0.05 ? '<div><b>🧠 ' + Math.round(k.fade * 100) + '%</b> hint chance</div>' : '');
      var foes = w.querySelector(".adv-foes"); foes.innerHTML = "";
      W.monsters.forEach(function (M) {
        var b = el('<button type="button" class="adv-foe"><span class="adv-face"></span><span class="adv-fname"></span><span class="adv-fsub"></span></button>');
        txt(b, ".adv-face", M.face); txt(b, ".adv-fname", M.name);
        txt(b, ".adv-fsub", "❤️ " + M.hp + " · hits " + M.hit + (M.timer ? " · ⏱️" : ""));
        b.addEventListener("click", function () { fight(player, W, M, false, function () { draw(); if (redrawMap) redrawMap(); }); });
        foes.appendChild(b);
      });
      var B = W.boss, beat = adv.beaten[B.id] || 0, bb = w.querySelector(".adv-bossbox"); bb.innerHTML = "";
      var bt = el('<button type="button" class="adv-bossbtn"><span class="adv-bface"></span><span class="adv-binfo"><span class="adv-bname"></span><span class="adv-bpow"></span><span class="adv-bstat"></span><span class="adv-bloot"></span></span></button>');
      var bf = bt.querySelector(".adv-bface"); bf.textContent = B.face; if (B.ice) bf.classList.add("icy"); if (B.crown) bf.classList.add("crowned");
      txt(bt, ".adv-bname", B.name + " " + new Array(B.level + 1).join("💀"));
      txt(bt, ".adv-bpow", "⚠️ " + B.power + (B.rage ? " · big attack every " + B.rage + " turns" : ""));
      txt(bt, ".adv-bstat", "❤️ " + B.hp + " · hits " + B.hit + (B.timer ? " · ⏱️ " + B.timer + "s" : " · no timer"));
      txt(bt, ".adv-bloot", beat ? "🏆 Beaten " + beat + (beat === 1 ? " time" : " times") + ". Again: 🍇 5 + 🎟️ 2 (once a day)" : "First win: 🍇 " + B.loot.grapes + " + 🎟️ " + B.loot.tokens + " + a trophy!");
      bt.addEventListener("click", function () { fight(player, W, B, true, function () { draw(); if (redrawMap) redrawMap(); }); });
      bb.appendChild(bt);
      var day = pet.advDay && pet.advDay.d === today() ? pet.advDay.n : 0;
      txt(w, ".adv-daily", day >= DAILY_MONSTERS ? "No more monster prizes today, but you can still fight for practice!" : (DAILY_MONSTERS - day) + " monster prizes left today. Lost a fight? Earn tokens, train in the gym, and come back stronger!");
    }
    draw();
    w.querySelector(".adv-back").addEventListener("click", function () { w.remove(); });
    K.say("Welcome to " + W.name + "! " + W.intro);
  }

  /* ---------- the fight ---------- */
  function fight(player, W, F, isBoss, after) {
    var pet = P.load(player.id), k = kit(pet);
    var me = { hp: k.hp, max: k.hp }, foe = { hp: F.hp, max: F.hp };
    var turn = 0, streak = 0, lastKey = null, busy = false, timerRAF = null, over = false, rightN = 0, wrongN = 0;
    var w = overlay("g-battle-wrap adv-fight sky-" + W.sky);
    w.innerHTML =
      '<div class="arena">' +
      '<div class="ar-hp"><div class="hpbox a"><b></b><span class="hp"><span></span></span><em></em></div><div class="vs">VS</div><div class="hpbox b"><b></b><span class="hp"><span></span></span><em></em></div></div>' +
      '<div class="adv-floor"><div class="fighter a"></div><div class="adv-enemy"><span class="adv-eface"></span></div><div class="ar-call" aria-live="polite"></div></div>' +
      '<div class="adv-panel"><div class="adv-warn" hidden></div><div class="adv-timer" hidden><span></span></div><div class="adv-q"></div><div class="adv-help"></div><div class="adv-opts"></div><div class="adv-streak"></div></div>' +
      '<button class="round small adv-flee" type="button" aria-label="Run away">🏳️</button>' +
      '<div class="ar-end" hidden></div>' +
      "</div>";
    var fa = w.querySelector(".fighter.a"), fe = w.querySelector(".adv-enemy"), face = w.querySelector(".adv-eface"), call = w.querySelector(".ar-call");
    var qEl = w.querySelector(".adv-q"), opts = w.querySelector(".adv-opts"), help = w.querySelector(".adv-help"), tbar = w.querySelector(".adv-timer"), warn = w.querySelector(".adv-warn"), streakEl = w.querySelector(".adv-streak");
    fa.innerHTML = P.teddySVG(stageOf(player.id), pet);
    face.textContent = F.face;
    if (isBoss) fe.classList.add("boss");
    if (F.ice) face.classList.add("icy");
    if (F.crown) fe.classList.add("crowned");
    txt(w, ".hpbox.a b", pet.name || "Teddy"); txt(w, ".hpbox.b b", F.name);
    function hp(side, v, max) { var box = w.querySelector(".hpbox." + side); box.querySelector(".hp span").style.width = Math.max(0, v / max * 100) + "%"; box.querySelector("em").textContent = Math.max(0, v) + " / " + max; box.classList.toggle("low", v / max < 0.3); }
    hp("a", me.hp, me.max); hp("b", foe.hp, foe.max);
    function say(t) { call.textContent = t; call.classList.remove("pop"); void call.offsetWidth; call.classList.add("pop"); }
    function pop(target, text, cls) {
      var r = target.getBoundingClientRect(), d = document.createElement("span");
      d.className = "dmg " + (cls || ""); d.textContent = text;
      d.style.left = (r.left + r.width / 2) + "px"; d.style.top = (r.top + r.height * 0.2) + "px";
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1100);
    }
    function anim(node, cls, ms) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); setTimeout(function () { node.classList.remove(cls); }, ms || 600); }
    function stopTimer() { if (timerRAF) cancelAnimationFrame(timerRAF); timerRAF = null; }

    w.querySelector(".adv-flee").addEventListener("click", function () {
      if (over) return;
      over = true; stopTimer(); w.remove(); K.say("Phew! We ran away. Let's get stronger!"); after();
    });

    say(isBoss ? F.name + "!" : "A wild " + F.name + "!");
    if (isBoss) { roar(); anim(fe, "boss-in", 1200); }
    K.say(isBoss ? F.taunt : "A wild " + F.name + " appears! Answer the sums to attack!");
    opts.innerHTML = "";
    setTimeout(next, isBoss ? 2200 : 1400);

    var q = null, asked = 0, rage = false, limit = 0;
    function next() {
      if (over) return;
      turn++;
      rage = isBoss && F.rage && turn % F.rage === 0;
      q = question(player.id, W, lastKey); lastKey = q.key; asked = performance.now();
      limit = F.timer ? (F.timer + k.extra) * (rage ? 0.7 : 1) : 0;
      warn.hidden = !rage;
      if (rage) {
        warn.textContent = F.fire ? "🔥 FIRE BREATH coming! Answer FAST to block it!" : "⚠️ BIG ATTACK coming! Answer FAST to block it!";
        anim(fe, "charge", 900); roar();
      }
      qEl.textContent = q.a + " × " + q.b + " = ?";
      K.say((rage ? "Quick! " : "") + q.a + " times " + q.b);
      // grape picture helper on the first two lands, for counting it out
      help.innerHTML = "";
      if ((W.id === "island" || W.id === "forest") && q.ans <= 30) {
        var hb = el('<button type="button" class="adv-hint">🍇 Show me</button>');
        hb.addEventListener("click", function () {
          hb.remove();
          var g = el('<div class="adv-grid" aria-label="' + q.a + ' rows of ' + q.b + '"></div>');
          for (var r = 0; r < q.a; r++) { var row = document.createElement("div"); row.textContent = new Array(q.b + 1).join("🍇"); g.appendChild(row); }
          help.appendChild(g); q.helped = true;
        });
        help.appendChild(hb);
      }
      opts.innerHTML = ""; opts.className = "adv-opts n" + q.opts.length;
      var colors = ["grape", "sky", "tang", "leaf"], wrongs = q.opts.filter(function (v) { return v !== q.ans; });
      var faded = Math.random() < k.fade ? pick(wrongs) : null;
      q.opts.forEach(function (v, i) {
        var b = el('<button type="button" class="block c-' + colors[i % 4] + '"></button>'); b.textContent = v;
        if (v === faded) { b.classList.add("faded"); b.disabled = true; b.setAttribute("aria-hidden", "true"); }
        b.addEventListener("click", function () { answer(v, b); });
        opts.appendChild(b);
      });
      busy = false;
      if (limit) {
        tbar.hidden = false; var bar = tbar.querySelector("span");
        (function tick() {
          var left = limit * 1000 - (performance.now() - asked);
          bar.style.width = Math.max(0, left / (limit * 1000) * 100) + "%";
          tbar.classList.toggle("hurry", left < limit * 1000 * 0.3);
          if (left <= 0) { timerRAF = null; if (!busy && !over) timeout(); return; }
          timerRAF = requestAnimationFrame(tick);
        })();
      } else tbar.hidden = true;
    }

    function lockOpts(chosen) {
      opts.querySelectorAll("button").forEach(function (b) {
        b.disabled = true;
        if (Number(b.textContent) === q.ans) b.classList.add("right");
        else if (b === chosen) b.classList.add("wrong");
      });
    }

    function answer(v, btn) {
      if (busy || over) return;
      busy = true; stopTimer();
      var secs = (performance.now() - asked) / 1000, right = v === q.ans;
      lockOpts(btn);
      noteFact(player.id, q.a, q.b, right);
      K.recordAnswer(LESSON, right, right ? null : { q: q.a + " × " + q.b, given: v, answer: q.ans });
      if (right) {
        rightN++; streak++;
        // fast = within 45% of the timer, or within 4 seconds when there's no timer
        var fast = !q.helped && (limit ? secs <= limit * 0.45 : secs <= 4);
        var mult = (fast ? 1.5 : 1) * (streak % 3 === 0 ? 1.5 : 1) * (0.88 + Math.random() * 0.24);
        var dmg = Math.max(1, Math.round(k.dmg * mult));
        ding();
        anim(fa, "lunge-r", 500);
        setTimeout(function () {
          foe.hp = Math.max(0, foe.hp - dmg); hp("b", foe.hp, foe.max);
          anim(fe, "hit", 500); (fast || streak % 3 === 0) ? zap() : bonk();
          pop(fe, "-" + dmg, fast || streak % 3 === 0 ? "big" : "");
          say(streak % 3 === 0 ? "🔥 COMBO x" + streak + "!" : fast ? "⚡ SUPER HIT!" : pick(["Bonk!", "Pow!", "Wham!", "Thwack!", "Boom!"]));
          if (fast || streak % 3 === 0) anim(fa, "glow", 900);
          streakEl.textContent = streak >= 2 ? "🔥 " + streak + " in a row!" : "";
          if (foe.hp <= 0) return setTimeout(function () { end(true); }, 700);
          // a big attack is blocked only by a fast right answer
          if (rage) {
            if (fast) setTimeout(function () { say("🛡️ BLOCKED!"); pop(fa, "Blocked!", "miss"); tone(1500, 0, 0.1, "sine", 0.06); setTimeout(next, 1100); }, 600);
            else setTimeout(function () { enemyHits(1.5, "Too slow to block!"); }, 650);
          } else setTimeout(next, 900);
        }, 300);
      } else {
        wrongN++; streak = 0; streakEl.textContent = "";
        buzz();
        qEl.textContent = q.a + " × " + q.b + " = " + q.ans;
        K.say(q.a + " times " + q.b + " is " + q.ans);
        setTimeout(function () { enemyHits(rage ? 1.6 : 1, null); }, 900);
      }
    }

    function timeout() {
      busy = true; streak = 0; streakEl.textContent = "";
      lockOpts(null);
      noteFact(player.id, q.a, q.b, false);
      K.recordAnswer(LESSON, false, { q: q.a + " × " + q.b, given: "too slow", answer: q.ans });
      qEl.textContent = q.a + " × " + q.b + " = " + q.ans;
      say("⏱️ Too slow!"); buzz();
      K.say("Too slow! " + q.a + " times " + q.b + " is " + q.ans);
      setTimeout(function () { enemyHits(rage ? 1.6 : 1, null); }, 900);
    }

    function enemyHits(mult, line, again) {
      if (over) return;
      var dmg = Math.max(1, Math.round(F.hit * mult * (0.85 + Math.random() * 0.3)));
      anim(fe, "lunge-l", 500);
      setTimeout(function () {
        me.hp = Math.max(0, me.hp - dmg); hp("a", me.hp, me.max);
        anim(fa, "hit", 500); mult > 1.2 ? zap() : bonk();
        if (F.fire && mult > 1.2) fireBurst(fa);
        pop(fa, "-" + dmg, mult > 1.2 ? "big" : "");
        say(line || (mult > 1.2 ? (F.fire ? "🔥 FIRE BREATH!" : "💥 BIG ATTACK!") : pick(["Ouch!", "Oof!", "Bonk!"])));
        if (me.hp <= 0) return setTimeout(function () { end(false); }, 800);
        // the Ice Giant freezes you on a wrong answer: he gets a second hit
        if (F.freeze && !again && !line) {
          setTimeout(function () { say("❄️ FROZEN!"); fa.classList.add("frozen"); setTimeout(function () { fa.classList.remove("frozen"); enemyHits(0.6, "❄️ Ice punch!", true); }, 900); }, 700);
          return;
        }
        setTimeout(next, 1100);
      }, 300);
    }
    function fireBurst(target) {
      if (reduce) return;
      var r = target.getBoundingClientRect();
      for (var i = 0; i < 8; i++) {
        var s = document.createElement("span"); s.className = "adv-flame"; s.textContent = "🔥";
        s.style.left = (r.left + Math.random() * r.width) + "px"; s.style.top = (r.top + r.height * (0.2 + Math.random() * 0.6)) + "px";
        s.style.animationDelay = (i * 40) + "ms";
        document.body.appendChild(s); setTimeout(function (n) { n.remove(); }.bind(null, s), 1000);
      }
    }

    function end(won) {
      if (over) return; over = true; stopTimer();
      w.querySelector(".adv-panel").style.visibility = "hidden";
      var winSide = won ? fa : fe, loseSide = won ? fe : fa;
      loseSide.classList.add("ko"); winSide.classList.add("victory");
      // rewards
      var p2 = P.load(player.id), adv = advOf(p2), d = today(), lines = [], gGain = 0, tGain = 0;
      if (won) {
        adv.wins++;
        if (isBoss) {
          var first = !adv.beaten[F.id];
          adv.beaten[F.id] = (adv.beaten[F.id] || 0) + 1;
          adv.bossDay = adv.bossDay && typeof adv.bossDay === "object" ? adv.bossDay : {};
          if (first) { gGain = F.loot.grapes; tGain = F.loot.tokens; lines.push("🏆 Trophy: " + F.name + "!"); }
          else if (adv.bossDay[F.id] !== d) { gGain = 5; tGain = 2; }
          else lines.push("Already got today's boss prize. Come back tomorrow!");
          adv.bossDay[F.id] = d;
        } else {
          if (!p2.advDay || p2.advDay.d !== d) p2.advDay = { d: d, n: 0 };
          if (p2.advDay.n < DAILY_MONSTERS) { gGain = 1; tGain = 1; }
          else lines.push("No more monster prizes today.");
          p2.advDay.n++;
        }
        if (gGain) { p2.grapes = Math.max(0, Number(p2.grapes) || 0) + gGain; p2.grapesEarned = (Number(p2.grapesEarned) || 0) + gGain; }
        if (tGain) p2.tokens = Math.max(0, Number(p2.tokens) || 0) + tGain;
        P.setHearts(p2, "happy", P.happy(p2) + 1);
      }
      p2.adv = adv;
      P.save(player.id, p2);

      say(won ? F.name + " is beaten!" : F.name + " wins!");
      if (won) { fanfare(); K.celebrate(winSide, isBoss ? ["🏆", "👑", "⭐", "🎉"] : ["⭐", "🍇", "✨"]); } else sad();
      var box = w.querySelector(".ar-end");
      setTimeout(function () {
        box.hidden = false;
        box.innerHTML = '<div class="card"><div class="big"></div><h2></h2><p class="adv-score"></p><p class="fine"></p><div class="rowb"><button type="button" class="block c-sun adv-again">⚔️ Fight again</button><button type="button" class="block c-leaf adv-done">Back</button></div></div>';
        txt(box, ".big", won ? (isBoss ? "🏆" : "⭐") : "💪");
        txt(box, "h2", won ? "You beat the " + F.name + "!" : F.name + " was too strong!");
        txt(box, ".adv-score", "✅ " + rightN + " right · ❌ " + wrongN + " wrong");
        var prize = gGain || tGain ? "You won 🍇 " + gGain + " and 🎟️ " + tGain + ". " : "";
        txt(box, ".fine", won ? prize + lines.join(" ") : "No prize this time. Win monster fights and lessons for tokens, train in the gym, then come back stronger!");
        K.say(won ? (isBoss ? "You beat the " + F.name + "! Amazing!" : "You won! ") + (gGain ? "You get " + gGain + (gGain === 1 ? " grape" : " grapes") + " and " + tGain + (tGain === 1 ? " token!" : " tokens!") : "")
          : "The " + F.name + " was too strong this time. Train in the gym and come back!");
        box.querySelector(".adv-again").addEventListener("click", function () { w.remove(); fight(player, W, F, isBoss, after); });
        box.querySelector(".adv-done").addEventListener("click", function () { w.remove(); after(); });
      }, 1300);
    }
  }

  window.KidsAdventure = { open: open, WORLDS: WORLDS, kit: kit };
})();
