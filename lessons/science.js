/* Science lessons for Kids Lab: Biology, Chemistry, Physics, Earth & Space.
   Each lesson has explore(stage, api), a hands-on activity, and gen(quiz), the quiz questions.
   Loaded by lessons/basics.html, which provides the helpers in H. */
window.makeScienceLessons = function (H) {
  var rnd = H.rnd, pick = H.pickOne, shuffle = H.shuffle, options = H.options, K = H.K, reduce = H.reduce;

  /* ---------- styles for the activities ---------- */
  if (!document.getElementById("sci-css")) {
    var css = document.createElement("style"); css.id = "sci-css";
    css.textContent = [
      ".explore-stage { flex-direction: column; gap: 14px; min-height: 360px; }",
      ".sci-card { display: flex; flex-direction: column; align-items: center; gap: 4px; }",
      ".sci-card .e { font-size: 96px; line-height: 1; }",
      ".sci-card .n { font-family: var(--display); font-weight: 800; font-size: 1.8rem; }",
      ".sci-card.shake { animation: sshake .45s; } @keyframes sshake { 25%,75% { transform: translateX(-10px); } 50% { transform: translateX(10px); } }",
      ".sci-card.fly { animation: sfly .45s ease-in forwards; } @keyframes sfly { to { transform: translateY(80px) scale(.3); opacity: 0; } }",
      ".bins { width: 100%; display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 130px), 1fr)); }",
      ".bin { border: 0; border-radius: 22px; padding: 12px 8px; min-height: 120px; cursor: pointer; color: #fff; background: var(--c); box-shadow: 0 7px 0 color-mix(in srgb, var(--c) 62%, #000);",
      "  display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: var(--display); font-weight: 800; font-size: 1.3rem; }",
      ".bin:active { transform: translateY(5px); box-shadow: 0 2px 0 color-mix(in srgb, var(--c) 62%, #000); }",
      ".bin .be { font-size: 40px; line-height: 1; } .bin .got { font-size: 22px; min-height: 26px; letter-spacing: 2px; text-shadow: none; }",
      ".sci-progress { font-weight: 800; color: var(--muted); }",
      ".slots { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }",
      ".slot { width: 110px; min-height: 110px; border-radius: 18px; box-shadow: inset 0 0 0 4px var(--rim); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6px; text-align: center; font-weight: 800; font-size: .9rem; }",
      ".slot .e { font-size: 44px; line-height: 1.1; } .slot.full { background: var(--bg-2); box-shadow: inset 0 0 0 4px var(--leaf); }",
      ".slot-arrow { font-size: 1.6rem; color: var(--muted); }",
      ".cards { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }",
      ".card-btn { border: 0; border-radius: 18px; width: 120px; min-height: 110px; background: var(--card); box-shadow: 0 6px 0 var(--shadow), inset 0 0 0 3px var(--rim); cursor: pointer;",
      "  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-weight: 800; font-size: .95rem; color: var(--ink); padding: 6px; }",
      ".card-btn .e { font-size: 46px; line-height: 1.1; } .card-btn.used { visibility: hidden; } .card-btn.shake { animation: sshake .45s; }",
      ".dot-planet { border-radius: 50%; display: inline-block; box-shadow: inset -6px -6px 0 rgba(0,0,0,.18); }",
      ".tank { position: relative; width: min(520px, 100%); height: 240px; border-radius: 0 0 26px 26px; border: 6px solid #9EC5F0; border-top: 0; background: linear-gradient(transparent 22%, #8CC8FF 22%, #4A9BE0); overflow: hidden; }",
      ".tank .obj { position: absolute; font-size: 54px; line-height: 1; transition: top 1.1s cubic-bezier(.3,.6,.4,1); transform: translateX(-50%); }",
      ".tank .obj.bob { animation: bob 1.6s ease-in-out infinite; } @keyframes bob { 50% { transform: translateX(-50%) translateY(6px) rotate(4deg); } }",
      ".objrow { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }",
      ".objbtn { border: 0; border-radius: 16px; background: var(--card); box-shadow: 0 5px 0 var(--shadow), inset 0 0 0 3px var(--rim); width: 92px; padding: 8px 4px; cursor: pointer; font-weight: 800; font-size: .85rem; color: var(--ink); }",
      ".objbtn .e { font-size: 40px; display: block; line-height: 1.1; } .objbtn.done { opacity: .45; } .objbtn.sel { box-shadow: 0 5px 0 var(--shadow), inset 0 0 0 4px var(--sun); }",
      ".magnet-zone { position: relative; width: min(560px, 100%); height: 250px; }",
      ".magnet { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 90px; }",
      ".mitem { position: absolute; font-size: 44px; transition: left .7s cubic-bezier(.5,0,.3,1.3), top .7s cubic-bezier(.5,0,.3,1.3); transform: translate(-50%, -50%); border: 0; background: none; cursor: pointer; }",
      ".mitem.nope { animation: sshake .45s; }",
      ".sci-slider { width: min(460px, 100%); accent-color: var(--berry); height: 34px; }",
      ".sci-readout { font-family: var(--display); font-weight: 800; font-size: 2rem; }",
      ".sci-canvas { width: min(420px, 100%); height: auto; aspect-ratio: 420 / 260; border-radius: 22px; background: var(--bg-2); }",
      ".paints { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }",
      ".paint { width: 76px; height: 76px; border-radius: 50%; border: 5px solid var(--card); box-shadow: 0 5px 0 var(--shadow); cursor: pointer; }",
      ".paint.sel { box-shadow: 0 0 0 5px var(--sun), 0 5px 0 var(--shadow); transform: scale(1.08); }",
      ".bowl-mix { width: 170px; height: 110px; border-radius: 0 0 90px 90px; background: #E9EEF6; border: 6px solid #C9D2E2; border-top-width: 3px; display: grid; place-items: center; transition: background .6s; font-family: var(--display); font-weight: 800; font-size: 1.4rem; color: #fff; text-shadow: 0 2px 0 rgba(0,0,0,.3); }",
      ".beaker { position: relative; width: 170px; height: 210px; border: 6px solid #9EC5F0; border-top: 0; border-radius: 0 0 22px 22px; background: linear-gradient(transparent 18%, rgba(140,200,255,.55) 18%); overflow: hidden; }",
      ".beaker .p { position: absolute; width: 9px; height: 9px; border-radius: 50%; transition: top 1.4s ease-in, opacity 1.6s ease, left 1.4s ease; }",
      ".body-wrap { position: relative; width: min(300px, 80vw); }",
      ".organ { cursor: pointer; transition: transform .2s; transform-box: fill-box; transform-origin: center; } .organ:hover, .organ.on { transform: scale(1.12); }",
      ".circuit { width: min(460px, 100%); } .circuit svg { width: 100%; height: auto; display: block; }",
      ".wire-gap { cursor: pointer; }",
      ".sci-toggle { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }",
      ".sci-toggle button { border: 0; border-radius: 999px; padding: 10px 18px; font: 800 1.05rem var(--body); background: var(--bg-2); color: var(--ink); cursor: pointer; }",
      ".sci-toggle button.on { background: var(--grape); color: #fff; }",
      ".earth-wrap { width: min(520px, 100%); } .earth-wrap svg { width: 100%; height: auto; display: block; }",
      ".earth-spin { transform-box: fill-box; transform-origin: center; transition: transform 1.2s ease-in-out; }"
    ].join("\n");
    document.head.appendChild(css);
  }

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function a(n) { return /^[aeiou]/i.test(n) ? "an " + n : "a " + n; }
  function bigEmoji(e, n) { return '<div class="sci-card"><span class="e">' + e + '</span>' + (n ? '<span class="n">' + n + "</span>" : "") + "</div>"; }
  function choicesFrom(ans, pool, n) { return shuffle([ans].concat(shuffle(pool.filter(function (x) { return x !== ans; })).slice(0, (n || 4) - 1))); }

  /* ---------- reusable activity: sort things into groups ---------- */
  // items: [{e, n, c, f}]  c = bin id, f = a fact shown after sorting. bins: [{id, label, e, color}]
  function sortExplore(items, bins, howMany, askText) {
    return function (stage, api) {
      var list = shuffle(items).slice(0, howMany || 8), i = 0;
      stage.innerHTML = '<div class="sci-card" id="sc"></div><div class="sci-progress"></div>';
      var binWrap = el('<div class="bins"></div>');
      bins.forEach(function (b) {
        var bt = el('<button type="button" class="bin c-' + (b.color || "grape") + '"><span class="be"></span><span class="bl"></span><span class="got"></span></button>');
        bt.querySelector(".be").textContent = b.e; bt.querySelector(".bl").textContent = b.label;
        bt.addEventListener("click", function () { choose(b, bt); });
        binWrap.appendChild(bt);
      });
      api.choices.appendChild(binWrap);
      var locked = false;
      function show() {
        var it = list[i], card = stage.querySelector("#sc");
        card.className = "sci-card"; card.innerHTML = '<span class="e"></span><span class="n"></span>';
        card.querySelector(".e").textContent = it.e; card.querySelector(".n").textContent = cap(it.n);
        stage.querySelector(".sci-progress").textContent = (i + 1) + " of " + list.length;
        api.prompt(askText(it));
        K.say(askText(it));
        locked = false;
      }
      function choose(b, bt) {
        if (locked) return;
        var it = list[i], card = stage.querySelector("#sc");
        if (b.id === it.c) {
          locked = true; api.right(); card.classList.add("fly");
          bt.querySelector(".got").textContent += it.e;
          api.say("Yes! " + (it.f || cap(it.n) + " goes in " + b.label + "."), "good");
          setTimeout(function () { i++; if (i < list.length) show(); else api.done("You sorted them all! Ready for the quiz?"); }, reduce ? 300 : 1700);
        } else {
          api.wrong({ q: askText(it), given: b.label, answer: bins.filter(function (x) { return x.id === it.c; })[0].label });
          card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
          api.say("Not quite. Have another think!", "bad");
        }
      }
      show();
    };
  }
  function sortQuiz(items, bins, askText) {
    return function () {
      var it = pick(items), right = bins.filter(function (b) { return b.id === it.c; })[0];
      return { prompt: askText(it), visual: bigEmoji(it.e, cap(it.n)), answer: right.label, choices: bins.map(function (b) { return b.label; }),
        explain: it.f || cap(it.n) + " belongs in " + right.label + "." };
    };
  }

  /* ---------- reusable activity: put things in order ---------- */
  // sets: [{name, steps: [{e, n}], dots?}]
  function orderExplore(sets, intro) {
    return function (stage, api) {
      var si = 0, order = shuffle(sets.map(function (_, k) { return k; }));
      function run() {
        var S = sets[order[si]], next = 0;
        api.prompt(intro(S));
        K.say(intro(S));
        stage.innerHTML = "";
        var slots = el('<div class="slots"></div>');
        S.steps.forEach(function (st, k) {
          if (k) slots.appendChild(el('<span class="slot-arrow">➜</span>'));
          slots.appendChild(el('<div class="slot"><span class="e"></span><span class="t"></span></div>'));
        });
        stage.appendChild(slots);
        api.choices.innerHTML = "";
        var cards = el('<div class="cards"></div>');
        shuffle(S.steps.map(function (st, k) { return k; })).forEach(function (k) {
          var st = S.steps[k], c = el('<button type="button" class="card-btn"><span class="e"></span><span class="t"></span></button>');
          c.querySelector(".e").innerHTML = st.html || ""; if (!st.html) c.querySelector(".e").textContent = st.e;
          c.querySelector(".t").textContent = st.n;
          c.addEventListener("click", function () {
            if (k === next) {
              var slot = slots.querySelectorAll(".slot")[next];
              slot.classList.add("full"); slot.querySelector(".e").innerHTML = st.html || ""; if (!st.html) slot.querySelector(".e").textContent = st.e; slot.querySelector(".t").textContent = st.n;
              c.classList.add("used"); api.right(); next++;
              K.say(st.n);
              if (next === S.steps.length) {
                api.say((S.done || "That's the right order!"), "good"); api.celebrate(slots);
                si++;
                setTimeout(function () { if (si < Math.min(sets.length, 3)) run(); else api.done("Brilliant ordering! Ready for the quiz?"); }, reduce ? 400 : 2200);
              }
            } else {
              api.wrong({ q: S.name + ": what comes " + (next ? "after " + S.steps[next - 1].n : "first") + "?", given: st.n, answer: S.steps[next].n });
              c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake");
              api.say(next ? "What comes after " + S.steps[next - 1].n + "?" : "What comes first?", "bad");
            }
          });
          cards.appendChild(c);
        });
        api.choices.appendChild(cards);
      }
      run();
    };
  }
  function orderQuiz(sets) {
    return function () {
      var S = pick(sets), k = rnd(0, S.steps.length - 2), names = S.steps.map(function (s) { return s.n; });
      if (Math.random() < .25) return { prompt: S.name + ": what comes first?", visual: bigEmoji(S.icon || S.steps[0].e), answer: names[0], choices: choicesFrom(names[0], names, Math.min(4, names.length)),
        explain: S.name + ": " + names.join(" → ") + "." };
      var ans = names[k + 1];
      return { prompt: S.name + ": what comes after " + names[k] + "?", visual: bigEmoji(S.steps[k].e, names[k]), answer: ans, choices: choicesFrom(ans, names, Math.min(4, names.length)),
        explain: S.name + ": " + names.join(" → ") + "." };
    };
  }

  /* ================= BIOLOGY ================= */
  var LIVING = [
    { e: "🐶", n: "dog", c: "yes", f: "A dog is living: it eats, breathes, grows and has babies." },
    { e: "🌳", n: "tree", c: "yes", f: "A tree is living! It grows, drinks water and makes seeds." },
    { e: "🐟", n: "fish", c: "yes", f: "A fish is living. It breathes with gills underwater." },
    { e: "🍄", n: "mushroom", c: "yes", f: "A mushroom is living. It's a fungus and it grows!" },
    { e: "🐝", n: "bee", c: "yes", f: "A bee is living. It eats nectar and grows from an egg." },
    { e: "🌻", n: "sunflower", c: "yes", f: "A sunflower is living. It grows towards the sun." },
    { e: "🧒", n: "child", c: "yes", f: "You're living! You eat, breathe, move and grow." },
    { e: "🪨", n: "rock", c: "no", f: "A rock isn't living. It doesn't eat, breathe or grow." },
    { e: "🚗", n: "car", c: "no", f: "A car moves, but it isn't living. It can't grow or have babies." },
    { e: "🧸", n: "teddy bear", c: "no", f: "A teddy isn't living (even Math Teddy!). It doesn't eat or grow." },
    { e: "☁️", n: "cloud", c: "no", f: "A cloud isn't living. It's just tiny drops of water." },
    { e: "🔥", n: "fire", c: "no", f: "Fire grows and moves, but it isn't living. It can't have babies or breathe." },
    { e: "🤖", n: "robot", c: "no", f: "A robot isn't living. It needs batteries, not food." },
    { e: "💧", n: "water", c: "no", f: "Water isn't living, but all living things need it!" }
  ];
  var LBINS = [{ id: "yes", label: "Living", e: "🌱", color: "leaf" }, { id: "no", label: "Not living", e: "🪨", color: "sky" }];
  var lAsk = function (it) { return "Is " + a(it.n) + " living or not living?"; };

  var ANIMALS = [
    { e: "🐶", n: "dog", c: "mammal", f: "Dogs are mammals: fur, and they feed their babies milk." },
    { e: "🐄", n: "cow", c: "mammal", f: "Cows are mammals. Their babies drink milk." },
    { e: "🐋", n: "whale", c: "mammal", f: "Whales live in the sea but they're mammals! They breathe air and feed babies milk." },
    { e: "🦇", n: "bat", c: "mammal", f: "Bats fly, but they're mammals with fur, not birds!" },
    { e: "🐑", n: "sheep", c: "mammal", f: "Sheep are mammals with woolly coats." },
    { e: "🦜", n: "parrot", c: "bird", f: "Parrots are birds: feathers, beaks and eggs." },
    { e: "🐧", n: "penguin", c: "bird", f: "Penguins can't fly, but they're birds with feathers!" },
    { e: "🥝", n: "kiwi", c: "bird", f: "The kiwi is a New Zealand bird that can't fly." },
    { e: "🦉", n: "owl", c: "bird", f: "Owls are birds that hunt at night." },
    { e: "🐟", n: "fish", c: "fish", f: "Fish breathe underwater with gills and have scales." },
    { e: "🦈", n: "shark", c: "fish", f: "Sharks are fish. They breathe with gills." },
    { e: "🐍", n: "snake", c: "reptile", f: "Snakes are reptiles with dry, scaly skin." },
    { e: "🐢", n: "turtle", c: "reptile", f: "Turtles are reptiles. They lay eggs on the beach." },
    { e: "🦎", n: "lizard", c: "reptile", f: "Lizards are reptiles. They warm up in the sun." },
    { e: "🐊", n: "crocodile", c: "reptile", f: "Crocodiles are reptiles with tough scales." },
    { e: "🐝", n: "bee", c: "insect", f: "Bees are insects: 6 legs and 3 body parts." },
    { e: "🐞", n: "ladybird", c: "insect", f: "Ladybirds are insects with 6 legs." },
    { e: "🦋", n: "butterfly", c: "insect", f: "Butterflies are insects. They start as caterpillars!" },
    { e: "🐜", n: "ant", c: "insect", f: "Ants are insects that live in big groups." }
  ];
  var ABINS = [
    { id: "mammal", label: "Mammal", e: "🐻", color: "tang" }, { id: "bird", label: "Bird", e: "🪶", color: "sky" },
    { id: "fish", label: "Fish", e: "🐠", color: "grape" }, { id: "reptile", label: "Reptile", e: "🦎", color: "leaf" }, { id: "insect", label: "Insect", e: "🐛", color: "berry" }
  ];
  var aAsk = function (it) { return "What kind of animal is " + a(it.n) + "?"; };

  var CYCLES = [
    { name: "Frog life cycle", icon: "🐸", steps: [{ e: "⚪", n: "frogspawn (eggs)" }, { e: "〰️", n: "tadpole" }, { e: "🦎", n: "froglet" }, { e: "🐸", n: "frog" }], done: "Eggs, tadpole, froglet, frog!" },
    { name: "Butterfly life cycle", icon: "🦋", steps: [{ e: "🥚", n: "egg" }, { e: "🐛", n: "caterpillar" }, { e: "🫘", n: "chrysalis" }, { e: "🦋", n: "butterfly" }], done: "Egg, caterpillar, chrysalis, butterfly!" },
    { name: "Chicken life cycle", icon: "🐔", steps: [{ e: "🥚", n: "egg" }, { e: "🐣", n: "hatching chick" }, { e: "🐥", n: "chick" }, { e: "🐔", n: "chicken" }], done: "Egg, hatching, chick, chicken!" },
    { name: "Plant life cycle", icon: "🌻", steps: [{ e: "🌰", n: "seed" }, { e: "🌱", n: "seedling" }, { e: "🌿", n: "young plant" }, { e: "🌻", n: "flower" }], done: "Seed, seedling, plant, flower, and the flower makes new seeds!" }
  ];

  var CHAINS = [
    { name: "Food chain", icon: "☀️", steps: [{ e: "☀️", n: "sun" }, { e: "🌿", n: "grass" }, { e: "🐇", n: "rabbit" }, { e: "🦊", n: "fox" }], done: "The sun feeds the grass, the rabbit eats grass, the fox eats the rabbit!" },
    { name: "Sea food chain", icon: "🌊", steps: [{ e: "☀️", n: "sun" }, { e: "🦠", n: "plankton" }, { e: "🐟", n: "small fish" }, { e: "🦈", n: "shark" }], done: "Sun, plankton, little fish, shark!" },
    { name: "Garden food chain", icon: "🌼", steps: [{ e: "☀️", n: "sun" }, { e: "🥬", n: "lettuce" }, { e: "🐌", n: "snail" }, { e: "🐦", n: "thrush" }], done: "Sun, lettuce, snail, bird!" },
    { name: "Bush food chain", icon: "🌳", steps: [{ e: "☀️", n: "sun" }, { e: "🍃", n: "leaves" }, { e: "🐛", n: "caterpillar" }, { e: "🦉", n: "ruru (morepork)" }], done: "Sun, leaves, caterpillar, ruru!" }
  ];

  var ORGANS = [
    { id: "brain", n: "brain", job: "thinks, remembers and controls your whole body", color: "#F2A7C3", d: "M80 40 C80 18 120 18 120 40 C128 46 124 62 114 62 L86 62 C76 62 72 46 80 40 Z" },
    { id: "lungs", n: "lungs", job: "breathe air in and out, so your body gets oxygen", color: "#8CC8FF", d: "M78 120 C66 124 64 168 74 178 C84 186 94 176 94 160 L94 124 C92 118 84 116 78 120 Z M122 120 C134 124 136 168 126 178 C116 186 106 176 106 160 L106 124 C108 118 116 116 122 120 Z" },
    { id: "heart", n: "heart", job: "pumps blood all around your body", color: "#E5484D", d: "M100 172 L86 158 C80 152 84 142 92 144 C96 145 99 148 100 151 C101 148 104 145 108 144 C116 142 120 152 114 158 Z" },
    { id: "stomach", n: "stomach", job: "mashes up your food so your body can use it", color: "#F6C453", d: "M100 192 C120 188 130 200 124 214 C118 228 96 230 90 218 C86 210 92 206 98 206 C104 206 104 198 100 192 Z" },
    { id: "bones", n: "bones", job: "hold you up and protect the soft parts inside", color: "#EDE7DA", d: "M64 270 L74 270 L74 330 L64 330 Z M126 270 L136 270 L136 330 L126 330 Z" },
    { id: "muscles", n: "muscles", job: "pull on your bones so you can move", color: "#D4466F", d: "M40 130 C30 150 32 180 40 196 L50 196 C54 176 54 150 50 132 Z M160 130 C170 150 168 180 160 196 L150 196 C146 176 146 150 150 132 Z" }
  ];
  function bodySvg(highlight) {
    var s = '<svg viewBox="0 0 200 350" width="100%" aria-hidden="true">' +
      '<g fill="#FBE3CF" stroke="#C99A72" stroke-width="3"><circle cx="100" cy="45" r="36"/><rect x="58" y="88" width="84" height="160" rx="36"/>' +
      '<rect x="30" y="96" width="30" height="120" rx="15"/><rect x="140" y="96" width="30" height="120" rx="15"/><rect x="62" y="236" width="32" height="104" rx="16"/><rect x="106" y="236" width="32" height="104" rx="16"/></g>';
    ORGANS.forEach(function (o) { s += '<path class="organ" data-id="' + o.id + '" d="' + o.d + '" fill="' + o.color + '" stroke="#1E2240" stroke-width="2" opacity="' + (highlight && highlight !== o.id ? ".25" : "1") + '"/>'; });
    if (!highlight) s += '<text x="100" y="346" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94A3B8">tap the coloured parts</text>';
    return s + "</svg>";
  }

  /* ================= CHEMISTRY ================= */
  var STATES = [
    { e: "🧊", n: "ice cube", c: "solid", f: "Ice is a solid: it keeps its shape." },
    { e: "🪨", n: "rock", c: "solid", f: "A rock is a solid. Its shape stays the same." },
    { e: "🥄", n: "spoon", c: "solid", f: "A spoon is a solid." },
    { e: "🧱", n: "brick", c: "solid", f: "Bricks are solids. You can stack them!" },
    { e: "🪵", n: "wood", c: "solid", f: "Wood is a solid." },
    { e: "🥛", n: "milk", c: "liquid", f: "Milk is a liquid: it pours and takes the shape of the cup." },
    { e: "💧", n: "water", c: "liquid", f: "Water is a liquid. It flows!" },
    { e: "🧃", n: "juice", c: "liquid", f: "Juice is a liquid." },
    { e: "🍯", n: "honey", c: "liquid", f: "Honey is a slow, sticky liquid. It still pours!" },
    { e: "🛢️", n: "oil", c: "liquid", f: "Oil is a liquid." },
    { e: "♨️", n: "steam", c: "gas", f: "Steam is a gas: water that got so hot it floats away." },
    { e: "🎈", n: "air in a balloon", c: "gas", f: "Air is a gas. It spreads out to fill the balloon." },
    { e: "🫧", n: "bubbles in fizzy drink", c: "gas", f: "The bubbles in fizzy drinks are a gas." },
    { e: "💨", n: "wind", c: "gas", f: "Wind is moving air, and air is a gas." }
  ];
  var SBINS = [{ id: "solid", label: "Solid", e: "🧊", color: "sky" }, { id: "liquid", label: "Liquid", e: "💧", color: "grape" }, { id: "gas", label: "Gas", e: "💨", color: "tang" }];
  var sAsk = function (it) { return "Is " + it.n + " a solid, a liquid or a gas?"; };

  var PAINTS = { red: "#E5484D", yellow: "#F6C443", blue: "#3B82F6", white: "#FFFFFF" };
  var MIXES = {
    "red+yellow": ["orange", "#F28C28"], "blue+yellow": ["green", "#3BAA4A"], "blue+red": ["purple", "#8B4FC7"],
    "red+white": ["pink", "#F6A6C1"], "blue+white": ["light blue", "#9CC9FF"], "white+yellow": ["light yellow", "#FCEB9C"],
    "red+red": ["red", PAINTS.red], "yellow+yellow": ["yellow", PAINTS.yellow], "blue+blue": ["blue", PAINTS.blue], "white+white": ["white", "#FFFFFF"]
  };
  function mixKey(x, y) { return [x, y].sort().join("+"); }

  var SUBSTANCES = [
    { e: "🍬", n: "sugar", d: true, how: "dissolve", col: "#FFFFFF", f: "Sugar dissolves: it seems to disappear, but the water tastes sweet!" },
    { e: "🧂", n: "salt", d: true, how: "dissolve", col: "#FFFFFF", f: "Salt dissolves in water. That's why the sea is salty." },
    { e: "☕", n: "instant coffee", d: true, how: "colour", col: "#7A4A2A", f: "Coffee dissolves and turns the water brown." },
    { e: "🏖️", n: "sand", d: false, how: "sink", col: "#E3C27A", f: "Sand doesn't dissolve. It sinks to the bottom." },
    { e: "🛢️", n: "oil", d: false, how: "float", col: "#E8B923", f: "Oil doesn't dissolve. It floats on top of the water." },
    { e: "🪨", n: "pebbles", d: false, how: "sink", col: "#9097A3", f: "Pebbles don't dissolve. They sink." },
    { e: "🍫", n: "drinking chocolate", d: true, how: "colour", col: "#8B5A3C", f: "Drinking chocolate dissolves (best in warm water!)." }
  ];

  /* ================= PHYSICS ================= */
  var FORCES = [
    { e: "🚪", n: "opening a door towards you", c: "pull", f: "Opening a door towards you is a pull." },
    { e: "🛒", n: "moving a shopping trolley", c: "push", f: "You push a shopping trolley." },
    { e: "🪁", n: "flying a kite on a string", c: "pull", f: "The string pulls the kite." },
    { e: "⚽", n: "kicking a ball", c: "push", f: "Kicking is a push!" },
    { e: "🧲", n: "a magnet grabbing a paperclip", c: "pull", f: "Magnets pull iron things towards them." },
    { e: "🛝", n: "a friend on a swing", c: "push", f: "You push a friend on a swing." },
    { e: "🥕", n: "getting a carrot out of the ground", c: "pull", f: "Pulling up a carrot!" },
    { e: "🛷", n: "dragging a sled", c: "pull", f: "Dragging a sled is a pull." },
    { e: "🔔", n: "ringing a doorbell", c: "push", f: "You push a doorbell button." },
    { e: "🦷", n: "a dentist taking out a tooth", c: "pull", f: "That's a pull. Ouch!" }
  ];
  var FBINS = [{ id: "push", label: "Push", e: "👐", color: "sky" }, { id: "pull", label: "Pull", e: "🪢", color: "berry" }];
  var fAsk = function (it) { return cap(it.n) + ": push or pull?"; };

  var FLOATERS = [
    { e: "🦆", n: "rubber duck", fl: true, f: "The rubber duck floats. It's full of air." },
    { e: "🪵", n: "piece of wood", fl: true, f: "Wood floats. It's lighter than the same amount of water." },
    { e: "🍎", n: "apple", fl: true, f: "Apples float! There's air inside them." },
    { e: "🪨", n: "rock", fl: false, f: "A rock sinks. It's heavy for its size." },
    { e: "🔑", n: "key", fl: false, f: "A metal key sinks." },
    { e: "🪙", n: "coin", fl: false, f: "Coins sink. Metal is heavy for its size." },
    { e: "🍃", n: "leaf", fl: true, f: "Leaves float." },
    { e: "⚽", n: "ball", fl: true, f: "A ball is full of air, so it floats." },
    { e: "🥄", n: "metal spoon", fl: false, f: "A metal spoon sinks." },
    { e: "🧽", n: "sponge", fl: true, f: "A dry sponge floats (until it fills with water!)." },
    { e: "🥚", n: "egg", fl: false, f: "A fresh egg sinks in plain water. (In very salty water it floats!)" }
  ];

  var MAGNETIC = [
    { e: "📎", n: "paperclip", m: true, f: "A steel paperclip is magnetic." },
    { e: "🔩", n: "iron nail", m: true, f: "Iron nails are magnetic." },
    { e: "🔑", n: "steel key", m: true, f: "Steel keys stick to magnets." },
    { e: "🥫", n: "steel can", m: true, f: "Steel food cans are magnetic." },
    { e: "✂️", n: "steel scissors", m: true, f: "The steel blades are magnetic." },
    { e: "🪵", n: "wooden block", m: false, f: "Wood isn't magnetic." },
    { e: "🧸", n: "teddy", m: false, f: "Teddies aren't magnetic." },
    { e: "🥤", n: "plastic cup", m: false, f: "Plastic isn't magnetic." },
    { e: "🪙", n: "gold coin", m: false, f: "Gold isn't magnetic. Only some metals are!" },
    { e: "🍎", n: "apple", m: false, f: "Apples aren't magnetic." },
    { e: "🧻", n: "paper", m: false, f: "Paper isn't magnetic." }
  ];

  var MATERIALS = [
    { e: "🪟", n: "clear glass", t: "transparent", f: "Clear glass lets light through, so there's no shadow." },
    { e: "🪵", n: "wood", t: "opaque", f: "Wood blocks the light, so it makes a dark shadow." },
    { e: "🧻", n: "tissue paper", t: "translucent", f: "Tissue paper lets some light through, so its shadow is faint." },
    { e: "📘", n: "book", t: "opaque", f: "A book blocks the light: a dark shadow." },
    { e: "🧊", n: "clear plastic", t: "transparent", f: "Clear plastic lets light through." },
    { e: "🧸", n: "teddy", t: "opaque", f: "A teddy blocks light: a dark shadow." }
  ];

  function circuitSvg(o) {
    // o: { battery, switchOn, wireOk, bulbOk }
    var lit = o.battery && o.switchOn && o.wireOk && o.bulbOk;
    var wire = function (d, ok) { return '<path d="' + d + '" fill="none" stroke="' + (ok ? "#E26A2C" : "#E26A2C") + '" stroke-width="7" stroke-linecap="round"' + (ok ? "" : ' stroke-dasharray="2 14"') + "/>"; };
    var s = '<svg viewBox="0 0 460 300" aria-hidden="true">' +
      (lit ? '<circle cx="230" cy="66" r="70" fill="#FDE68A" opacity=".55"/>' : "") +
      wire("M90 210 L90 66 L190 66", true) + wire("M270 66 L370 66 L370 140", true) + wire("M370 200 L370 236 L300 236", true) +
      (o.wireOk ? wire("M240 236 L150 236 L90 236 L90 210", true) : wire("M240 236 L196 236", true) + wire("M150 236 L90 236 L90 210", true) + '<g class="wire-gap"><circle cx="173" cy="236" r="16" fill="#FDE68A" stroke="#E9A21F" stroke-width="3"/><text x="173" y="237" text-anchor="middle" dominant-baseline="central" font-size="18">✂️</text></g>') +
      // battery
      (o.battery ? '<g><rect x="60" y="120" width="60" height="90" rx="10" fill="#1E2240"/><rect x="60" y="120" width="60" height="30" rx="8" fill="#E9A21F"/><rect x="80" y="110" width="20" height="12" rx="3" fill="#9CA3AF"/><text x="90" y="182" text-anchor="middle" fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26">+ −</text></g>' : '<rect x="60" y="120" width="60" height="90" rx="10" fill="none" stroke="#9AA0B8" stroke-width="4" stroke-dasharray="8 6"/><text x="90" y="170" text-anchor="middle" font-size="16" fill="#9AA0B8" font-family="sans-serif">no battery</text>') +
      // bulb
      '<g><circle cx="230" cy="66" r="34" fill="' + (lit ? "#FDE047" : "#F1F5F9") + '" stroke="#1E2240" stroke-width="4"/>' + (o.bulbOk ? '<path d="M216 70 Q223 50 230 70 Q237 50 244 70" fill="none" stroke="' + (lit ? "#B45309" : "#64748B") + '" stroke-width="3"/>' : '<path d="M216 70 L226 58 M234 58 L244 70" stroke="#64748B" stroke-width="3"/>') + '<rect x="214" y="96" width="32" height="18" rx="4" fill="#9CA3AF"/><path d="M190 66 L214 100 M270 66 L246 100" stroke="#E26A2C" stroke-width="6"/></g>' +
      // switch
      '<g class="switch"><rect x="330" y="112" width="100" height="112" rx="16" fill="#FFFFFF" fill-opacity="0.01"/><text x="420" y="232" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#94A3B8">switch</text><circle cx="370" cy="140" r="7" fill="#1E2240"/><circle cx="370" cy="200" r="7" fill="#1E2240"/>' + (o.switchOn ? '<path d="M370 140 L370 200" stroke="#1E2240" stroke-width="8" stroke-linecap="round"/>' : '<path d="M370 200 L408 150" stroke="#1E2240" stroke-width="8" stroke-linecap="round"/>') + "</g>" +
      '<rect x="240" y="222" width="60" height="28" rx="8" fill="#94A3B8"/><text x="270" y="237" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fff" font-family="sans-serif">wire</text>' +
      "</svg>";
    return s;
  }

  /* ================= EARTH & SPACE ================= */
  var PLANETS = [
    { n: "Mercury", c: "#A8A29E", s: 22 }, { n: "Venus", c: "#E9C46A", s: 30 }, { n: "Earth", c: "#3B82F6", s: 32 }, { n: "Mars", c: "#DC6B3A", s: 26 },
    { n: "Jupiter", c: "#D9A066", s: 58 }, { n: "Saturn", c: "#E8D08A", s: 50 }, { n: "Uranus", c: "#7DD3FC", s: 40 }, { n: "Neptune", c: "#3B5BDB", s: 40 }
  ];
  function planetHtml(p, scale) { var z = Math.round(p.s * (scale || 1)); return '<span class="dot-planet" style="width:' + z + "px;height:" + z + "px;background:" + p.c + '"></span>'; }
  var SPACE_FACTS = [
    { q: "What gives Earth light and warmth?", a: "the Sun", c: ["the Sun", "the Moon", "the clouds", "Mars"], f: "The Sun is a star. It gives us light and heat." },
    { q: "Why do we have day and night?", a: "Earth spins around", c: ["Earth spins around", "the Sun switches off", "clouds cover the Sun", "the Moon blocks the Sun"], f: "Earth spins. When our side faces the Sun it's day; when it faces away it's night." },
    { q: "How long does Earth take to spin around once?", a: "1 day", c: ["1 day", "1 week", "1 month", "1 year"], f: "One full spin takes a day: 24 hours." },
    { q: "How long does Earth take to go all the way around the Sun?", a: "1 year", c: ["1 day", "1 week", "1 month", "1 year"], f: "One trip around the Sun takes a year: about 365 days." },
    { q: "Which planet do we live on?", a: "Earth", c: ["Earth", "Mars", "Venus", "Jupiter"], f: "We live on Earth, the third planet from the Sun." },
    { q: "Which planet is closest to the Sun?", a: "Mercury", c: ["Mercury", "Venus", "Earth", "Neptune"], f: "Mercury is closest to the Sun." },
    { q: "Which is the biggest planet?", a: "Jupiter", c: ["Jupiter", "Earth", "Saturn", "Mars"], f: "Jupiter is the biggest planet. Over 1,000 Earths would fit inside!" },
    { q: "Which planet has big bright rings?", a: "Saturn", c: ["Saturn", "Mars", "Mercury", "Earth"], f: "Saturn's rings are made of ice and rock." },
    { q: "Which planet is called the Red Planet?", a: "Mars", c: ["Mars", "Venus", "Neptune", "Jupiter"], f: "Mars looks red because of rusty dust." },
    { q: "What is the Moon?", a: "a ball of rock that goes around Earth", c: ["a ball of rock that goes around Earth", "a small star", "a planet near the Sun", "a cloud"], f: "The Moon is rock. It shines because sunlight bounces off it." }
  ];

  /* ================= THE LESSONS ================= */
  return {
    /* ---- Biology ---- */
    living: {
      title: "Living or Not Living?", emoji: "🌱", color: "leaf", intro: "Living things eat, breathe, grow and have babies. Let's sort!",
      explorePrompt: "Living or not living?", explore: sortExplore(LIVING, LBINS, 8, lAsk), gen: sortQuiz(LIVING, LBINS, lAsk)
    },
    animalgroups: {
      title: "Animal Groups", emoji: "🦁", color: "tang", intro: "Mammals, birds, fish, reptiles and insects. Which group does each animal belong to?",
      explorePrompt: "Which group?", explore: sortExplore(ANIMALS, ABINS, 10, aAsk),
      gen: function (quiz) {
        if (quiz && Math.random() < .3) {
          var facts = [
            { q: "How many legs does an insect have?", a: "6", c: ["4", "6", "8", "2"], f: "All insects have 6 legs." },
            { q: "Which animals feed their babies milk?", a: "mammals", c: ["mammals", "birds", "fish", "insects"], f: "Mammals feed their babies milk." },
            { q: "What covers a bird's body?", a: "feathers", c: ["feathers", "fur", "scales", "shells"], f: "Only birds have feathers." },
            { q: "How do fish breathe?", a: "with gills", c: ["with gills", "with lungs", "through their tail", "they don't"], f: "Fish breathe with gills." }
          ], x = pick(facts);
          return { prompt: x.q, visual: bigEmoji("🤔"), answer: x.a, choices: shuffle(x.c), explain: x.f };
        }
        return sortQuiz(ANIMALS, ABINS, aAsk)();
      }
    },
    lifecycles: {
      title: "Life Cycles", emoji: "🐸", color: "grape", intro: "Living things change as they grow. Put the stages in order!",
      explorePrompt: "Put them in order", explore: orderExplore(CYCLES, function (S) { return "Put the " + S.name.toLowerCase() + " in order"; }), gen: orderQuiz(CYCLES)
    },
    body: {
      title: "My Body", emoji: "🫀", color: "berry", intro: "Tap the parts inside the body to find out what they do.",
      explorePrompt: "Tap each body part",
      explore: function (stage, api) {
        var seen = {};
        stage.innerHTML = '<div class="body-wrap">' + bodySvg() + "</div>";
        api.prompt("Tap each body part to find out what it does");
        stage.querySelectorAll(".organ").forEach(function (p) {
          p.addEventListener("click", function () {
            var o = ORGANS.filter(function (x) { return x.id === p.getAttribute("data-id"); })[0];
            stage.querySelectorAll(".organ").forEach(function (q) { q.classList.toggle("on", q === p); });
            api.say("Your " + o.n + (o.n === "lungs" || o.n === "bones" || o.n === "muscles" ? " " : " ") + o.job + ".", "good");
            if (!seen[o.id]) { seen[o.id] = 1; api.right(); }
            if (Object.keys(seen).length === ORGANS.length) setTimeout(function () { api.done("You found them all! Ready for the quiz?"); }, 1800);
          });
        });
      },
      gen: function (quiz) {
        var o = pick(ORGANS), names = ORGANS.map(function (x) { return x.n; });
        if (Math.random() < .5) return { prompt: "Which part of your body " + o.job + "?", visual: '<div class="body-wrap" style="width:160px">' + bodySvg() + "</div>", answer: o.n, choices: choicesFrom(o.n, names), explain: "Your " + o.n + " " + o.job + "." };
        return { prompt: "What is the glowing part called?", visual: '<div class="body-wrap" style="width:180px">' + bodySvg(o.id) + "</div>", answer: o.n, choices: choicesFrom(o.n, names), explain: "That's your " + o.n + ". It " + o.job + "." };
      }
    },
    foodchains: {
      title: "Food Chains", emoji: "🦊", color: "sky", intro: "Every food chain starts with the Sun. Who eats who?",
      explorePrompt: "Build the food chain", explore: orderExplore(CHAINS, function (S) { return "Build the " + S.name.toLowerCase() + ": start with what gives energy"; }),
      gen: function (quiz) {
        var S = pick(CHAINS), k = rnd(1, S.steps.length - 2), names = [].concat.apply([], CHAINS.map(function (c) { return c.steps.map(function (s) { return s.n; }); })).filter(function (v, i, a) { return a.indexOf(v) === i && v !== "sun"; });
        if (quiz && Math.random() < .35) return { prompt: "Where does all the energy in a food chain start?", visual: bigEmoji("🍽️"), answer: "the Sun", choices: ["the Sun", "the soil", "the water", "the biggest animal"], explain: "Plants use sunlight to grow, and animals eat the plants. It all starts with the Sun!" };
        var eater = S.steps[k + 1].n, food = S.steps[k].n;
        return { prompt: "In this food chain, what does the " + eater + " eat?", visual: '<div class="slots">' + S.steps.map(function (s, i) { return '<div class="slot' + (i === k ? "" : " full") + '"><span class="e">' + (i === k ? "?" : s.e) + '</span><span>' + (i === k ? "" : s.n) + "</span></div>"; }).join('<span class="slot-arrow">➜</span>') + "</div>",
          answer: food, choices: choicesFrom(food, names), explain: "The " + eater + " eats " + food + ". " + S.done };
      }
    },

    /* ---- Chemistry ---- */
    states: {
      title: "Solid, Liquid or Gas?", emoji: "🧊", color: "sky", intro: "Solids keep their shape. Liquids pour. Gases spread out to fill any space.",
      explorePrompt: "Solid, liquid or gas?", explore: sortExplore(STATES, SBINS, 9, sAsk), gen: sortQuiz(STATES, SBINS, sAsk)
    },
    melting: {
      title: "Melting and Freezing", emoji: "🌡️", color: "berry", intro: "Heat water up and cool it down. Watch the tiny particles change!",
      explorePrompt: "Slide the temperature",
      explore: function (stage, api) {
        stage.innerHTML = '<div class="sci-readout" id="tmp"></div><canvas class="sci-canvas" width="420" height="260"></canvas><input class="sci-slider" id="sl" type="range" min="-20" max="120" value="-10" aria-label="Temperature">';
        var cv = stage.querySelector("canvas"), ctx = cv.getContext("2d"), sl = stage.querySelector("#sl"), seen = {}, P = [];
        for (var i = 0; i < 36; i++) P.push({ hx: 150 + (i % 6) * 22, hy: 130 + Math.floor(i / 6) * 22 - 40, x: 0, y: 0, vx: 0, vy: 0 });
        P.forEach(function (p) { p.x = p.hx; p.y = p.hy; });
        function state(t) { return t <= 0 ? "solid" : t < 100 ? "liquid" : "gas"; }
        function label() {
          var t = +sl.value, s = state(t);
          stage.querySelector("#tmp").textContent = t + "°C  ·  " + (s === "solid" ? "🧊 Ice (solid)" : s === "liquid" ? "💧 Water (liquid)" : "♨️ Steam (gas)");
          if (!seen[s]) { seen[s] = 1; api.right(); api.say(s === "solid" ? "Frozen! The particles are stuck together, just wiggling. That's a solid." : s === "liquid" ? "It melted! The particles slide past each other. That's a liquid." : "It boiled! The particles zoom about and spread out. That's a gas.", "good"); }
          if (seen.solid && seen.liquid && seen.gas) setTimeout(function () { api.done("You've seen all three states! Ready for the quiz?"); }, 1500);
        }
        sl.addEventListener("input", label); label();
        api.prompt("Slide the temperature to melt the ice, then boil the water");
        var alive = true;
        (function loop() {
          if (!document.body.contains(cv)) return;
          var t = +sl.value, s = state(t);
          ctx.clearRect(0, 0, 420, 260);
          ctx.fillStyle = s === "solid" ? "rgba(140,200,255,.35)" : s === "liquid" ? "rgba(74,155,224,.25)" : "rgba(0,0,0,0)";
          if (s !== "gas") ctx.fillRect(s === "solid" ? 130 : 20, s === "solid" ? 70 : 140, s === "solid" ? 150 : 380, s === "solid" ? 150 : 110);
          P.forEach(function (p) {
            if (s === "solid") { p.x += (p.hx - p.x) * .2 + (Math.random() - .5) * 2.2; p.y += (p.hy - p.y) * .2 + (Math.random() - .5) * 2.2; p.vx = 0; p.vy = 0; }
            else {
              var sp = s === "liquid" ? 1.2 : 4.5;
              p.vx += (Math.random() - .5) * sp * .6; p.vy += (Math.random() - .5) * sp * .6 + (s === "liquid" ? .25 : 0);
              var m = Math.hypot(p.vx, p.vy); if (m > sp) { p.vx *= sp / m; p.vy *= sp / m; }
              p.x += p.vx; p.y += p.vy;
              var top = s === "liquid" ? 150 : 10;
              if (p.x < 26) { p.x = 26; p.vx *= -1; } if (p.x > 394) { p.x = 394; p.vx *= -1; }
              if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); } if (p.y > 242) { p.y = 242; p.vy = -Math.abs(p.vy); }
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fillStyle = s === "gas" ? "#94A3B8" : "#2F7FC6"; ctx.fill();
          });
          if (alive) requestAnimationFrame(loop);
        })();
      },
      gen: function (quiz) {
        var qs = [
          { q: "What is it called when ice turns into water?", a: "melting", c: ["melting", "freezing", "boiling", "condensing"], e: "🧊➜💧", f: "Ice melts into water when it warms up." },
          { q: "What is it called when water turns into ice?", a: "freezing", c: ["melting", "freezing", "boiling", "evaporating"], e: "💧➜🧊", f: "Water freezes into ice when it gets very cold (0°C)." },
          { q: "At what temperature does water boil?", a: "100°C", c: ["0°C", "37°C", "50°C", "100°C"], e: "♨️", f: "Water boils at 100°C and turns into steam." },
          { q: "At what temperature does water freeze?", a: "0°C", c: ["0°C", "10°C", "50°C", "100°C"], e: "❄️", f: "Water freezes at 0°C." },
          { q: "What happens to a puddle on a sunny day?", a: "it evaporates", c: ["it evaporates", "it freezes", "it gets bigger", "it turns to rock"], e: "☀️💧", f: "The Sun warms the water and it evaporates into the air." },
          { q: "Why do drops of water appear on a cold glass?", a: "water in the air condenses", c: ["water in the air condenses", "the glass is leaking", "the glass is melting", "ice is boiling"], e: "🥛💧", f: "Water vapour in the air cools down on the cold glass and condenses into drops." }
        ];
        if (!quiz) qs = qs.slice(0, 4);
        var t = rnd(-20, 120), x;
        if (Math.random() < .4) { var st = t <= 0 ? "solid (ice)" : t < 100 ? "liquid (water)" : "gas (steam)"; return { prompt: "Water at " + t + "°C is a…", visual: '<div class="bignum" style="font-size:4rem">🌡️ ' + t + "°C</div>", answer: st, choices: ["solid (ice)", "liquid (water)", "gas (steam)"], explain: "Below 0°C water is ice, from 0 to 100°C it's liquid, and at 100°C it boils into steam." }; }
        x = pick(qs);
        return { prompt: x.q, visual: '<div style="font-size:5rem">' + x.e + "</div>", answer: x.a, choices: shuffle(x.c), explain: x.f };
      }
    },
    colours: {
      title: "Mixing Colours", emoji: "🎨", color: "tang", intro: "Red, yellow and blue are the primary colours. Mix two and see what you get!",
      explorePrompt: "Pick two paints to mix",
      explore: function (stage, api) {
        var sel = [], made = {};
        stage.innerHTML = '<div class="paints"></div><div class="bowl-mix">?</div>';
        var pw = stage.querySelector(".paints"), bowl = stage.querySelector(".bowl-mix");
        Object.keys(PAINTS).forEach(function (k) {
          var b = el('<button type="button" class="paint" aria-label="' + k + '"></button>'); b.style.background = PAINTS[k];
          b.addEventListener("click", function () {
            sel.push(k); b.classList.add("sel");
            if (sel.length === 2) {
              var m = MIXES[mixKey(sel[0], sel[1])];
              bowl.style.background = m[1]; bowl.textContent = m[0];
              api.say(cap(sel[0]) + " and " + sel[1] + " make " + m[0] + "!", "good");
              if (!made[m[0]] && sel[0] !== sel[1]) { made[m[0]] = 1; api.right(); }
              sel = []; setTimeout(function () { pw.querySelectorAll(".paint").forEach(function (p) { p.classList.remove("sel"); }); }, 600);
              if (made.orange && made.green && made.purple) setTimeout(function () { api.done("You made all three secondary colours! Ready for the quiz?"); }, 1600);
            }
          });
          pw.appendChild(b);
        });
        api.prompt("Mix two paints. Can you make orange, green and purple?");
      },
      gen: function (quiz) {
        var pairs = quiz ? ["red+yellow", "blue+yellow", "blue+red", "red+white", "blue+white"] : ["red+yellow", "blue+yellow", "blue+red"];
        var k = pick(pairs), m = MIXES[k], parts = k.split("+");
        if (quiz && Math.random() < .25) return { prompt: "Which are the three primary colours?", visual: '<div style="font-size:4rem">🎨</div>', answer: "red, yellow, blue", choices: shuffle(["red, yellow, blue", "orange, green, purple", "red, green, blue", "pink, yellow, black"]), explain: "Red, yellow and blue are primary colours. Mix them to make the others!" };
        var dot = function (c) { return '<span class="paint" style="display:inline-block;background:' + PAINTS[c] + '"></span>'; };
        return { prompt: cap(parts[0]) + " + " + parts[1] + " = ?", visual: '<div class="paints" style="align-items:center">' + dot(parts[0]) + '<span class="op">+</span>' + dot(parts[1]) + '<span class="op">=</span><span class="paint" style="display:inline-block;background:#E9EEF6;display:grid;place-items:center;font:800 2rem var(--display)">?</span></div>',
          answer: m[0], choices: choicesFrom(m[0], ["orange", "green", "purple", "brown", "pink", "light blue"]), explain: cap(parts[0]) + " and " + parts[1] + " make " + m[0] + "." };
      }
    },
    dissolving: {
      title: "Dissolve or Not?", emoji: "🥄", color: "grape", intro: "Some things disappear into water. That's dissolving! Others don't. Let's test.",
      explorePrompt: "Pick something to stir into water",
      explore: function (stage, api) {
        var tested = {};
        stage.innerHTML = '<div class="beaker"></div><div class="objrow"></div>';
        var bk = stage.querySelector(".beaker"), row = stage.querySelector(".objrow");
        SUBSTANCES.forEach(function (S) {
          var b = el('<button type="button" class="objbtn"><span class="e"></span><span class="t"></span></button>');
          b.querySelector(".e").textContent = S.e; b.querySelector(".t").textContent = S.n;
          b.addEventListener("click", function () {
            bk.innerHTML = ""; bk.style.background = "linear-gradient(transparent 18%, rgba(140,200,255,.55) 18%)";
            var ps = [];
            for (var i = 0; i < 26; i++) { var p = document.createElement("span"); p.className = "p"; p.style.background = S.col; p.style.left = (20 + Math.random() * 120) + "px"; p.style.top = "4px"; if (S.col === "#FFFFFF") p.style.boxShadow = "0 0 0 1px #94A3B8"; bk.appendChild(p); ps.push(p); }
            api.say("Stirring in the " + S.n + "…");
            setTimeout(function () {
              ps.forEach(function (p) {
                if (S.how === "float") p.style.top = (34 + Math.random() * 10) + "px";
                else if (S.how === "sink") p.style.top = (185 + Math.random() * 12) + "px";
                else { p.style.top = (60 + Math.random() * 120) + "px"; p.style.opacity = "0"; }
              });
              if (S.how === "colour") bk.style.background = "linear-gradient(transparent 18%, " + S.col + "AA 18%)";
            }, 80);
            setTimeout(function () {
              api.say(S.f, "good");
              if (!tested[S.n]) { tested[S.n] = 1; api.right(); b.classList.add("done"); }
              if (Object.keys(tested).length >= 5) setTimeout(function () { api.done("Great testing! Ready for the quiz?"); }, 1500);
            }, 1700);
          });
          row.appendChild(b);
        });
        api.prompt("Pick something to stir into the water. Test at least 5!");
      },
      gen: function (quiz) {
        var S = pick(SUBSTANCES);
        if (quiz && Math.random() < .3) return { prompt: "What does dissolve mean?", visual: '<div style="font-size:4rem">🥄💧</div>', answer: "it mixes in and seems to disappear", choices: shuffle(["it mixes in and seems to disappear", "it sinks to the bottom", "it floats on top", "it turns to ice"]), explain: "When something dissolves, it breaks into tiny bits too small to see, spread through the water." };
        return { prompt: "Does " + S.n + " dissolve in water?", visual: bigEmoji(S.e, cap(S.n)), answer: S.d ? "Yes, it dissolves" : "No, it doesn't", choices: ["Yes, it dissolves", "No, it doesn't"], explain: S.f };
      }
    },

    /* ---- Physics ---- */
    pushpull: {
      title: "Push or Pull?", emoji: "👐", color: "sky", intro: "Forces are pushes and pulls. They make things move, stop or change shape.",
      explorePrompt: "Push or pull?", explore: sortExplore(FORCES, FBINS, 8, fAsk), gen: sortQuiz(FORCES, FBINS, fAsk)
    },
    floatsink: {
      title: "Float or Sink?", emoji: "🛁", color: "grape", intro: "Guess first, then drop it in the water and see!",
      explorePrompt: "Will it float or sink?",
      explore: function (stage, api) {
        var list = shuffle(FLOATERS).slice(0, 7), i = 0, locked = false;
        stage.innerHTML = '<div class="tank"></div>';
        var tank = stage.querySelector(".tank");
        var wrap = el('<div class="bins"><button type="button" class="bin c-sky"><span class="be">🛟</span><span>It will float</span></button><button type="button" class="bin c-berry"><span class="be">⚓</span><span>It will sink</span></button></div>');
        api.choices.appendChild(wrap);
        var bts = wrap.querySelectorAll(".bin");
        function show() {
          var it = list[i];
          var o = document.createElement("span"); o.className = "obj"; o.textContent = it.e; o.style.left = (14 + (i % 7) * 12) + "%"; o.style.top = "-60px";
          o.id = "cur"; tank.appendChild(o);
          setTimeout(function () { o.style.top = "-4px"; }, 30);
          api.prompt("Will the " + it.n + " float or sink?"); K.say("Will the " + it.n + " float or sink?");
          locked = false;
        }
        function guess(fl) {
          if (locked) return; locked = true;
          var it = list[i], o = tank.querySelector("#cur"), ok = fl === it.fl;
          o.removeAttribute("id");
          o.style.top = it.fl ? "30px" : "178px";
          if (it.fl) setTimeout(function () { o.classList.add("bob"); }, 1100);
          setTimeout(function () {
            if (ok) { api.right(); api.say("Good guess! " + it.f, "good"); } else { api.wrong({ q: "Float or sink: " + it.n, given: fl ? "float" : "sink", answer: it.fl ? "float" : "sink" }); api.say("Surprise! " + it.f, "bad"); }
            i++;
            setTimeout(function () { if (i < list.length) show(); else api.done("Great experimenting! Ready for the quiz?"); }, reduce ? 300 : 1900);
          }, 1150);
        }
        bts[0].addEventListener("click", function () { guess(true); });
        bts[1].addEventListener("click", function () { guess(false); });
        show();
      },
      gen: function (quiz) {
        var it = pick(FLOATERS);
        if (quiz && Math.random() < .25) return { prompt: "Why does a big ship float even though it's heavy?", visual: '<div style="font-size:5rem">🚢</div>', answer: "it's full of air", choices: shuffle(["it's full of air", "the sea is magic", "it's made of wood only", "it has wheels"]), explain: "A ship's hull is full of air, so overall it's lighter than the water it pushes away. That's why it floats." };
        return { prompt: "Will " + a(it.n) + " float or sink?", visual: bigEmoji(it.e, cap(it.n)), answer: it.fl ? "Float" : "Sink", choices: ["Float", "Sink"], explain: it.f };
      }
    },
    magnets: {
      title: "Magnets", emoji: "🧲", color: "berry", intro: "Magnets pull some metals, like iron and steel. Tap things to see if the magnet grabs them!",
      explorePrompt: "Tap each thing. Does the magnet grab it?",
      explore: function (stage, api) {
        var list = shuffle(MAGNETIC).slice(0, 8), tested = 0;
        stage.innerHTML = '<div class="magnet-zone"><span class="magnet">🧲</span></div>';
        var zone = stage.querySelector(".magnet-zone");
        list.forEach(function (it, k) {
          var ang = (k / list.length) * Math.PI * 2, x = 50 + Math.cos(ang) * 40, y = 50 + Math.sin(ang) * 38;
          var b = el('<button type="button" class="mitem" aria-label="' + it.n + '"></button>'); b.textContent = it.e; b.style.left = x + "%"; b.style.top = y + "%";
          b.addEventListener("click", function () {
            if (b.dataset.done) return; b.dataset.done = "1"; tested++;
            if (it.m) { b.style.left = (50 + Math.cos(ang) * 11) + "%"; b.style.top = (50 + Math.sin(ang) * 14) + "%"; api.say("Clunk! " + it.f, "good"); }
            else { b.classList.add("nope"); b.style.opacity = ".5"; api.say("Nothing happens. " + it.f); }
            api.right();
            if (tested === list.length) setTimeout(function () { api.done("You tested everything! Ready for the quiz?"); }, 1500);
          });
          zone.appendChild(b);
        });
        api.prompt("Tap each thing. Does the magnet grab it?");
      },
      gen: function (quiz) {
        var it = pick(MAGNETIC);
        if (quiz && Math.random() < .3) {
          var x = pick([
            { q: "What happens when you put two north poles together?", a: "they push apart", c: ["they push apart", "they stick together", "nothing", "they get hot"], f: "Same poles push apart (repel). Opposite poles pull together (attract)." },
            { q: "What happens when you put a north pole next to a south pole?", a: "they pull together", c: ["they push apart", "they pull together", "nothing", "they melt"], f: "Opposites attract! North and south pull together." },
            { q: "Which of these is magnetic?", a: "iron", c: ["iron", "wood", "plastic", "glass"], f: "Iron (and steel, which has iron in it) is magnetic." }
          ]);
          return { prompt: x.q, visual: '<div style="font-size:5rem">🧲</div>', answer: x.a, choices: shuffle(x.c), explain: x.f };
        }
        return { prompt: "Will a magnet pick up " + a(it.n) + "?", visual: bigEmoji(it.e, cap(it.n)), answer: it.m ? "Yes" : "No", choices: ["Yes", "No"], explain: it.f };
      }
    },
    shadows: {
      title: "Light and Shadows", emoji: "🔦", color: "sun", intro: "Shadows happen when something blocks the light. Move the torch and try different things!",
      explorePrompt: "Move the torch and swap the object",
      explore: function (stage, api) {
        var cur = MATERIALS[1], seen = {};
        stage.innerHTML = '<svg viewBox="0 0 460 220" style="width:min(460px,100%);height:auto" aria-hidden="true"><rect x="0" y="0" width="460" height="220" rx="18" fill="#1E2240"/><rect x="400" y="10" width="44" height="200" rx="6" fill="#F8FAFC"/><g id="beam"></g><g id="shadow"></g><g id="torch"></g><text id="obj" x="230" y="128" text-anchor="middle" dominant-baseline="central" font-size="56"></text></svg>' +
          '<input class="sci-slider" id="tl" type="range" min="10" max="180" value="80" aria-label="Torch distance"><div class="sci-toggle"></div>';
        var tg = stage.querySelector(".sci-toggle"), sl = stage.querySelector("#tl");
        MATERIALS.forEach(function (m) {
          var b = el('<button type="button"></button>'); b.textContent = m.e + " " + m.n; if (m === cur) b.className = "on";
          b.addEventListener("click", function () { cur = m; tg.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); explain(); });
          tg.appendChild(b);
        });
        function draw() {
          var tx = +sl.value, objX = 230, wall = 400, size = 46 * (wall - tx) / (objX - tx);
          stage.querySelector("#torch").innerHTML = '<rect x="' + (tx - 30) + '" y="104" width="34" height="26" rx="6" fill="#E9A21F"/><rect x="' + (tx + 2) + '" y="98" width="12" height="38" rx="4" fill="#FDE68A"/>';
          stage.querySelector("#beam").innerHTML = '<path d="M' + (tx + 12) + ' 117 L400 ' + (117 - 110) + ' L400 ' + (117 + 110) + ' Z" fill="#FDE68A" opacity=".25"/>';
          var op = cur.t === "opaque" ? .9 : cur.t === "translucent" ? .35 : 0;
          stage.querySelector("#shadow").innerHTML = '<ellipse cx="420" cy="117" rx="' + Math.max(8, size * .25) + '" ry="' + Math.min(100, size / 2) + '" fill="#0F172A" opacity="' + op + '"/>';
          stage.querySelector("#obj").textContent = cur.e;
        }
        function explain() { api.say(cur.f, "good"); if (!seen[cur.t]) { seen[cur.t] = 1; api.right(); } check(); }
        var moved = { near: false, far: false };
        sl.addEventListener("input", function () {
          draw();
          if (+sl.value > 150 && !moved.near) { moved.near = true; api.say("Torch close to the object: the shadow gets BIG!", "good"); api.right(); }
          if (+sl.value < 30 && !moved.far) { moved.far = true; api.say("Torch far away: the shadow gets smaller.", "good"); api.right(); }
          check();
        });
        function check() { if (seen.opaque && seen.transparent && seen.translucent && moved.near && moved.far) setTimeout(function () { api.done("You're a shadow expert! Ready for the quiz?"); }, 1500); }
        draw();
        api.prompt("Move the torch closer and further. Then try glass and tissue paper!");
      },
      gen: function (quiz) {
        var qs = [
          { q: "What do you need to make a shadow?", a: "light and something to block it", c: ["light and something to block it", "only darkness", "water", "a mirror"], e: "🔦", f: "A shadow forms where an object blocks the light." },
          { q: "What happens to a shadow when the torch moves closer to the object?", a: "it gets bigger", c: ["it gets bigger", "it gets smaller", "it disappears", "it changes colour"], e: "🔦➜🧸", f: "The closer the light, the bigger the shadow." },
          { q: "Which makes the darkest shadow?", a: "a wooden block", c: ["a wooden block", "clear glass", "tissue paper", "clear plastic"], e: "🌑", f: "Opaque things like wood block all the light." },
          { q: "Clear glass lets light through. It is…", a: "transparent", c: ["transparent", "opaque", "translucent", "magnetic"], e: "🪟", f: "Transparent means light goes straight through." },
          { q: "Where is your shadow if the Sun is in front of you?", a: "behind you", c: ["behind you", "in front of you", "on your head", "nowhere"], e: "☀️🧍", f: "Shadows fall on the side away from the light." }
        ];
        var x = pick(quiz ? qs : qs.slice(0, 4));
        return { prompt: x.q, visual: '<div style="font-size:5rem">' + x.e + "</div>", answer: x.a, choices: shuffle(x.c), explain: x.f };
      }
    },
    circuits: {
      title: "Electric Circuits", emoji: "💡", color: "leaf", intro: "Electricity needs a complete loop to flow. Fix the circuit to light the bulb!",
      explorePrompt: "Make the bulb light up",
      explore: function (stage, api) {
        var o = { battery: true, switchOn: false, wireOk: false, bulbOk: true }, lit = false, offAgain = false;
        function draw() {
          stage.innerHTML = '<div class="circuit">' + circuitSvg(o) + "</div>";
          var sw = stage.querySelector(".switch"), gap = stage.querySelector(".wire-gap");
          sw.style.cursor = "pointer";
          sw.addEventListener("click", function () { o.switchOn = !o.switchOn; after(o.switchOn ? "Switch on." : "Switch off."); });
          if (gap) gap.addEventListener("click", function () { o.wireOk = true; after("You joined the wire!"); });
        }
        function after(msg) {
          draw();
          var on = o.battery && o.switchOn && o.wireOk && o.bulbOk;
          if (on && !lit) { lit = true; api.right(); api.say(msg + " The loop is complete. Electricity flows and the bulb lights up! 💡", "good"); api.celebrate(stage); }
          else if (!on && lit && !offAgain) { offAgain = true; api.right(); api.say(msg + " The loop is broken, so the electricity stops. Lights out!", "good"); setTimeout(function () { api.done("You're an electrician! Ready for the quiz?"); }, 1500); }
          else api.say(msg + (on ? " Still glowing!" : o.wireOk ? " Is the switch on?" : " There's still a gap in the wire. Tap the ✂️ to join it."));
        }
        draw();
        api.prompt("Join the broken wire and flick the switch to light the bulb. Then switch it off!");
      },
      gen: function (quiz) {
        var cases = [
          { o: { battery: true, switchOn: true, wireOk: true, bulbOk: true }, lit: true, why: "The loop is complete, so the bulb lights." },
          { o: { battery: true, switchOn: false, wireOk: true, bulbOk: true }, lit: false, why: "The switch is off, so there's a gap in the loop." },
          { o: { battery: true, switchOn: true, wireOk: false, bulbOk: true }, lit: false, why: "There's a break in the wire, so electricity can't flow." },
          { o: { battery: false, switchOn: true, wireOk: true, bulbOk: true }, lit: false, why: "There's no battery to push the electricity." },
          { o: { battery: true, switchOn: true, wireOk: true, bulbOk: false }, lit: false, why: "The bulb is broken (its wire inside snapped)." }
        ];
        if (quiz && Math.random() < .3) {
          var x = pick([
            { q: "Which of these lets electricity flow through it?", a: "metal", c: ["metal", "plastic", "wood", "rubber"], f: "Metals are conductors: electricity flows through them." },
            { q: "Why are wires covered in plastic?", a: "plastic stops electricity escaping", c: ["plastic stops electricity escaping", "to make them colourful", "to make them heavy", "plastic makes electricity"], f: "Plastic is an insulator. It keeps the electricity inside the wire and keeps us safe." },
            { q: "What does a switch do?", a: "opens or closes the loop", c: ["opens or closes the loop", "makes electricity", "stores electricity", "changes the colour"], f: "A switch opens or closes a gap in the circuit." }
          ]);
          return { prompt: x.q, visual: '<div style="font-size:5rem">🔌</div>', answer: x.a, choices: shuffle(x.c), explain: x.f };
        }
        var c = pick(cases);
        return { prompt: "Will the bulb light up?", visual: '<div class="circuit">' + circuitSvg(c.o).replace("M370 200 L408 150", c.o.switchOn ? "M370 140 L370 200" : "M370 200 L408 150").replace(/<circle cx="230" cy="66" r="70"[^>]*\/>/, "").replace('fill="#FDE047"', 'fill="#F1F5F9"').replace('stroke="#B45309"', 'stroke="#64748B"') + "</div>",
          answer: c.lit ? "Yes" : "No", choices: ["Yes", "No"], explain: c.why };
      }
    },

    /* ---- Earth & Space ---- */
    daynight: {
      title: "Day and Night", emoji: "🌗", color: "grape", intro: "Earth spins around once every day. Spin it and watch New Zealand go from day to night!",
      explorePrompt: "Spin the Earth",
      explore: function (stage, api) {
        var angle = 0, spins = 0, seen = {};
        stage.innerHTML = '<div class="earth-wrap"><svg viewBox="0 0 460 260" aria-hidden="true"><rect width="460" height="260" rx="18" fill="#0B1026"/>' +
          '<circle cx="40" cy="130" r="90" fill="#FDE047"/><circle cx="40" cy="130" r="110" fill="#FDE047" opacity=".2"/>' +
          '<g><circle cx="300" cy="130" r="92" fill="#3B82F6"/><g class="earth-spin" id="spin"><circle cx="300" cy="130" r="92" fill="none"/><path d="M262 70 q22 -10 40 6 q-4 22 -30 22 z M318 160 q20 -6 30 10 q-10 24 -34 16 z M250 150 q10 -10 22 0 q0 14 -16 12 z" fill="#3AAA69"/>' +
          '<g><circle cx="300" cy="222" r="9" fill="#E9A21F" stroke="#fff" stroke-width="3"/><text x="300" y="250" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#fff">NZ</text></g></g>' +
          '<path d="M300 38 A92 92 0 0 1 300 222 Z" fill="#0B1026" opacity=".55"/></g></svg></div>';
        var spin = stage.querySelector("#spin");
        var btn = el('<button type="button" class="block c-sun" style="padding:14px 28px;min-height:70px;font-size:1.6rem;flex-direction:row">🔄 Spin a quarter turn</button>');
        api.choices.appendChild(btn);
        function where() { var a2 = ((angle % 360) + 360) % 360; return a2 === 90 ? "day" : a2 === 270 ? "night" : a2 === 0 ? "morning" : "evening"; }
        function tell() {
          var w = where();
          var msg = { night: "New Zealand faces away from the Sun. It's night time! 🌙", day: "New Zealand faces the Sun. It's daytime! ☀️", morning: "New Zealand is turning towards the Sun. Sunrise! 🌅", evening: "New Zealand is turning away from the Sun. Sunset! 🌇" }[w];
          api.say(msg, "good");
          if (!seen[w]) { seen[w] = 1; api.right(); }
          if (Object.keys(seen).length === 4 && spins >= 4) setTimeout(function () { api.done("One full spin is one whole day: 24 hours! Ready for the quiz?"); }, 1600);
        }
        btn.addEventListener("click", function () { angle += 90; spins++; spin.style.transform = "rotate(" + angle + "deg)"; setTimeout(tell, 900); });
        spin.style.transform = "rotate(0deg)";
        tell();
        api.prompt("Spin the Earth. When is it day in New Zealand?");
      },
      gen: function (quiz) { var x = pick(SPACE_FACTS.slice(0, quiz ? 5 : 3)); return { prompt: x.q, visual: '<div style="font-size:5rem">🌍☀️</div>', answer: x.a, choices: shuffle(x.c), explain: x.f }; }
    },
    planets: {
      title: "The Planets", emoji: "🪐", color: "sky", intro: "Eight planets go around the Sun. Put them in order, starting closest to the Sun!",
      explorePrompt: "Put the planets in order from the Sun",
      explore: function (stage, api) {
        var steps = PLANETS.map(function (p) { return { n: p.n, html: planetHtml(p, .8) }; });
        orderExplore([{ name: "The Solar System", steps: steps, done: "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune! (My Very Easy Method Just Speeds Up Naming)" }],
          function () { return "Tap the planets in order, starting closest to the Sun ☀️"; })(stage, api);
      },
      gen: function (quiz) {
        if (Math.random() < .5) { var x = pick(SPACE_FACTS.slice(4)); return { prompt: x.q, visual: '<div style="font-size:5rem">🪐</div>', answer: x.a, choices: shuffle(x.c), explain: x.f }; }
        var k = rnd(0, 6), names = PLANETS.map(function (p) { return p.n; });
        return { prompt: "Which planet comes after " + names[k] + " (going out from the Sun)?", visual: '<div class="slots" style="align-items:center">' + planetHtml(PLANETS[k], 1.4) + '<span class="slot-arrow">➜</span><span style="font:800 3rem var(--display);color:var(--sun)">?</span></div>',
          answer: names[k + 1], choices: choicesFrom(names[k + 1], names), explain: "In order from the Sun: " + names.join(", ") + "." };
      }
    }
  };
};
