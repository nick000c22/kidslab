/* Kids Lab Garage: each kid's car, powered by English.
   - English quizzes give 🔧 car parts (lessons/basics.html). Parts buy upgrades, paint and stickers.
   - Better CARS unlock from English progress (quizzes finished), not from parts, so repeating easy lessons can't buy them.
   - Races: 5 fuel a day. "Fill up" is a 5-question reading quiz from the kid's tricky English lessons (+1 race).
   - In a race, reading questions pop up. A right answer is a turbo boost. Upgrades set how fast the car can go;
     reading decides how well it drives. Win 🔧 3 parts, lose 🔧 1.
   The car lives in the teddy doc as pet.car, so it syncs like everything else. */
(function () {
  var K = window.KidsLab, P = window.KidsPet;
  if (!K || !P) return;
  var C = K.config;

  /* ---------- the rules (tweak here) ---------- */
  var CARS = [
    { id: "kart",    name: "Go-Kart",       need: 0 },
    { id: "buggy",   name: "Beach Buggy",   need: 3 },
    { id: "rally",   name: "Rally Car",     need: 7 },
    { id: "monster", name: "Monster Truck", need: 12 },
    { id: "racer",   name: "Race Car",      need: 17 },
    { id: "storm",   name: "Storm GT",      need: 22 },   // low, sharp wedge supercar
    { id: "rosso",   name: "Rosso GT",      need: 28 },   // sleek Italian-style GT
    { id: "rocket",  name: "Rocket Car",    need: 36 }
  ];
  var UPS = [
    { id: "eng",   name: "Engine", icon: "⚙️", what: "Faster top speed", color: "berry" },
    { id: "tyre",  name: "Tyres",  icon: "🛞", what: "Quicker off the line", color: "sky" },
    { id: "turbo", name: "Turbo",  icon: "🔥", what: "Bigger reading boosts", color: "tang" }
  ];
  function upCost(level) { return 5 * (level + 1); }              // 5, 10, 15, 20, 25 parts
  function upMax(tier) { return Math.min(5, tier + 1); }          // better cars can take more upgrades
  var PAINTS = [
    { id: "red", name: "Red", c: "#E8463C", cost: 0 }, { id: "blue", name: "Blue", c: "#2F7FE0", cost: 5 }, { id: "green", name: "Green", c: "#2FAE5A", cost: 5 },
    { id: "yellow", name: "Yellow", c: "#F5C518", cost: 5 }, { id: "orange", name: "Orange", c: "#F28A2E", cost: 5 }, { id: "purple", name: "Purple", c: "#8A5FCB", cost: 5 },
    { id: "pink", name: "Pink", c: "#F06FA8", cost: 5 }, { id: "black", name: "Black", c: "#2B2B36", cost: 10 }, { id: "white", name: "White", c: "#F4F4F6", cost: 10 },
    { id: "gold", name: "Gold", c: "#D4A53A", cost: 30 }, { id: "rainbow", name: "Rainbow", c: "url(#rbw)", cost: 40 }
  ];
  var STICKERS = [
    { id: "none", e: "", name: "None", cost: 0 }, { id: "bolt", e: "⚡", name: "Lightning", cost: 8 }, { id: "star", e: "⭐", name: "Star", cost: 8 },
    { id: "fire", e: "🔥", name: "Flames", cost: 8 }, { id: "heart", e: "💖", name: "Heart", cost: 8 }, { id: "uni", e: "🦄", name: "Unicorn", cost: 12 },
    { id: "skull", e: "💀", name: "Skull", cost: 12 }, { id: "flower", e: "🌸", name: "Flower", cost: 8 }, { id: "seven", e: "7️⃣", name: "Number 7", cost: 8 },
    { id: "dino", e: "🦖", name: "Dino", cost: 12 }, { id: "crown", e: "👑", name: "Crown", cost: 15 }
  ];
  var FUEL_BASE = 5, WIN_PARTS = 3, LOSE_PARTS = 1;

  /* ---------- helpers ---------- */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function today() { return K.fightDay ? K.fightDay() : new Date().toDateString(); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }

  function englishDone(pid) {
    return (C.lessons || []).filter(function (l) {
      return l.subject === "english" && l.status === "ready" && (!l.players || l.players.indexOf(pid) !== -1) && K.isDone(l.id, pid);
    }).length;
  }
  function tierFor(pid) { var n = englishDone(pid), t = 0; CARS.forEach(function (c, i) { if (n >= c.need) t = i; }); return t; }
  // The car doc with every field filled in.
  function car(pet) {
    var c = pet.car && typeof pet.car === "object" ? JSON.parse(JSON.stringify(pet.car)) : {};
    c.parts = Math.max(0, Number(c.parts) || 0);
    c.up = c.up && typeof c.up === "object" ? c.up : {};
    UPS.forEach(function (u) { c.up[u.id] = Math.max(0, Math.min(5, Number(c.up[u.id]) || 0)); });
    c.paint = c.paint || "red"; c.sticker = c.sticker || "none";
    c.paints = Array.isArray(c.paints) ? c.paints : ["red"]; if (c.paints.indexOf("red") === -1) c.paints.push("red");
    c.stickers = Array.isArray(c.stickers) ? c.stickers : ["none"]; if (c.stickers.indexOf("none") === -1) c.stickers.push("none");
    c.w = Number(c.w) || 0; c.l = Number(c.l) || 0;
    return c;
  }
  function driving(pid, c) { var t = tierFor(pid); return c.drive != null && c.drive <= t ? c.drive : t; }
  function saveCar(pid, c) { var pet = P.load(pid); pet.car = c; P.save(pid, pet); }
  function fuelMax(c) { return FUEL_BASE + (c.fuel && c.fuel.d === today() ? Number(c.fuel.bonus) || 0 : 0); }
  function fuelUsed(c) { return c.fuel && c.fuel.d === today() ? Number(c.fuel.n) || 0 : 0; }
  function fuelLeft(c) { return Math.max(0, fuelMax(c) - fuelUsed(c)); }
  function power(tier, c) { return tier * 20 + (c.up.eng + c.up.tyre + c.up.turbo) * 8; }
  function furOf(pet) { var F = (P.FURS || {})[pet.fur] || { fur: "#A86B3C", dark: "#8E5830", light: "#E7B98A" }; return F; }

  /* ---------- drawing a car (side view, facing right) ---------- */
  var RIM = ["#BFC5CF", "#BFC5CF", "#E8EDF3", "#7FD3FF", "#FFD84D", "#FFD84D"];
  function wheel(x, y, r, lvl) {
    var s = '<g class="wheel" style="transform-origin:' + x + "px " + y + 'px">' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#23232B"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.58) + '" fill="' + RIM[lvl || 0] + '"/>';
    for (var i = 0; i < 5; i++) {
      var a = i * Math.PI * 2 / 5;
      s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + Math.cos(a) * r * 0.52).toFixed(1) + '" y2="' + (y + Math.sin(a) * r * 0.52).toFixed(1) + '" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/>';
    }
    if (lvl >= 4) s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.85) + '" fill="none" stroke="#FFD84D" stroke-width="1.6" stroke-dasharray="3 4"/>';
    return s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.18) + '" fill="#555"/></g>';
  }
  function teddy(x, y, s, F, helmet) {
    var out = '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' +
      '<circle cx="-11" cy="-11" r="7" fill="' + F.fur + '"/><circle cx="11" cy="-11" r="7" fill="' + F.fur + '"/>' +
      '<circle cx="-11" cy="-11" r="3.5" fill="' + F.light + '"/><circle cx="11" cy="-11" r="3.5" fill="' + F.light + '"/>' +
      '<circle cx="0" cy="0" r="15" fill="' + F.fur + '"/><ellipse cx="2" cy="5" rx="7" ry="5.5" fill="' + F.light + '"/>' +
      '<circle cx="-5" cy="-3" r="2" fill="#222"/><circle cx="7" cy="-3" r="2" fill="#222"/><ellipse cx="3" cy="2.5" rx="2.6" ry="1.9" fill="#222"/>';
    if (helmet) out += '<path d="M-16 -2 A16 16 0 0 1 16 -2 L16 -6 A16 15 0 0 0 -16 -6 Z" fill="' + helmet + '"/><path d="M-15 -7 A15 14 0 0 1 15 -7" fill="none" stroke="' + helmet + '" stroke-width="7"/>';
    return out + "</g>";
  }
  function carSVG(tier, c, F, opts) {
    opts = opts || {};
    var paint = byId(PAINTS, c.paint).c, st = byId(STICKERS, c.sticker).e, up = c.up, out = paint === "#F4F4F6" ? "#C9CCD6" : "rgba(0,0,0,.28)";
    var pipes = 1 + Math.floor(up.eng / 2), body = "", wheels = "", sx = 120, sy = 80, ss = 22, extra = "", driver = "", inWindow = false;
    var spoiler = up.turbo >= 1 ? '<path d="M12 ' + (opts.spY || 58) + ' l' + (14 + up.turbo * 3) + ' 0 l-3 7 l-' + (8 + up.turbo * 3) + ' 0 z" fill="#2B2B36"/><rect x="18" y="' + ((opts.spY || 58) + 6) + '" width="4" height="10" fill="#2B2B36"/>' : "";
    var kind = (CARS[tier] || CARS[0]).id;
    if (kind === "kart") { // go-kart
      body = '<path d="M22 100 L30 88 L200 88 Q214 90 216 100 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M150 88 L162 64" stroke="#2B2B36" stroke-width="5" stroke-linecap="round"/><ellipse cx="164" cy="62" rx="10" ry="4" fill="#2B2B36"/>';
      wheels = wheel(56, 100, 19, up.tyre) + wheel(186, 104, 14, up.tyre); sx = 140; sy = 95; ss = 14; inWindow = true;
      driver = '<rect x="72" y="56" width="16" height="34" rx="6" fill="#2B2B36"/>' + teddy(104, 64, 1, F, null) + '<path d="M88 86 L120 86" stroke="#2B2B36" stroke-width="8" stroke-linecap="round"/>';
      spoiler = up.turbo >= 1 ? '<path d="M14 70 l26 0 l-2 6 l-22 0 z" fill="#2B2B36"/><rect x="24" y="74" width="4" height="16" fill="#2B2B36"/>' : "";
    } else if (kind === "buggy") { // beach buggy
      body = '<path d="M20 98 Q24 74 60 72 L180 72 Q214 74 222 98 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M80 72 L96 36 L158 36 L176 72" fill="none" stroke="#3A3A46" stroke-width="6" stroke-linejoin="round"/><path d="M128 36 L128 72" stroke="#3A3A46" stroke-width="4"/>';
      wheels = wheel(60, 100, 23, up.tyre) + wheel(188, 100, 23, up.tyre); driver = teddy(108, 58, .95, F, null); sx = 150; sy = 86; ss = 18;
    } else if (kind === "rally") { // rally car
      body = '<path d="M16 98 L16 72 Q18 62 34 60 L62 38 Q68 33 80 33 L132 33 Q142 33 150 40 L174 60 L206 64 Q222 68 224 82 L224 98 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M68 58 L84 40 L104 40 L104 58 Z M112 40 L132 40 Q138 40 142 44 L158 58 L112 58 Z" fill="#BFE6FF" stroke="#2B2B36" stroke-width="2"/>' +
        '<rect x="196" y="72" width="22" height="7" rx="3" fill="#FFE27A"/>';
      wheels = wheel(62, 100, 20, up.tyre) + wheel(184, 100, 20, up.tyre); driver = teddy(128, 51, .62, F, null); sx = 104; sy = 79; ss = 20;
      extra = '<clipPath id="rwin' + (opts.uid || "") + '"><path d="M112 40 L132 40 Q138 40 142 44 L158 58 L112 58 Z"/></clipPath>';
      driver = '<g clip-path="url(#rwin' + (opts.uid || "") + ')">' + driver + "</g>"; inWindow = true;
    } else if (kind === "monster") { // monster truck
      body = '<path d="M18 84 L18 54 L104 54 L114 30 L160 30 L178 54 L218 58 Q228 62 228 72 L228 84 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M120 36 L156 36 L170 54 L120 54 Z" fill="#BFE6FF" stroke="#2B2B36" stroke-width="2"/>' +
        '<path d="M58 84 L58 96 M186 84 L186 96" stroke="#555" stroke-width="7"/><path d="M48 86 L70 86 M176 86 L198 86" stroke="#888" stroke-width="3" stroke-dasharray="3 3"/>';
      wheels = wheel(60, 98, 30, up.tyre) + wheel(186, 98, 30, up.tyre); driver = '<g clip-path="url(#mwin' + (opts.uid || "") + ')">' + teddy(140, 50, .6, F, null) + "</g>"; sx = 122; sy = 70; ss = 22;
      extra = '<clipPath id="mwin' + (opts.uid || "") + '"><path d="M120 36 L156 36 L170 54 L120 54 Z"/></clipPath>'; inWindow = true;
      spoiler = up.turbo >= 1 ? '<path d="M10 44 l' + (16 + up.turbo * 3) + ' 0 l-3 6 l-' + (10 + up.turbo * 3) + ' 0 z" fill="#2B2B36"/><rect x="16" y="48" width="4" height="8" fill="#2B2B36"/>' : "";
    } else if (kind === "racer") { // race car
      body = '<path d="M14 96 L14 80 L58 76 Q74 62 96 62 L120 64 Q132 74 150 78 L228 88 L228 96 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<rect x="206" y="94" width="30" height="7" rx="2" fill="#2B2B36"/><rect x="4" y="44" width="40" height="9" rx="2" fill="#2B2B36"/><rect x="20" y="52" width="6" height="26" fill="#2B2B36"/>' +
        '<path d="M150 78 L196 84" stroke="#fff" stroke-width="3" opacity=".6"/>';
      wheels = wheel(54, 98, 18, up.tyre) + wheel(192, 98, 18, up.tyre); driver = teddy(100, 58, .8, F, byId(PAINTS, c.paint === "white" ? "black" : "white").c); sx = 160; sy = 86; ss = 14;
      spoiler = "";
    } else if (kind === "storm") { // wedge supercar
      body = '<path d="M8 96 L8 84 L44 78 L98 58 L140 54 L200 72 L234 82 L234 96 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M102 62 L138 57 L156 68 L106 70 Z" fill="#BFE6FF" stroke="#2B2B36" stroke-width="2"/>' +
        '<path d="M156 80 L184 77 L176 91 L156 91 Z" fill="#2B2B36" opacity=".8"/><path d="M60 84 L96 82" stroke="#2B2B36" stroke-width="3" opacity=".5"/>' +
        '<path d="M212 80 L232 85" stroke="#FFF6C9" stroke-width="4" stroke-linecap="round"/><rect x="0" y="58" width="44" height="7" rx="2" fill="#2B2B36"/><rect x="16" y="64" width="6" height="16" fill="#2B2B36"/>';
      wheels = wheel(56, 98, 19, up.tyre) + wheel(196, 98, 19, up.tyre); sx = 118; sy = 84; ss = 15; inWindow = true; spoiler = "";
      extra = '<clipPath id="swin' + (opts.uid || "") + '"><path d="M102 62 L138 57 L156 68 L106 70 Z"/></clipPath>';
      driver = '<g clip-path="url(#swin' + (opts.uid || "") + ')">' + teddy(126, 68, .62, F, null) + "</g>";
    } else if (kind === "rosso") { // curvy Italian-style GT
      body = '<path d="M8 96 Q6 80 26 77 L66 72 Q96 50 136 50 Q164 52 182 68 L218 76 Q236 80 234 96 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M90 68 Q104 55 132 55 Q150 57 162 69 Z" fill="#BFE6FF" stroke="#2B2B36" stroke-width="2"/>' +
        '<path d="M106 82 Q128 76 152 82 Q130 88 108 88 Z" fill="#2B2B36" opacity=".75"/><circle cx="14" cy="84" r="4" fill="#FF6B6B"/><circle cx="24" cy="84" r="4" fill="#FF6B6B"/>' +
        '<path d="M214 80 Q224 80 230 86" stroke="#FFF6C9" stroke-width="4" fill="none" stroke-linecap="round"/>';
      wheels = wheel(54, 98, 19, up.tyre) + wheel(194, 98, 19, up.tyre); sx = 186; sy = 84; ss = 14; inWindow = true; spoiler = "";
      extra = '<clipPath id="gwin' + (opts.uid || "") + '"><path d="M90 68 Q104 55 132 55 Q150 57 162 69 Z"/></clipPath>';
      driver = '<g clip-path="url(#gwin' + (opts.uid || "") + ')">' + teddy(128, 68, .66, F, null) + "</g>";
    } else { // rocket car
      body = '<path d="M14 92 Q18 70 70 66 L150 60 Q196 58 226 76 Q236 84 226 92 Z" fill="' + paint + '" stroke="' + out + '" stroke-width="2"/>' +
        '<path d="M36 68 L22 40 L52 66 Z" fill="#2B2B36"/><rect x="0" y="72" width="18" height="16" rx="4" fill="#6B7280"/>' +
        '<path d="M2 74 Q-26 80 2 86 Z" fill="#FFB347" class="flame"/><path d="M2 76 Q-14 80 2 84 Z" fill="#FFF3A0" class="flame"/>' +
        '<path d="M86 66 Q100 40 128 40 Q150 42 156 60 Z" fill="#BFE6FF" stroke="#2B2B36" stroke-width="2" opacity=".85"/>';
      wheels = wheel(62, 98, 16, up.tyre) + wheel(182, 98, 16, up.tyre); driver = teddy(122, 58, .7, F, null); sx = 180; sy = 78; ss = 16;
      spoiler = "";
    }
    // Exhaust pipes (engine) and boost flame (turbo), at the back.
    var exh = "";
    if (kind !== "rocket") for (var i = 0; i < pipes; i++) exh += '<rect x="' + (kind === "kart" ? 14 : 6) + '" y="' + (90 - i * 6) + '" width="14" height="4" rx="2" fill="#8C8F99"/>';
    var flame = '<g class="boost-flame"><path d="M8 88 Q-30 86 8 80 Z" fill="#FF7A1A"/><path d="M8 86 Q-14 84 8 82 Z" fill="#FFE066"/></g>';
    var sticker = st ? '<text x="' + sx + '" y="' + sy + '" font-size="' + ss + '" text-anchor="middle" dominant-baseline="middle">' + st + "</text>" : "";
    return '<svg class="car-svg' + (opts.cls ? " " + opts.cls : "") + '" viewBox="-30 20 270 112" aria-hidden="true">' +
      '<defs><linearGradient id="rbw" x1="0" x2="1"><stop offset="0" stop-color="#FF5E5E"/><stop offset=".25" stop-color="#FFC94D"/><stop offset=".5" stop-color="#5ED17A"/><stop offset=".75" stop-color="#4DA6FF"/><stop offset="1" stop-color="#A66BFF"/></linearGradient>' + extra + "</defs>" +
      '<ellipse cx="120" cy="' + (kind === "monster" ? 128 : 120) + '" rx="110" ry="6" fill="rgba(0,0,0,.12)"/>' +
      flame + exh + spoiler + (inWindow ? body + driver : driver + body) + sticker + wheels + "</svg>";
  }

  /* ---------- the garage screen ---------- */
  function overlay(cls) { var w = document.createElement("div"); w.className = "gym-wrap garage-wrap " + (cls || ""); document.body.appendChild(w); return w; }
  var onClose = null;
  function open(player, after) {
    onClose = after || null;
    var pid = player.id;
    var w = overlay();
    w.innerHTML = '<div class="gym garage">' +
      '<div class="g-top"><button class="round small g-back" type="button" aria-label="Back">⬅️</button><h2>🏎️ ' + esc(player.name) + "'s Garage</h2>" +
      '<div class="stars" title="Car parts"><span>🔧</span><span class="gr-parts"></span></div></div>' +
      '<div class="gr-hero"><div class="gr-stage"></div><div class="gr-side"><h3 class="gr-name"></h3><div class="gr-power"></div><p class="gr-next"></p></div></div>' +
      '<div class="gr-fuel"></div>' +
      '<div class="gr-go"><button type="button" class="block c-berry gr-race"><span class="emoji">🏁</span><span class="label">Race!</span><span class="g-sub">Read to boost past the others</span></button>' +
      '<button type="button" class="block c-leaf gr-fill"><span class="emoji">⛽</span><span class="label">Fill up</span><span class="g-sub">5 reading questions = ⛽ +1 race</span></button></div>' +
      '<h3 class="ward-h">Upgrades (🔧 parts come from English quizzes)</h3><div class="gr-ups"></div>' +
      '<h3 class="ward-h">My cars (new cars unlock as you finish English quizzes)</h3><div class="gr-cars"></div>' +
      '<h3 class="ward-h">Paint</h3><div class="gr-paints"></div>' +
      '<h3 class="ward-h">Stickers</h3><div class="gr-stickers"></div>' +
      '<p class="gr-record"></p></div>';

    function draw() {
      var pet = P.load(pid), c = car(pet), maxT = tierFor(pid), tier = driving(pid, c), F = furOf(pet), done = englishDone(pid);
      w.querySelector(".gr-parts").textContent = c.parts;
      w.querySelector(".gr-stage").innerHTML = carSVG(tier, c, F, { uid: "h", cls: "idle" });
      w.querySelector(".gr-name").textContent = CARS[tier].name;
      w.querySelector(".gr-power").textContent = "Power " + power(tier, c);
      var nx = CARS[maxT + 1];
      w.querySelector(".gr-next").textContent = nx ? "Finish " + (nx.need - done) + " more English " + (nx.need - done === 1 ? "quiz" : "quizzes") + " to unlock the " + nx.name + "!" : "You've unlocked every car. Legend!";
      // fuel
      var left = fuelLeft(c), max = fuelMax(c), cells = "";
      for (var i = 0; i < max; i++) cells += '<span class="' + (i < left ? "on" : "") + '">⛽</span>';
      w.querySelector(".gr-fuel").innerHTML = '<div class="g-energy' + (left ? "" : " empty") + '"><b>Fuel</b><span class="g-cells gr-cells">' + cells + "</span><em>" + left + " / " + max + "</em></div>";
      w.querySelector(".gr-race").classList.toggle("tired", left <= 0);
      // upgrades
      var ups = w.querySelector(".gr-ups"); ups.innerHTML = "";
      var cap = upMax(tier);
      UPS.forEach(function (U) {
        var lv = c.up[U.id], full = lv >= 5, capped = lv >= cap, cost = upCost(lv);
        var pips = ""; for (var k = 0; k < 5; k++) pips += '<i class="' + (k < lv ? "on" : k < cap ? "" : "lock") + '"></i>';
        var b = el('<button type="button" class="block c-' + U.color + ' gr-up"><span class="emoji">' + U.icon + '</span><span class="label">' + U.name + '</span><span class="g-sub">' + U.what + '</span><span class="gr-pips">' + pips + '</span><span class="gr-cost"></span></button>');
        b.querySelector(".gr-cost").textContent = full ? "Maxed out!" : capped ? "Unlock a better car to go higher" : "Upgrade: 🔧 " + cost;
        if (full || capped) b.classList.add("locked");
        b.addEventListener("click", function () {
          var p2 = P.load(pid), c2 = car(p2), lv2 = c2.up[U.id], cap2 = upMax(driving(pid, c2));
          if (lv2 >= 5) { K.say(U.name + " is maxed out!"); return; }
          if (lv2 >= cap2) { K.say("This car can't take a bigger " + U.name.toLowerCase() + ". Finish more English quizzes to unlock a better car!"); return; }
          var cst = upCost(lv2);
          if (c2.parts < cst) { K.say("You need " + cst + " parts. You have " + c2.parts + ". Do an English quiz to get 5 more!"); return; }
          c2.parts -= cst; c2.up[U.id] = lv2 + 1; saveCar(pid, c2);
          K.say(U.name + " upgraded to level " + (lv2 + 1) + "!"); K.celebrate(b, ["🔧", "⭐", "🔥"]); vroom();
          draw();
        });
        ups.appendChild(b);
      });
      // cars
      var cars = w.querySelector(".gr-cars"); cars.innerHTML = "";
      CARS.forEach(function (Cr, t) {
        var locked = t > maxT, b = el('<button type="button" class="gr-car' + (t === tier ? " on" : "") + (locked ? " locked" : "") + '"><span class="gr-car-art"></span><span class="gr-car-name"></span><span class="gr-car-sub"></span></button>');
        b.querySelector(".gr-car-art").innerHTML = locked ? '<span class="gr-lock">🔒</span>' + carSVG(t, car({}), F, { uid: "c" + t, cls: "shadow" }) : carSVG(t, c, F, { uid: "c" + t });
        b.querySelector(".gr-car-name").textContent = Cr.name;
        b.querySelector(".gr-car-sub").textContent = locked ? "Finish " + Cr.need + " English quizzes" : t === tier ? "Driving" : "Tap to drive";
        b.addEventListener("click", function () {
          if (locked) { K.say("The " + Cr.name + " unlocks when you've finished " + Cr.need + " English quizzes. You've done " + done + "."); return; }
          var c2 = car(P.load(pid)); c2.drive = t; saveCar(pid, c2); K.say("You're driving the " + Cr.name + "!"); vroom(); draw();
        });
        cars.appendChild(b);
      });
      // paint
      var pw = w.querySelector(".gr-paints"); pw.innerHTML = "";
      PAINTS.forEach(function (Pn) {
        var own = c.paints.indexOf(Pn.id) !== -1;
        var b = el('<button type="button" class="gr-swatch' + (c.paint === Pn.id ? " on" : "") + '" aria-label="' + Pn.name + '"><span class="sw"></span><span class="gr-sw-sub"></span></button>');
        b.querySelector(".sw").style.background = Pn.id === "rainbow" ? "linear-gradient(90deg,#FF5E5E,#FFC94D,#5ED17A,#4DA6FF,#A66BFF)" : Pn.c;
        b.querySelector(".gr-sw-sub").textContent = own ? Pn.name : "🔧 " + Pn.cost;
        b.addEventListener("click", function () { buy(c, "paints", "paint", Pn, b); });
        pw.appendChild(b);
      });
      var sw = w.querySelector(".gr-stickers"); sw.innerHTML = "";
      STICKERS.forEach(function (S) {
        var own = c.stickers.indexOf(S.id) !== -1;
        var b = el('<button type="button" class="gr-swatch st' + (c.sticker === S.id ? " on" : "") + '" aria-label="' + S.name + '"><span class="sw">' + (S.e || "🚫") + '</span><span class="gr-sw-sub"></span></button>');
        b.querySelector(".gr-sw-sub").textContent = own ? S.name : "🔧 " + S.cost;
        b.addEventListener("click", function () { buy(c, "stickers", "sticker", S, b); });
        sw.appendChild(b);
      });
      w.querySelector(".gr-record").textContent = "Races: " + c.w + " won, " + c.l + " lost.";
    }
    function buy(c0, listKey, key, item, btn) {
      var c2 = car(P.load(pid));
      if (c2[listKey].indexOf(item.id) === -1) {
        if (c2.parts < item.cost) { K.say(item.name + " costs " + item.cost + " parts. You have " + c2.parts + ". Do an English quiz to get 5 more!"); return; }
        c2.parts -= item.cost; c2[listKey].push(item.id); K.celebrate(btn, ["🎨", "✨", "⭐"]);
      }
      c2[key] = item.id; saveCar(pid, c2); K.say(item.name + "!"); draw();
    }
    draw();
    w.querySelector(".g-back").addEventListener("click", function () { w.remove(); if (onClose) onClose(); });
    w.querySelector(".gr-fill").addEventListener("click", fillUp);
    w.querySelector(".gr-race").addEventListener("click", function () { chooseRival(player, draw); });
    w._draw = draw;
    K.say("Welcome to your garage!");
  }
  function fillUp() {
    try { sessionStorage.setItem("kidslab.visit", "1"); sessionStorage.setItem("kidslab.reopen", "garage"); } catch (e) {}
    K.say("Let's fill up! Get five reading questions right.");
    setTimeout(function () { location.href = "lessons/basics.html?l=strength&s=english"; }, 300);
  }

  /* ---------- rivals ---------- */
  function rivals(player) {
    var mine = car(P.load(player.id)), myTier = driving(player.id, mine);
    var list = K.visiblePlayers().filter(function (p) { return p.id !== player.id; }).map(function (p) {
      var pet = P.load(p.id), c = car(pet);
      return { name: p.name + "'s " + CARS[driving(p.id, c)].name, who: p.emoji + " " + p.name, tier: driving(p.id, c), c: c, F: furOf(pet), read: 0.7 };
    });
    // A computer racer about as fast as you, so there's always someone to race.
    var rc = car({}); rc.paint = pick(["black", "white", "gold"]); rc.sticker = pick(["bolt", "skull", "star", "seven"]);
    UPS.forEach(function (u) { rc.up[u.id] = Math.max(0, Math.min(upMax(myTier), mine.up[u.id] + pick([-1, 0, 0, 1]))); });
    list.unshift({ name: "Robo Racer", who: "🤖 Computer", tier: myTier, c: rc, F: { fur: "#9AA3B5", dark: "#737A86", light: "#DCE2EE" }, read: 0.6, robo: true });
    return list;
  }
  function chooseRival(player, after) {
    var c = car(P.load(player.id));
    if (fuelLeft(c) <= 0) { K.say("Out of fuel! Tap Fill up and get five reading questions right."); return; }
    var w = overlay();
    w.innerHTML = '<div class="gym"><div class="g-top"><button class="round small g-back" type="button" aria-label="Back">⬅️</button><h2>🏁 Who will you race?</h2></div><div class="gr-rivals"></div>' +
      '<p class="g-tip">Win 🔧 ' + WIN_PARTS + " parts. Even if you lose you get 🔧 " + LOSE_PARTS + ". Answer the reading questions to boost!</p></div>";
    var box = w.querySelector(".gr-rivals");
    rivals(player).forEach(function (R, i) {
      var b = el('<button type="button" class="g-opp gr-rival"><span class="gr-rival-art"></span><span class="g-opp-name"></span><span class="g-opp-sub"></span><span class="g-opp-power"></span></button>');
      b.querySelector(".gr-rival-art").innerHTML = carSVG(R.tier, R.c, R.F, { uid: "r" + i });
      b.querySelector(".g-opp-name").textContent = R.name;
      b.querySelector(".g-opp-sub").textContent = R.who;
      b.querySelector(".g-opp-power").textContent = "Power " + power(R.tier, R.c);
      b.addEventListener("click", function () {
        var p2 = P.load(player.id), c2 = car(p2);
        if (fuelLeft(c2) <= 0) { K.say("Out of fuel!"); return; }
        c2.fuel = { d: today(), n: fuelUsed(c2) + 1, bonus: c2.fuel && c2.fuel.d === today() ? Number(c2.fuel.bonus) || 0 : 0 };
        saveCar(player.id, c2);
        w.remove(); race(player, R, after);
      });
      box.appendChild(b);
    });
    w.querySelector(".g-back").addEventListener("click", function () { w.remove(); });
    K.say("Who will you race?");
  }

  /* ---------- reading questions for boosts (level follows English progress) ---------- */
  var ABC = "ABCDEFGHIJKLMNOPRSTUVWYZ".split("");
  var W1 = ["cat", "dog", "sun", "pig", "bus", "hat", "bed", "cup", "fox", "box", "the", "and", "is", "my", "go", "see", "can", "up", "at", "big", "red", "run", "you", "we", "look", "like"];
  var W2 = ["said", "was", "they", "have", "come", "some", "were", "what", "when", "where", "because", "could", "would", "friend", "people", "again", "once", "very", "little", "here", "does", "many", "every", "after", "school", "water"];
  function boostQ(pid) {
    var n = englishDone(pid);
    if (n < 5) {
      var L = pick(ABC), opts = shuffle([L].concat(shuffle(ABC.filter(function (x) { return x !== L && !(/[CKQ]/.test(x) && /[CKQ]/.test(L)); })).slice(0, 2)));
      return { say: "Tap the letter " + L + "!", show: "Tap the letter", answer: L, choices: opts, big: true };
    }
    var list = n < 12 ? W1 : W2, w2 = pick(list);
    var close = shuffle(list.filter(function (x) { return x !== w2 && (x[0] === w2[0] || x.length === w2.length); })).concat(shuffle(list.filter(function (x) { return x !== w2; })));
    var o = [w2]; close.forEach(function (x) { if (o.length < 3 && o.indexOf(x) === -1) o.push(x); });
    return { say: "Tap the word: " + w2 + "!", show: "Tap the word you hear", answer: w2, choices: shuffle(o) };
  }

  /* ---------- the race ---------- */
  var ac = null;
  function tone(f, at, len, type, vol) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + (at || 0);
      o.type = type || "sawtooth"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.8, t + len);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.05, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + len + 0.05);
    } catch (e) {}
  }
  function vroom() { tone(70, 0, 0.5, "sawtooth", 0.06); tone(90, 0.35, 0.6, "sawtooth", 0.05); }
  function beep(f) { tone(f, 0, 0.12, "square", 0.05); }

  function stats(tier, c) {
    return { vmax: 4 + tier * 0.35 + c.up.eng * 0.25, acc: 1.6 + c.up.tyre * 0.35, boost: 1.8 + c.up.turbo * 0.35 };
  }
  function race(player, R, after) {
    var pet = P.load(player.id), mine = car(pet), myTier = driving(player.id, mine), F = furOf(pet);
    var w = overlay("race-wrap");
    w.innerHTML = '<div class="race">' +
      '<div class="r-top"><span class="r-title">🏁 ' + esc(CARS[myTier].name) + " vs " + esc(R.name) + '</span></div>' +
      '<div class="r-track"><div class="r-scenery"></div><div class="r-lane l1"><div class="r-car them"></div></div><div class="r-lane l2"><div class="r-car me"></div></div><div class="r-finish"></div>' +
      '<div class="r-count"></div></div>' +
      '<div class="r-bar"><span class="r-me-dot">' + esc(player.emoji || "🙂") + '</span><span class="r-them-dot">' + (R.robo ? "🤖" : "🏎️") + '</span><i></i></div>' +
      '<div class="r-q" hidden><p class="r-qp"></p><div class="r-choices"></div></div>' +
      '<div class="r-end" hidden></div></div>';
    var meEl = w.querySelector(".r-car.me"), themEl = w.querySelector(".r-car.them"), track = w.querySelector(".r-track"), scen = w.querySelector(".r-scenery");
    meEl.innerHTML = carSVG(myTier, mine, F, { uid: "rm" }); themEl.innerHTML = carSVG(R.tier, R.c, R.F, { uid: "rt" });
    var A = { s: stats(myTier, mine), x: 0, v: 0, boostT: 0, wobT: 0, el: meEl }, B = { s: stats(R.tier, R.c), x: 0, v: 0, boostT: 0, wobT: 0, el: themEl };
    var LEN = 100, GATES = [16, 36, 56, 76], gate = 0, slow = 1, qOpen = false, qTimer = 0, finished = false, last = 0, started = false, scroll = 0, boosts = 0;
    var qBox = w.querySelector(".r-q"), barMe = w.querySelector(".r-me-dot"), barThem = w.querySelector(".r-them-dot");

    function place() {
      var tw = track.clientWidth, cw = meEl.clientWidth || 160, span = Math.max(50, tw - cw - 24);
      // The camera follows the leader a little so the race feels fast; scenery scrolls with my speed.
      meEl.style.transform = "translateX(" + (12 + A.x / LEN * span) + "px)";
      themEl.style.transform = "translateX(" + (12 + B.x / LEN * span) + "px)";
      meEl.classList.toggle("boosting", A.boostT > 0); themEl.classList.toggle("boosting", B.boostT > 0);
      meEl.classList.toggle("wobble", A.wobT > 0); themEl.classList.toggle("wobble", B.wobT > 0);
      scen.style.backgroundPositionX = (-scroll) + "px";
      barMe.style.left = Math.min(100, A.x) + "%"; barThem.style.left = Math.min(100, B.x) + "%";
    }
    function step(o, dt) {
      var top = o.s.vmax + (o.boostT > 0 ? o.s.boost : 0), target = o.wobT > 0 ? top * 0.35 : top;
      if (o.v < target) o.v = Math.min(target, o.v + (o.boostT > 0 ? o.s.acc * 2.2 : o.s.acc) * dt);
      else o.v = Math.max(target, o.v - 4 * dt);
      o.x += o.v * dt;
      o.boostT = Math.max(0, o.boostT - dt); o.wobT = Math.max(0, o.wobT - dt);
    }
    function frame(now) {
      if (!w.isConnected) return;
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (started && !finished) {
        var sdt = dt * slow;
        step(A, sdt); step(B, sdt);
        scroll += A.v * sdt * 18;
        if (qOpen) { qTimer -= dt; if (qTimer <= 0) answer(null); }
        else if (gate < GATES.length && Math.max(A.x, B.x) >= GATES[gate]) ask();
        if (A.x >= LEN || B.x >= LEN) finish();
      }
      place();
      requestAnimationFrame(frame);
    }
    var Qn = null;
    function ask() {
      gate++; qOpen = true; slow = 0.3; qTimer = 8;
      Qn = boostQ(player.id);
      w.querySelector(".r-qp").textContent = Qn.show;
      var cbox = w.querySelector(".r-choices"); cbox.innerHTML = ""; cbox.classList.toggle("big", !!Qn.big);
      var cols = ["grape", "sky", "tang"];
      Qn.choices.forEach(function (v, i) {
        var b = document.createElement("button"); b.type = "button"; b.className = "block c-" + cols[i % 3]; b.textContent = v;
        b.addEventListener("click", function () { answer(v, b); });
        cbox.appendChild(b);
      });
      qBox.hidden = false; K.say(Qn.say);
      // The other car reads too.
      setTimeout(function () { if (!finished && Math.random() < R.read) { B.boostT = 1.6; } }, 600 + Math.random() * 1600);
    }
    function answer(v, btn) {
      if (!qOpen) return;
      qOpen = false; slow = 1; qBox.hidden = true;
      if (v === Qn.answer) { A.boostT = 1.6; boosts++; K.say(pick(["Turbo boost!", "Zoom!", "Yes! Boost!", "Vroom!"])); vroom(); }
      else if (v == null) { K.say("Too slow! Keep driving!"); }
      else { A.wobT = 0.9; K.say("Oops! It was " + Qn.answer + ". Wobble!"); beep(160); }
    }
    function finish() {
      finished = true; qOpen = false; qBox.hidden = true;
      var won = A.x >= B.x, prize = won ? WIN_PARTS : LOSE_PARTS;
      var c2 = car(P.load(player.id)); c2.parts += prize; if (won) c2.w++; else c2.l++; saveCar(player.id, c2);
      var end = w.querySelector(".r-end");
      end.hidden = false;
      end.innerHTML = '<div class="card"><div class="big">' + (won ? "🏆" : "🥈") + '</div><h2></h2><p class="fine"></p><div class="rowb"></div></div>';
      end.querySelector("h2").textContent = won ? "You won!" : R.name + " won this time!";
      end.querySelector(".fine").textContent = "You got " + boosts + " of " + GATES.length + " reading boosts. You get 🔧 " + prize + (prize === 1 ? " part." : " parts.") + " ⛽ " + fuelLeft(c2) + " fuel left today.";
      var row = end.querySelector(".rowb");
      function btn(label, color, fn) { var b = document.createElement("button"); b.type = "button"; b.className = "block c-" + color; b.textContent = label; b.addEventListener("click", fn); row.appendChild(b); }
      if (fuelLeft(c2) > 0) btn("🏁 Race again", "sun", function () { w.remove(); chooseRival(player, after); });
      else btn("⛽ Fill up", "leaf", fillUp);
      btn("🏎️ Garage", "sky", function () { w.remove(); if (after) after(); });
      if (won) { K.celebrate(end.querySelector(".big"), ["🏆", "🏁", "⭐"]); [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.14, "square", 0.05); }); }
      K.say(won ? "You won the race! " + prize + " parts!" : R.name + " won this time. Read fast for more boosts! You still get a part.");
    }
    // 3, 2, 1, GO!
    var cnt = w.querySelector(".r-count"), n = 3;
    (function count() {
      if (!w.isConnected) return;
      cnt.textContent = n > 0 ? n : "GO!"; cnt.classList.remove("pop"); void cnt.offsetWidth; cnt.classList.add("pop");
      if (n > 0) { beep(440); K.say(String(n)); n--; setTimeout(count, 900); }
      else { beep(880); vroom(); K.say("Go!"); started = true; setTimeout(function () { cnt.textContent = ""; }, 700); }
    })();
    requestAnimationFrame(frame);
  }

  /* ---------- home tile ---------- */
  function partsOf(pid) { return car(P.load(pid)).parts; }
  function homeTile(player) {
    var c = car(P.load(player.id)), t = driving(player.id, c);
    return { emoji: "🏎️", title: "Garage", sub: "🔧 " + c.parts + " parts · " + CARS[t].name };
  }

  window.KidsGarage = { open: open, carSVG: carSVG, car: car, tierFor: tierFor, englishDone: englishDone, homeTile: homeTile, partsOf: partsOf, CARS: CARS };
})();
