/* English lessons for Kids Lab: the alphabet, sounds and rhymes, reading words, spelling, sentences and stories.
   Each lesson has gen(quiz) for questions, and some have explore(stage, api) for a hands-on activity.
   Loaded by lessons/basics.html, which provides the helpers in H.
   Letters use the Andika font, made for early readers (simple "a" and "g", like kids write them at school).

   Letter SOUNDS: the iPad voice says letter NAMES well ("bee") but not phonics sounds ("buh").
   To add real sounds later, record them and list the files in SOUND_FILES below, e.g. b: "sounds/b.m4a". */
window.makeEnglishLessons = function (H) {
  var rnd = H.rnd, pick = H.pickOne, shuffle = H.shuffle, K = H.K, reduce = H.reduce;

  /* ---------- styles ---------- */
  if (!document.getElementById("en-css")) {
    var css = document.createElement("style"); css.id = "en-css";
    css.textContent = [
      ".en, .choices.en .block, .tpad .tp-show, .tpad .tp-tiles button { font-family: 'Andika', 'Nunito', sans-serif; }",
      ".choices.en .block { font-weight: 700; text-shadow: none; }",
      ".choices.en.big .block { font-size: clamp(2.6rem, 8vw, 4rem); min-height: 110px; }",
      ".en-letter { font-family: 'Andika', 'Nunito', sans-serif; font-weight: 700; font-size: clamp(110px, 22vw, 180px); line-height: 1; color: var(--grape); }",
      ".en-pic { font-size: clamp(90px, 18vw, 130px); line-height: 1; }",
      ".en-row { display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; }",
      ".en-word { font-family: 'Andika', 'Nunito', sans-serif; font-weight: 700; font-size: clamp(2.6rem, 9vw, 4.4rem); color: var(--ink); letter-spacing: 2px; }",
      ".en-seq { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }",
      ".en-seq span { min-width: 70px; height: 80px; border-radius: 18px; background: var(--bg-2); display: grid; place-items: center; font: 700 2.6rem 'Andika', 'Nunito', sans-serif; padding: 0 8px; }",
      ".en-seq span.q { background: var(--sun); color: #fff; }",
      ".en-sent { font-family: 'Andika', 'Nunito', sans-serif; font-weight: 700; font-size: clamp(1.6rem, 4.6vw, 2.4rem); line-height: 1.35; text-align: center; color: var(--ink); max-width: 30ch; text-wrap: balance; }",
      ".en-sent u { text-decoration-thickness: 4px; text-underline-offset: 6px; color: var(--berry); }",
      ".en-story { font-family: 'Andika', 'Nunito', sans-serif; font-size: clamp(1.25rem, 3.4vw, 1.65rem); line-height: 1.55; text-align: left; max-width: 34ch; color: var(--ink); background: #FFF8E6; border-radius: 22px; padding: 18px 22px; box-shadow: inset 0 0 0 3px #F3DFA8; }",
      ".en-story .st-title { display: block; font-weight: 700; font-size: 1.1em; margin-bottom: 4px; color: var(--tang); }",
      ".hear { border: 0; border-radius: 50%; width: 76px; height: 76px; font-size: 38px; background: var(--sky); box-shadow: 0 6px 0 color-mix(in srgb, var(--sky) 60%, #000); cursor: pointer; flex: none; }",
      ".hear:active { transform: translateY(4px); box-shadow: 0 2px 0 color-mix(in srgb, var(--sky) 60%, #000); }",
      ".hear.small { width: 56px; height: 56px; font-size: 28px; }",
      ".pic-choice { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }",
      ".pic-choice small { font-size: 1.1rem; font-family: 'Andika', 'Nunito', sans-serif; }",
      /* letter explorer */
      ".abc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 10px; width: 100%; }",
      ".abc-grid button { border: 0; border-radius: 18px; min-height: 80px; background: var(--card); box-shadow: 0 5px 0 var(--shadow), inset 0 0 0 3px var(--rim); font: 700 2.6rem 'Andika', 'Nunito', sans-serif; color: var(--ink); cursor: pointer; }",
      ".abc-grid button.seen { background: var(--leaf); color: #fff; box-shadow: 0 5px 0 color-mix(in srgb, var(--leaf) 60%, #000); }",
      ".abc-show { display: flex; align-items: center; gap: 18px; min-height: 130px; }",
      ".abc-show .en-letter { font-size: 120px; }",
      /* tracing */
      ".trace-wrap { position: relative; width: min(380px, 86vw); aspect-ratio: 1; border-radius: 26px; background: #FFFDF6; box-shadow: inset 0 0 0 4px var(--rim); touch-action: none; }",
      ".trace-wrap canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 26px; touch-action: none; }",
      ".trace-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }",
      ".trace-btns button { border: 0; border-radius: 999px; padding: 14px 26px; font: 800 1.2rem var(--body); color: #fff; cursor: pointer; }",
      ".trace-meter { width: min(380px, 86vw); height: 16px; border-radius: 999px; background: var(--bg-2); overflow: hidden; }",
      ".trace-meter span { display: block; height: 100%; width: 0; background: var(--leaf); transition: width .2s; }",
      /* tile builder (spelling and sentences) */
      ".choices.tile-mode { display: flex; justify-content: center; }",
      ".tpad { width: min(760px, 100%); display: flex; flex-direction: column; align-items: center; gap: 14px; }",
      ".tp-show { min-height: 92px; width: 100%; border-radius: 22px; background: var(--card); box-shadow: inset 0 0 0 4px var(--sun); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; padding: 10px; font-size: clamp(2rem, 6vw, 3rem); font-weight: 700; }",
      ".tp-show.words { font-size: clamp(1.4rem, 4vw, 2rem); }",
      ".tp-show .gap { width: 46px; height: 58px; border-bottom: 5px solid var(--rim); }",
      ".tp-show.words .gap { width: 70px; height: 40px; }",
      ".tp-show.empty { color: var(--muted); font-size: 1.3rem; font-family: var(--body); }",
      ".tp-tiles { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }",
      ".tp-tiles button { border: 0; border-radius: 16px; min-width: 70px; min-height: 74px; padding: 0 14px; background: var(--grape); color: #fff; font-size: 2.3rem; font-weight: 700; box-shadow: 0 6px 0 color-mix(in srgb, var(--grape) 60%, #000); cursor: pointer; }",
      ".tp-tiles.words button { font-size: 1.5rem; background: var(--sky); box-shadow: 0 6px 0 color-mix(in srgb, var(--sky) 60%, #000); }",
      ".tp-tiles button.used { visibility: hidden; }",
      ".tp-ctl { display: flex; gap: 12px; }",
      ".tp-ctl button { border: 0; border-radius: 999px; padding: 16px 30px; font: 800 1.35rem var(--body); cursor: pointer; background: var(--card); box-shadow: 0 5px 0 var(--shadow); color: var(--berry); }",
      ".tp-ctl .tp-ok { background: var(--leaf); color: #fff; }"
    ].join("\n");
    document.head.appendChild(css);
  }

  /* ---------- helpers ---------- */
  var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  var SOUND_FILES = {}; // e.g. { s: "sounds/s.m4a" } once recorded
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hear(text, small) { return '<button type="button" class="hear' + (small ? " small" : "") + '" data-say="' + esc(text) + '" aria-label="Hear it again">🔊</button>'; }
  function wire(v) { v.querySelectorAll(".hear").forEach(function (b) { b.addEventListener("click", function () { K.say(b.getAttribute("data-say")); }); }); }
  // Every question: hear buttons work, letters use the reading font.
  function Q(o) {
    var a = o.after;
    o.after = function (v) { wire(v); if (a) a(v); };
    o.cls = o.cls || "en";
    return o;
  }
  // n wrong answers from a pool, not equal to the answer (and not in the "avoid" list).
  function others(ans, pool, n, avoid) {
    var out = [], p = shuffle(pool);
    for (var i = 0; i < p.length && out.length < n; i++) if (p[i] !== ans && out.indexOf(p[i]) === -1 && (!avoid || avoid.indexOf(p[i]) === -1)) out.push(p[i]);
    return out;
  }
  function choicesOf(ans, pool, n, avoid) { return shuffle([ans].concat(others(ans, pool, (n || 4) - 1, avoid))); }
  // Letters that sound or look alike are kept apart so the question is fair.
  var SOUNDALIKE = { C: ["K", "Q", "S"], K: ["C", "Q"], Q: ["C", "K"], S: ["C"] };
  function letterChoices(L, pool, lower) {
    var c = choicesOf(L, pool, 4, SOUNDALIKE[L]);
    return lower ? c.map(function (x) { return x.toLowerCase(); }) : c;
  }
  function sayLetter(L) { return L.toUpperCase() + "."; }

  /* ---------- word banks ---------- */
  // Words for each letter, with a picture. Used by Letter Explorer and First Letter.
  var PICS = {
    A: [["apple", "🍎"], ["ant", "🐜"], ["alligator", "🐊"]], B: [["ball", "⚽"], ["bee", "🐝"], ["banana", "🍌"], ["bus", "🚌"]],
    C: [["cat", "🐱"], ["car", "🚗"], ["cake", "🎂"], ["cow", "🐄"]], D: [["dog", "🐶"], ["duck", "🦆"], ["door", "🚪"], ["drum", "🥁"]],
    E: [["egg", "🥚"], ["elephant", "🐘"], ["envelope", "✉️"]], F: [["fish", "🐟"], ["frog", "🐸"], ["fire", "🔥"], ["fox", "🦊"]],
    G: [["goat", "🐐"], ["gift", "🎁"], ["grapes", "🍇"], ["guitar", "🎸"]], H: [["hat", "🎩"], ["horse", "🐴"], ["house", "🏠"], ["heart", "❤️"]],
    I: [["insect", "🐞"], ["igloo", "🧊"], ["ink", "🖋️"]], J: [["juice", "🧃"], ["jeans", "👖"], ["jet", "🛩️"]],
    K: [["kite", "🪁"], ["key", "🔑"], ["koala", "🐨"], ["king", "🤴"]], L: [["lion", "🦁"], ["leaf", "🍃"], ["lemon", "🍋"], ["lollipop", "🍭"]],
    M: [["moon", "🌙"], ["monkey", "🐵"], ["mouse", "🐭"], ["milk", "🥛"]], N: [["nose", "👃"], ["nut", "🥜"], ["noodles", "🍜"], ["nine", "9️⃣"]],
    O: [["octopus", "🐙"], ["owl", "🦉"], ["orange", "🍊"]], P: [["pig", "🐷"], ["pizza", "🍕"], ["penguin", "🐧"], ["panda", "🐼"]],
    Q: [["queen", "👸"], ["question mark", "❓"]], R: [["rabbit", "🐰"], ["robot", "🤖"], ["rainbow", "🌈"], ["rocket", "🚀"]],
    S: [["snake", "🐍"], ["sun", "☀️"], ["sock", "🧦"], ["star", "⭐"]], T: [["tiger", "🐯"], ["train", "🚂"], ["tree", "🌳"], ["tooth", "🦷"]],
    U: [["umbrella", "☂️"], ["unicorn", "🦄"], ["up arrow", "⬆️"]], V: [["violin", "🎻"], ["van", "🚐"], ["volcano", "🌋"]],
    W: [["whale", "🐳"], ["watch", "⌚"], ["worm", "🪱"], ["web", "🕸️"]], X: [["x-ray", "🩻"], ["xylophone", "🎶"]],
    Y: [["yo-yo", "🪀"], ["yak", "🐃"], ["yawn", "🥱"]], Z: [["zebra", "🦓"], ["zip", "🤐"], ["zero", "0️⃣"]]
  };
  // For "which letter does it start with": skip letters whose words start with a tricky sound.
  var FIRST_OK = "ABCDEFGHJKLMNOPRSTUVWZ".split("");
  function picFor(L) { return pick(PICS[L]); }

  var CVC = [
    ["cat", "🐱"], ["bat", "🦇"], ["hat", "🎩"], ["rat", "🐀"], ["dog", "🐶"], ["log", "🪵"], ["pig", "🐷"], ["fox", "🦊"], ["box", "📦"],
    ["sun", "☀️"], ["bus", "🚌"], ["bug", "🐛"], ["cup", "🥤"], ["hen", "🐔"], ["pen", "🖊️"], ["ten", "🔟"], ["bed", "🛏️"], ["jet", "🛩️"],
    ["net", "🥅"], ["web", "🕸️"], ["map", "🗺️"], ["van", "🚐"], ["can", "🥫"], ["pan", "🍳"], ["cap", "🧢"], ["bag", "👜"], ["six", "6️⃣"],
    ["pin", "📌"], ["bin", "🗑️"], ["nut", "🥜"], ["pot", "🍲"], ["kid", "🧒"], ["mud", "🟫"], ["lip", "👄"]
  ];
  function cvcDistractors(w) {
    // Prefer words that share the ending (cat, hat, bat) or the start (cat, can, cap), so you really have to read it.
    var same = CVC.filter(function (x) { return x[0] !== w && (x[0].slice(1) === w.slice(1) || x[0][0] === w[0] || x[0][1] === w[1]); }).map(function (x) { return x[0]; });
    var rest = CVC.map(function (x) { return x[0]; }).filter(function (x) { return x !== w && same.indexOf(x) === -1; });
    return others(w, same, 3).concat(others(w, rest, 3)).slice(0, 3);
  }

  var SIGHT1 = ["I", "a", "the", "and", "is", "it", "in", "to", "my", "me", "we", "go", "see", "can", "up", "no", "at", "on", "you", "he", "she", "look", "like", "big", "am"];
  var SIGHT2 = ["said", "was", "they", "have", "come", "some", "were", "what", "when", "where", "because", "could", "would", "friend", "people", "again", "once", "very", "little", "here", "one", "two", "does", "many", "any", "every", "after", "school", "water", "who"];
  // Words that look alike, so sight-word choices make you look closely.
  function lookalikes(w, list) {
    var close = list.filter(function (x) { return x !== w && (x[0] === w[0] || x.length === w.length); });
    return others(w, close, 3).concat(others(w, list, 3)).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 3);
  }

  var RHYMES = [
    [["cat", "🐱"], ["hat", "🎩"], ["bat", "🦇"], ["rat", "🐀"]], [["dog", "🐶"], ["frog", "🐸"], ["log", "🪵"]], [["bee", "🐝"], ["tree", "🌳"], ["key", "🔑"], ["three", "3️⃣"]],
    [["cake", "🎂"], ["snake", "🐍"], ["lake", "🏞️"]], [["car", "🚗"], ["star", "⭐"], ["jar", "🫙"]], [["king", "🤴"], ["ring", "💍"], ["wing", "🪽"]],
    [["moon", "🌙"], ["spoon", "🥄"], ["balloon", "🎈"]], [["sock", "🧦"], ["clock", "🕰️"], ["rock", "🪨"], ["lock", "🔒"]], [["box", "📦"], ["fox", "🦊"], ["socks", "🧦"]],
    [["bug", "🐛"], ["mug", "☕"], ["rug", "🧶"]], [["house", "🏠"], ["mouse", "🐭"]], [["train", "🚂"], ["rain", "🌧️"], ["chain", "⛓️"]],
    [["sun", "☀️"], ["bun", "🍞"], ["run", "🏃"]], [["bell", "🔔"], ["shell", "🐚"], ["well", "🪣"]], [["boat", "⛵"], ["goat", "🐐"], ["coat", "🧥"]],
    [["fish", "🐟"], ["dish", "🍽️"], ["wish", "🌠"]], [["bed", "🛏️"], ["red", "🟥"], ["sled", "🛷"]], [["night", "🌃"], ["light", "💡"], ["kite", "🪁"]]
  ];
  // "kite" and "light" share a sound but not spelling; they're still rhymes. "socks" is in with box/fox because it sounds the same.

  var BLENDS = [
    ["sh", "sheep", "🐑"], ["sh", "shoe", "👟"], ["sh", "ship", "🚢"], ["sh", "shell", "🐚"], ["sh", "shark", "🦈"],
    ["ch", "chick", "🐥"], ["ch", "cheese", "🧀"], ["ch", "chair", "🪑"], ["ch", "cherry", "🍒"], ["ch", "chocolate", "🍫"],
    ["th", "thumb", "👍"], ["th", "three", "3️⃣"], ["th", "thirteen", "1️⃣3️⃣"],
    ["tr", "train", "🚂"], ["tr", "tree", "🌳"], ["tr", "truck", "🚚"], ["tr", "trumpet", "🎺"],
    ["fr", "frog", "🐸"], ["fr", "fries", "🍟"], ["fr", "fridge", "🧊"], ["sn", "snake", "🐍"], ["sn", "snail", "🐌"], ["sn", "snowman", "⛄"],
    ["sp", "spider", "🕷️"], ["sp", "spoon", "🥄"], ["st", "star", "⭐"], ["st", "stop sign", "🛑"], ["cl", "clock", "🕰️"], ["cl", "cloud", "☁️"], ["cl", "clown", "🤡"],
    ["dr", "drum", "🥁"], ["dr", "dragon", "🐉"], ["pl", "plane", "✈️"], ["pl", "plate", "🍽️"], ["gr", "grapes", "🍇"], ["bl", "blue", "🔵"], ["br", "bread", "🍞"], ["br", "brush", "🖌️"]
  ];
  var BLEND_SET = ["sh", "ch", "th", "tr", "fr", "sn", "sp", "st", "cl", "dr", "pl", "gr", "bl", "br"];

  var FAMILIES = {
    at: ["cat", "hat", "bat", "mat", "rat", "sat"], ig: ["pig", "big", "dig", "wig", "fig"], op: ["hop", "top", "mop", "pop", "shop", "stop"],
    un: ["sun", "run", "fun", "bun"], ing: ["king", "ring", "sing", "wing", "swing", "thing"], ake: ["cake", "make", "lake", "snake", "bake", "take"],
    ell: ["bell", "shell", "tell", "well", "smell"], ock: ["sock", "rock", "clock", "lock"], an: ["can", "man", "fan", "pan", "van", "ran"], et: ["jet", "net", "pet", "wet", "get", "vet"]
  };

  var SPELL2 = ["jump", "play", "green", "train", "shop", "fish", "thing", "black", "stop", "swim", "rain", "boat", "night", "light", "cake", "snake", "bike", "home",
    "tree", "sleep", "book", "moon", "cloud", "house", "about", "again", "said", "friend", "because", "water", "after", "every", "were", "school", "little", "people", "when", "what", "sister", "brother"];
  var SPELL_SENT = { said: "Mum said yes.", were: "We were happy.", what: "What is that?", when: "When is lunch?", again: "Read it again.", because: "I ran because I was late.", every: "I play every day.", after: "We had cake after lunch." };

  var MISSING = [
    ["I like to ___ in the pool.", "swim", ["swim", "sleep", "cook", "read"]], ["The dog ___ at the cat.", "barked", ["barked", "baked", "sang", "drove"]],
    ["We eat soup with a ___.", "spoon", ["spoon", "fork", "hat", "shoe"]], ["The sun is very ___ today.", "hot", ["hot", "cold", "wet", "sad"]],
    ["A bird can ___ in the sky.", "fly", ["fly", "swim", "dig", "drive"]], ["I brush my ___ every night.", "teeth", ["teeth", "feet", "cake", "car"]],
    ["Put your ___ on your feet.", "shoes", ["shoes", "gloves", "hat", "glasses"]], ["The cow says ___.", "moo", ["moo", "woof", "quack", "meow"]],
    ["It is dark at ___.", "night", ["night", "lunch", "school", "noon"]], ["My cat likes to drink ___.", "milk", ["milk", "rocks", "sand", "paint"]],
    ["We ___ to school on the bus.", "go", ["go", "eat", "sleep", "sing"]], ["The ice cream will ___ in the sun.", "melt", ["melt", "grow", "jump", "bark"]],
    ["I wear a coat when it is ___.", "cold", ["cold", "hot", "sunny", "happy"]], ["The baby is ___ in her cot.", "sleeping", ["sleeping", "driving", "flying", "cooking"]],
    ["Fish live in the ___.", "sea", ["sea", "sky", "tree", "house"]], ["I read a ___ before bed.", "book", ["book", "spoon", "ball", "chair"]]
  ];

  var GOOD_SENT = ["The dog ran to the park.", "We went to the beach.", "My cat likes milk.", "I can ride my bike.", "Sam has a red hat.", "Mum made pancakes.",
    "Ella can swim fast.", "The bus is late.", "Jack has a big blue kite.", "We play on Saturday.", "I saw Nana at the shop.", "Alice reads a book."];
  function wrongVersions(s) {
    var words = s.replace(/\.$/, "").split(" ");
    var v1 = words[0].toLowerCase() + " " + words.slice(1).join(" ") + ".";        // no capital at the start
    var v2 = s.replace(/\.$/, "");                                                  // no full stop
    var v3 = words.map(function (w, i) { return i ? w.toLowerCase() : w; }).join(" ") + ".";   // names in lower case
    var v4 = v1.replace(/\.$/, "");
    return [v1, v2, v3, v4].filter(function (x, i, a) { return x !== s && a.indexOf(x) === i; });
  }
  var QUESTIONS = ["Where is my hat", "Can you swim", "What is your name", "Do you like cake", "Who is at the door", "Is it time for lunch"];
  var STATEMENTS = ["I like cake", "The sun is hot", "We ran home", "My dog is brown", "It is time for bed", "The bus is red"];

  var PLURALS = [["cat", "cats"], ["dog", "dogs"], ["box", "boxes"], ["bus", "buses"], ["fox", "foxes"], ["baby", "babies"], ["cherry", "cherries"], ["mouse", "mice"],
    ["foot", "feet"], ["tooth", "teeth"], ["child", "children"], ["sheep", "sheep"], ["man", "men"], ["dish", "dishes"], ["book", "books"], ["lady", "ladies"]];
  var PLURAL_PIC = { cat: "🐱", dog: "🐶", box: "📦", bus: "🚌", fox: "🦊", baby: "👶", cherry: "🍒", mouse: "🐭", foot: "🦶", tooth: "🦷", child: "🧒", sheep: "🐑", man: "👨", dish: "🍽️", book: "📕", lady: "👩" };
  var PAST = [["jump", "jumped"], ["play", "played"], ["walk", "walked"], ["kick", "kicked"], ["run", "ran"], ["go", "went"], ["see", "saw"], ["eat", "ate"],
    ["swim", "swam"], ["sing", "sang"], ["sit", "sat"], ["come", "came"], ["make", "made"], ["write", "wrote"], ["drink", "drank"], ["help", "helped"]];
  var OPPOSITES = [["hot", "cold"], ["big", "small"], ["up", "down"], ["fast", "slow"], ["happy", "sad"], ["day", "night"], ["open", "closed"], ["full", "empty"],
    ["wet", "dry"], ["old", "new"], ["tall", "short"], ["in", "out"], ["loud", "quiet"], ["hard", "soft"], ["light", "dark"], ["first", "last"]];
  var NOUNS = ["dog", "table", "apple", "house", "teacher", "car", "tree", "ball", "school", "cake"];
  var VERBS = ["jump", "run", "eat", "swim", "sing", "climb", "read", "throw", "kick", "sleep"];
  var ADJS = ["big", "red", "happy", "soft", "tiny", "noisy", "cold", "shiny", "funny", "tall"];

  var RIDDLES = [
    ["I am big and grey. I have a long trunk.", "🐘", ["🐘", "🐭", "🦒", "🐻"]], ["I am yellow and I am a fruit. Monkeys love me.", "🍌", ["🍌", "🍎", "🍇", "🥕"]],
    ["I am hot and bright. I am in the sky in the day.", "☀️", ["☀️", "🌙", "⭐", "☁️"]], ["I live in water. I swim and I have fins.", "🐟", ["🐟", "🐶", "🐦", "🐍"]],
    ["I am small and I buzz. I make honey.", "🐝", ["🐝", "🦋", "🐜", "🐞"]], ["I have four wheels. You drive me on the road.", "🚗", ["🚗", "🚲", "⛵", "✈️"]],
    ["I am made of snow. I melt when it is hot.", "⛄", ["⛄", "🧊", "🌨️", "🍦"]], ["I have a very long neck. I eat leaves from tall trees.", "🦒", ["🦒", "🐘", "🦓", "🐄"]],
    ["I say moo. I give you milk.", "🐄", ["🐄", "🐑", "🐷", "🐐"]], ["I am green. I hop and I live by a pond.", "🐸", ["🐸", "🐢", "🐊", "🐛"]],
    ["I have hands but I can't clap. I tell you the time.", "🕰️", ["🕰️", "📱", "🧤", "📖"]], ["I have pages. You read me.", "📖", ["📖", "✏️", "📺", "🎨"]],
    ["I have eight legs. I make a web.", "🕷️", ["🕷️", "🐜", "🐙", "🦀"]], ["I am a bird but I can't fly. I swim in icy water.", "🐧", ["🐧", "🦆", "🦉", "🐔"]],
    ["I fall from the clouds. I make puddles.", "🌧️", ["🌧️", "🌈", "☀️", "❄️"]], ["I am cold and white. I fall in winter and you can make a snowman with me.", "❄️", ["❄️", "🌧️", "🔥", "🍃"]],
    ["You blow me up. I float and I can pop!", "🎈", ["🎈", "⚽", "🪁", "🎁"]], ["I have a hard shell. I am very slow.", "🐢", ["🐢", "🐇", "🐆", "🐌"]]
  ];

  var STORIES = [
    { t: "The Red Kite", s: "Mia has a red kite. She takes it to the beach. The wind is strong. The kite flies up high.", q: [
      ["What colour is the kite?", "red", ["red", "blue", "green", "yellow"]], ["Where does Mia go?", "the beach", ["the beach", "the park", "school", "the shop"]],
      ["Why does the kite fly high?", "The wind is strong.", ["The wind is strong.", "It is raining.", "Mia throws it.", "It is night."]]] },
    { t: "Max Digs", s: "Tom's dog is called Max. Max likes to dig in the garden. One day he dug up an old shoe! Tom laughed.", q: [
      ["What is the dog's name?", "Max", ["Max", "Tom", "Sam", "Rex"]], ["What did Max dig up?", "a shoe", ["a shoe", "a bone", "a ball", "a box"]],
      ["How did Tom feel?", "happy", ["happy", "sad", "angry", "scared"]]] },
    { t: "A Cold Walk", s: "It was a cold morning. Lily put on her coat and her warm hat. She walked to school with her big brother. They saw a duck on the pond.", q: [
      ["What was the weather like?", "cold", ["cold", "hot", "rainy", "windy"]], ["Who did Lily walk with?", "her big brother", ["her big brother", "her mum", "her friend", "her dad"]],
      ["What did they see on the pond?", "a duck", ["a duck", "a frog", "a boat", "a fish"]]] },
    { t: "No Milk", s: "Ben was hungry. He opened the fridge. There was no milk! So Dad took him to the shop to buy some.", q: [
      ["How did Ben feel?", "hungry", ["hungry", "sleepy", "cold", "silly"]], ["What was missing?", "milk", ["milk", "bread", "apples", "cheese"]],
      ["Where did they go?", "the shop", ["the shop", "the beach", "the park", "school"]]] },
    { t: "The Seed", s: "A little seed was planted in the soil. The sun shone and the rain fell. Soon a green shoot popped up. After many weeks, it was a tall sunflower.", q: [
      ["What did the seed need to grow?", "sun and rain", ["sun and rain", "snow and ice", "toys", "milk"]], ["What came up first?", "a green shoot", ["a green shoot", "a flower", "an apple", "a tree"]],
      ["What did the seed grow into?", "a sunflower", ["a sunflower", "a carrot", "a rose", "a bean"]]] },
    { t: "The Sandcastle", s: "Zoe and Sam built a sandcastle. Zoe made the towers and Sam dug a moat. Then a big wave came and washed it away! They started again.", q: [
      ["Who dug the moat?", "Sam", ["Sam", "Zoe", "Mum", "a crab"]], ["What happened to the sandcastle?", "A wave washed it away.", ["A wave washed it away.", "A dog sat on it.", "It got bigger.", "The wind blew it."]],
      ["What did they do next?", "They started again.", ["They started again.", "They went home.", "They cried.", "They had a swim."]]] },
    { t: "Birthday Cake", s: "Grandma made a chocolate cake for Ella's birthday. It had seven candles on top. Ella made a wish and blew them all out.", q: [
      ["Whose birthday was it?", "Ella's", ["Ella's", "Grandma's", "Jack's", "Mum's"]], ["How old is Ella now?", "seven", ["seven", "five", "six", "ten"]],
      ["Who made the cake?", "Grandma", ["Grandma", "Ella", "Dad", "a baker"]]] },
    { t: "Wet Jack", s: "The bus was late. Jack waited at the bus stop in the rain. When the bus came, he was wet from head to toe!", q: [
      ["What was the weather?", "rainy", ["rainy", "sunny", "snowy", "windy"]], ["Why was Jack wet?", "He waited in the rain.", ["He waited in the rain.", "He fell in a pond.", "He went swimming.", "He spilt his drink."]],
      ["Where did Jack wait?", "at the bus stop", ["at the bus stop", "at school", "at home", "at the park"]]] },
    { t: "Night Owls", s: "Owls sleep in the day. At night they wake up and fly through the dark woods. They have big eyes to help them see. They hunt for mice.", q: [
      ["When do owls sleep?", "in the day", ["in the day", "at night", "in winter", "never"]], ["What helps owls see in the dark?", "big eyes", ["big eyes", "a torch", "long ears", "big feet"]],
      ["What do owls hunt for?", "mice", ["mice", "fish", "leaves", "cake"]]] },
    { t: "Lost Car", s: "Leo lost his toy car. He looked under his bed. He looked in the toy box. At last he found it in his gumboot!", q: [
      ["What did Leo lose?", "his toy car", ["his toy car", "his teddy", "his shoe", "his book"]], ["Where did he look first?", "under his bed", ["under his bed", "in the toy box", "in the garden", "in the car"]],
      ["Where was the car?", "in his gumboot", ["in his gumboot", "in the bath", "under the bed", "in the toy box"]]] }
  ];

  var DETECTIVE = [
    ["Sam put on his togs and grabbed his towel.", "Where is Sam going?", "to the pool", ["to the pool", "to bed", "to school", "to the shops"]],
    ["Mum took her umbrella before she went outside.", "What is the weather like?", "rainy", ["rainy", "sunny", "snowy", "foggy"]],
    ["The ice cream was dripping down Ava's hand.", "What is the weather like?", "hot", ["hot", "cold", "rainy", "windy"]],
    ["Noah yawned and rubbed his eyes.", "How does Noah feel?", "tired", ["tired", "angry", "hungry", "excited"]],
    ["The baby bird opened its beak and cheeped loudly.", "What does the bird want?", "food", ["food", "a bath", "a toy", "to sleep"]],
    ["Everyone sang and Lily blew out the candles.", "What is happening?", "a birthday party", ["a birthday party", "a swimming race", "a school test", "a storm"]],
    ["Dad's hands were covered in flour and the kitchen smelled sweet.", "What is Dad doing?", "baking", ["baking", "painting", "gardening", "washing the car"]],
    ["The leaves were orange and falling from the trees.", "What season is it?", "autumn", ["autumn", "summer", "spring", "winter"]],
    ["Ruby's lip wobbled and a tear ran down her cheek.", "How does Ruby feel?", "sad", ["sad", "happy", "sleepy", "brave"]],
    ["The dog wagged its tail and jumped up when Max came home.", "How does the dog feel?", "happy", ["happy", "scared", "cross", "sick"]],
    ["Grace put on her helmet and pumped up her tyres.", "What is Grace going to do?", "ride her bike", ["ride her bike", "go swimming", "bake a cake", "go to sleep"]],
    ["The crowd cheered as the runner crossed the line first.", "What happened?", "The runner won.", ["The runner won.", "The runner fell.", "It started raining.", "The race was cancelled."]],
    ["Leo's tummy rumbled and he looked at the clock. It was nearly twelve.", "What does Leo want?", "lunch", ["lunch", "a nap", "a bath", "a story"]],
    ["The windows were dark and the stars were out.", "What time of day is it?", "night", ["night", "morning", "lunchtime", "afternoon"]]
  ];

  var MAKE = ["The dog is big.", "I like red apples.", "We went to the park.", "My cat can jump high.", "The sun is very hot.", "Can you see the bird?",
    "Mum has a blue car.", "The fish swims in the sea.", "I love my teddy bear.", "We play on the swings.", "The frog sat on a log.", "Dad reads me a story."];

  /* ---------- question makers ---------- */
  function findLetter(pool, lower) {
    var L = pick(pool), shown = lower ? L.toLowerCase() : L;
    return Q({ prompt: lower ? "Find the small letter " + L.toLowerCase() : "Find the letter " + L, visual: '<div class="en-row">' + hear((lower ? "Find the small letter " : "Find the letter ") + sayLetter(L)) + "</div>",
      speak: (lower ? "Find the small letter " : "Find the letter ") + sayLetter(L), answer: shown, choices: letterChoices(L, pool, lower), cls: "en big",
      explain: "That's " + (lower ? "small " : "") + L.toLowerCase() + ". " + L + " is for " + picFor(L)[0] + " " + picFor(L)[1] + "." });
  }
  // Explore: tap each letter to hear its name and a word that starts with it.
  function letterExplore(pool) {
    return function (stage, api) {
      var seen = {};
      stage.innerHTML = '<div class="abc-show"></div><div class="abc-grid"></div><p class="sci-progress en-left"></p>';
      var show = stage.querySelector(".abc-show"), grid = stage.querySelector(".abc-grid"), left = stage.querySelector(".en-left");
      api.prompt("Tap every letter");
      function count() { left.textContent = Object.keys(seen).length + " of " + pool.length + " letters"; }
      pool.forEach(function (L) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = L;
        b.addEventListener("click", function () {
          var w = picFor(L);
          show.innerHTML = '<span class="en-letter">' + L + L.toLowerCase() + '</span><span class="en-pic">' + w[1] + "</span>";
          api.say(L + ". " + L + " is for " + w[0] + ".", "good");
          if (!seen[L]) { seen[L] = 1; b.classList.add("seen"); api.right(); count(); }
          if (Object.keys(seen).length === pool.length) setTimeout(function () { api.done("You know them all! Ready for the quiz?"); }, 1600);
        });
        grid.appendChild(b);
      });
      count();
    };
  }
  // Explore: trace big letters with a finger.
  function traceExplore(stage, api) {
    var letters = shuffle(ABC).slice(0, 5).map(function (L, i) { return i % 2 ? L.toLowerCase() : L; }), idx = 0;
    stage.innerHTML = '<div class="trace-wrap"><canvas class="t-guide"></canvas><canvas class="t-ink"></canvas></div><div class="trace-meter"><span></span></div>' +
      '<div class="trace-btns"><button type="button" class="t-clear" style="background:var(--berry)">Rub out</button><button type="button" class="t-done" style="background:var(--leaf)">I traced it ✓</button></div>';
    var wrap = stage.querySelector(".trace-wrap"), guide = stage.querySelector(".t-guide"), ink = stage.querySelector(".t-ink"), meter = stage.querySelector(".trace-meter span");
    var S = 360, dpr = 1, g = guide.getContext("2d"), k = ink.getContext("2d"), pts = [], drawing = false, last = null;
    guide.width = ink.width = S; guide.height = ink.height = S;
    function font(px) { return "700 " + px + "px Andika, Nunito, sans-serif"; }
    function letterMask(L, stroke) {
      var c = document.createElement("canvas"); c.width = c.height = S; var x = c.getContext("2d");
      x.font = font(270); x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#000";
      if (stroke) { x.lineWidth = stroke; x.strokeStyle = "#000"; x.lineJoin = "round"; x.strokeText(L, S / 2, S / 2 + 10); }
      x.fillText(L, S / 2, S / 2 + 10);
      return x.getImageData(0, 0, S, S).data;
    }
    function setup() {
      var L = letters[idx];
      g.clearRect(0, 0, S, S); k.clearRect(0, 0, S, S); meter.style.width = "0";
      g.font = font(270); g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "#E3DCF2"; g.fillText(L, S / 2, S / 2 + 10);
      g.setLineDash([8, 10]); g.lineWidth = 3; g.strokeStyle = "#B7A6DA"; g.strokeText(L, S / 2, S / 2 + 10); g.setLineDash([]);
      pts = []; var m = letterMask(L);
      for (var y = 0; y < S; y += 6) for (var x = 0; x < S; x += 6) if (m[(y * S + x) * 4 + 3] > 128) pts.push([x, y]);
      wrap._near = letterMask(L, 46);
      api.prompt("Trace the " + (L === L.toUpperCase() ? "big" : "small") + " letter " + L);
      K.say("Trace the " + (L === L.toUpperCase() ? "big" : "small") + " letter " + L.toUpperCase() + ".");
    }
    function pos(e) { var r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * S, (e.clientY - r.top) / r.height * S]; }
    ink.addEventListener("pointerdown", function (e) { drawing = true; last = pos(e); try { ink.setPointerCapture(e.pointerId); } catch (x) {} dot(last); });
    ink.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pos(e); line(last, p); last = p; });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) { ink.addEventListener(t, function () { drawing = false; meter.style.width = Math.round(coverage().cov * 100) + "%"; }); });
    function dot(p) { k.fillStyle = "#8A5FCB"; k.beginPath(); k.arc(p[0], p[1], 15, 0, Math.PI * 2); k.fill(); }
    function line(a, b) { k.strokeStyle = "#8A5FCB"; k.lineWidth = 30; k.lineCap = "round"; k.beginPath(); k.moveTo(a[0], a[1]); k.lineTo(b[0], b[1]); k.stroke(); }
    function coverage() {
      var d = k.getImageData(0, 0, S, S).data, hit = 0, out = 0, inked = 0, near = wrap._near;
      pts.forEach(function (p) { if (d[(p[1] * S + p[0]) * 4 + 3] > 0) hit++; });
      for (var y = 0; y < S; y += 6) for (var x = 0; x < S; x += 6) { var i = (y * S + x) * 4 + 3; if (d[i] > 0) { inked++; if (near[i] < 128) out++; } }
      return { cov: pts.length ? hit / pts.length : 0, stray: inked ? out / inked : 0 };
    }
    stage.querySelector(".t-clear").addEventListener("click", function () { k.clearRect(0, 0, S, S); meter.style.width = "0"; });
    stage.querySelector(".t-done").addEventListener("click", function () {
      var c = coverage();
      if (c.cov < 0.6) { api.say("Keep going! Trace over all of the letter.", "bad"); return; }
      if (c.stray > 0.35) { api.say("Try to stay on the letter. Rub out and have another go!", "bad"); return; }
      api.right(); api.say("Beautiful " + letters[idx] + "!", "good");
      idx++;
      if (idx >= letters.length) { setTimeout(function () { api.done("Great tracing! Ready for the quiz?"); }, 1200); return; }
      setTimeout(setup, 1100);
    });
    // Wait for the reading font so the letter outline is the school shape.
    var go = function () { if (!stage.isConnected) return; setup(); };
    try { document.fonts.load(font(270)).then(go, go); } catch (e) { go(); }
  }
  function bigSmall(pool) {
    var L = pick(pool);
    if (Math.random() < .5) return Q({ prompt: "Which small letter matches?", visual: '<div class="en-letter">' + L + "</div>", speak: "Big " + sayLetter(L) + " Which small letter matches?",
      answer: L.toLowerCase(), choices: letterChoices(L, pool, true), cls: "en big", explain: "Big " + L + " and small " + L.toLowerCase() + " are the same letter." });
    return Q({ prompt: "Which big letter matches?", visual: '<div class="en-letter">' + L.toLowerCase() + "</div>", speak: "Small " + sayLetter(L) + " Which big letter matches?",
      answer: L, choices: letterChoices(L, pool), cls: "en big", explain: "Small " + L.toLowerCase() + " and big " + L + " are the same letter." });
  }
  // b, d, p and q get mixed up a lot, so they turn up often.
  function smallLetter() {
    var tricky = ["B", "D", "P", "Q", "N", "U", "M", "W"];
    if (Math.random() < .4) {
      var L = pick(tricky), set = L === "N" || L === "U" ? ["N", "U", "H", "R"] : L === "M" || L === "W" ? ["M", "W", "N", "V"] : ["B", "D", "P", "Q"];
      return Q({ prompt: "Find the small letter " + L.toLowerCase(), visual: '<div class="en-row">' + hear("Find the small letter " + sayLetter(L)) + "</div>",
        speak: "Find the small letter " + sayLetter(L), answer: L.toLowerCase(), choices: shuffle(set.map(function (x) { return x.toLowerCase(); })), cls: "en big",
        explain: L === "B" ? "b has its tummy on the right. Think: the bat comes before the ball." : L === "D" ? "d has its tummy on the left. Think: the drum comes before the stick." : "That's small " + L.toLowerCase() + "." });
    }
    return findLetter(ABC, true);
  }
  function abcOrder(quiz) {
    var t = rnd(0, quiz ? 2 : 1), i = rnd(1, 24), L = ABC[i];
    if (t === 0) return Q({ prompt: "What letter comes after " + L + "?", visual: '<div class="en-seq"><span>' + L + '</span><span class="q">?</span></div>', speak: "What letter comes after " + sayLetter(L),
      answer: ABC[i + 1], choices: shuffle([ABC[i + 1]].concat(others(ABC[i + 1], [ABC[i - 1], ABC[Math.min(25, i + 2)], ABC[Math.max(0, i - 2)], ABC[rnd(0, 25)], ABC[rnd(0, 25)]], 3))), cls: "en big",
      explain: L + ", " + ABC[i + 1] + ". " + ABC[i + 1] + " comes after " + L + "." });
    if (t === 1) return Q({ prompt: "What letter comes before " + L + "?", visual: '<div class="en-seq"><span class="q">?</span><span>' + L + "</span></div>", speak: "What letter comes before " + sayLetter(L),
      answer: ABC[i - 1], choices: shuffle([ABC[i - 1]].concat(others(ABC[i - 1], [ABC[i + 1], ABC[Math.min(25, i + 2)], ABC[Math.max(0, i - 2)], ABC[rnd(0, 25)], ABC[rnd(0, 25)]], 3))), cls: "en big",
      explain: ABC[i - 1] + " comes before " + L + "." });
    var s = rnd(0, 21), gap = rnd(1, 2), seq = ABC.slice(s, s + 4);
    return Q({ prompt: "Which letter is missing?", visual: '<div class="en-seq">' + seq.map(function (x, j) { return j === gap ? '<span class="q">?</span>' : "<span>" + x + "</span>"; }).join("") + "</div>",
      speak: "Which letter is missing?", answer: seq[gap], choices: shuffle([seq[gap]].concat(others(seq[gap], ABC.slice(Math.max(0, s - 2), s + 6), 3))), cls: "en big",
      explain: seq.join(", ") + "." });
  }
  function firstLetter(quiz) {
    var L = pick(FIRST_OK), w = picFor(L);
    if (quiz && Math.random() < .4) {
      // Letter → which picture starts with it
      var pics = [w].concat(shuffle(FIRST_OK.filter(function (x) { return x !== L && (SOUNDALIKE[L] || []).indexOf(x) === -1; })).slice(0, 3).map(picFor));
      var choice = function (p) { return p[1] + " " + p[0]; };
      return Q({ prompt: "Which picture starts with " + L + "?", visual: '<div class="en-letter">' + L + L.toLowerCase() + "</div>", speak: "Which picture starts with " + sayLetter(L),
        answer: choice(w), choices: shuffle(pics.map(choice)), explain: w[0] + " starts with " + L + "." });
    }
    return Q({ prompt: "What letter does " + w[0] + " start with?", visual: '<div class="en-row"><span class="en-pic">' + w[1] + "</span>" + hear(w[0]) + "</div>",
      speak: w[0] + ". What letter does " + w[0] + " start with?", answer: L.toLowerCase(), choices: letterChoices(L, FIRST_OK, true), cls: "en big",
      explain: w[0] + " starts with " + L.toLowerCase() + ". " + L + " is for " + w[0] + "." });
  }
  function rhyme() {
    var fam = pick(RHYMES), two = shuffle(fam).slice(0, 2), a = two[0], b = two[1];
    var wrong = shuffle(RHYMES.filter(function (f) { return f !== fam; })).slice(0, 3).map(function (f) { return pick(f); });
    var label = function (p) { return p[1] + " " + p[0]; };
    return Q({ prompt: "What rhymes with " + a[0] + "?", visual: '<div class="en-row"><span class="en-pic">' + a[1] + "</span>" + hear(a[0]) + "</div>",
      speak: "What rhymes with " + a[0] + "?", answer: label(b), choices: shuffle([b].concat(wrong).map(label)),
      explain: a[0] + " and " + b[0] + " rhyme. They sound the same at the end." });
  }
  function blend() {
    var x = pick(BLENDS), first = x[1][0];
    var opts = [x[0]].concat(others(x[0], BLEND_SET.filter(function (b) { return b[0] !== x[0][0] || Math.random() < .5; }), 2)).concat(others(x[0], [first], 1));
    opts = opts.filter(function (v, i, a) { return a.indexOf(v) === i; });
    while (opts.length < 4) { var o = pick(BLEND_SET); if (opts.indexOf(o) === -1) opts.push(o); }
    return Q({ prompt: "How does " + x[1] + " start?", visual: '<div class="en-row"><span class="en-pic">' + x[2] + "</span>" + hear(x[1]) + "</div>",
      speak: x[1] + ". How does " + x[1] + " start?", answer: x[0], choices: shuffle(opts), cls: "en big",
      explain: x[1] + " starts with " + x[0].split("").join(" ") + ". " + x[0] + ", " + x[1] + "." });
  }
  function cvcRead(quiz) {
    var w = pick(CVC);
    if (!quiz || Math.random() < .6) return Q({ prompt: "Which word is this?", visual: '<div class="en-pic">' + w[1] + "</div>", speak: "Which word matches the picture?",
      answer: w[0], choices: shuffle([w[0]].concat(cvcDistractors(w[0]))), cls: "en", explain: "It's a " + w[0] + ". " + w[0].split("").join(", ") + ", " + w[0] + "!" });
    var pics = [w].concat(shuffle(CVC.filter(function (x) { return x[0] !== w[0] && cvcDistractors(w[0]).indexOf(x[0]) !== -1; })).slice(0, 3));
    while (pics.length < 4) { var y = pick(CVC); if (pics.indexOf(y) === -1) pics.push(y); }
    return Q({ prompt: "Read the word. Tap the picture.", visual: '<div class="en-word">' + w[0] + "</div>", speak: "Read the word, then tap the picture.",
      answer: w[1], choices: shuffle(pics.map(function (p) { return p[1]; })), cls: "en big", explain: "It says " + w[0] + ". " + w[1] });
  }
  function sight(list) {
    var w = pick(list);
    return Q({ prompt: "Tap the word you hear", visual: '<div class="en-row">' + hear(w) + "</div>", speak: "Tap the word: " + w + ".",
      answer: w, choices: shuffle([w].concat(lookalikes(w, list))), cls: "en", explain: "That word is " + w + "." });
  }
  function family(quiz) {
    var keys = Object.keys(FAMILIES), f = pick(keys), words = FAMILIES[f];
    if (!quiz || Math.random() < .5) {
      var a = pick(words), b = pick(words.filter(function (x) { return x !== a && x.length === a.length && x.slice(-f.length) === f; }).concat([]));
      if (b && a.length === b.length) {
        var head = a.slice(0, a.length - f.length), nh = b.slice(0, b.length - f.length);
        var wrong = [nh + pick(keys.filter(function (k) { return k !== f; })), head + pick(keys.filter(function (k) { return k !== f; })), pick(FAMILIES[pick(keys.filter(function (k) { return k !== f; }))])];
        return Q({ prompt: "Change the " + head + " in " + a + " to " + nh + ". What word do you get?", visual: '<div class="en-row"><span class="en-word">' + a + '</span><span class="en-word" style="color:var(--muted)">➜</span><span class="en-word">' + nh + '<span style="color:var(--berry)">' + f + "</span></span></div>",
          speak: "Change the " + head + " in " + a + " to " + nh + ". What word do you get?", answer: b, choices: shuffle(pad4([b].concat(wrong))), cls: "en",
          explain: a + " becomes " + b + ". They're both in the " + f + " family." });
      }
    }
    var w = pick(words), other = shuffle(keys.filter(function (k) { return k !== f; })).slice(0, 3).map(function (k) { return pick(FAMILIES[k]); });
    var base = pick(words.filter(function (x) { return x !== w; }));
    return Q({ prompt: "Which word rhymes with " + base + "?", visual: '<div class="en-row"><span class="en-word">' + base + "</span>" + hear(base) + "</div>", speak: "Which word rhymes with " + base + "?",
      answer: w, choices: shuffle([w].concat(other)), cls: "en", explain: base + " and " + w + " both end in " + f + "." });
  }
  function pad4(list) {
    var out = list.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4), all = [].concat.apply([], Object.keys(FAMILIES).map(function (k) { return FAMILIES[k]; }));
    while (out.length < 4) { var y = pick(all); if (out.indexOf(y) === -1) out.push(y); }
    return out;
  }
  function letterTiles(word, extra) {
    var pool = "abcdefghijklmnoprstuvwy".split("").filter(function (c) { return word.indexOf(c) === -1; });
    return shuffle(word.split("").concat(shuffle(pool).slice(0, extra)));
  }
  function spellCVC() {
    var w = pick(CVC);
    return Q({ prompt: "Spell the word", visual: '<div class="en-row"><span class="en-pic">' + w[1] + "</span>" + hear(w[0]) + "</div>", speak: "Spell " + w[0] + ".",
      input: "tiles", tiles: letterTiles(w[0], 3), need: 3, joiner: "", answer: w[0], cls: "en",
      hint: "Say it slowly: " + w[0].split("").join(", ") + ".", explain: w[0].split("").join(", ") + " spells " + w[0] + "." });
  }
  function spellBee() {
    var w = pick(SPELL2), s = SPELL_SENT[w] ? " " + SPELL_SENT[w] + " " + w + "." : "";
    return Q({ prompt: "Listen, then spell the word", visual: '<div class="en-row">' + hear(w + "." + s) + "</div>", speak: "Spell " + w + "." + s,
      input: "tiles", tiles: letterTiles(w, Math.max(2, 7 - w.length)), need: w.length, joiner: "", answer: w, cls: "en",
      hint: "Tap 🔊 to hear it again.", explain: w + " is spelt " + w.split("").join(", ") + "." });
  }
  function missingWord() {
    var x = pick(MISSING);
    return Q({ prompt: "Which word fits?", visual: '<p class="en-sent">' + x[0].replace("___", "<u>&nbsp;?&nbsp;</u>") + "</p>", speak: x[0].replace("___", "blank") + " Which word fits?",
      answer: x[1], choices: shuffle(x[2]), cls: "en", explain: x[0].replace("___", x[1]) });
  }
  function capitals(quiz) {
    if (quiz && Math.random() < .3) {
      var qq = pick(QUESTIONS), st = shuffle(STATEMENTS).slice(0, 3);
      return Q({ prompt: "Which one needs a question mark?", visual: '<div class="en-pic">❓</div>', speak: "Which one is asking a question? It needs a question mark.",
        answer: qq, choices: shuffle([qq].concat(st)), cls: "en", explain: qq + "? It's asking something, so it ends with a question mark." });
    }
    var s = pick(GOOD_SENT), wrong = wrongVersions(s).slice(0, 3);
    return Q({ prompt: "Which one is written the right way?", visual: '<div class="en-pic">✏️</div>', speak: "Which sentence is written the right way? Look for a capital letter at the start and a full stop at the end.",
      answer: s, choices: shuffle([s].concat(wrong)), cls: "en", explain: "A sentence starts with a capital letter and ends with a full stop. Names start with a capital too." });
  }
  function plural() {
    var x = pick(PLURALS), w = x[0], pl = x[1];
    var c = [pl, w + "s", w + "es", w.replace(/y$/, "ies"), w + "ies"].filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4);
    if (c.length < 4) c.push(w + "z");
    var p = PLURAL_PIC[w] || "";
    return Q({ prompt: "One " + w + ", two ...", visual: '<div class="en-row"><span class="en-pic">' + p + '</span><span class="en-pic">' + p + p + "</span></div>", speak: "One " + w + ". Two what?",
      answer: pl, choices: shuffle(c.slice(0, 4)), cls: "en", explain: "One " + w + ", two " + pl + "." });
  }
  function pastTense() {
    var x = pick(PAST), w = x[0], p = x[1];
    var c = [p, w + "ed", w + "s", w + "ing", w.replace(/e$/, "") + "ed"].filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4);
    return Q({ prompt: "Today I " + w + ". Yesterday I ...", visual: '<p class="en-sent">Today I ' + w + ".<br>Yesterday I <u>&nbsp;?&nbsp;</u>.</p>", speak: "Today I " + w + ". Yesterday I what?",
      answer: p, choices: shuffle(c), cls: "en", explain: "Today I " + w + ". Yesterday I " + p + "." });
  }
  function opposite() {
    var x = pick(OPPOSITES), flip = Math.random() < .5, a = flip ? x[1] : x[0], b = flip ? x[0] : x[1];
    var pool = [].concat.apply([], OPPOSITES).filter(function (v) { return v !== a && v !== b; });
    return Q({ prompt: "What is the opposite of " + a + "?", visual: '<div class="en-row"><span class="en-word">' + a + "</span>" + hear(a) + "</div>", speak: "What is the opposite of " + a + "?",
      answer: b, choices: shuffle([b].concat(others(b, pool, 3))), cls: "en", explain: a + " and " + b + " are opposites." });
  }
  function wordType() {
    var t = rnd(0, 2), want = [VERBS, NOUNS, ADJS][t], rest = [VERBS, NOUNS, ADJS].filter(function (_, i) { return i !== t; });
    var name = ["a doing word (a verb)", "a naming word (a noun)", "a describing word (an adjective)"][t];
    var a = pick(want), wrong = [pick(rest[0]), pick(rest[1]), pick(rest[rnd(0, 1)])].filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    while (wrong.length < 3) { var y = pick(rest[0]); if (wrong.indexOf(y) === -1) wrong.push(y); }
    var why = ["You can " + a + ". It's something you do.", "A " + a + " is a thing. It's a naming word.", "It tells you what something is like."][t];
    return Q({ prompt: "Which word is " + name + "?", visual: '<div class="en-pic">' + ["🏃", "🏷️", "🌈"][t] + "</div>", speak: "Which word is " + name + "?",
      answer: a, choices: shuffle([a].concat(wrong)), cls: "en", explain: why });
  }
  function riddle() {
    var x = pick(RIDDLES);
    return Q({ prompt: "Read the riddle. What am I?", visual: '<div class="en-row"><p class="en-sent">' + x[0] + "</p>" + hear(x[0], true) + "</div>", speak: "Read the riddle. What am I?",
      answer: x[1], choices: shuffle(x[2]), cls: "en big", explain: x[0] + " I am " + x[1] + "!" });
  }
  function story() {
    var S = pick(STORIES), qq = pick(S.q);
    return Q({ prompt: qq[0], visual: '<div class="en-row" style="align-items:flex-start"><div class="en-story"><span class="st-title">' + S.t + "</span>" + S.s + "</div>" + hear(S.s, true) + "</div>",
      speak: "Read the story. " + qq[0], answer: qq[1], choices: shuffle(qq[2]), cls: "en", explain: "The answer is " + qq[1].replace(/\.$/, "") + ". You can always look back at the story to check!" });
  }
  function detective() {
    var x = pick(DETECTIVE);
    return Q({ prompt: x[1], visual: '<div class="en-row"><p class="en-sent">🔎 ' + x[0] + "</p>" + hear(x[0], true) + "</div>", speak: x[0] + " " + x[1],
      answer: x[2], choices: shuffle(x[3]), cls: "en", explain: "The clues tell us: " + x[2] + "." });
  }
  function makeSentence() {
    var s = pick(MAKE), words = s.split(" ");
    return Q({ prompt: "Put the words in order to make a sentence", visual: '<div class="en-row">' + hear(s, true) + '<span style="font-weight:800;color:var(--muted)">Start with the capital letter. End with the . or ?</span></div>',
      speak: "Put the words in order to make a sentence.", input: "tiles", tiles: shuffle(words), need: words.length, joiner: " ", answer: s, cls: "en",
      hint: "Which word has the capital letter? Start with that one.", explain: s });
  }

  /* ================= THE LESSONS ================= */
  var AM = ABC.slice(0, 13), NZ = ABC.slice(13);
  return {
    /* ---- Alphabet ---- */
    "abc-am": { title: "Letters A to M", emoji: "🅰️", intro: "Tap each letter to hear its name. Then find the letters in the quiz!", explorePrompt: "Tap every letter", explore: letterExplore(AM), gen: function () { return findLetter(AM); } },
    "abc-nz": { title: "Letters N to Z", emoji: "🔤", intro: "The second half of the alphabet. Tap them all!", explorePrompt: "Tap every letter", explore: letterExplore(NZ),
      gen: function (quiz) { return findLetter(quiz && Math.random() < .3 ? ABC : NZ); } },
    "abc-trace": { title: "Trace the Letters", emoji: "✍️", intro: "Use your finger to trace big and small letters.", explorePrompt: "Trace the letter", explore: traceExplore,
      gen: function () { return Math.random() < .5 ? findLetter(ABC) : findLetter(ABC, true); } },
    "abc-bigsmall": { title: "Big and Small", emoji: "🔠", intro: "Every letter has a big one and a small one. Can you match them?", gen: function () { return bigSmall(ABC); } },
    "abc-small": { title: "Small Letters", emoji: "🔡", intro: "Find the small letters. Watch out for b, d, p and q!", gen: smallLetter },
    "abc-order": { title: "ABC Order", emoji: "🚂", intro: "A, B, C... What comes next? What comes before?", gen: abcOrder },
    /* ---- Sounds and rhymes ---- */
    "first-letter": { title: "First Letter", emoji: "🐍", intro: "Snake starts with s. What do other words start with?", gen: firstLetter },
    "rhyme": { title: "Rhyme Time", emoji: "🎵", intro: "Cat and hat rhyme. They sound the same at the end!", gen: rhyme },
    "blends": { title: "sh, ch, th...", emoji: "🐑", intro: "Some words start with two letters together, like sh in sheep.", gen: blend },
    /* ---- Reading words ---- */
    "cvc": { title: "Picture Words", emoji: "🐱", intro: "Read short words like cat, dog and sun.", gen: cvcRead },
    "sight1": { title: "Sight Words 1", emoji: "👀", intro: "Words we see all the time: the, and, is, my...", gen: function () { return sight(SIGHT1); } },
    "families": { title: "Word Families", emoji: "👨‍👩‍👧", intro: "Cat, hat and bat are in the at family. Change the first letter to make new words!", gen: family },
    "sight2": { title: "Sight Words 2", emoji: "🧐", intro: "Trickier words: said, because, friend, were...", gen: function () { return sight(SIGHT2); } },
    /* ---- Spelling ---- */
    "spell-cvc": { title: "Spell It", emoji: "🧩", intro: "Hear the word and build it with letters.", gen: spellCVC },
    "spell-bee": { title: "Spelling Bee", emoji: "🐝", intro: "Listen carefully, then spell the word.", gen: spellBee },
    /* ---- Sentences ---- */
    "missing": { title: "Missing Word", emoji: "🕳️", intro: "Read the sentence. Which word fits in the gap?", gen: missingWord },
    "capitals": { title: "Capitals and Full Stops", emoji: "✏️", intro: "Sentences start with a capital letter and end with a full stop.", gen: capitals },
    "plurals": { title: "More Than One", emoji: "🐑", intro: "One cat, two cats. One mouse, two... mice!", gen: plural },
    "past": { title: "Yesterday", emoji: "⏪", intro: "Today I jump. Yesterday I jumped!", gen: pastTense },
    "opposites": { title: "Opposites", emoji: "↔️", intro: "Hot and cold. Big and small. Find the opposite!", gen: opposite },
    "wordtypes": { title: "Word Types", emoji: "🏷️", intro: "Naming words, doing words and describing words.", gen: wordType },
    /* ---- Stories ---- */
    "riddles": { title: "Riddles", emoji: "🤔", intro: "Read the clues. What am I?", gen: riddle },
    "stories": { title: "Story Time", emoji: "📚", intro: "Read a little story, then answer the questions.", gen: story },
    /* ---- Concepts ---- */
    "make-sentence": { title: "Make a Sentence", emoji: "🧱", intro: "Mixed-up words! Put them in the right order.", gen: makeSentence },
    "detective": { title: "Reading Detective", emoji: "🔎", intro: "Use the clues to work out what's going on.", gen: detective },
    /* ---- Special ---- */
    "jack-abc": { title: "Jack's ABC Adventure", emoji: "🦖", quizN: 8, intro: "A big alphabet adventure. Practise each part, then take the quiz!",
      parts: [
        { name: "Find the letter", emoji: "🔤", gen: function () { return findLetter(ABC); } },
        { name: "Big and small", emoji: "🔠", gen: function () { return bigSmall(ABC); } },
        { name: "ABC order", emoji: "🚂", gen: abcOrder },
        { name: "First letter", emoji: "🐍", gen: firstLetter }
      ] },
    "alice-reading": { title: "Alice's Reading Challenge", emoji: "🦄", quizN: 8, intro: "Spelling, tricky words and stories. Practise each part, then take the quiz!",
      parts: [
        { name: "Spelling Bee", emoji: "🐝", gen: spellBee },
        { name: "Tricky words", emoji: "🧐", gen: function () { return sight(SIGHT2); } },
        { name: "Story time", emoji: "📚", gen: story },
        { name: "Detective", emoji: "🔎", gen: detective }
      ] }
  };
};
