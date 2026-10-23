/* Math Teddy: each kid's pet.
   Egg -> hatches at 10 stars -> Baby -> Little (60) -> Big (150).
   Outfits unlock at star milestones. Every star earned becomes a grape to feed him.
   If nobody has played for 2 days he's asleep; tapping wakes him up happy. He never gets sad or hungry. */
(function () {
  var K = window.KidsLab;
  var HATCH = 10;
  var STAGES = [
    { id: 1, name: "Baby teddy", at: HATCH, scale: 0.62 },
    { id: 2, name: "Little teddy", at: 60, scale: 0.8 },
    { id: 3, name: "Big teddy", at: 150, scale: 1 }
  ];
  var OUTFITS = [
    { id: "glasses", slot: "face", name: "Glasses", icon: "👓", at: 20 },
    { id: "bowtie", slot: "neck", name: "Bow tie", icon: "🎀", at: 40 },
    { id: "scarf", slot: "neck", name: "Scarf", icon: "🧣", at: 80 },
    { id: "cape", slot: "back", name: "Super cape", icon: "🦸", at: 110 },
    { id: "grapehat", slot: "hat", name: "Grape hat", icon: "🍇", at: 180 },
    { id: "crown", slot: "hat", name: "Crown", icon: "👑", at: 250 }
  ];
  var NAMES = ["Teddy", "Biscuit", "Grapey", "Honey", "Mr Bear", "Bubbles", "Cuddles", "Professor"];
  var SLEEP_AFTER = 2 * 24 * 3600 * 1000;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- state ---------- */
  function key(id) { return "pet." + id; }
  function load(id) {
    var s = K.get(key(id), null) || {};
    return {
      name: s.name || "", hatched: !!s.hatched, wear: s.wear || {}, fedUpTo: s.fedUpTo == null ? null : s.fedUpTo,
      lastSeen: s.lastSeen || null, seen: s.seen || [], stage: s.stage || 0, asleep: !!s.asleep
    };
  }
  function save(id, s) { K.set(key(id), s); }

  function stageFor(stars) {
    var st = 0;
    STAGES.forEach(function (S) { if (stars >= S.at) st = S.id; });
    return st;
  }
  function unlocked(stars) { return OUTFITS.filter(function (o) { return stars >= o.at; }); }
  function nextGoal(stars, hatched) {
    if (!hatched) return { at: HATCH, from: 0, text: stars >= HATCH ? "Ready to hatch!" : "Hatch at " + HATCH + " ⭐" };
    var goals = STAGES.filter(function (S) { return S.at > HATCH; }).map(function (S) { return { at: S.at, text: "Grows into a " + S.name.toLowerCase() }; })
      .concat(OUTFITS.map(function (o) { return { at: o.at, text: "Unlocks the " + o.name.toLowerCase() + " " + o.icon }; }))
      .sort(function (a, b) { return a.at - b.at; });
    var prev = HATCH, g = null;
    for (var i = 0; i < goals.length; i++) { if (goals[i].at > stars) { g = goals[i]; break; } prev = goals[i].at; }
    if (!g) return null;
    g.from = prev;
    return g;
  }
  function grapesWaiting(id, s) {
    if (!s.hatched || s.fedUpTo == null) return 0;
    return Math.max(0, Math.min(12, K.stars(id) - s.fedUpTo));
  }

  /* ---------- sound ---------- */
  var ac = null;
  function tone(freq, at, len, vol) {
    if (!K.get("sound", true)) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + (at || 0);
      o.type = "triangle"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.2));
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + (len || 0.2) + 0.05);
    } catch (e) {}
  }
  function jingle() { [523, 659, 784, 659, 880, 784, 1047].forEach(function (f, i) { tone(f, i * 0.16, 0.18); }); }
  function munchSound() { tone(220, 0, 0.08, 0.1); tone(180, 0.12, 0.08, 0.1); tone(240, 0.24, 0.08, 0.1); }

  /* ---------- drawings ---------- */
  var FUR = "#A86B3C", FUR_D = "#8E5830", FUR_L = "#E7B98A", INK = "#2B1A10";

  function teddySVG(stage, wear) {
    var S = STAGES[stage - 1] || STAGES[0];
    wear = wear || {};
    var head = stage === 1 ? ' transform="translate(100 132) scale(1.14) translate(-100 -132)"' : "";
    var cape = wear.back === "cape" ? '<path d="M64 128 Q100 120 136 128 L166 222 Q100 236 34 222 Z" fill="#D4466F"/><path d="M64 128 Q100 120 136 128 L140 140 Q100 132 60 140 Z" fill="#B2345A"/>' : "";
    var neck = "";
    if (wear.neck === "bowtie") neck = '<path d="M100 136 L78 124 L78 148 Z M100 136 L122 124 L122 148 Z" fill="#6E44A8"/><circle cx="100" cy="136" r="7" fill="#8A5FCB"/>';
    if (wear.neck === "scarf") neck = '<path d="M60 128 Q100 146 140 128 L142 142 Q100 160 58 142 Z" fill="#2F9358"/><path d="M118 140 L132 186 L116 188 L108 146 Z" fill="#2F9358"/><path d="M60 133 Q100 151 140 133" stroke="#E9A21F" stroke-width="4" fill="none"/>';
    var glasses = wear.face === "glasses" ? '<g fill="rgba(255,255,255,.25)" stroke="' + INK + '" stroke-width="4"><circle cx="82" cy="78" r="14"/><circle cx="118" cy="78" r="14"/></g><path d="M96 78 H104 M68 74 L54 68 M132 74 L146 68" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' : "";
    var hat = "";
    if (wear.hat === "crown") hat = '<path d="M68 42 L74 12 L88 30 L100 4 L112 30 L126 12 L132 42 Z" fill="#F2C230" stroke="#C99A12" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="30" r="5" fill="#D4466F"/><circle cx="82" cy="34" r="4" fill="#2F7FC6"/><circle cx="118" cy="34" r="4" fill="#2F9358"/>';
    if (wear.hat === "grapehat") hat = '<g fill="#8A5FCB" stroke="#5B2E95" stroke-width="2"><circle cx="82" cy="34" r="11"/><circle cx="100" cy="30" r="12"/><circle cx="118" cy="34" r="11"/><circle cx="91" cy="18" r="11"/><circle cx="109" cy="18" r="11"/><circle cx="100" cy="6" r="10"/></g><path d="M100 -4 Q114 -14 126 -6 Q114 4 100 -4 Z" fill="#3AAA69"/>';

    return '<svg class="teddy-svg" viewBox="0 -20 200 260" aria-hidden="true">' +
      '<g transform="translate(100 236) scale(' + S.scale + ') translate(-100 -236)"><g class="rig">' +
      cape +
      '<ellipse cx="72" cy="222" rx="24" ry="15" fill="' + FUR_D + '"/><ellipse cx="128" cy="222" rx="24" ry="15" fill="' + FUR_D + '"/>' +
      '<ellipse cx="72" cy="224" rx="12" ry="7" fill="' + FUR_L + '"/><ellipse cx="128" cy="224" rx="12" ry="7" fill="' + FUR_L + '"/>' +
      '<ellipse cx="52" cy="168" rx="15" ry="28" fill="' + FUR_D + '" transform="rotate(22 52 168)"/>' +
      '<g class="arm-r"><ellipse cx="148" cy="168" rx="15" ry="28" fill="' + FUR_D + '" transform="rotate(-22 148 168)"/></g>' +
      '<ellipse cx="100" cy="178" rx="52" ry="47" fill="' + FUR + '"/>' +
      '<ellipse cx="100" cy="184" rx="32" ry="30" fill="' + FUR_L + '"/>' +
      '<path d="M100 172 V196 M88 184 H112" stroke="#6E44A8" stroke-width="7" stroke-linecap="round"/>' +
      neck +
      '<g' + head + '>' +
      '<circle cx="56" cy="50" r="22" fill="' + FUR + '"/><circle cx="56" cy="50" r="11" fill="' + FUR_L + '"/>' +
      '<circle cx="144" cy="50" r="22" fill="' + FUR + '"/><circle cx="144" cy="50" r="11" fill="' + FUR_L + '"/>' +
      '<circle cx="100" cy="84" r="51" fill="' + FUR + '"/>' +
      '<ellipse cx="100" cy="104" rx="26" ry="20" fill="' + FUR_L + '"/>' +
      '<ellipse cx="100" cy="95" rx="10" ry="7" fill="' + INK + '"/>' +
      '<path class="mouth-smile" d="M88 108 Q100 119 112 108" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse class="mouth-open" cx="100" cy="111" rx="9" ry="8" fill="#5A2A1A"/>' +
      '<g class="eye-open"><circle cx="82" cy="78" r="7" fill="' + INK + '"/><circle cx="118" cy="78" r="7" fill="' + INK + '"/><circle cx="84.5" cy="75.5" r="2.4" fill="#fff"/><circle cx="120.5" cy="75.5" r="2.4" fill="#fff"/></g>' +
      '<g class="eye-shut" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"><path d="M74 79 Q82 85 90 79"/><path d="M110 79 Q118 85 126 79"/></g>' +
      '<g class="eye-happy" stroke="' + INK + '" stroke-width="4.5" fill="none" stroke-linecap="round"><path d="M74 82 Q82 70 90 82"/><path d="M110 82 Q118 70 126 82"/></g>' +
      '<circle cx="66" cy="102" r="8" fill="#E89BA8" opacity=".75"/><circle cx="134" cy="102" r="8" fill="#E89BA8" opacity=".75"/>' +
      glasses + hat +
      '</g></g></g></svg>';
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
      '<g class="egg-rig"><g class="shell-bot" clip-path="url(#' + u + 'b)">' + shell + '</g>' +
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
  var EAT_LINES = ["Yum!", "Munch munch!", "Delicious grapes!", "More please!", "Mmm, juicy!"];

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
    var stars = K.stars(p.id), s = load(p.id);
    var g = nextGoal(stars, s.hatched);
    var newThings = s.hatched && unlocked(stars).some(function (o) { return s.seen.indexOf(o.id) === -1; });
    var waiting = grapesWaiting(p.id, s);

    var bubble, sub;
    if (!s.hatched) {
      bubble = stars >= HATCH ? "Your egg is hatching! Tap it!" : "Hi " + p.name + "! Your egg needs " + (HATCH - stars) + " more ⭐";
      sub = "Mystery egg";
    } else if (s.asleep) {
      bubble = "Zzz… " + s.name + " is asleep. Tap to wake him!"; sub = s.name + " · " + STAGES[stageFor(stars) - 1].name;
    } else {
      bubble = waiting ? "Hi " + p.name + "! I'm hungry for grapes!" : "Hi " + p.name + "!";
      sub = s.name + " · " + STAGES[stageFor(stars) - 1].name;
    }

    el.innerHTML = "";
    var b = document.createElement("button");
    b.type = "button"; b.className = "pet-card"; b.setAttribute("aria-label", "Open your teddy");
    var pet = document.createElement("div");
    pet.className = "pc-pet idle" + (!s.hatched && stars >= HATCH ? " ready" : "") + (s.asleep ? " sleeping" : "");
    pet.innerHTML = s.hatched ? teddySVG(stageFor(stars), s.wear) + (s.asleep ? zzz() : "") : eggSVG(Math.min(3, Math.floor(stars / 4)));
    var txt = document.createElement("div"); txt.className = "pc-text";
    txt.innerHTML = '<div class="pc-bubble"></div><div class="pc-name"></div>';
    txt.querySelector(".pc-bubble").textContent = bubble;
    txt.querySelector(".pc-name").textContent = sub;
    if (g) {
      var pct = Math.max(0, Math.min(100, ((stars - g.from) / (g.at - g.from)) * 100));
      var bar = document.createElement("div"); bar.className = "goal-bar"; bar.innerHTML = "<span></span>";
      bar.firstChild.style.width = pct + "%";
      var gt = document.createElement("div"); gt.className = "goal-txt";
      gt.textContent = (stars >= g.at ? g.text : "⭐ " + stars + " / " + g.at + "  ·  " + g.text);
      txt.appendChild(bar); txt.appendChild(gt);
    }
    b.appendChild(pet); b.appendChild(txt);
    if (newThings) { var n = document.createElement("span"); n.className = "pc-new"; n.textContent = "NEW!"; b.appendChild(n); }
    b.addEventListener("click", openRoom);
    el.appendChild(b);
    if (s.hatched && !s.asleep) startBlinking(pet);
  }

  /* ---------- the room ---------- */
  var room = null, R = null;

  function openRoom() {
    var p = K.player(); if (!p) return;
    closeRoom();
    room = document.createElement("div");
    room.className = "pet-room";
    room.innerHTML =
      '<div class="pr-inner">' +
      '<div class="bar"><button class="round small pr-back" type="button" aria-label="Back">⬅️</button><div class="pr-title"></div>' +
      '<div class="stars"><span>⭐</span><span class="pr-stars"></span></div></div>' +
      '<div class="pr-stage"><div class="pr-bubble" aria-live="polite"></div><div class="pr-pet idle"></div><div class="floor"></div></div>' +
      '<div class="pr-goal"></div>' +
      '<div class="pr-bowl" aria-label="Grape bowl"></div>' +
      '<div class="pr-actions"></div></div>';
    document.body.appendChild(room);
    room.querySelector(".pr-back").addEventListener("click", closeRoom);
    room.querySelector(".pr-title").addEventListener("click", function () { if (load(R.p.id).hatched) openNaming(false); });
    R = { p: p, petEl: room.querySelector(".pr-pet"), bubble: room.querySelector(".pr-bubble"), taps: 0, busy: false };
    R.petEl.addEventListener("click", tapPet);
    drawRoom(true);
  }

  function closeRoom() {
    if (room) { room.remove(); room = null; R = null; }
    if (cardEl) renderCard(cardEl);
  }

  function say(text) { if (R) R.bubble.textContent = text; K.say(text); }

  function drawRoom(first) {
    var p = R.p, s = load(p.id), stars = K.stars(p.id);
    room.querySelector(".pr-title").textContent = s.hatched ? s.name : "Your egg";
    room.querySelector(".pr-stars").textContent = stars;

    var stage = stageFor(stars);
    if (s.hatched) {
      R.petEl.className = "pr-pet idle" + (s.asleep ? " sleeping" : "");
      R.petEl.innerHTML = teddySVG(stage, s.wear) + (s.asleep ? zzz() : "");
      startBlinking(R.petEl);
    } else {
      R.petEl.className = "pr-pet" + (stars >= HATCH ? " ready" : "");
      R.petEl.innerHTML = eggSVG(Math.min(3, Math.floor(stars / 4)));
    }

    // goal
    var g = nextGoal(stars, s.hatched), goal = room.querySelector(".pr-goal");
    goal.innerHTML = "";
    if (g && !(stars >= g.at)) {
      var pct = Math.max(0, Math.min(100, ((stars - g.from) / (g.at - g.from)) * 100));
      goal.innerHTML = '<div class="goal-bar"><span></span></div><div class="goal-txt"></div>';
      goal.querySelector("span").style.width = pct + "%";
      goal.querySelector(".goal-txt").textContent = "⭐ " + stars + " / " + g.at + "  ·  " + g.text;
    }

    drawBowl(s);
    drawActions(s, stars);

    if (first) {
      if (!s.hatched) say(stars >= HATCH ? "Your egg is wiggling! Tap it three times!" : "Your egg needs " + (HATCH - stars) + " more stars to hatch. Play a game to earn stars!");
      else if (s.asleep) say("Shh… " + s.name + " is sleeping. Tap him to wake him up!");
      else if (stage > s.stage) { s.stage = stage; save(p.id, s); say("Look! I grew into a " + STAGES[stage - 1].name.toLowerCase() + "!"); dance(R.petEl, "d-jump"); jingle(); K.celebrate(R.petEl); }
      else if (grapesWaiting(p.id, s)) say("Hi " + p.name + "! Can I have some grapes?");
      else { say(pick(["Hi " + p.name + "!", "Yay, " + p.name + " is here!", "Hello " + p.name + "! Let's play!"])); dance(R.petEl, "d-wave"); }
    }
  }

  function drawBowl(s) {
    var bowl = room.querySelector(".pr-bowl"), p = R.p;
    bowl.hidden = !s.hatched;
    if (!s.hatched) return;
    bowl.innerHTML = "";
    var n = grapesWaiting(p.id, s);
    if (!n) {
      bowl.innerHTML = '<p class="empty-note">No grapes left. Earn stars in a game to get more!</p>';
      return;
    }
    for (var i = 0; i < n; i++) {
      var gEl = document.createElement("button");
      gEl.type = "button"; gEl.className = "pet-grape"; gEl.setAttribute("aria-label", "Feed a grape");
      gEl.addEventListener("click", feed);
      bowl.appendChild(gEl);
    }
  }

  function drawActions(s, stars) {
    var a = room.querySelector(".pr-actions"); a.innerHTML = "";
    if (!s.hatched) return;
    function btn(label, color, fn, isNew) {
      var b = document.createElement("button"); b.type = "button"; b.className = "block c-" + color;
      b.innerHTML = '<span class="label"></span>'; b.querySelector(".label").textContent = label;
      if (isNew) { var n = document.createElement("span"); n.className = "badge-new"; n.textContent = "NEW"; b.appendChild(n); }
      b.addEventListener("click", fn); a.appendChild(b);
    }
    btn("💃 Dance!", "berry", function () {
      if (!wake()) return;
      dance(R.petEl); jingle(); say(pick(["Watch me dance!", "Dance party!", "Wheee!", "Can you dance too?"]));
    });
    var hasNew = unlocked(stars).some(function (o) { return s.seen.indexOf(o.id) === -1; });
    btn("👕 Dress up", "sky", openWardrobe, hasNew);
  }

  // Returns false if the tap was used to wake him up.
  function wake() {
    var s = load(R.p.id);
    if (!s.asleep) return true;
    s.asleep = false; s.lastSeen = new Date().toISOString(); save(R.p.id, s);
    R.petEl.classList.remove("sleeping");
    var z = R.petEl.querySelector(".zzz"); if (z) z.remove();
    startBlinking(R.petEl);
    say("Oh! " + R.p.name + "! You're back! I missed you!");
    dance(R.petEl, "d-jump"); jingle();
    return false;
  }

  function tapPet() {
    if (!R || R.busy) return;
    var s = load(R.p.id), stars = K.stars(R.p.id);
    if (!s.hatched) {
      if (stars < HATCH) { R.petEl.classList.remove("shake"); void R.petEl.offsetWidth; R.petEl.classList.add("shake"); say("Not yet! " + (HATCH - stars) + " more stars to hatch."); return; }
      return crack();
    }
    if (!wake()) return;
    dance(R.petEl, pick(DANCES)); tone(660, 0, 0.12); tone(880, 0.1, 0.15);
    say(pick(TAP_LINES));
  }

  function crack() {
    R.taps++;
    var svg = R.petEl.querySelector(".egg-svg");
    svg.setAttribute("class", "egg-svg cr" + Math.min(3, R.taps));
    R.petEl.classList.remove("shake"); void R.petEl.offsetWidth; R.petEl.classList.add("shake");
    tone(300 + R.taps * 120, 0, 0.15, 0.2);
    if (R.taps < 3) { say(R.taps === 1 ? "Crack! Keep tapping!" : "It's coming! One more!"); return; }
    R.busy = true;
    R.petEl.classList.remove("ready");
    R.petEl.classList.add("hatching");
    say("Here it comes…");
    setTimeout(function () {
      var s = load(R.p.id), stars = K.stars(R.p.id);
      s.hatched = true; s.fedUpTo = stars - 5; s.stage = stageFor(stars); s.lastSeen = new Date().toISOString();
      save(R.p.id, s);
      R.petEl.className = "pr-pet idle";
      R.petEl.innerHTML = teddySVG(s.stage, s.wear);
      R.petEl.firstChild.classList.add("pop-out");
      K.celebrate(R.petEl, ["🧸", "⭐", "🎉", "✨"]); jingle();
      say("Hello " + R.p.name + "! I'm your Math Teddy!");
      setTimeout(function () { dance(R.petEl, "d-wave"); }, 700);
      setTimeout(function () { R.busy = false; openNaming(true); }, 2400);
    }, reduce ? 200 : 750);
  }

  function feed(e) {
    if (!R || R.busy) return;
    if (!wake()) return;
    var grape = e.currentTarget;
    var mouth = R.petEl.querySelector(".mouth-smile") || R.petEl;
    var a = grape.getBoundingClientRect(), b = mouth.getBoundingClientRect();
    var ghost = document.createElement("span");
    ghost.className = "pet-grape";
    ghost.style.cssText = "position:fixed;z-index:80;pointer-events:none;left:" + a.left + "px;top:" + a.top + "px;transition:transform .45s cubic-bezier(.4,.1,.3,1)";
    document.body.appendChild(ghost);
    grape.style.visibility = "hidden";
    R.busy = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      ghost.style.transform = "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + b.height / 2 - a.top - a.height / 2) + "px) scale(.4)";
    }); });
    setTimeout(function () {
      ghost.remove();
      var s = load(R.p.id); s.fedUpTo += 1; save(R.p.id, s);
      R.petEl.classList.add("munch"); munchSound();
      var left = grapesWaiting(R.p.id, s);
      say(left ? pick(EAT_LINES) : "Yum! My tummy is full! Thank you " + R.p.name + "!");
      setTimeout(function () {
        R.petEl.classList.remove("munch");
        R.busy = false;
        drawBowl(s);
        if (!left) { dance(R.petEl, "d-groove"); jingle(); }
      }, 650);
    }, 470);
  }

  /* ---------- wardrobe ---------- */
  function openWardrobe() {
    if (!R) return;
    var p = R.p, s = load(p.id), stars = K.stars(p.id);
    var wrap = document.createElement("div"); wrap.className = "pet-sheet-wrap";
    wrap.innerHTML = '<div class="pet-sheet" role="dialog" aria-modal="true"><h2>Dress up</h2><div class="wardrobe"></div>' +
      '<button class="block c-leaf" type="button">Done</button></div>';
    var grid = wrap.querySelector(".wardrobe");
    OUTFITS.forEach(function (o) {
      var open = stars >= o.at;
      var b = document.createElement("button"); b.type = "button";
      b.className = "w-item" + (open ? "" : " locked") + (s.wear[o.slot] === o.id ? " on" : "");
      b.innerHTML = '<span class="wi" aria-hidden="true"></span><span class="wn"></span><span class="wl"></span>';
      b.querySelector(".wi").textContent = o.icon;
      b.querySelector(".wn").textContent = o.name;
      b.querySelector(".wl").textContent = open ? (s.wear[o.slot] === o.id ? "Wearing" : "Tap to wear") : "🔒 " + o.at + " ⭐";
      if (open && s.seen.indexOf(o.id) === -1) { var n = document.createElement("span"); n.className = "badge-new"; n.textContent = "NEW"; b.appendChild(n); }
      b.addEventListener("click", function () {
        if (!open) { K.say("Earn " + (o.at - stars) + " more stars to unlock the " + o.name); return; }
        var st = load(p.id);
        if (st.wear[o.slot] === o.id) delete st.wear[o.slot]; else st.wear[o.slot] = o.id;
        save(p.id, st);
        wrap.remove(); openWardrobeAfter(o, st.wear[o.slot] === o.id);
      });
      grid.appendChild(b);
    });
    // mark everything unlocked as seen
    s.seen = unlocked(stars).map(function (o) { return o.id; }); save(p.id, s);
    wrap.querySelector(".block").addEventListener("click", function () { wrap.remove(); drawRoom(false); });
    wrap.addEventListener("click", function (e) { if (e.target === wrap) { wrap.remove(); drawRoom(false); } });
    document.body.appendChild(wrap);
    K.say("Dress up!");
  }
  function openWardrobeAfter(o, on) {
    drawRoom(false);
    if (on) { say(pick(["Ooh, I love my " + o.name.toLowerCase() + "!", "Do I look fancy?", "So stylish!"])); dance(R.petEl, "d-spin"); tone(784, 0, .15); tone(1047, .12, .2); }
    else say("Okay, I took it off.");
    setTimeout(openWardrobe, on ? 1400 : 500);
  }

  /* ---------- naming ---------- */
  function openNaming(isNew) {
    if (!R) return;
    var p = R.p, s = load(p.id);
    var wrap = document.createElement("div"); wrap.className = "pet-sheet-wrap";
    wrap.innerHTML = '<div class="pet-sheet" role="dialog" aria-modal="true"><div style="width:140px"></div><h2>What\'s my name?</h2>' +
      '<div class="name-chips"></div><input class="name-input" id="pet-name" maxlength="16" autocomplete="off" placeholder="Or type a name">' +
      '<button class="block c-leaf" type="button">That\'s my name!</button></div>';
    wrap.querySelector("div[style]").innerHTML = teddySVG(stageFor(K.stars(p.id)), s.wear);
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

  window.KidsPet = { renderCard: renderCard, openRoom: openRoom, arrive: arrive, teddySVG: teddySVG, eggSVG: eggSVG };
})();
