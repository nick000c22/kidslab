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
  function star(cx, cy, r, fill, stroke) {
    var p = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + p.join(" ") + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"' : "") + "/>";
  }
  // A held toy drawn with an emoji, sitting in the right paw.
  function held(emoji, size, dx, dy) {
    return '<text x="' + (164 + (dx || 0)) + '" y="' + (196 + (dy || 0)) + '" text-anchor="middle" dominant-baseline="central" font-size="' + (size || 40) + '">' + emoji + "</text>";
  }
  function beads(fill, stroke, r) {
    var o = "";
    for (var i = 0; i <= 10; i++) {
      var t = i / 10, x = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * 100 + t * t * 138, y = (1 - t) * (1 - t) * 130 + 2 * (1 - t) * t * 156 + t * t * 130;
      o += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r || 5) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="1.2"' : "") + "/>";
    }
    return o;
  }
  var ballet = '<path d="M48 226 Q48 210 72 210 Q96 210 96 226 Q96 236 72 236 Q48 236 48 226 Z" fill="#F9A8D4"/><path d="M60 212 Q72 196 84 212 M58 200 L86 222" stroke="#EC4899" stroke-width="2.5" fill="none"/><circle cx="72" cy="214" r="3.5" fill="#EC4899"/>';
  var sparkleShoe = '<path d="M46 224 Q46 206 70 207 Q93 208 98 222 Q98 234 72 234 Q46 234 46 224 Z" fill="#C084FC"/><g fill="#FFFFFF"><circle cx="60" cy="216" r="2"/><circle cx="74" cy="222" r="2"/><circle cx="86" cy="215" r="2"/><circle cx="66" cy="228" r="1.6"/><circle cx="82" cy="229" r="1.6"/></g><path d="M66 208 L74 202 L80 210 Z" fill="#F472B6"/>';
  var footyBoot = '<path d="M46 222 Q46 204 70 205 Q93 206 98 220 L98 228 H46 Z" fill="#111827"/><path d="M56 212 L84 212" stroke="#FACC15" stroke-width="3"/><g fill="#9CA3AF"><rect x="52" y="228" width="5" height="6"/><rect x="66" y="228" width="5" height="6"/><rect x="80" y="228" width="5" height="6"/></g>';
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
    glitter: { name: "Glitter pink", fur: "#F9A8D4", dark: "#EC4899", light: "#FCE7F3", price: 80, sparkle: true },
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
  /* ---- sparkle & princess (style: "girl" shows these first) ---- */
  ITEMS.push(
    { id: "bigbow", slot: "hat", style: "girl", name: "Big pink bow", icon: "🎀", price: 5,
      svg: '<g transform="translate(126 34) rotate(18)"><path d="M0 0 L-26 -15 Q-33 0 -26 15 Z M0 0 L26 -15 Q33 0 26 15 Z" fill="#F472B6" stroke="#DB2777" stroke-width="2.5" stroke-linejoin="round"/><path d="M-4 4 L-12 26 M4 4 L12 26" stroke="#F472B6" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="#EC4899"/></g>' },
    { id: "tiara", slot: "hat", style: "girl", name: "Princess tiara", icon: "👸", price: 15,
      svg: '<path d="M66 44 Q100 30 134 44 L130 26 L117 37 L100 8 L83 37 L70 26 Z" fill="#E6EAF0" stroke="#AEB6C4" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="22" r="6" fill="#EC4899"/><circle cx="80" cy="34" r="3.5" fill="#8CC8FF"/><circle cx="120" cy="34" r="3.5" fill="#8CC8FF"/><circle cx="70" cy="28" r="2.5" fill="#FFFFFF"/><circle cx="130" cy="28" r="2.5" fill="#FFFFFF"/>' },
    { id: "bunnyears", slot: "hat", style: "girl", name: "Bunny ears", icon: "🐰", price: 20,
      svg: '<g fill="#FFFFFF" stroke="#E5B8CB" stroke-width="2.5"><ellipse cx="80" cy="0" rx="12" ry="34" transform="rotate(-12 80 0)"/><ellipse cx="120" cy="0" rx="12" ry="34" transform="rotate(12 120 0)"/></g><g fill="#F9A8D4"><ellipse cx="80" cy="3" rx="5" ry="22" transform="rotate(-12 80 3)"/><ellipse cx="120" cy="3" rx="5" ry="22" transform="rotate(12 120 3)"/></g><path d="M60 46 Q100 22 140 46" stroke="#F472B6" stroke-width="7" fill="none" stroke-linecap="round"/>' },
    { id: "flowerclip", slot: "hat", style: "girl", name: "Daisy hair clip", icon: "🌼", price: 8,
      svg: flower(130, 40, "#FFFFFF", 7) + flower(70, 40, "#FDE68A", 5) },
    { id: "catglasses", slot: "face", style: "girl", name: "Cat-eye glasses", icon: "😺", price: 12,
      svg: '<g fill="rgba(255,255,255,.3)" stroke="#EC4899" stroke-width="4" stroke-linejoin="round"><path d="M66 72 Q80 64 96 70 Q94 88 80 88 Q66 88 66 72 Z"/><path d="M104 70 Q120 64 134 72 Q134 88 120 88 Q106 88 104 70 Z"/></g><path d="M66 72 L56 62 M134 72 L144 62 M96 76 H104" stroke="#EC4899" stroke-width="4" stroke-linecap="round"/>' + star(58, 62, 4, "#FDE68A") + star(142, 62, 4, "#FDE68A") },
    { id: "starglasses", slot: "face", style: "girl", name: "Star glasses", icon: "🌟", price: 15,
      svg: star(82, 78, 17, "#FDE047", "#EAB308") + star(118, 78, 17, "#FDE047", "#EAB308") + '<path d="M96 78 H104 M66 74 L54 68 M134 74 L146 68" stroke="#EAB308" stroke-width="3.5" stroke-linecap="round"/>' },
    { id: "lipstick", slot: "face", style: "girl", name: "Pink lip gloss", icon: "💄", price: 5,
      svg: '<path d="M88 108 Q100 119 112 108 Q100 114 88 108 Z" fill="#EC4899" stroke="#DB2777" stroke-width="3" stroke-linejoin="round"/><circle cx="66" cy="102" r="9" fill="#F472B6" opacity=".55"/><circle cx="134" cy="102" r="9" fill="#F472B6" opacity=".55"/>' },
    { id: "pearls", slot: "neck", style: "girl", name: "Pearl necklace", icon: "🦪", price: 10, svg: beads("#FFFFFF", "#D1D5DB", 5.5) },
    { id: "heartlocket", slot: "neck", style: "girl", name: "Heart locket", icon: "💖", price: 15,
      svg: '<path d="M64 130 Q100 154 136 130" stroke="#EAB308" stroke-width="2.5" fill="none"/><path d="' + heart(100, 156) + '" fill="#EC4899" stroke="#BE185D" stroke-width="2"/>' },
    { id: "tutu", slot: "body", style: "girl", name: "Ballet tutu", icon: "🩰", price: 20,
      svg: '<path d="M44 184 Q100 172 156 184 L170 212 Q100 228 30 212 Z" fill="#FBCFE8" stroke="#F472B6" stroke-width="2"/><path d="M48 194 Q100 184 152 194 L162 214 Q100 226 38 214 Z" fill="#F9A8D4"/><g fill="#FFFFFF"><circle cx="70" cy="204" r="2"/><circle cx="100" cy="208" r="2"/><circle cx="130" cy="204" r="2"/><circle cx="86" cy="214" r="1.6"/><circle cx="116" cy="214" r="1.6"/></g>' },
    { id: "ballgown", slot: "body", style: "girl", name: "Sparkly ball gown", icon: "👗", price: 45,
      svg: '<path d="M64 140 Q100 130 136 140 L172 222 Q100 240 28 222 Z" fill="#C084FC" stroke="#9333EA" stroke-width="2.5"/><path d="M70 170 Q100 182 130 170 L150 222 Q100 232 50 222 Z" fill="#D8B4FE" opacity=".8"/><path d="M64 140 Q100 152 136 140" stroke="#F0ABFC" stroke-width="6" fill="none"/>' + star(84, 196, 5, "#FFFFFF") + star(118, 206, 4, "#FFFFFF") + star(100, 170, 4, "#FFFFFF") + star(64, 214, 3, "#FFFFFF") + star(138, 216, 3, "#FFFFFF") },
    { id: "princesscape", slot: "back", style: "girl", name: "Princess cape", icon: "🩷", price: 25,
      svg: '<path d="M64 128 Q100 120 136 128 L170 224 Q100 240 30 224 Z" fill="#F472B6"/><path d="M64 128 Q100 120 136 128 L140 140 Q100 132 60 140 Z" fill="#DB2777"/>' + star(46, 206, 6, "#FDE68A") + star(154, 206, 6, "#FDE68A") + star(40, 180, 4, "#FFFFFF") + star(160, 180, 4, "#FFFFFF") },
    { id: "butterfly", slot: "back", style: "girl", name: "Butterfly wings", icon: "🦋", price: 35,
      svg: '<g stroke="#7C3AED" stroke-width="2.5" stroke-linejoin="round"><path d="M70 150 Q18 80 8 140 Q12 176 70 168 Z" fill="#F0ABFC"/><path d="M130 150 Q182 80 192 140 Q188 176 130 168 Z" fill="#F0ABFC"/><path d="M72 170 Q30 186 40 216 Q62 220 78 184 Z" fill="#A5B4FC"/><path d="M128 170 Q170 186 160 216 Q138 220 122 184 Z" fill="#A5B4FC"/></g><g fill="#FFFFFF"><circle cx="34" cy="132" r="7"/><circle cx="166" cy="132" r="7"/><circle cx="52" cy="200" r="4"/><circle cx="148" cy="200" r="4"/></g>' },
    { id: "handbag", slot: "hand", style: "girl", name: "Pink handbag", icon: "👛", price: 15,
      svg: '<path d="M152 178 Q166 156 180 178" stroke="#DB2777" stroke-width="4" fill="none"/><rect x="146" y="176" width="40" height="30" rx="9" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/><path d="M146 188 H186" stroke="#FBCFE8" stroke-width="3"/><circle cx="166" cy="188" r="4.5" fill="#FDE68A"/>' },
    { id: "unicornplush", slot: "hand", style: "girl", name: "Unicorn cuddly", icon: "🦄", price: 20, svg: held("🦄", 44, 2, -4) },
    { id: "bouquet", slot: "hand", style: "girl", name: "Flower bouquet", icon: "💐", price: 8, svg: held("💐", 42, 0, -6) },
    { id: "mirror", slot: "hand", style: "girl", name: "Hand mirror", icon: "🪞", price: 10,
      svg: '<path d="M160 198 L168 170" stroke="#EC4899" stroke-width="6" stroke-linecap="round"/><ellipse cx="171" cy="154" rx="16" ry="20" fill="#F472B6"/><ellipse cx="171" cy="154" rx="11" ry="15" fill="#E0F2FE"/><path d="M165 146 L170 141" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>' },
    { id: "balletslippers", slot: "feet", style: "girl", name: "Ballet slippers", icon: "🩰", price: 15, svg: ballet + mirror(ballet) },
    { id: "sparkleshoes", slot: "feet", style: "girl", name: "Sparkly shoes", icon: "👠", price: 20, svg: sparkleShoe + mirror(sparkleShoe) }
  );

  /* ---- action & adventure (style: "boy" shows these first) ---- */
  ITEMS.push(
    { id: "eyepatch", slot: "face", style: "boy", name: "Pirate eye patch", icon: "🏴‍☠️", price: 5,
      svg: '<path d="M52 60 L148 96" stroke="#15151B" stroke-width="3.5"/><ellipse cx="118" cy="79" rx="16" ry="14" fill="#15151B"/><path d="M110 74 L114 70" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>' },
    { id: "ninjaband", slot: "hat", style: "boy", name: "Ninja headband", icon: "🥷", price: 8,
      svg: '<path d="M50 56 Q100 40 150 56 L150 68 Q100 52 50 68 Z" fill="#DC2626"/><path d="M150 58 L176 48 L170 62 Z M150 64 L178 76 L166 82 Z" fill="#DC2626"/><circle cx="100" cy="51" r="6" fill="#FFFFFF"/>' },
    { id: "firehelmet", slot: "hat", style: "boy", name: "Firefighter helmet", icon: "🚒", price: 20,
      svg: '<path d="M60 50 Q100 2 140 50 Z" fill="#DC2626"/><path d="M46 50 Q100 62 154 50 L154 57 Q100 70 46 57 Z" fill="#B91C1C"/><path d="M92 18 L108 18 L106 40 L94 40 Z" fill="#FBBF24"/><path d="M100 4 V48" stroke="#991B1B" stroke-width="3"/>' },
    { id: "policecap", slot: "hat", style: "boy", name: "Police cap", icon: "👮", price: 15,
      svg: '<path d="M60 44 Q100 8 140 44 Z" fill="#1E3A8A"/><path d="M58 44 H142 V52 H58 Z" fill="#111827"/><path d="M64 52 Q100 66 136 52 Z" fill="#111827"/>' + star(100, 30, 8, "#FBBF24", "#B45309") },
    { id: "dinospikes", slot: "hat", style: "boy", name: "Dino spikes", icon: "🦕", price: 15,
      svg: '<path d="M60 44 L66 22 L78 38 L88 10 L100 32 L112 10 L122 38 L134 22 L140 44 Z" fill="#22C55E" stroke="#15803D" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: "viking", slot: "hat", style: "boy", name: "Viking helmet", icon: "🪓", price: 30,
      svg: '<path d="M56 56 Q100 0 144 56 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="3"/><path d="M56 54 H144" stroke="#B45309" stroke-width="8"/><path d="M100 10 V54" stroke="#6B7280" stroke-width="3"/><path d="M60 44 Q34 32 38 2 Q50 28 68 34 Z M140 44 Q166 32 162 2 Q150 28 132 34 Z" fill="#FFF7E0" stroke="#D6C7A1" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: "armyhelmet", slot: "hat", style: "boy", name: "Camo helmet", icon: "🪖", price: 20,
      svg: '<path d="M52 54 Q100 -4 148 54 Z" fill="#4D7C0F"/><g fill="#365314"><ellipse cx="80" cy="34" rx="10" ry="6"/><ellipse cx="116" cy="26" rx="9" ry="5"/><ellipse cx="128" cy="44" rx="8" ry="5"/></g><g fill="#A16207"><ellipse cx="96" cy="44" rx="9" ry="5"/><ellipse cx="68" cy="48" rx="6" ry="4"/></g>' },
    { id: "binoculars", slot: "neck", style: "boy", name: "Binoculars", icon: "🔭", price: 15,
      svg: '<path d="M70 130 L88 160 M130 130 L112 160" stroke="#3F2A14" stroke-width="3"/><rect x="80" y="156" width="17" height="24" rx="5" fill="#1F2937"/><rect x="103" y="156" width="17" height="24" rx="5" fill="#1F2937"/><rect x="95" y="162" width="10" height="8" fill="#374151"/><circle cx="88.5" cy="180" r="6" fill="#60A5FA"/><circle cx="111.5" cy="180" r="6" fill="#60A5FA"/>' },
    { id: "sheriff", slot: "body", style: "boy", name: "Sheriff badge", icon: "⭐", price: 10,
      svg: star(78, 166, 15, "#FBBF24", "#B45309") + '<circle cx="78" cy="166" r="5" fill="#B45309"/>' },
    { id: "jersey", slot: "body", style: "boy", name: "Footy jersey", icon: "🏉", price: 30,
      svg: '<path d="M58 142 Q100 128 142 142 L152 204 Q100 220 48 204 Z" fill="#111827"/><path d="M58 142 L40 170 L54 178 L64 160 M142 142 L160 170 L146 178 L136 160" fill="#111827"/><path d="M84 136 L100 150 L116 136" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linejoin="round"/><text x="100" y="182" text-anchor="middle" dominant-baseline="central" font-family="Baloo 2, sans-serif" font-weight="800" font-size="32" fill="#FFFFFF">9</text>' },
    { id: "herosuit", slot: "body", style: "boy", name: "Superhero suit", icon: "⚡", price: 35,
      svg: '<path d="M58 142 Q100 128 142 142 L152 206 Q100 222 48 206 Z" fill="#DC2626"/><path d="M48 194 Q100 210 152 194 L152 206 Q100 222 48 206 Z" fill="#1D4ED8"/><path d="M106 150 L88 180 L102 180 L94 204 L116 170 L102 170 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="2" stroke-linejoin="round"/>' },
    { id: "shield", slot: "back", style: "boy", name: "Knight shield", icon: "🛡️", price: 25,
      svg: '<path d="M10 148 Q36 136 62 148 Q62 192 36 212 Q10 192 10 148 Z" fill="#2563EB" stroke="#FBBF24" stroke-width="4"/><path d="M36 150 V204 M16 170 H56" stroke="#FBBF24" stroke-width="6"/>' },
    { id: "dinotail", slot: "back", style: "boy", name: "Dinosaur tail", icon: "🦖", price: 25,
      svg: '<path d="M136 196 Q172 196 200 168 Q194 206 140 222 Z" fill="#22C55E" stroke="#15803D" stroke-width="2.5" stroke-linejoin="round"/><path d="M152 197 L158 184 L166 194 L174 180 L180 189 L188 174 L192 182" fill="none" stroke="#15803D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' },
    { id: "laser", slot: "hand", style: "boy", name: "Laser blaster", icon: "🔫", price: 25,
      svg: '<g transform="rotate(-12 166 190)"><rect x="146" y="178" width="44" height="17" rx="7" fill="#2563EB"/><rect x="186" y="182" width="16" height="9" rx="3" fill="#60A5FA"/><rect x="154" y="192" width="12" height="20" rx="4" fill="#1E3A8A"/><rect x="160" y="172" width="18" height="7" rx="3" fill="#F97316"/><circle cx="205" cy="186.5" r="5" fill="#A7F3D0"/><circle cx="205" cy="186.5" r="9" fill="#A7F3D0" opacity=".35"/></g>' },
    { id: "waterblaster", slot: "hand", style: "boy", name: "Water blaster", icon: "💦", price: 20,
      svg: '<g transform="rotate(-8 166 190)"><rect x="144" y="180" width="46" height="15" rx="7" fill="#F97316"/><rect x="186" y="183" width="14" height="8" rx="3" fill="#FACC15"/><circle cx="160" cy="174" r="11" fill="#22C55E" stroke="#15803D" stroke-width="2"/><rect x="152" y="192" width="11" height="18" rx="4" fill="#EA580C"/></g><g fill="#60A5FA"><circle cx="206" cy="182" r="3"/><circle cx="212" cy="178" r="2.2"/><circle cx="214" cy="186" r="1.8"/></g>' },
    { id: "sword", slot: "hand", style: "boy", name: "Pirate sword", icon: "🗡️", price: 20,
      svg: '<path d="M160 190 Q170 150 192 112 Q182 152 168 194 Z" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/><path d="M150 192 Q164 186 178 196" stroke="#FBBF24" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M160 196 L156 212" stroke="#7C2D12" stroke-width="7" stroke-linecap="round"/>' },
    { id: "rugbyball", slot: "hand", style: "boy", name: "Rugby ball", icon: "🏉", price: 10, svg: held("🏉", 40, 2, -4) },
    { id: "soccerball", slot: "hand", style: "boy", name: "Soccer ball", icon: "⚽", price: 10, svg: held("⚽", 38, 2, -2) },
    { id: "toycar", slot: "hand", style: "boy", name: "Race car", icon: "🏎️", price: 15, svg: held("🏎️", 40, 4, -2) },
    { id: "trex", slot: "hand", style: "boy", name: "Toy T-rex", icon: "🦖", price: 15, svg: held("🦖", 42, 2, -6) },
    { id: "footyboots", slot: "feet", style: "boy", name: "Footy boots", icon: "🥾", price: 15, svg: footyBoot + mirror(footyBoot) },
    { id: "skateboard", slot: "feet", style: "boy", name: "Skateboard", icon: "🛹", price: 25,
      svg: '<rect x="36" y="232" width="128" height="9" rx="4.5" fill="#F97316"/><path d="M40 236 Q36 230 42 228 M160 236 Q164 230 158 228" stroke="#F97316" stroke-width="6" stroke-linecap="round"/><circle cx="58" cy="246" r="6" fill="#1F2937"/><circle cx="142" cy="246" r="6" fill="#1F2937"/><path d="M60 236 H140" stroke="#FDBA74" stroke-width="2"/>' }
  );

  var BY_ID = {};
  ITEMS.forEach(function (it) { BY_ID[it.id] = it; });

  var SLOTS = [
    { id: "hat", name: "Hats" }, { id: "face", name: "Faces" }, { id: "neck", name: "Necks" }, { id: "body", name: "Outfits" },
    { id: "back", name: "Backs" }, { id: "hand", name: "In his paw" }, { id: "feet", name: "Feet" }
  ];

  window.TeddyItems = { FURS: FURS, ITEMS: ITEMS, BY_ID: BY_ID, SLOTS: SLOTS };
})();
