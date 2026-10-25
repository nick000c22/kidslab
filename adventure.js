/* Teddy Adventure: a world map of five lands, each with small monsters and a big boss.
   Fights are moves, not sums (the sums are in the lessons, which pay the grapes and tokens):
     ⚔️ Attack  a normal hit (sometimes a lucky crit)
     🛡️ Block   no hit, but the monster only does a quarter damage
     ✨ Super   a huge hit, ready after 3 moves
   Bosses warn you a turn before their big attack: Block it, or it hits twice as hard.
   Gym stats decide who wins: Strength = hit power, Endurance = health, Speed = dodge chance,
   Brains = Super power. It's a grind on purpose: losing gives nothing (and costs nothing).
   Rough stats needed (all four about the same): Crab ~100, Troll ~300, Goblin King ~500,
   Ice Giant ~600, Dragon ~800 (needs a Big teddy).
   Fights a day are limited (5, more with Endurance; see gym.js) and shared with cousin battles.
   Tokens come from lessons, not fights. Rewards: monster win 🍇2. Boss: big loot (grapes + tokens)
   the first time, 🍇5 once a day after that. Progress lives on the teddy (pet.adv), so it syncs. */
(function () {
  var K = window.KidsLab, P = window.KidsPet;
  if (!K || !P) return;


  /* ---------- the lands ---------- */
  // hp/hit: monster health and damage. rage: boss big attack every N turns (0 = never).
  var WORLDS = [
    { id: "island", name: "Teddy Island", icon: "🏝️", sky: "island", x: 16, y: 74,
      intro: "Home sweet home, with sandy beaches and one very grumpy crab.",
      monsters: [
        { id: "snail", name: "Slow Snail", face: "🐌", hp: 40, hit: 8 },
        { id: "bee", name: "Buzzy Bee", face: "🐝", hp: 55, hit: 10 },
        { id: "seagull", name: "Cheeky Seagull", face: "🐦", hp: 70, hit: 12 }
      ],
      boss: { id: "crab", name: "Grumpy Crab", face: "🦀", hp: 170, hit: 14, rage: 0, level: 1,
        loot: { grapes: 15, tokens: 4 }, taunt: "Snip snap! Nobody gets past my beach!", power: "Snappy claws" } },
    { id: "forest", name: "Whispering Forest", icon: "🌲", sky: "forest", x: 36, y: 44,
      intro: "Tall trees, sneaky creatures, and a troll who loves to SMASH.",
      monsters: [
        { id: "spider", name: "Wiggly Spider", face: "🕷️", hp: 80, hit: 14 },
        { id: "wolf", name: "Howly Wolf", face: "🐺", hp: 110, hit: 17 },
        { id: "boar", name: "Grumbly Boar", face: "🐗", hp: 140, hit: 20 }
      ],
      boss: { id: "troll", name: "Forest Troll", face: "🧌", hp: 500, hit: 32, rage: 4, level: 2,
        loot: { grapes: 25, tokens: 6 }, taunt: "TROLL SMASH! You are tiny!", power: "Big slow SMASH" } },
    { id: "caves", name: "Goblin Caves", icon: "🕳️", sky: "caves", x: 64, y: 74,
      intro: "Dark tunnels full of goblins. Their king is so fast he dodges hits.",
      monsters: [
        { id: "bat", name: "Flappy Bat", face: "🦇", hp: 130, hit: 20 },
        { id: "rat", name: "Cave Rat", face: "🐀", hp: 170, hit: 24 },
        { id: "skeleton", name: "Rattly Skeleton", face: "💀", hp: 210, hit: 27 }
      ],
      boss: { id: "goblin", name: "Goblin King", face: "👺", crown: true, hp: 750, hit: 36, rage: 4, level: 3,
        loot: { grapes: 35, tokens: 8 }, taunt: "Hee hee! I'm too FAST for you!", power: "Dodges some of your hits", evade: true } },
    { id: "mountains", name: "Frozen Mountains", icon: "🏔️", sky: "snow", x: 58, y: 22,
      intro: "Brrr! Snow and ice, and a giant who freezes you solid.",
      monsters: [
        { id: "snowman", name: "Snowman", face: "⛄", hp: 190, hit: 27 },
        { id: "yeti", name: "Grumpy Goat", face: "🐐", hp: 240, hit: 31 },
        { id: "owl", name: "Snow Owl", face: "🦉", hp: 290, hit: 34 }
      ],
      boss: { id: "icegiant", name: "Ice Giant", face: "👹", ice: true, hp: 1100, hit: 44, rage: 4, level: 4, freeze: true,
        loot: { grapes: 45, tokens: 10 }, taunt: "Get one wrong and I'll FREEZE you!", power: "Freezes you if you don't block" } },
    { id: "volcano", name: "Dragon Volcano", icon: "🌋", sky: "volcano", x: 86, y: 44,
      intro: "The hottest place of all. Only the mightiest teddy can beat the dragon.",
      monsters: [
        { id: "imp", name: "Fire Imp", face: "😈", hp: 260, hit: 34 },
        { id: "lizard", name: "Lava Lizard", face: "🦎", hp: 320, hit: 38 },
        { id: "golem", name: "Rock Golem", face: "🗿", hp: 380, hit: 42 }
      ],
      boss: { id: "dragon", name: "Fire Dragon", face: "🐉", hp: 1700, hit: 58, rage: 3, level: 5, fire: true,
        loot: { grapes: 70, tokens: 15 }, taunt: "ROAAAR! Only a mighty teddy can beat me!", power: "Fire breath" } }
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
      hp: Math.round(80 + (f.end || 0) * 0.6),                 // 80 .. 680
      dmg: Math.round(10 + (f.str || 0) * 0.11),               // 10 .. 120
      dodge: 0.05 + Math.min(1000, f.spd || 0) / 1000 * 0.25,  // 5% .. 30%
      sup: 2 + Math.min(1000, f.brn || 0) / 1000 * 1.5         // Super = 2x .. 3.5x a hit
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
  function roar() { tone(110, 0, 0.35, "sawtooth", 0.11); tone(80, 0.1, 0.4, "sawtooth", 0.09); }
  function fanfare() { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.14, "square", 0.07); }); }
  function sad() { [392, 349, 311, 262].forEach(function (f, i) { tone(f, i * 0.2, 0.22, "triangle", 0.07); }); }

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
      txt(w, ".adv-tip", (window.KidsGym ? KidsGym.fightsLine(player.id) + " " : "") + (won === WORLDS.length ? "You beat every boss! You're a legend. Keep fighting to stay strong!" :
        won ? won + " of 5 bosses beaten. The 💀 skulls show how tough each boss is." :
        "Go anywhere you like! The 💀 skulls show how tough each boss is. Start on Teddy Island."));
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
      '<h3 class="ward-h">Monsters (win 🍇 2)</h3><div class="adv-foes"></div>' +
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
        '<div><b>⚡ ' + Math.round(k.dodge * 100) + '%</b> dodge</div><div><b>✨ ' + Math.round(k.dmg * k.sup) + '</b> super hit</div>';
      var foes = w.querySelector(".adv-foes"); foes.innerHTML = "";
      W.monsters.forEach(function (M) {
        var b = el('<button type="button" class="adv-foe"><span class="adv-face"></span><span class="adv-fname"></span><span class="adv-fsub"></span></button>');
        txt(b, ".adv-face", M.face); txt(b, ".adv-fname", M.name);
        txt(b, ".adv-fsub", "❤️ " + M.hp + " · hits " + M.hit);
        b.addEventListener("click", function () { fight(player, W, M, false, function () { draw(); if (redrawMap) redrawMap(); }); });
        foes.appendChild(b);
      });
      var B = W.boss, beat = adv.beaten[B.id] || 0, bb = w.querySelector(".adv-bossbox"); bb.innerHTML = "";
      var bt = el('<button type="button" class="adv-bossbtn"><span class="adv-bface"></span><span class="adv-binfo"><span class="adv-bname"></span><span class="adv-bpow"></span><span class="adv-bstat"></span><span class="adv-bloot"></span></span></button>');
      var bf = bt.querySelector(".adv-bface"); bf.textContent = B.face; if (B.ice) bf.classList.add("icy"); if (B.crown) bf.classList.add("crowned");
      txt(bt, ".adv-bname", B.name + " " + new Array(B.level + 1).join("💀"));
      txt(bt, ".adv-bpow", "⚠️ " + B.power + (B.rage ? " · big attack every " + B.rage + " turns" : ""));
      txt(bt, ".adv-bstat", "❤️ " + B.hp + " · hits " + B.hit);
      txt(bt, ".adv-bloot", beat ? "🏆 Beaten " + beat + (beat === 1 ? " time" : " times") + ". Again: 🍇 5 (once a day)" : "First win: 🍇 " + B.loot.grapes + " + 🎟️ " + B.loot.tokens + " + a trophy!");
      bt.addEventListener("click", function () { fight(player, W, B, true, function () { draw(); if (redrawMap) redrawMap(); }); });
      bb.appendChild(bt);
      txt(w, ".adv-daily", (window.KidsGym ? KidsGym.fightsLine(player.id) + " " : "") + "Lost a fight? Do lessons for tokens, train in the gym, and come back stronger!");
    }
    draw();
    w.querySelector(".adv-back").addEventListener("click", function () { w.remove(); });
    K.say("Welcome to " + W.name + "! " + W.intro);
  }

  /* ---------- the fight ---------- */
  function fight(player, W, F, isBoss, after) {
    if (window.KidsGym && !KidsGym.useFight(player.id)) return;
    var pet = P.load(player.id), k = kit(pet);
    var me = { hp: k.hp, max: k.hp }, foe = { hp: F.hp, max: F.hp };
    var turn = 0, charge = 0, busy = true, over = false, frozen = false, hits = 0, dodges = 0;
    var w = overlay("g-battle-wrap adv-fight sky-" + W.sky);
    w.innerHTML =
      '<div class="arena">' +
      '<div class="ar-hp"><div class="hpbox a"><b></b><span class="hp"><span></span></span><em></em></div><div class="vs">VS</div><div class="hpbox b"><b></b><span class="hp"><span></span></span><em></em></div></div>' +
      '<div class="adv-floor"><div class="fighter a"></div><div class="adv-enemy"><span class="adv-eface"></span></div><div class="ar-call" aria-live="polite"></div></div>' +
      '<div class="adv-panel"><div class="adv-warn" hidden></div><div class="adv-moves">' +
      '<button type="button" class="block c-berry adv-move" data-m="attack"><span class="adv-mi">⚔️</span><span class="adv-ml">Attack</span></button>' +
      '<button type="button" class="block c-sky adv-move" data-m="block"><span class="adv-mi">🛡️</span><span class="adv-ml">Block</span></button>' +
      '<button type="button" class="block c-sun adv-move" data-m="super"><span class="adv-mi">✨</span><span class="adv-ml">Super</span><span class="adv-charge"></span></button>' +
      '</div></div>' +
      '<button class="round small adv-flee" type="button" aria-label="Run away">🏳️</button>' +
      '<div class="ar-end" hidden></div>' +
      "</div>";
    var fa = w.querySelector(".fighter.a"), fe = w.querySelector(".adv-enemy"), face = w.querySelector(".adv-eface"), call = w.querySelector(".ar-call");
    var warn = w.querySelector(".adv-warn"), moves = w.querySelectorAll(".adv-move"), supBtn = w.querySelector('[data-m="super"]'), chargeEl = w.querySelector(".adv-charge");
    var teddy = pet.name || "Teddy";
    fa.innerHTML = P.teddySVG(stageOf(player.id), pet);
    face.textContent = F.face;
    if (isBoss) fe.classList.add("boss");
    if (F.ice) face.classList.add("icy");
    if (F.crown) fe.classList.add("crowned");
    txt(w, ".hpbox.a b", teddy); txt(w, ".hpbox.b b", F.name);
    function hp(side, v, max) { var box = w.querySelector(".hpbox." + side); box.querySelector(".hp span").style.width = Math.max(0, v / max * 100) + "%"; box.querySelector("em").textContent = Math.max(0, Math.round(v)) + " / " + max; box.classList.toggle("low", v / max < 0.3); }
    hp("a", me.hp, me.max); hp("b", foe.hp, foe.max);
    function say(t) { call.textContent = t; call.classList.remove("pop"); void call.offsetWidth; call.classList.add("pop"); }
    function pop(target, text, cls) {
      var r = target.getBoundingClientRect(), d = document.createElement("span");
      d.className = "dmg " + (cls || ""); d.textContent = text;
      d.style.left = (r.left + r.width / 2) + "px"; d.style.top = (r.top + r.height * 0.2) + "px";
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1100);
    }
    function anim(node, cls, ms) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); setTimeout(function () { node.classList.remove(cls); }, ms || 600); }
    function wobble() { return 0.85 + Math.random() * 0.3; }
    // A boss's big attack lands on every rage-th turn; the warning shows the turn before.
    function rageOn(t) { return isBoss && F.rage && t % F.rage === 0; }

    function setMoves(on) {
      busy = !on;
      moves.forEach(function (b) { b.disabled = !on; });
      var ready = charge >= 3;
      supBtn.classList.toggle("ready", ready);
      if (!ready) supBtn.disabled = true;
      chargeEl.textContent = ready ? "READY!" : new Array(charge + 1).join("●") + new Array(3 - charge + 1).join("○");
    }

    w.querySelector(".adv-flee").addEventListener("click", function () {
      if (over) return;
      over = true; w.remove(); K.say("Phew! We ran away. Let's get stronger!"); after();
    });
    moves.forEach(function (b) { b.addEventListener("click", function () { if (!busy && !over && !b.disabled) act(b.getAttribute("data-m")); }); });

    say(isBoss ? F.name + "!" : "A wild " + F.name + "!");
    if (isBoss) { roar(); anim(fe, "boss-in", 1200); }
    K.say(isBoss ? F.taunt : "A wild " + F.name + " appears!");
    setMoves(false);
    setTimeout(startTurn, isBoss ? 2000 : 1200);

    function startTurn() {
      if (over) return;
      turn++;
      if (frozen) {
        frozen = false; setMoves(false);
        say("❄️ Frozen! Can't move!"); K.say(teddy + " is frozen!");
        setTimeout(function () { foeTurn(false); }, 1100);
        return;
      }
      var big = rageOn(turn);
      warn.hidden = !big;
      if (big) {
        warn.textContent = (F.fire ? "🔥 " + F.name + " is about to breathe FIRE!" : "⚠️ " + F.name + " is getting ready for a BIG attack!") + " Block it!";
        anim(fe, "charge", 900); roar();
        K.say("Watch out! Big attack coming. Block it!");
      } else if (charge >= 3) K.say("Super is ready!");
      setMoves(true);
    }

    function act(m) {
      setMoves(false);
      var blocking = m === "block";
      if (blocking) {
        charge = Math.min(3, charge + 1);
        say("🛡️ " + teddy + " blocks!"); anim(fa, "glow", 700); tone(700, 0, 0.1, "sine", 0.06);
        setTimeout(function () { foeTurn(true); }, 700);
        return;
      }
      var isSuper = m === "super";
      if (isSuper) charge = 0; else charge = Math.min(3, charge + 1);
      var crit = !isSuper && Math.random() < 0.15;
      var dmg = Math.max(1, Math.round(k.dmg * (isSuper ? k.sup : 1) * (crit ? 1.5 : 1) * wobble()));
      anim(fa, "lunge-r", 500);
      setTimeout(function () {
        if (F.evade && Math.random() < 0.25) {
          anim(fe, "dodge-e", 600); pop(fe, "Missed!", "miss"); say(F.name + " dodges!"); tone(900, 0, 0.08, "sine", 0.05);
        } else {
          hits++;
          foe.hp = Math.max(0, foe.hp - dmg); hp("b", foe.hp, foe.max);
          anim(fe, "hit", 500); isSuper || crit ? zap() : bonk();
          pop(fe, "-" + dmg, isSuper || crit ? "big" : "");
          say(isSuper ? "✨ SUPER " + pick(["SMASH", "BLAST", "BEAR HUG", "PUNCH"]) + "!" : crit ? "⚡ CRITICAL HIT!" : pick(["Bonk!", "Pow!", "Wham!", "Thwack!", "Boom!"]));
          if (isSuper) { anim(fa, "glow", 900); K.celebrate(fe, ["✨", "⭐", "💥"]); }
        }
        if (foe.hp <= 0) return setTimeout(function () { end(true); }, 700);
        setTimeout(function () { foeTurn(false); }, 800);
      }, 300);
    }

    function foeTurn(blocked) {
      if (over) return;
      var big = rageOn(turn);
      warn.hidden = true;
      // a normal attack can be dodged (Speed); a big attack can only be blocked
      if (!big && !blocked && Math.random() < k.dodge) {
        anim(fe, "lunge-l", 500);
        setTimeout(function () { dodges++; anim(fa, "dodge", 600); pop(fa, "Dodged!", "miss"); say(teddy + " dodges!"); tone(900, 0, 0.08, "sine", 0.05); setTimeout(startTurn, 1000); }, 300);
        return;
      }
      var mult = big ? (blocked ? 0.25 : 2) : (blocked ? 0.25 : 1);
      var dmg = Math.max(1, Math.round(F.hit * mult * wobble()));
      anim(fe, "lunge-l", 500);
      setTimeout(function () {
        me.hp = Math.max(0, me.hp - dmg); hp("a", me.hp, me.max);
        anim(fa, "hit", 500); big && !blocked ? zap() : bonk();
        if (F.fire && big && !blocked) fireBurst(fa);
        pop(fa, "-" + dmg, big && !blocked ? "big" : "");
        if (blocked) say(big ? "🛡️ BLOCKED the big attack!" : "🛡️ Blocked!");
        else say(big ? (F.fire ? "🔥 FIRE BREATH!" : "💥 BIG ATTACK!") : pick(["Ouch!", "Oof!", "Bonk!"]));
        if (me.hp <= 0) return setTimeout(function () { end(false); }, 800);
        // the Ice Giant's unblocked big attack freezes you for a turn
        if (F.freeze && big && !blocked) { frozen = true; fa.classList.add("frozen"); setTimeout(function () { fa.classList.remove("frozen"); }, 2600); }
        setTimeout(startTurn, 1000);
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
      if (over) return; over = true;
      w.querySelector(".adv-panel").style.visibility = "hidden";
      var winSide = won ? fa : fe, loseSide = won ? fe : fa;
      loseSide.classList.add("ko"); winSide.classList.add("victory");
      var p2 = P.load(player.id), adv = advOf(p2), d = today(), lines = [], gGain = 0, tGain = 0;
      if (won) {
        adv.wins++;
        if (isBoss) {
          var first = !adv.beaten[F.id];
          adv.beaten[F.id] = (adv.beaten[F.id] || 0) + 1;
          adv.bossDay = adv.bossDay && typeof adv.bossDay === "object" ? adv.bossDay : {};
          if (first) { gGain = F.loot.grapes; tGain = F.loot.tokens; lines.push("🏆 Trophy: " + F.name + "!"); }
          else if (adv.bossDay[F.id] !== d) { gGain = 5; }
          else lines.push("Already got today's boss prize. Come back tomorrow!");
          adv.bossDay[F.id] = d;
        } else {
          gGain = 2;
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
        box.innerHTML = '<div class="card"><div class="big"></div><h2></h2><p class="fine"></p><div class="rowb"><button type="button" class="block c-sun adv-again">⚔️ Fight again</button><button type="button" class="block c-leaf adv-done">Back</button></div></div>';
        txt(box, ".big", won ? (isBoss ? "🏆" : "⭐") : "💪");
        txt(box, "h2", won ? "You beat the " + F.name + "!" : F.name + " was too strong!");
        var prize = gGain ? "You won 🍇 " + gGain + (tGain ? " and 🎟️ " + tGain : "") + ". " : "";
        txt(box, ".fine", (won ? prize + lines.join(" ") : "No prize this time. Do lessons for tokens, train in the gym, then come back stronger!") + (window.KidsGym ? " " + KidsGym.fightsLine(player.id) : ""));
        if (window.KidsGym && KidsGym.fightsLeft(player.id) <= 0) { var ag = box.querySelector(".adv-again"); ag.disabled = true; ag.textContent = "No fights left today"; }
        K.say(won ? (isBoss ? "You beat the " + F.name + "! Amazing!" : "You won! ") + (gGain ? "You get " + gGain + " grapes" + (tGain ? " and " + tGain + " tokens!" : "!") : "")
          : "The " + F.name + " was too strong this time. Do some lessons, train in the gym, and come back!");
        box.querySelector(".adv-again").addEventListener("click", function () { w.remove(); fight(player, W, F, isBoss, after); });
        box.querySelector(".adv-done").addEventListener("click", function () { w.remove(); after(); });
      }, 1300);
    }
  }

  window.KidsAdventure = { open: open, WORLDS: WORLDS, kit: kit };
})();
