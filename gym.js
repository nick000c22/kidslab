/* Teddy Gym and Battles.
   Four stats: Strength, Endurance, Speed, Brains. Each gym session costs 1 gym token (2 are earned per completed quiz)
   and adds +10 (or +20 for a great workout). Stats are capped by size: Baby 250, Little 500, Big 1000.
   Battles are against another kid's saved teddy. The win chance comes from both teddies' total stats with a luck floor
   (an untrained bear still wins about 1 in 8), then a fight is animated that ends that way.
   Winner gets 3 grapes, loser 1; nothing is ever lost. Battle grapes are capped at 5 battles a day. */
(function () {
  var K = window.KidsLab, P = window.KidsPet;
  if (!K || !P) return;
  var CAPS = [0, 250, 500, 1000], GAIN = 10, DAILY = 5, WIN_GRAPES = 3, LOSE_GRAPES = 1;
  // Training gets dearer as a stat climbs: 1 token below 200, 2 from 200, 3 from 400, 4 from 600, 5 from 800.
  // Maxing one stat takes about 150 tokens (75 quizzes) with great workouts, so it's a long-term goal.
  var TIER = 200;
  function costFor(v) { return 1 + Math.floor(Math.min(999, v || 0) / TIER); }
  function nextTierAt(v) { var c = costFor(v); return c >= 5 ? null : c * TIER; }
  // The battle maths was tuned on a 0-30 scale; stats are 0-1000, so they're shrunk for the maths
  // and the health/damage numbers are shown 10x bigger.
  var SCALE = 1000 / 30, SHOW = 10;
  function small(f) { return { str: (f.str || 0) / SCALE, end: (f.end || 0) / SCALE, spd: (f.spd || 0) / SCALE, brn: (f.brn || 0) / SCALE }; }
  function tokens(p) { return Math.max(0, Number(p.tokens) || 0); }
  var STATS = [
    { id: "str", name: "Strength", icon: "💪", color: "berry", game: "Lift the weights!", how: "Tap LIFT as fast as you can!" },
    { id: "end", name: "Endurance", icon: "❤️", color: "leaf", game: "Treadmill run", how: "Tap RUN when the dot is in the green!" },
    { id: "spd", name: "Speed", icon: "⚡", color: "sun", game: "Sprint start", how: "Wait for GREEN, then tap GO!" },
    { id: "brn", name: "Brains", icon: "🧠", color: "grape", game: "Brain training", how: "Answer the sums quickly!" }
  ];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function txt(node, sel, t) { node.querySelector(sel).textContent = t; }

  function capFor(id) { return CAPS[Math.max(1, P.stageFor(K.stars(id)))]; }
  function total(f) { return (f.str || 0) + (f.end || 0) + (f.spd || 0) + (f.brn || 0); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  /* ---------- battle energy (Adventure monsters + cousin battles share it; boss fights are free) ----------
     5 a day, plus 1 more for every 200 Endurance (so 10 at 1000). Starting a fight uses one.
     "Gain battle strength" (a 5-question quiz on the kid's weak spots) adds STRENGTH_GAIN more for today. */
  var FIGHTS_BASE = 5, FIGHTS_PER = 200, STRENGTH_GAIN = 1;
  function fightsBonus(p) { return p.fights && p.fights.d === today() ? Number(p.fights.bonus) || 0 : 0; }
  function fightsMax(p) { return FIGHTS_BASE + Math.floor(((p.fit && p.fit.end) || 0) / FIGHTS_PER) + fightsBonus(p); }
  function fightsUsed(p) { return p.fights && p.fights.d === today() ? Number(p.fights.n) || 0 : 0; }
  function fightsLeft(id) { var p = P.load(id); return Math.max(0, fightsMax(p) - fightsUsed(p)); }
  function nextFightAt(p) { var e = (p.fit && p.fit.end) || 0, n = (Math.floor(e / FIGHTS_PER) + 1) * FIGHTS_PER; return n <= 1000 ? n : null; }
  function fightsLine(id) {
    var p = P.load(id), left = fightsLeft(id), max = fightsMax(p), nx = nextFightAt(p);
    return "⚡ " + left + " of " + max + " energy left today (bosses are free)." + (nx ? " Train ❤️ Endurance to " + nx + " for more energy every day!" : "");
  }
  // The energy bar: one bolt per fight, lit while it's still there to use.
  function energyBar(id) {
    var p = P.load(id), left = fightsLeft(id), max = fightsMax(p), cells = "";
    for (var i = 0; i < max; i++) cells += '<span class="' + (i < left ? "on" : "") + '">⚡</span>';
    return '<div class="g-energy' + (left ? "" : " empty") + '" role="img" aria-label="' + left + " of " + max + ' energy left">' +
      '<b>Energy</b><span class="g-cells">' + cells + '</span><em>' + left + " / " + max + "</em></div>";
  }
  // Off to a 5-question quiz on the things this kid finds tricky. Finishing it adds energy, then comes back to the gym.
  function gainStrength() {
    try { sessionStorage.setItem("kidslab.visit", "1"); sessionStorage.setItem("kidslab.reopen", "gym"); } catch (e) {}
    K.say("Let's gain battle strength! Get five right.");
    setTimeout(function () { location.href = "lessons/basics.html?l=strength"; }, 300);
  }
  function strengthButton(label) {
    var b = el('<button type="button" class="block c-leaf g-strength"><span class="emoji">💪</span><span class="label">Gain battle strength</span><span class="g-sub"></span></button>');
    txt(b, ".g-sub", label || "5 tricky questions = ⚡ +" + STRENGTH_GAIN + " energy");
    b.addEventListener("click", gainStrength);
    return b;
  }
  // Uses up one fight. Returns false (and says so) when there are none left.
  function useFight(id) {
    var p = P.load(id);
    if (fightsMax(p) - fightsUsed(p) <= 0) {
      K.say("Out of energy! Tap Gain battle strength and get five questions right for more.");
      return false;
    }
    p.fights = { d: today(), n: fightsUsed(p) + 1, bonus: fightsBonus(p) };
    P.save(id, p);
    return true;
  }

  /* ---------- sound ---------- */
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
  function whoosh() { tone(900, 0, 0.08, "sine", 0.05); tone(500, 0.05, 0.1, "sine", 0.04); }
  function zap() { [600, 900, 1200, 1500].forEach(function (f, i) { tone(f, i * 0.05, 0.08, "square", 0.06); }); }
  function fanfare() { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.14, "square", 0.07); }); }
  function beep(f) { tone(f || 880, 0, 0.07); }

  /* ---------- shell ---------- */
  function overlay(cls) {
    var w = document.createElement("div"); w.className = "gym-wrap " + (cls || "");
    document.body.appendChild(w);
    return w;
  }
  function bars(f, cap) {
    return STATS.map(function (S) {
      var v = f[S.id] || 0;
      return '<div class="g-stat"><span class="g-ic">' + S.icon + '</span><span class="g-nm">' + S.name + '</span>' +
        '<span class="g-bar"><span class="c-' + S.color + '" style="width:' + Math.min(100, v / cap * 100) + '%"></span></span><span class="g-v">' + v + " / " + cap + "</span></div>";
    }).join("");
  }

  /* ---------- the gym ---------- */
  var onClose = null;
  function open(player, after) {
    onClose = after;
    var pet = P.load(player.id), stars = K.stars(player.id), cap = capFor(player.id);
    if (!pet.hatched) { K.say("Hatch your egg first!"); return; }
    markSeen(player.id);
    var w = overlay();
    w.innerHTML =
      '<div class="gym">' +
      '<div class="g-top"><button class="round small g-back" type="button" aria-label="Back">⬅️</button><h2>🏋️ ' + esc(pet.name) + "'s Gym</h2>" +
      '<div class="stars" title="Gym tokens"><span>🎟️</span><span class="g-grapes"></span></div></div>' +
      '<div class="g-hero"><div class="g-bear"></div><div class="g-side"><div class="g-stats"></div><div class="g-power"></div><p class="g-tip"></p></div></div>' +
      '<h3 class="ward-h">Train (finish a quiz to win 🎟️ 2. The stronger a stat gets, the more tokens it costs)</h3>' +
      '<div class="g-train"></div>' +
      '<div class="g-energy-box"></div>' +
      '<div class="g-fight-row"><button class="block c-berry g-battle" type="button"><span class="emoji">⚔️</span><span class="label">Battle!</span><span class="g-sub">Challenge a cousin\'s teddy</span></button></div>' +
      '<div class="g-record"></div>' +
      "</div>";
    function draw() {
      var p2 = P.load(player.id), c2 = capFor(player.id);
      w.querySelector(".g-grapes").textContent = tokens(p2);
      w.querySelector(".g-bear").innerHTML = P.teddySVG(Math.max(1, P.stageFor(K.stars(player.id))), p2);
      w.querySelector(".g-stats").innerHTML = bars(p2.fit, c2);
      w.querySelector(".g-power").textContent = "Power " + total(p2.fit) + " / " + c2 * 4;
      w.querySelector(".g-tip").textContent = total(p2.fit) >= c2 * 4 ? "Maxed out! Earn stars so " + p2.name + " grows bigger and can train more." : "Stats can go up to " + c2 + " while " + p2.name + " is a " + P.STAGES[Math.max(1, P.stageFor(K.stars(player.id))) - 1].name.toLowerCase() + ".";
      var rec = record(player.id);
      w.querySelector(".g-record").textContent = "Battles: " + rec.w + " won, " + rec.l + " lost. " + fightsLine(player.id);
      w.querySelector(".g-energy-box").innerHTML = energyBar(player.id);
      var row = w.querySelector(".g-fight-row"), old = row.querySelector(".g-strength");
      if (old) old.remove();
      row.appendChild(strengthButton());
      w.querySelector(".g-battle").classList.toggle("tired", fightsLeft(player.id) <= 0);
      var tr = w.querySelector(".g-train"); tr.innerHTML = "";
      STATS.forEach(function (S) {
        var full = (p2.fit[S.id] || 0) >= c2;
        var b = el('<button type="button" class="block c-' + S.color + ' g-tile"><span class="emoji"></span><span class="label"></span><span class="g-sub"></span></button>');
        var v = p2.fit[S.id] || 0, cost = costFor(v), nt = nextTierAt(v);
        txt(b, ".emoji", S.icon); txt(b, ".label", S.name);
        txt(b, ".g-sub", full ? "Full! Grow bigger" : S.id === "end" ? S.game + " · more fights a day" : S.game);
        if (!full) {
          var cs = document.createElement("span"); cs.className = "g-cost"; cs.textContent = new Array(cost + 1).join("🎟️"); cs.setAttribute("aria-label", "Costs " + cost + (cost === 1 ? " token" : " tokens"));
          b.appendChild(cs);
          if (nt && nt <= c2) { var nx = document.createElement("span"); nx.className = "g-next"; nx.textContent = "Costs " + (cost + 1) + " from " + nt; b.appendChild(nx); }
        }
        if (full) b.classList.add("locked");
        b.addEventListener("click", function () {
          var p3 = P.load(player.id);
          if ((p3.fit[S.id] || 0) >= capFor(player.id)) { K.say(p3.name + " needs to grow bigger first. Earn stars in your lessons!"); return; }
          var need = costFor(p3.fit[S.id] || 0);
          if (tokens(p3) < need) { K.say(S.name + " training costs " + need + " tokens now. You have " + tokens(p3) + ". Finish a quiz to win 2 more!"); return; }
          train(player, S, function () { draw(); });
        });
        tr.appendChild(b);
      });
    }
    draw();
    w.querySelector(".g-back").addEventListener("click", function () { w.remove(); if (onClose) onClose(); });
    w.querySelector(".g-battle").addEventListener("click", function () { chooseOpponent(player, draw); });
    K.say("Welcome to the gym! What shall we train?");
  }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- mini-games ---------- */
  function train(player, S, done) {
    var w = overlay("g-game-wrap");
    w.innerHTML = '<div class="g-game"><h2></h2><p class="g-how"></p><div class="g-arena"></div><div class="g-ctl"></div></div>';
    txt(w, "h2", S.icon + " " + S.game); txt(w, ".g-how", S.how);
    K.say(S.how);
    var pet = P.load(player.id), arena = w.querySelector(".g-arena"), ctl = w.querySelector(".g-ctl");
    arena.innerHTML = '<div class="g-mini-bear">' + P.teddySVG(Math.max(1, P.stageFor(K.stars(player.id))), pet) + "</div>";
    var bear = arena.querySelector(".g-mini-bear");
    function finish(great, detail) {
      var p2 = P.load(player.id), cap = capFor(player.id), before = p2.fit[S.id] || 0, gain = great ? GAIN * 2 : GAIN;
      p2.fit[S.id] = Math.min(cap, before + gain);
      p2.tokens = tokens(p2) - costFor(before);
      P.setHearts(p2, "happy", P.happy(p2) + 1);
      P.save(player.id, p2);
      var added = p2.fit[S.id] - before;
      ctl.innerHTML = "";
      var msg = el('<div class="g-result"><div class="g-big"></div><p></p><button type="button" class="block c-leaf">Yay! ▶</button></div>');
      txt(msg, ".g-big", (great ? "🌟 Great workout! " : "👍 Good workout! ") + "+" + added + " " + S.name);
      txt(msg, "p", detail);
      ctl.appendChild(msg);
      bear.classList.remove("lifting"); bear.classList.add("happy-jump");
      fanfare(); K.celebrate(bear, [S.icon, "⭐", "✨"]);
      K.say((great ? "Great workout! " : "Good workout! ") + p2.name + " got " + added + " more " + S.name.toLowerCase() + "!");
      msg.querySelector("button").addEventListener("click", function () { w.remove(); done(); });
    }
    ({ str: gameLift, end: gameTreadmill, spd: gameSprint, brn: gameBrains })[S.id](arena, ctl, bear, finish);
  }

  // Strength: tap as fast as possible for 5 seconds.
  function gameLift(arena, ctl, bear, finish) {
    var taps = 0, TARGET = 18, started = false, t0 = 0, LEN = 5000;
    arena.insertAdjacentHTML("beforeend", '<div class="g-dumbbell" aria-hidden="true">🏋️</div><div class="g-meter"><span></span></div><div class="g-count">0</div>');
    var meter = arena.querySelector(".g-meter span"), count = arena.querySelector(".g-count"), db = arena.querySelector(".g-dumbbell");
    var btn = el('<button type="button" class="block c-berry g-go">💪 LIFT!</button>');
    ctl.appendChild(btn);
    btn.addEventListener("click", function () {
      if (!started) { started = true; t0 = performance.now(); tick(); }
      taps++; count.textContent = taps; beep(300 + taps * 20);
      db.classList.remove("up"); void db.offsetWidth; db.classList.add("up");
      bear.classList.add("lifting");
    });
    function tick() {
      var left = LEN - (performance.now() - t0);
      meter.style.width = Math.max(0, left / LEN * 100) + "%";
      if (left > 0) requestAnimationFrame(tick);
      else { btn.disabled = true; finish(taps >= TARGET, taps + " lifts in 5 seconds!" + (taps >= TARGET ? "" : " Get " + TARGET + " for a great workout.")); }
    }
  }

  // Endurance: a dot runs back and forth; tap when it's in the green zone. 6 tries.
  function gameTreadmill(arena, ctl, bear, finish) {
    arena.insertAdjacentHTML("beforeend", '<div class="g-track"><span class="g-zone"></span><span class="g-dot"></span></div><div class="g-count">0 / 6</div>');
    var dot = arena.querySelector(".g-dot"), count = arena.querySelector(".g-count"), tries = 0, hits = 0, pos = 0, dir = 1, speed = 0.9, running = true, last = performance.now();
    var btn = el('<button type="button" class="block c-leaf g-go">🏃 RUN!</button>');
    ctl.appendChild(btn);
    bear.classList.add("running");
    (function move(now) {
      var dt = (now - last) / 1000; last = now;
      pos += dir * speed * dt; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; }
      dot.style.left = (pos * 100) + "%";
      if (running) requestAnimationFrame(move);
    })(last);
    btn.addEventListener("click", function () {
      if (!running) return;
      tries++;
      var hit = pos > 0.38 && pos < 0.62;
      if (hit) { hits++; beep(990); dot.classList.add("ok"); } else { beep(220); dot.classList.add("miss"); }
      setTimeout(function () { dot.classList.remove("ok", "miss"); }, 250);
      speed += 0.12;
      count.textContent = hits + " / 6";
      if (tries >= 6) { running = false; btn.disabled = true; bear.classList.remove("running"); finish(hits >= 4, hits + " out of 6 steps in the green!" + (hits >= 4 ? "" : " Get 4 for a great workout.")); }
    });
  }

  // Speed: reaction time. Wait for green, tap. 3 rounds.
  function gameSprint(arena, ctl, bear, finish) {
    arena.insertAdjacentHTML("beforeend", '<div class="g-light red" aria-live="polite">Wait…</div><div class="g-count">Round 1 of 3</div>');
    var light = arena.querySelector(".g-light"), count = arena.querySelector(".g-count"), round = 0, times = [], state = "wait", startAt = 0, timer = null;
    var btn = el('<button type="button" class="block c-sun g-go">⚡ GO!</button>');
    ctl.appendChild(btn);
    function next() {
      round++; count.textContent = "Round " + round + " of 3";
      light.className = "g-light red"; light.textContent = "Wait…"; state = "wait";
      timer = setTimeout(function () { state = "go"; light.className = "g-light green"; light.textContent = "GO!"; startAt = performance.now(); beep(1200); }, rnd(1200, 3000));
    }
    btn.addEventListener("click", function () {
      if (state === "wait") { clearTimeout(timer); light.textContent = "Too soon! 🙈"; light.className = "g-light amber"; times.push(1200); beep(200); setTimeout(after, 900); state = "pause"; return; }
      if (state !== "go") return;
      var ms = Math.round(performance.now() - startAt); times.push(ms); state = "pause";
      light.textContent = (ms / 1000).toFixed(2) + "s"; bear.classList.remove("dash"); void bear.offsetWidth; bear.classList.add("dash"); whoosh();
      setTimeout(after, 900);
    });
    function after() {
      if (round < 3) return next();
      btn.disabled = true;
      var avg = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length);
      finish(avg < 650, "Average start: " + (avg / 1000).toFixed(2) + " seconds." + (avg < 650 ? "" : " Under 0.65 for a great workout."));
    }
    next();
  }

  // Brains: 5 quick sums with 3 choices.
  function gameBrains(arena, ctl, bear, finish) {
    arena.insertAdjacentHTML("beforeend", '<div class="g-sumq"></div><div class="g-count">0 right</div>');
    var q = arena.querySelector(".g-sumq"), count = arena.querySelector(".g-count"), n = 0, right = 0;
    function ask() {
      n++;
      var a = rnd(1, 9), b = rnd(1, 9), sub = Math.random() < 0.35 && a !== b, x = Math.max(a, b), y = Math.min(a, b);
      var ans = sub ? x - y : a + b, sum = sub ? x + " − " + y : a + " + " + b;
      q.textContent = sum + " = ?";
      K.say(sum.replace("−", "minus").replace("+", "plus"));
      var opts = [ans]; while (opts.length < 3) { var v = ans + rnd(-3, 3); if (v >= 0 && opts.indexOf(v) === -1) opts.push(v); }
      opts.sort(function (m, k) { return m - k; });
      ctl.innerHTML = "";
      var row = el('<div class="g-opts"></div>'); ctl.appendChild(row);
      opts.forEach(function (v, i) {
        var bt = el('<button type="button" class="block c-' + ["grape", "sky", "tang"][i] + '"></button>'); bt.textContent = v;
        bt.addEventListener("click", function () {
          if (v === ans) { right++; beep(990); bear.classList.remove("think"); void bear.offsetWidth; bear.classList.add("think"); } else beep(220);
          count.textContent = right + " right";
          if (n < 5) ask(); else finish(right >= 4, right + " out of 5 sums right!" + (right >= 4 ? "" : " Get 4 for a great workout."));
        });
        row.appendChild(bt);
      });
    }
    ask();
  }

  /* ---------- battles ---------- */
  function record(id) {
    var log = K.get("battles", []), w = 0, l = 0, seen = {};
    log.forEach(function (b) { if (seen[b.id]) return; seen[b.id] = 1; if (b.a === id || b.b === id) { if (b.winner === id) w++; else l++; } });
    return { w: w, l: l };
  }
  function opponents(me) {
    return K.visiblePlayers().filter(function (p) { return p.id !== me.id; }).map(function (p) {
      var pet = P.load(p.id);
      return { p: p, pet: pet, stars: K.stars(p.id) };
    }).filter(function (o) { return o.pet.hatched; });
  }

  function chooseOpponent(player, after) {
    var list = opponents(player), w = overlay();
    w.innerHTML = '<div class="gym"><div class="g-top"><button class="round small g-back" type="button" aria-label="Back">⬅️</button><h2>⚔️ Who will you battle?</h2></div>' + energyBar(player.id) + '<div class="g-out"></div><div class="g-opps"></div><p class="g-tip"></p></div>';
    if (fightsLeft(player.id) <= 0) w.querySelector(".g-out").appendChild(strengthButton("Out of energy! 5 tricky questions = ⚡ +" + STRENGTH_GAIN));
    var box = w.querySelector(".g-opps");
    if (!list.length) box.innerHTML = '<p class="g-tip">No other teddies have hatched yet. Check back soon!</p>';
    list.forEach(function (o) {
      var b = el('<button type="button" class="g-opp"><span class="g-opp-bear"></span><span class="g-opp-name"></span><span class="g-opp-sub"></span><span class="g-opp-power"></span></button>');
      b.querySelector(".g-opp-bear").innerHTML = P.teddySVG(Math.max(1, P.stageFor(o.stars)), o.pet);
      txt(b, ".g-opp-name", o.pet.name || "Teddy");
      txt(b, ".g-opp-sub", o.p.emoji + " " + o.p.name + "'s teddy");
      txt(b, ".g-opp-power", "Power " + total(o.pet.fit));
      b.addEventListener("click", function () { if (!useFight(player.id)) return; w.remove(); battle(player, o, after); });
      box.appendChild(b);
    });
    var me = P.load(player.id), day = me.battleDay && me.battleDay.d === today() ? me.battleDay.n : 0;
    w.querySelector(".g-tip:last-child").textContent = fightsLine(player.id) + " " + (day >= DAILY ? "You can still battle for fun, but no more battle grapes today." : "Win 🍇 " + WIN_GRAPES + " grapes. Even if you lose you get 🍇 " + LOSE_GRAPES + ". (" + (DAILY - day) + " grape battles left today)");
    w.querySelector(".g-back").addEventListener("click", function () { w.remove(); });
    K.say("Who will you battle?");
  }

  // Decide the winner from total power with a luck floor, then build a fight that ends that way.
  function winChance(A, B) { A = small(A); B = small(B); var a = total(A), b = total(B), c = 10; return Math.max(0.12, Math.min(0.88, (a + c) / (a + b + 2 * c))); }
  function script(A, B, aWins) {
    A = small(A); B = small(B);
    function hpOf(s) { return Math.round(30 * (1 + (s.end || 0) * 0.025)); }
    for (var tries = 0; tries < 300; tries++) {
      var a = { s: A, hp: hpOf(A) }, b = { s: B, hp: hpOf(B) }; a.max = a.hp; b.max = b.hp;
      var att = ((A.spd || 0) + Math.random() * 10) >= ((B.spd || 0) + Math.random() * 10) ? a : b, def = att === a ? b : a, ev = [];
      // The planned winner gets a lucky boost when the plan is an upset, so the fight looks like it.
      var boostA = aWins ? 1 + Math.max(0, total(B) - total(A)) * 0.012 : 1, boostB = !aWins ? 1 + Math.max(0, total(A) - total(B)) * 0.012 : 1;
      for (var t = 0; t < 14; t++) {
        var dodge = Math.min(0.3, 0.08 + Math.max(0, (def.s.spd || 0) - (att.s.spd || 0)) * 0.008);
        if (Math.random() < dodge) ev.push({ who: att === a ? "a" : "b", type: "dodge" });
        else {
          var special = Math.random() < Math.min(0.35, 0.1 + (att.s.brn || 0) * 0.008);
          var dmg = Math.max(1, Math.round(6 * (1 + (att.s.str || 0) * 0.025) * (0.35 + Math.random() * 1.3) * (special ? 1.6 : 1) * (att === a ? boostA : boostB)));
          def.hp = Math.max(0, def.hp - dmg);
          ev.push({ who: att === a ? "a" : "b", type: special ? "special" : "hit", dmg: dmg, hpA: a.hp, hpB: b.hp });
          if (def.hp <= 0) break;
        }
        var tmp = att; att = def; def = tmp;
      }
      var winner = a.hp <= 0 ? "b" : b.hp <= 0 ? "a" : null;
      if (winner === (aWins ? "a" : "b")) return { ev: ev, maxA: a.max, maxB: b.max };
    }
    // Fallback: a short, clear fight for the planned winner.
    var mA = hpOf(A), mB = hpOf(B), hpA = mA, hpB = mB, evs = [];
    while (aWins ? hpB > 0 : hpA > 0) {
      var d = rnd(6, 11);
      if (aWins) { hpB = Math.max(0, hpB - d); evs.push({ who: "a", type: "hit", dmg: d, hpA: hpA, hpB: hpB }); }
      else { hpA = Math.max(0, hpA - d); evs.push({ who: "b", type: "hit", dmg: d, hpA: hpA, hpB: hpB }); }
    }
    return { ev: evs, maxA: mA, maxB: mB };
  }

  var SPECIALS = ["🧮 Maths Blast!", "➕ Plus Punch!", "✖️ Times Twister!", "🍇 Grape Shot!", "🔢 Number Crunch!"];

  function battle(player, opp, after) {
    var me = P.load(player.id), myStars = K.stars(player.id);
    var aWins = Math.random() < winChance(me.fit, opp.pet.fit);
    var sc = script(me.fit, opp.pet.fit, aWins);
    sc.maxA *= SHOW; sc.maxB *= SHOW;
    sc.ev.forEach(function (e) { if (e.dmg) e.dmg *= SHOW; if (e.hpA != null) e.hpA *= SHOW; if (e.hpB != null) e.hpB *= SHOW; });
    var w = overlay("g-battle-wrap");
    w.innerHTML =
      '<div class="arena">' +
      '<div class="ar-hp"><div class="hpbox a"><b></b><span class="hp"><span></span></span><em></em></div><div class="vs">VS</div><div class="hpbox b"><b></b><span class="hp"><span></span></span><em></em></div></div>' +
      '<div class="ar-floor"><div class="fighter a"></div><div class="fighter b"><div class="flip"></div></div><div class="ar-call" aria-live="polite"></div></div>' +
      '<div class="ar-end" hidden></div>' +
      "</div>";
    var fa = w.querySelector(".fighter.a"), fb = w.querySelector(".fighter.b"), call = w.querySelector(".ar-call");
    fa.innerHTML = P.teddySVG(Math.max(1, P.stageFor(myStars)), me);
    fb.querySelector(".flip").innerHTML = P.teddySVG(Math.max(1, P.stageFor(opp.stars)), opp.pet);
    txt(w, ".hpbox.a b", me.name); txt(w, ".hpbox.b b", opp.pet.name || "Teddy");
    function hp(side, v, max) { var box = w.querySelector(".hpbox." + side); box.querySelector(".hp span").style.width = Math.max(0, v / max * 100) + "%"; box.querySelector("em").textContent = Math.max(0, v) + " / " + max; box.classList.toggle("low", v / max < 0.3); }
    hp("a", sc.maxA, sc.maxA); hp("b", sc.maxB, sc.maxB);
    function say(t) { call.textContent = t; call.classList.remove("pop"); void call.offsetWidth; call.classList.add("pop"); }
    function pop(target, text, cls) {
      var r = target.getBoundingClientRect(), d = document.createElement("span");
      d.className = "dmg " + (cls || ""); d.textContent = text;
      d.style.left = (r.left + r.width / 2) + "px"; d.style.top = (r.top + r.height * 0.25) + "px";
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1100);
    }
    function anim(node, cls, ms) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); setTimeout(function () { node.classList.remove(cls); }, ms || 600); }

    say("Ready…"); K.say(me.name + " versus " + (opp.pet.name || "Teddy") + "! Ready, fight!");
    var step = 0, STEP_MS = reduce ? 700 : 1150;
    setTimeout(function () { say("FIGHT!"); fanfare(); setTimeout(play, 700); }, 1200);
    function play() {
      if (step >= sc.ev.length) return end();
      var e = sc.ev[step++], att = e.who === "a" ? fa : fb, def = e.who === "a" ? fb : fa, attName = e.who === "a" ? me.name : (opp.pet.name || "Teddy"), defName = e.who === "a" ? (opp.pet.name || "Teddy") : me.name;
      anim(att, e.who === "a" ? "lunge-r" : "lunge-l", 500);
      setTimeout(function () {
        if (e.type === "dodge") { anim(def, "dodge", 600); whoosh(); pop(def, "Dodged!", "miss"); say(defName + " dodges!"); }
        else {
          anim(def, "hit", 500); e.type === "special" ? zap() : bonk();
          pop(def, "-" + e.dmg, e.type === "special" ? "big" : "");
          if (e.type === "special") { var sp = pick(SPECIALS); say(attName + ": " + sp); anim(att, "glow", 900); } else say(pick(["Bonk!", "Boom!", "Pow!", "Wham!", "Thwack!"]));
          hp("a", e.hpA, sc.maxA); hp("b", e.hpB, sc.maxB);
        }
        setTimeout(play, STEP_MS - 300);
      }, 300);
    }
    function end() {
      var winSide = aWins ? fa : fb, loseSide = aWins ? fb : fa;
      loseSide.classList.add("ko"); winSide.classList.add("victory");
      var winnerName = aWins ? me.name : (opp.pet.name || "Teddy");
      say(winnerName + " wins!");
      fanfare(); K.celebrate(winSide, ["🏆", "⭐", "🎉"]);
      // rewards (daily cap) and the shared battle record
      var p2 = P.load(player.id), d = today();
      if (!p2.battleDay || p2.battleDay.d !== d) p2.battleDay = { d: d, n: 0 };
      var paid = p2.battleDay.n < DAILY, gain = paid ? (aWins ? WIN_GRAPES : LOSE_GRAPES) : 0;
      p2.battleDay.n++;
      if (gain) p2.grapes = (Number(p2.grapes) || 0) + gain;
      P.setHearts(p2, "happy", P.happy(p2) + (aWins ? 1 : 0));
      P.save(player.id, p2);
      K.postBattle({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), a: player.id, b: opp.p.id, winner: aWins ? player.id : opp.p.id, aName: me.name, bName: opp.pet.name || "Teddy" });
      var box = w.querySelector(".ar-end");
      box.hidden = false;
      box.innerHTML = '<div class="card"><div class="big"></div><h2></h2><p class="fine"></p><div class="rowb"><button type="button" class="block c-sun g-again-btn">⚔️ Battle again</button><button type="button" class="block c-leaf g-done-btn">Back to the gym</button></div></div>';
      txt(box, ".big", aWins ? "🏆" : "💪");
      txt(box, "h2", aWins ? me.name + " wins!" : (opp.pet.name || "Teddy") + " wins this time!");
      txt(box, ".fine", (gain ? "+🍇 " + gain + (gain === 1 ? " grape" : " grapes") + ". " : "No more battle grapes today. ") + (aWins ? "What a fight!" : "Train in the gym and try again!"));
      K.say(aWins ? me.name + " wins! " + (gain ? "You get " + gain + " grapes!" : "") : (opp.pet.name || "Teddy") + " wins this time. " + (gain ? "Here's a grape for trying! " : "") + "Train harder and try again!");
      box.querySelector(".g-again-btn").addEventListener("click", function () { w.remove(); chooseOpponent(player, after); });
      box.querySelector(".g-done-btn").addEventListener("click", function () { w.remove(); after(); });
    }
  }

  /* ---------- notices for the teddy that was challenged ---------- */
  function unseen(id) {
    var pet = P.load(id), since = pet.lastBattleSeen || "";
    return K.get("battles", []).some(function (b) { return b.b === id && (b.at || "") > since; }) ? true : false;
  }
  function markSeen(id) { var p = P.load(id); p.lastBattleSeen = new Date().toISOString(); P.save(id, p); }
  function notices(player) {
    var pet = P.load(player.id), since = pet.lastBattleSeen || "", seen = {};
    var mine = K.get("battles", []).filter(function (b) { if (seen[b.id]) return false; seen[b.id] = 1; return b.b === player.id && (b.at || "") > since; });
    if (!mine.length) return;
    markSeen(player.id);
    var won = mine.filter(function (b) { return b.winner === player.id; }).length;
    var w = overlay();
    var roster = K.visiblePlayers();
    function kid(id) { for (var i = 0; i < roster.length; i++) if (roster[i].id === id) return roster[i]; return { name: id, emoji: "🙂" }; }
    w.innerHTML = '<div class="gym g-news"><h2>📣 While you were away…</h2><div class="g-list"></div><p class="g-tip"></p><button type="button" class="block c-leaf">OK!</button></div>';
    var list = w.querySelector(".g-list");
    mine.slice(-6).forEach(function (b) {
      var k = kid(b.a), line = el('<div class="g-line"><span class="g-res"></span><span></span></div>');
      txt(line, ".g-res", b.winner === player.id ? "🏆" : "💥");
      line.lastChild.textContent = k.emoji + " " + k.name + "'s " + (b.aName || "teddy") + " challenged " + pet.name + ". " + (b.winner === player.id ? pet.name + " WON!" : b.aName + " won this time.");
      list.appendChild(line);
    });
    w.querySelector(".g-tip").textContent = won ? pet.name + " defended the gym " + won + (won === 1 ? " time" : " times") + "!" : "Go to the gym to train, then challenge them back!";
    K.say(won ? pet.name + " won " + won + " battle" + (won === 1 ? "" : "s") + " while you were away!" : "Someone challenged " + pet.name + "! Train in the gym and get them back!");
    w.querySelector(".block").addEventListener("click", function () { w.remove(); });
  }

  window.KidsGym = { useFight: useFight, fightsLeft: fightsLeft, fightsLine: fightsLine, energyBar: energyBar, gainStrength: gainStrength, strengthButton: strengthButton, open: open, notices: notices, unseen: unseen, winChance: winChance, script: script, total: total };
})();
