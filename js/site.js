/* Tina Chao's portfolio: the shared script for every page.
   Each page has one .view: the homepage, the About page, or a case study.
   Every part below checks that its pieces are on the page before it runs. */
document.documentElement.lang = 'en';
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const view = document.querySelector('.view');
  const isHome = !!view && view.id === 'homeView';
  const hero = document.querySelector('.hero');
  const heroArt = document.getElementById('heroArt');

  /* ---- mobile menu ---- */
  const menuBtn = document.getElementById('menuBtn'), links = document.getElementById('navLinks');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => { const o = links.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); });
    links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---- scroll: nav state, hero parallax, car ---- */
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('solid', !hero || y > (hero.offsetHeight - 90));
    if (hero && heroArt && !reduce && y < hero.offsetHeight * 1.2) heroArt.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.04)`;
    moveCar(); spyToc(); spyNav();
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---- on the homepage, the nav marks the section you're in.
     About and the case studies mark their nav link in the page itself. ---- */
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const navSpots = ['work', 'process', 'studio', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  let navAt = '';
  function markNav(href, kind) {
    if (href === navAt) return;
    navAt = href;
    navLinks.forEach(a => { if (href && a.getAttribute('href') === href) a.setAttribute('aria-current', kind); else a.removeAttribute('aria-current'); });
  }
  function spyNav() {
    if (!isHome) return;
    const line = innerHeight * .4;
    let at = '';
    navSpots.forEach(el => { if (el.getBoundingClientRect().top <= line) at = '#' + el.id; });
    if (at === '#contact' || innerHeight + scrollY >= document.documentElement.scrollHeight - 4) at = '';   // the merge sign has its own button
    markNav(at, 'location');
  }

  /* ---- rain over the painting ---- */
  const cv = document.getElementById('rain'), cx = cv ? cv.getContext('2d') : null;
  let drops = [], rainOn = false, raf = 0;
  function sizeRain() {
    if (!cx || !hero) return;
    const r = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * dpr; cv.height = r.height * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(r.width / 9);
    drops = Array.from({ length: n }, () => ({ x: Math.random() * r.width, y: Math.random() * r.height, l: 10 + Math.random() * 22, v: 7 + Math.random() * 8, a: .08 + Math.random() * .16 }));
  }
  function rain() {
    const w = cv.width / (Math.min(devicePixelRatio || 1, 2)), h = cv.height / (Math.min(devicePixelRatio || 1, 2));
    cx.clearRect(0, 0, w, h); cx.lineCap = 'round';
    for (const d of drops) {
      cx.strokeStyle = `rgba(255, 244, 228, ${d.a})`; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(d.x, d.y); cx.lineTo(d.x - d.l * .22, d.y + d.l); cx.stroke();
      d.y += d.v; d.x -= d.v * .22;
      if (d.y > h) { d.y = -d.l; d.x = Math.random() * (w + 60); }
    }
    raf = rainOn ? requestAnimationFrame(rain) : 0;
  }
  if (cx && hero && !reduce) {
    sizeRain();
    new IntersectionObserver(([e]) => { rainOn = e.isIntersecting; if (rainOn && !raf) raf = requestAnimationFrame(rain); }).observe(hero);
  }

  /* ---- the highway (homepage) ---- */
  const wrap = document.getElementById('roadWrap'), svg = document.getElementById('roadSvg'), carSvg = document.getElementById('carSvg');
  const P = { shoulder: document.getElementById('roadShoulder'), asphalt: document.getElementById('roadAsphalt'), glow: document.getElementById('roadGlow'), dash: document.getElementById('roadDash') };
  const car = document.getElementById('car');
  const hasRoad = !!(wrap && svg && carSvg && car && P.asphalt);
  let roadLen = 0;
  function catmull(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function layoutRoad() {
    if (!hasRoad) return;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !H) return;
    [svg, carSvg].forEach(s => { s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('viewBox', `0 0 ${W} ${H}`); });
    const narrow = W < 760, wr = wrap.getBoundingClientRect();
    const mid = narrow ? 36 : W / 2;
    const pts = [[mid, 0]];
    wrap.querySelectorAll('.stop').forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const y = r.top - wr.top + r.height * .5;
      const x = narrow ? mid + (i % 2 ? 9 : -9) : (s.classList.contains('left') ? W / 2 + W * .045 : W / 2 - W * .045);
      pts.push([x, y]);
    });
    pts.push([mid, H - 6]);
    const d = catmull(pts);
    Object.values(P).forEach(p => p.setAttribute('d', d));
    const wRoad = narrow ? 40 : 70;
    P.shoulder.setAttribute('stroke-width', wRoad + 26);
    P.asphalt.setAttribute('stroke-width', wRoad);
    P.glow.setAttribute('stroke-width', wRoad * .45);
    P.dash.setAttribute('stroke-width', narrow ? 3 : 4);
    roadLen = P.asphalt.getTotalLength();
    car.setAttribute('transform', `scale(${narrow ? .75 : 1})`);
    moveCar();
  }
  function moveCar() {
    if (!hasRoad || !roadLen) return;
    const r = wrap.getBoundingClientRect();
    let t = (innerHeight * .55 - r.top) / r.height;
    t = Math.min(1, Math.max(0, t));
    const L = t * roadLen, a = P.asphalt.getPointAtLength(L), b = P.asphalt.getPointAtLength(Math.min(roadLen, L + 2));
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI || 90;
    const s = wrap.clientWidth < 760 ? .75 : 1;
    car.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${s})`);
  }

  /* ---- copy email (homepage) ---- */
  const copyBtn = document.getElementById('copyEmail'), emailText = document.getElementById('emailText');
  if (copyBtn && emailText) copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = 'Copied'; setTimeout(() => copyBtn.textContent = 'Copy email', 1800); };
    const fallback = () => { const s = getSelection(), rg = document.createRange(); rg.selectNodeContents(emailText); s.removeAllRanges(); s.addRange(rg); copyBtn.textContent = 'Selected, press copy'; setTimeout(() => copyBtn.textContent = 'Copy email', 2400); };
    try { navigator.clipboard.writeText(emailText.textContent.trim()).then(done, fallback); } catch (e) { fallback(); }
  });

  /* ---- music: one audio element shared by every player and the record player ---- */
  const audio = new Audio(); audio.preload = 'none';
  const playBtns = [...document.querySelectorAll('button[data-src]')];
  const nows = [...document.querySelectorAll('[data-now]')];
  const msgs = [...document.querySelectorAll('.player-msg')];
  const tracks = {};
  playBtns.forEach(b => { const t = tracks[b.dataset.src] || (tracks[b.dataset.src] = { title: b.dataset.title, cover: '' }); if (b.dataset.cover) t.cover = b.dataset.cover; });
  const tt = document.getElementById('turntable'), discLabel = document.getElementById('discLabel'), arm = document.getElementById('tonearm'), ttPlay = document.getElementById('ttPlay');
  let curSrc = null;
  const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  const say = t => msgs.forEach(m => { m.textContent = t; });
  function start(src) {
    if (src !== curSrc) { curSrc = src; audio.src = src; }
    say('');
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(err => { if (!err || err.name !== 'AbortError') say('That song didn\'t start. Press play again.'); syncPlayers(); });
    syncPlayers();
  }
  function syncPlayers() {
    const playing = !!curSrc && !audio.paused && !audio.ended;
    const t = curSrc ? tracks[curSrc] : null;
    playBtns.forEach(b => {
      const mine = b.dataset.src === curSrc, on = mine && playing;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      const sr = b.querySelector('.sr-only'); if (sr) sr.textContent = (on ? 'Pause ' : 'Play ') + b.dataset.title;
      const row = b.closest('.trk'); if (row) row.classList.toggle('current', mine);
      b.classList.toggle('on-deck', mine);
    });
    nows.forEach(n => {
      n.classList.toggle('active', !!t);
      n.querySelector('.now-title').textContent = t ? (playing ? 'Now playing: ' : 'Paused: ') + t.title : 'Press play on a song';
      const seek = n.querySelector('.seek');
      seek.disabled = !t || !audio.duration;
      if (audio.duration) seek.value = Math.round(audio.currentTime / audio.duration * 1000);
      n.querySelector('.now-time').textContent = t ? fmt(audio.currentTime) + (audio.duration ? ' / ' + fmt(audio.duration) : '') : '0:00';
    });
    if (tt) {
      tt.classList.toggle('loaded', !!t);
      tt.classList.toggle('spinning', playing);
      if (t) {
        discLabel.style.backgroundImage = t.cover ? 'url("' + t.cover + '")' : '';
        discLabel.classList.toggle('painted', !t.cover);
        discLabel.dataset.title = t.title;
      }
      const prog = audio.duration ? audio.currentTime / audio.duration : 0;
      arm.style.transform = t ? 'rotate(' + (32 + 18 * prog).toFixed(2) + 'deg)' : '';
      ttPlay.setAttribute('aria-pressed', playing ? 'true' : 'false');
      ttPlay.querySelector('.sr-only').textContent = t ? (playing ? 'Pause ' : 'Play ') + t.title : 'Play a record';
    }
  }
  playBtns.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.src === curSrc && !audio.paused) { audio.pause(); return; }
    start(b.dataset.src);
  }));
  if (ttPlay) ttPlay.addEventListener('click', () => {
    if (!curSrc) { const first = document.querySelector('button.sleeve[data-src]'); if (first) start(first.dataset.src); return; }
    if (audio.paused) start(curSrc); else audio.pause();
  });
  ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => audio.addEventListener(ev, syncPlayers));
  audio.addEventListener('error', () => { if (curSrc) say('That recording couldn\'t load. Check your connection and press play again.'); syncPlayers(); });
  nows.forEach(n => n.querySelector('.seek').addEventListener('input', e => { if (audio.duration) audio.currentTime = e.target.value / 1000 * audio.duration; }));

  /* ---- on this page: a route card listing the sections of the About page or a case study ---- */
  const LIST_ICON = '<svg viewBox="0 0 26 18" aria-hidden="true"><path d="M10 3h13M10 9h13M10 15h13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="4.5" cy="3" r="1.9" fill="currentColor"/><circle cx="4.5" cy="9" r="1.9" fill="currentColor"/><circle cx="4.5" cy="15" r="1.9" fill="currentColor"/></svg>';
  const slug = t => t.toLowerCase().replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const tocList = [];
  if (view && !isHome) {
    view.querySelectorAll(':scope > section.mile, :scope > [data-toc]').forEach(el => {
      let label = el.dataset.toc || '', n = '';
      if (!label) {
        const tab = el.querySelector(':scope > .mile-tab .tabtext'), m = tab && tab.textContent.trim().match(/^Mile\s+(\d+)\s*·\s*(.+)$/);
        if (m) { n = m[1]; label = m[2]; } else { const h = el.querySelector('h2'); label = h ? h.textContent.trim() : ''; }
      }
      if (!label) return;
      let id = el.id;
      if (el.tagName === 'HEADER') id = view.id;
      else if (!id) { const base = view.id + '-' + slug(label); id = base; for (let k = 2; document.getElementById(id); k++) id = base + '-' + k; el.id = id; }
      tocList.push({ el, label, n, id });
    });
  }
  let toc = null, tocBtn = null, tocItems = [];
  if (tocList.length) {
    toc = document.createElement('div');
    toc.className = 'toc';
    toc.innerHTML = '<button class="toc-toggle" type="button" aria-expanded="false" aria-controls="tocPanel">' + LIST_ICON + '<span>On this page</span></button>'
      + '<nav class="toc-panel" id="tocPanel" aria-label="On this page"><p class="toc-head">' + LIST_ICON + '<span>on this page</span></p><ol class="toc-list"></ol></nav>';
    document.body.appendChild(toc);
    tocBtn = toc.querySelector('.toc-toggle');
    const list = toc.querySelector('.toc-list');
    tocItems = tocList.map(it => {
      const li = document.createElement('li'), a = document.createElement('a'), mk = document.createElement('span'), lb = document.createElement('span');
      a.href = '#' + it.id;
      mk.className = 'toc-mk' + (it.n ? '' : ' dot'); mk.setAttribute('aria-hidden', 'true'); mk.textContent = it.n;
      lb.className = 'toc-lb'; lb.textContent = it.label;
      a.append(mk, lb); li.append(a); list.append(li);
      return { el: it.el, a };
    });
    tocBtn.addEventListener('click', () => { const o = toc.classList.toggle('open'); tocBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    list.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a) return;
      closeToc();
      if (a.getAttribute('href') === location.hash) {   // already there: just drive back to it
        e.preventDefault();
        const el = document.getElementById(location.hash.slice(1));
        if (el && el.classList.contains('view')) scrollTo({ top: 0 }); else if (el) el.scrollIntoView();
      }
    });
    document.addEventListener('click', e => { if (toc.classList.contains('open') && !toc.contains(e.target)) closeToc(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && toc.classList.contains('open')) closeToc(true); });
  }
  function spyToc() {
    if (!tocItems.length) return;
    const line = innerHeight * .32;
    let cur = 0;
    tocItems.forEach((it, i) => { if (it.el.getBoundingClientRect().top <= line) cur = i; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = tocItems.length - 1;
    tocItems.forEach((it, i) => { if (i === cur) it.a.setAttribute('aria-current', 'location'); else it.a.removeAttribute('aria-current'); });
  }
  function closeToc(refocus) {
    if (!toc || !toc.classList.contains('open')) return;
    toc.classList.remove('open'); tocBtn.setAttribute('aria-expanded', 'false');
    if (refocus) tocBtn.focus();
  }

  /* ---- boot ---- */
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layoutRoad(); if (!reduce) sizeRain(); }, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutRoad);
  addEventListener('load', layoutRoad);
  // a link to a section the route card names (e.g. argus.html#argus-reflection) arrives before that id exists
  if (location.hash) { const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el) requestAnimationFrame(() => el.scrollIntoView()); }
  onScroll(); layoutRoad();
})();
