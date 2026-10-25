/* Learning stats on the kid's home screen, under the Maths / Science buttons.
   KidsProgress.render(box, playerId) draws a panel with a Maths / Science switch:
   this week vs last week, accuracy by topic (weakest first), where mistakes come from,
   and the most recent wrong answers. Reads the teddy doc (stats, days, mistakes) that
   KidsLab.recordAnswer fills in during lessons. */
(function () {
  var K = window.KidsLab, P = window.KidsPet;
  if (!K || !P) return;
  var LEVELS = [
    { min: 85, name: "Strong", color: "var(--leaf)", icon: "✓" },
    { min: 70, name: "Getting there", color: "var(--sun)", icon: "~" },
    { min: 0, name: "Needs work", color: "var(--berry)", icon: "!" }
  ];
  function level(acc) { for (var i = 0; i < LEVELS.length; i++) if (acc >= LEVELS[i].min) return LEVELS[i]; return LEVELS[2]; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var chosen = null;
  try { chosen = sessionStorage.getItem("kidslab.statsSubject"); } catch (e) {}

  function render(box, playerId) {
    var C = K.config, subjects = C.subjects && C.subjects.length ? C.subjects : [{ id: "maths", title: "Maths", emoji: "🔢" }];
    if (!chosen || !subjects.some(function (s) { return s.id === chosen; })) chosen = subjects[0].id;
    box.innerHTML = "";
    var head = el("div", "ks-head");
    head.appendChild(el("h2", "ks-title", "📊 How I'm going"));
    var tabs = el("div", "ks-tabs");
    subjects.forEach(function (s) {
      var b = el("button", "ks-tab" + (s.id === chosen ? " on" : ""), s.emoji + " " + s.title);
      b.type = "button";
      b.addEventListener("click", function () { chosen = s.id; try { sessionStorage.setItem("kidslab.statsSubject", s.id); } catch (e) {} render(box, playerId); });
      tabs.appendChild(b);
    });
    head.appendChild(tabs);
    box.appendChild(head);

    var pet = P.load(playerId), stats = pet.stats || {}, days = pet.days || {};
    var lessons = (C.lessons || []).filter(function (l) { return (l.subject || "maths") === chosen && (!l.players || l.players.indexOf(playerId) !== -1); });
    var byId = {}; lessons.forEach(function (l) { byId[l.id] = l; });
    function groupOf(l) {
      if (l.topic) { var t = (C.topics || []).filter(function (x) { return x.id === l.topic; })[0]; return t ? t.emoji + " " + t.title : l.topic; }
      return (l.section === "Special" ? "🌟 " : "💡 ") + l.title;
    }
    var groups = {}, order = [];
    Object.keys(stats).forEach(function (id) {
      if (!byId[id]) return; // other subject
      var g = groupOf(byId[id]), st = stats[id], t = (st.r || 0) + (st.w || 0);
      if (!groups[g]) { groups[g] = { r: 0, w: 0, lessons: [] }; order.push(g); }
      groups[g].r += st.r || 0; groups[g].w += st.w || 0;
      if (t) groups[g].lessons.push(byId[id].title + " " + Math.round((st.r || 0) / t * 100) + "%");
    });
    var now = new Date(), wk = { r: 0, w: 0 }, prev = { r: 0, w: 0 };
    Object.keys(days).forEach(function (k) {
      var age = Math.floor((now - new Date(k + "T12:00:00")) / 864e5), bucket = age < 7 ? wk : age < 14 ? prev : null;
      if (!bucket) return;
      Object.keys(days[k]).forEach(function (id) { if (!byId[id]) return; bucket.r += days[k][id].r || 0; bucket.w += days[k][id].w || 0; });
    });
    var allR = 0, allW = 0; order.forEach(function (g) { allR += groups[g].r; allW += groups[g].w; });
    var accWk = wk.r + wk.w ? Math.round(wk.r / (wk.r + wk.w) * 100) : null, accPrev = prev.r + prev.w ? Math.round(prev.r / (prev.r + prev.w) * 100) : null;

    var grid = el("div", "ks-grid"); box.appendChild(grid);
    if (!allR && !allW) {
      var none = el("div", "ks-card wide");
      none.appendChild(el("p", "ks-none", "No answers yet. Do some lessons and your stats will show up here!"));
      grid.appendChild(none);
      return;
    }

    // 1. Headline numbers
    var c1 = el("div", "ks-card"); c1.appendChild(el("h3", null, "This week"));
    var tiles = el("div", "ks-tiles"); c1.appendChild(tiles);
    function tile(big, label, note, cls) {
      var t = el("div", "ks-tile"); t.appendChild(el("b", null, big)); t.appendChild(el("span", null, label));
      if (note) t.appendChild(el("em", cls || null, note));
      tiles.appendChild(t);
    }
    tile(String(wk.r + wk.w), "answers", accPrev === null ? "" : (prev.r + prev.w) + " last week");
    tile(accWk === null ? "–" : accWk + "%", "right", accWk === null || accPrev === null ? "" : (accWk >= accPrev ? "▲ " : "▼ ") + Math.abs(accWk - accPrev) + " vs last week", accWk === null || accPrev === null ? "" : accWk >= accPrev ? "up" : "down");
    tile(Math.round(allR / (allR + allW) * 100) + "%", "right ever", (allR + allW) + " answers");
    grid.appendChild(c1);

    // 2. Accuracy by topic, weakest first
    var c2 = el("div", "ks-card"); c2.appendChild(el("h3", null, "Topics"));
    c2.appendChild(el("p", "ks-sub", "Weakest first. Topics with fewer than 5 answers are left out."));
    var ranked = order.filter(function (g) { return groups[g].r + groups[g].w >= 5; })
      .map(function (g) { var t = groups[g].r + groups[g].w; return { g: g, acc: Math.round(groups[g].r / t * 100), t: t, w: groups[g].w, lessons: groups[g].lessons }; })
      .sort(function (a, b) { return a.acc - b.acc; });
    if (!ranked.length) c2.appendChild(el("p", "ks-none", "Not enough answers yet."));
    ranked.forEach(function (x) {
      var L = level(x.acc);
      c2.appendChild(bar(x.g, x.acc, x.acc + "%", L.color, L.icon + " " + L.name + " · " + (x.t - x.w) + " right, " + x.w + " wrong"));
    });
    var key = el("div", "ks-key");
    LEVELS.forEach(function (L) { var k = el("span"); var i = el("i"); i.style.background = L.color; k.appendChild(i); k.appendChild(document.createTextNode(L.name)); key.appendChild(k); });
    c2.appendChild(key);
    grid.appendChild(c2);

    // 3. Where the mistakes come from
    var c3 = el("div", "ks-card"); c3.appendChild(el("h3", null, "Where the mistakes are"));
    var mis = order.map(function (g) { return { g: g, w: groups[g].w, t: groups[g].r + groups[g].w }; }).filter(function (x) { return x.w; }).sort(function (a, b) { return b.w - a.w; });
    if (!mis.length) c3.appendChild(el("p", "ks-none", "No mistakes yet. Wow!"));
    var maxW = mis.length ? mis[0].w : 1;
    mis.slice(0, 6).forEach(function (x) { c3.appendChild(bar(x.g, x.w / maxW * 100, Math.round(x.w / allW * 100) + "%", "var(--grape)", x.w + " wrong out of " + x.t)); });
    grid.appendChild(c3);

    // 4. Recent wrong answers in this subject
    var list = (pet.mistakes || []).filter(function (m) { return byId[m.l]; }).slice().reverse().slice(0, 12);
    if (list.length) {
      var c4 = el("div", "ks-card wide"); c4.appendChild(el("h3", null, "Ones to practise"));
      c4.appendChild(el("p", "ks-sub", "Recent wrong answers, newest first."));
      var ml = el("div", "ks-mist"); c4.appendChild(ml);
      list.forEach(function (m) {
        var row = el("div", "ks-mrow");
        row.appendChild(el("span", "ks-mq", m.q));
        var a = el("span", "ks-ma"); a.appendChild(document.createTextNode("said ")); a.appendChild(el("s", null, m.g)); a.appendChild(document.createTextNode(" · answer ")); a.appendChild(el("b", null, m.a));
        row.appendChild(a);
        row.appendChild(el("span", "ks-ml", byId[m.l].title + " · " + new Date(m.at).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })));
        ml.appendChild(row);
      });
      grid.appendChild(c4);
    }
  }
  function bar(name, pct, value, color, detail) {
    var row = el("div", "ks-row");
    row.appendChild(el("span", "ks-rn", name));
    var tr = el("span", "ks-track"), f = el("span", "ks-fill"); f.style.width = Math.max(2, pct) + "%"; f.style.background = color; tr.appendChild(f);
    row.appendChild(tr);
    row.appendChild(el("span", "ks-rv", value));
    row.appendChild(el("span", "ks-rd", detail));
    return row;
  }
  window.KidsProgress = { render: render };
})();
