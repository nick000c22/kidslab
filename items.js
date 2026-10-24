/* Math Teddy's things: fur colours, star prizes and shop items, each with its drawing.
   Drawings use the teddy's own coordinates (viewBox 0 -20 200 260): head centre (100,84) r51,
   eyes at y78, nose (100,95), neck y≈132, body centre (100,178), right paw ≈(159,194), feet at y≈222.
   slot: hat | face | neck | back | hand | feet.  Star prizes have `stars`; shop items have `price` (grapes). */
(function () {
  function flower(x, y, petal, r) {
    r = r || 6;
    var o = '<g fill="' + petal + '">';
    for (var i = 0; i < 5; i++) { var a = (i / 5) * Math.PI * 2; o += '<circle cx="' + (x + Math.cos(a) * r).toFixed(1) + '" cy="' + (y + Math.sin(a) * r).toFixed(1) + '" r="' + r * 0.8 + '"/>'; }
    return o + '</g><circle cx="' + x + '" cy="' + y + '" r="' + r * 0.6 + '" fill="#F6C453"/>';
  }
  function mirror(svg) { return '<g transform="translate(200 0) scale(-1 1)">' + svg + "</g>"; }
  function heart(cx, cy) {
    return "M" + cx + " " + (cy + 11) + " L" + (cx - 12) + " " + (cy - 1) + " A6.5 6.5 0 0 1 " + cx + " " + (cy - 8) + " A6.5 6.5 0 0 1 " + (cx + 12) + " " + (cy - 1) + " Z";
  }
  function grapeBeads() {
    var o = "";
    for (var i = 0; i <= 8; i++) {
      var t = i / 8, x = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * 100 + t * t * 138, y = (1 - t) * (1 - t) * 130 + 2 * (1 - t) * t * 156 + t * t * 130;
      o += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" fill="#8A5FCB" stroke="#5B2E95" stroke-width="1.5"/>';
    }
    return o;
  }
  var INK = "#2B1A10";
  var sneaker = '<path d="M46 224 Q46 206 70 207 Q93 208 98 222 Q98 234 72 234 Q46 234 46 224 Z" fill="#EF476F"/><path d="M48 228 H96" stroke="#fff" stroke-width="3"/><path d="M62 212 L74 218 M66 208 L78 214" stroke="#fff" stroke-width="2.5"/>';
  var boot = '<path d="M54 196 H90 V220 Q99 222 99 232 H47 Q46 222 54 220 Z" fill="#F2C230" stroke="#C99A12" stroke-width="2.5" stroke-linejoin="round"/><path d="M54 202 H90" stroke="#C99A12" stroke-width="2"/>';
  var skate = '<path d="M46 222 Q46 204 70 205 Q93 206 98 220 L98 228 H46 Z" fill="#8A5FCB"/><path d="M46 228 H98" stroke="#3A3F55" stroke-width="4"/><circle cx="56" cy="236" r="6" fill="#F2C230"/><circle cx="72" cy="236" r="6" fill="#F2C230"/><circle cx="88" cy="236" r="6" fill="#F2C230"/>';
  var dragon = '<path d="M68 150 L10 102 L22 134 L2 140 L24 158 L10 176 L66 172 Z" fill="#3AAA69" stroke="#2A7F4E" stroke-width="3" stroke-linejoin="round"/><path d="M66 156 L22 134 M64 166 L24 158" stroke="#2A7F4E" stroke-width="2"/>';

  var FURS = {
    brown: { name: "Brown", fur: "#A86B3C", dark: "#8E5830", light: "#E7B98A" },
    honey: { name: "Honey", fur: "#D9963B", dark: "#B87A28", light: "#F6D7A0" },
    cocoa: { name: "Cocoa", fur: "#6E4429", dark: "#573420", light: "#C99A72" },
    grey: { name: "Grey", fur: "#9097A3", dark: "#737A86", light: "#DCDFE5" },
    polar: { name: "Polar", fur: "#F1EEE6", dark: "#D3CEC2", light: "#FFFFFF", outline: "#CFC9BC" },
    pink: { name: "Pink", fur: "#EE9BB5", dark: "#D97C9B", light: "#FBD9E4" },
    lilac: { name: "Lilac", fur: "#B596E0", dark: "#9878C8", light: "#E7DBF7" },
    mint: { name: "Mint", fur: "#7FC9A8", dark: "#5FAE8C", light: "#D3F0E2" },
    sky: { name: "Sky", fur: "#7DB6E8", dark: "#5E99CF", light: "#D6EAFA" },
    gold: { name: "Gold", fur: "#E8B923", dark: "#C99A12", light: "#FBE7A1", price: 100, sparkle: true },
    rainbow: { name: "Rainbow", fur: "rainbow", dark: "#8A5FCB", light: "#FFFFFF", price: 150, sparkle: true }
  };

  var ITEMS = [
    // ---- star prizes (unlock by stars, free) ----
    { id: "glasses", slot: "face", name: "Glasses", icon: "👓", stars: 20,
      svg: '<g fill="rgba(255,255,255,.25)" stroke="' + INK + '" stroke-width="4"><circle cx="82" cy="78" r="14"/><circle cx="118" cy="78" r="14"/></g><path d="M96 78 H104 M68 74 L54 68 M132 74 L146 68" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' },
    { id: "bowtie", slot: "neck", name: "Bow tie", icon: "🎀", stars: 40,
      svg: '<path d="M100 136 L78 124 L78 148 Z M100 136 L122 124 L122 148 Z" fill="#6E44A8"/><circle cx="100" cy="136" r="7" fill="#8A5FCB"/>' },
    { id: "scarf", slot: "neck", name: "Scarf", icon: "🧣", stars: 80,
      svg: '<path d="M60 128 Q100 146 140 128 L142 142 Q100 160 58 142 Z" fill="#2F9358"/><path d="M118 140 L132 186 L116 188 L108 146 Z" fill="#2F9358"/><path d="M60 133 Q100 151 140 133" stroke="#E9A21F" stroke-width="4" fill="none"/>' },
    { id: "cape", slot: "back", name: "Super cape", icon: "🦸", stars: 110,
      svg: '<path d="M64 128 Q100 120 136 128 L166 222 Q100 236 34 222 Z" fill="#D4466F"/><path d="M64 128 Q100 120 136 128 L140 140 Q100 132 60 140 Z" fill="#B2345A"/>' },
    { id: "grapehat", slot: "hat", name: "Grape hat", icon: "🍇", stars: 180,
      svg: '<g fill="#8A5FCB" stroke="#5B2E95" stroke-width="2"><circle cx="82" cy="34" r="11"/><circle cx="100" cy="30" r="12"/><circle cx="118" cy="34" r="11"/><circle cx="91" cy="18" r="11"/><circle cx="109" cy="18" r="11"/><circle cx="100" cy="6" r="10"/></g><path d="M100 -4 Q114 -14 126 -6 Q114 4 100 -4 Z" fill="#3AAA69"/>' },
    { id: "crown", slot: "hat", name: "Crown", icon: "👑", stars: 250,
      svg: '<path d="M68 42 L74 12 L88 30 L100 4 L112 30 L126 12 L132 42 Z" fill="#F2C230" stroke="#C99A12" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="30" r="5" fill="#D4466F"/><circle cx="82" cy="34" r="4" fill="#2F7FC6"/><circle cx="118" cy="34" r="4" fill="#2F9358"/>' },

    // ---- shop: hats ----
    { id: "partyhat", slot: "hat", name: "Party hat", icon: "🥳", price: 5,
      svg: '<path d="M78 42 L100 -8 L122 42 Z" fill="#E9A21F"/><path d="M89 17 H111 M84 30 H116" stroke="#D4466F" stroke-width="6"/><circle cx="100" cy="-10" r="8" fill="#2F7FC6"/>' },
    { id: "flowers", slot: "hat", name: "Flower crown", icon: "🌸", price: 10,
      svg: '<path d="M58 50 Q100 18 142 50" stroke="#3AAA69" stroke-width="4" fill="none"/>' + flower(62, 48, "#F7A8C4") + flower(80, 36, "#FFFFFF") + flower(100, 32, "#C3A2EC") + flower(120, 36, "#FFFFFF") + flower(138, 48, "#F7A8C4") },
    { id: "cowboy", slot: "hat", name: "Cowboy hat", icon: "🤠", price: 20,
      svg: '<ellipse cx="100" cy="38" rx="66" ry="11" fill="#9C6A3A"/><path d="M70 38 Q72 0 100 4 Q128 0 130 38 Z" fill="#B57D45"/><path d="M71 30 Q100 36 129 30 L130 38 Q100 44 70 38 Z" fill="#5A3A1C"/>' },
    { id: "chef", slot: "hat", name: "Chef hat", icon: "🧑‍🍳", price: 20,
      svg: '<g fill="#FFFFFF" stroke="#D6D6D6" stroke-width="2"><circle cx="80" cy="12" r="15"/><circle cx="120" cy="12" r="15"/><circle cx="100" cy="2" r="18"/><rect x="74" y="18" width="52" height="22" rx="4"/></g><path d="M78 20 H122" stroke="#FFFFFF" stroke-width="6"/>' },
    { id: "pirate", slot: "hat", name: "Pirate hat", icon: "🏴‍☠️", price: 30,
      svg: '<path d="M54 44 Q100 -14 146 44 Q100 30 54 44 Z" fill="#1E1E28"/><path d="M54 44 Q100 30 146 44" stroke="#E9A21F" stroke-width="3" fill="none"/><circle cx="100" cy="20" r="7" fill="#FFFFFF"/><path d="M93 30 L107 36 M107 30 L93 36" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>' },
    { id: "wizard", slot: "hat", name: "Wizard hat", icon: "🧙", price: 40,
      svg: '<ellipse cx="100" cy="38" rx="60" ry="10" fill="#3B4FB8"/><path d="M72 38 Q96 20 104 -30 Q112 10 128 38 Z" fill="#4A62D8"/><path d="M92 8 l3 7 7 0 -6 4 2 7 -6 -4 -6 4 2 -7 -6 -4 7 0 Z M110 22 l2 5 5 0 -4 3 2 5 -5 -3 -4 3 1 -5 -4 -3 5 0 Z" fill="#F2C230"/>' },
    { id: "unicorn", slot: "hat", name: "Unicorn horn", icon: "🦄", price: 50,
      svg: '<path d="M92 38 L100 -14 L108 38 Z" fill="#F6D16B" stroke="#E2B23E" stroke-width="2" stroke-linejoin="round"/><path d="M93 28 L107 23 M95 15 L105 11 M97 3 L103 0" stroke="#E2B23E" stroke-width="2.5"/>' + flower(66, 42, "#F7A8C4", 5) + flower(134, 42, "#C3A2EC", 5) },
    { id: "astronaut", slot: "hat", name: "Space helmet", icon: "🧑‍🚀", price: 90,
      svg: '<circle cx="100" cy="82" r="66" fill="rgba(200,230,255,.3)" stroke="#E6EAF0" stroke-width="8"/><path d="M60 54 Q70 34 92 28" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/><rect x="70" y="140" width="60" height="12" rx="6" fill="#C9CED8"/><circle cx="150" cy="40" r="5" fill="#EF476F"/>' },

    // ---- shop: faces ----
    { id: "moustache", slot: "face", name: "Moustache", icon: "🥸", price: 5,
      svg: '<path d="M100 101 Q90 95 80 101 Q72 108 64 99 Q68 113 84 111 Q94 109 100 104 Q106 109 116 111 Q132 113 136 99 Q128 108 120 101 Q110 95 100 101 Z" fill="#3B2414"/>' },
    { id: "sunnies", slot: "face", name: "Sunglasses", icon: "🕶️", price: 10,
      svg: '<rect x="66" y="68" width="30" height="20" rx="8" fill="#15151B"/><rect x="104" y="68" width="30" height="20" rx="8" fill="#15151B"/><path d="M96 75 H104 M66 72 L52 66 M134 72 L148 66" stroke="#15151B" stroke-width="4" stroke-linecap="round"/><path d="M71 73 L80 73 M109 73 L118 73" stroke="#FFFFFF" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>' },
    { id: "heartglasses", slot: "face", name: "Heart glasses", icon: "😍", price: 15,
      svg: '<g fill="#EF476F" stroke="#B2345A" stroke-width="2.5" stroke-linejoin="round"><path d="' + heart(82, 77) + '"/><path d="' + heart(118, 77) + '"/></g><path d="M94 76 H106 M70 74 L54 68 M130 74 L146 68" stroke="#B2345A" stroke-width="3.5" stroke-linecap="round"/>' },
    { id: "heromask", slot: "face", name: "Hero mask", icon: "🎭", price: 20,
      svg: '<path fill="#2F7FC6" fill-rule="evenodd" d="M56 72 Q100 56 144 72 L140 90 Q120 94 104 86 L100 88 L96 86 Q80 94 60 90 Z M73 78 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 Z M109 78 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 Z"/><path d="M144 72 L162 64 L158 80 Z" fill="#2F7FC6"/>' },

    // ---- shop: neck ----
    { id: "bandana", slot: "neck", name: "Bandana", icon: "🧣", price: 10,
      svg: '<path d="M62 128 Q100 140 138 128 L100 170 Z" fill="#D4466F"/><g fill="#FFFFFF"><circle cx="88" cy="140" r="2.5"/><circle cx="110" cy="141" r="2.5"/><circle cx="99" cy="153" r="2.5"/></g>' },
    { id: "grapebeads", slot: "neck", name: "Grape necklace", icon: "📿", price: 15, svg: grapeBeads() },
    { id: "medal", slot: "neck", name: "Gold medal", icon: "🏅", price: 25,
      svg: '<path d="M84 128 L96 162 M116 128 L104 162" stroke="#2F7FC6" stroke-width="7"/><circle cx="100" cy="168" r="14" fill="#F2C230" stroke="#C99A12" stroke-width="3"/><text x="100" y="169" text-anchor="middle" dominant-baseline="central" font-family="Baloo 2, sans-serif" font-size="15" font-weight="800" fill="#8A6A00">1</text>' },

    // ---- shop: back ----
    { id: "fairywings", slot: "back", name: "Fairy wings", icon: "🧚", price: 35,
      svg: '<g fill="rgba(190,220,255,.8)" stroke="#9EC5F0" stroke-width="2"><path d="M70 150 Q20 88 16 150 Q20 186 70 170 Z"/><path d="M130 150 Q180 88 184 150 Q180 186 130 170 Z"/><path d="M72 172 Q36 200 44 216 Q62 216 76 182 Z"/><path d="M128 172 Q164 200 156 216 Q138 216 124 182 Z"/></g>' },
    { id: "dragonwings", slot: "back", name: "Dragon wings", icon: "🐉", price: 60, svg: dragon + mirror(dragon) },
    { id: "jetpack", slot: "back", name: "Jetpack", icon: "🚀", price: 75,
      svg: '<g fill="#9AA3B2" stroke="#6B7383" stroke-width="2.5"><rect x="38" y="128" width="28" height="64" rx="13"/><rect x="134" y="128" width="28" height="64" rx="13"/></g><path class="flame" d="M42 192 Q52 230 62 192 Z M138 192 Q148 230 158 192 Z" fill="#F2A33A"/><path class="flame" d="M47 192 Q52 214 57 192 Z M143 192 Q148 214 153 192 Z" fill="#FFE27A"/>' },

    // ---- shop: in his paw ----
    { id: "balloon", slot: "hand", name: "Balloon", icon: "🎈", price: 5,
      svg: '<path d="M159 194 Q168 140 176 74" stroke="#555" stroke-width="2" fill="none"/><ellipse cx="178" cy="48" rx="21" ry="26" fill="#EF476F"/><path d="M174 73 L182 73 L178 80 Z" fill="#EF476F"/><ellipse cx="171" cy="39" rx="5" ry="8" fill="#FFFFFF" opacity=".5"/>' },
    { id: "lolly", slot: "hand", name: "Lollipop", icon: "🍭", price: 5,
      svg: '<path d="M160 196 L166 152" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><circle cx="168" cy="134" r="19" fill="#9AE0C2"/><path d="M168 134 m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -7 -7" stroke="#EF476F" stroke-width="4" fill="none"/>' },
    { id: "icecream", slot: "hand", name: "Ice cream", icon: "🍦", price: 10,
      svg: '<path d="M149 186 L171 186 L160 218 Z" fill="#D9A15B" stroke="#B57D45" stroke-width="2"/><circle cx="160" cy="178" r="12" fill="#F7B6C8"/><circle cx="160" cy="163" r="10" fill="#FFF4DE"/><circle cx="160" cy="150" r="4" fill="#D4466F"/>' },
    { id: "calculator", slot: "hand", name: "Calculator", icon: "🧮", price: 15,
      svg: '<rect x="148" y="166" width="32" height="44" rx="6" fill="#3A3F55"/><rect x="152" y="170" width="24" height="10" rx="2" fill="#CFDDAE"/><g fill="#E6EAF0"><circle cx="157" cy="187" r="3"/><circle cx="164" cy="187" r="3"/><circle cx="171" cy="187" r="3"/><circle cx="157" cy="195" r="3"/><circle cx="164" cy="195" r="3"/><circle cx="171" cy="195" r="3"/><circle cx="157" cy="203" r="3"/><circle cx="164" cy="203" r="3"/></g><circle cx="171" cy="203" r="3" fill="#E9A21F"/>' },
    { id: "wand", slot: "hand", name: "Magic wand", icon: "🪄", price: 25,
      svg: '<path d="M158 196 L184 132" stroke="#3B2414" stroke-width="5" stroke-linecap="round"/><path d="M187 104 l5 12 13 1 -10 8 4 13 -12 -7 -11 7 3 -13 -10 -8 13 -1 Z" fill="#F2C230" stroke="#C99A12" stroke-width="2" stroke-linejoin="round"/>' },

    // ---- shop: feet ----
    { id: "gumboots", slot: "feet", name: "Gumboots", icon: "🥾", price: 10, svg: boot + mirror(boot) },
    { id: "sneakers", slot: "feet", name: "Sneakers", icon: "👟", price: 15, svg: sneaker + mirror(sneaker) },
    { id: "skates", slot: "feet", name: "Roller skates", icon: "🛼", price: 30, svg: skate + mirror(skate) }
  ];
  var BY_ID = {};
  ITEMS.forEach(function (it) { BY_ID[it.id] = it; });

  var SLOTS = [
    { id: "hat", name: "Hats" }, { id: "face", name: "Faces" }, { id: "neck", name: "Necks" },
    { id: "back", name: "Backs" }, { id: "hand", name: "In his paw" }, { id: "feet", name: "Feet" }
  ];

  window.TeddyItems = { FURS: FURS, ITEMS: ITEMS, BY_ID: BY_ID, SLOTS: SLOTS };
})();
