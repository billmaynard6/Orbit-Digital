/* All Flutes Plus — homepage interactions
   Flute artwork is drawn as inline SVG so the page works without photography.
   Swap in real product shots later by replacing the [data-flute-row] / .cat__art contents. */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;

  /* ---------- SVG flute builder ---------- */
  const H = 40;          // artwork height (viewBox units)
  const CY = 20;         // tube centre line
  const R = 6.5;         // tube radius

  const finishes = {
    silver:  { hi: '#ffffff', mid: '#cfd0da', lo: '#7d7e8e', key: '#e9e9ef', keyLo: '#9a9aab' },
    warm:    { hi: '#fffaf2', mid: '#d8d2c8', lo: '#8a8274', key: '#efebe3', keyLo: '#a39c8e' },
    gold:    { hi: '#fff4d6', mid: '#e0bf73', lo: '#8f6a22', key: '#f3dfa8', keyLo: '#b08a3c' },
    rose:    { hi: '#fff0ea', mid: '#e3b3a0', lo: '#96604e', key: '#f2d3c6', keyLo: '#b37d69' },
    grenadilla: { hi: '#6b5a66', mid: '#2e2430', lo: '#0f0a10', key: '#e9e9ef', keyLo: '#9a9aab' },
  };

  function defs(f, keyF) {
    const id = `f${++uid}`;
    const k = keyF || f;
    return {
      id,
      markup: `<defs>
        <linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${f.lo}"/><stop offset=".28" stop-color="${f.hi}"/>
          <stop offset=".55" stop-color="${f.mid}"/><stop offset="1" stop-color="${f.lo}"/>
        </linearGradient>
        <radialGradient id="${id}k" cx=".35" cy=".3" r=".8">
          <stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="${k.key}"/><stop offset="1" stop-color="${k.keyLo}"/>
        </radialGradient>
        <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${k.keyLo}"/><stop offset=".4" stop-color="#fff"/><stop offset="1" stop-color="${k.keyLo}"/>
        </linearGradient>
      </defs>`,
    };
  }

  const tube = (id, x, w, r = R) =>
    `<rect x="${x}" y="${CY - r}" width="${w}" height="${r * 2}" rx="${r * .35}" fill="url(#${id}t)"/>`;
  const ring = (id, x, w = 7, r = R + 1.3) =>
    `<rect x="${x}" y="${CY - r}" width="${w}" height="${r * 2}" rx="1.5" fill="url(#${id}r)"/>`;
  const cup = (id, x, r = 7.2, open = true) =>
    `<circle cx="${x + .8}" cy="${CY + 1.2}" r="${r}" fill="rgba(20,10,30,.28)"/>` +
    `<circle cx="${x}" cy="${CY}" r="${r}" fill="url(#${id}k)" stroke="rgba(40,30,60,.45)" stroke-width=".7"/>` +
    `<circle cx="${x}" cy="${CY}" r="${r * .78}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width=".6"/>` +
    (open ? `<circle cx="${x}" cy="${CY}" r="${r * .36}" fill="#241733" stroke="rgba(255,255,255,.5)" stroke-width=".5"/>` : '');
  const rod = (id, x1, x2, y = CY + R + 2.2) =>
    `<rect x="${x1}" y="${y - 1}" width="${x2 - x1}" height="2" rx="1" fill="url(#${id}r)"/>`;
  const post = (id, x, y = CY + R + 2.2) =>
    `<rect x="${x - 1.8}" y="${y - 2.5}" width="3.6" height="5" rx="1" fill="url(#${id}r)"/>`;

  // Each part returns [markup, width]
  function headPart(id, { len = 300, r = R, lip = 'self' } = {}) {
    const lipId = lip === 'self' ? id : lip;
    return [
      tube(id, 10, len - 10, r) +
      `<rect x="0" y="${CY - r - 1.6}" width="14" height="${(r + 1.6) * 2}" rx="4" fill="url(#${id}r)"/>` +
      `<g transform="translate(${len * .24} ${CY})">
         <ellipse rx="17" ry="${r + 3.5}" fill="url(#${lipId}k)" stroke="rgba(0,0,0,.2)" stroke-width=".6"/>
         <ellipse rx="6.5" ry="3.4" fill="#1d1226"/>
         <ellipse rx="5" ry="1.6" cy="-.8" fill="rgba(255,255,255,.15)"/>
       </g>` +
      ring(id, len - 8),
      len,
    ];
  }

  function bodyPart(id, { len = 420, r = R, keys = 11 } = {}) {
    let m = tube(id, 0, len, r) + ring(id, 0) + ring(id, len - 7);
    m += rod(id, 22, len - 26) + post(id, 22) + post(id, len * .5) + post(id, len - 26);
    // Trill keys (small, on the far side)
    m += `<circle cx="${len * .2}" cy="${CY - r - 1}" r="2.6" fill="url(#${id}k)"/>`;
    m += `<circle cx="${len * .27}" cy="${CY - r - 1}" r="2.6" fill="url(#${id}k)"/>`;
    const start = 40, end = len - 40, step = (end - start) / (keys - 1);
    for (let i = 0; i < keys; i++) {
      const gap = i >= keys / 2 ? 10 : 0; // left / right hand split
      m += cup(id, start + i * step * .94 + gap, i % 4 === 3 ? 5.8 : 7.2, i % 4 !== 3);
    }
    return [m, len];
  }

  function footPart(id, { len = 170, r = R, keys = 3 } = {}) {
    let m = tube(id, 0, len, r) + ring(id, 0) + ring(id, len - 7, 7);
    m += rod(id, 18, len - 20) + post(id, 18) + post(id, len - 20);
    for (let i = 0; i < keys; i++) m += cup(id, 40 + i * ((len - 70) / Math.max(1, keys - 1)), 7.4, false);
    m += `<rect x="${len - 48}" y="${CY + r + 3}" width="18" height="4" rx="2" fill="url(#${id}r)"/>`; // roller
    return [m, len];
  }

  /** Full flute. orientation: 'h' (head on the left) or 'v' (head at top). */
  function flute({ finish = 'silver', keyFinish, lipFinish, scale = 1, keys, orientation = 'h', cls = '' } = {}) {
    const f = finishes[finish];
    const d = defs(f, keyFinish && finishes[keyFinish]);
    let lipId = 'self', lipDefs = '';
    if (lipFinish) { const ld = defs(finishes[lipFinish]); lipId = ld.id; lipDefs = ld.markup; }
    const r = R * (scale > 1 ? 1 + (scale - 1) * .6 : 1);
    const [hm, hw] = headPart(d.id, { len: 300 * scale, r, lip: lipId });
    const [bm, bw] = bodyPart(d.id, { len: 420 * scale, r, keys: keys ?? 11 });
    const [fm, fw] = footPart(d.id, { len: 170 * scale, r, keys: scale < .7 ? 1 : 3 });
    const L = hw + bw + fw;
    const g = `<g>${hm}</g><g transform="translate(${hw} 0)">${bm}</g><g transform="translate(${hw + bw} 0)">${fm}</g>`;
    if (orientation === 'v') {
      return `<svg class="flute-v ${cls}" viewBox="0 0 ${H} ${L}" preserveAspectRatio="xMidYMax meet" role="presentation">${d.markup}${lipDefs}<g transform="translate(${H} 0) rotate(90)">${g}</g></svg>`;
    }
    return `<svg class="flute-h ${cls}" viewBox="0 0 ${L} ${H}" role="presentation">${d.markup}${lipDefs}${g}</svg>`;
  }

  function partSvg(kind) {
    const d = defs(finishes.silver);
    const [m, w] = kind === 'head' ? headPart(d.id) : kind === 'body' ? bodyPart(d.id) : footPart(d.id);
    return `<svg viewBox="0 0 ${w} ${H}" role="presentation">${d.markup}${m}</svg>`;
  }

  /* ---------- Render artwork ---------- */
  // Hero display case: a staggered row of upright flutes, echoing the shop's velvet stand
  document.querySelectorAll('[data-flute-row]').forEach((row) => {
    const n = Number(row.dataset.count || 7);
    const looks = ['silver', 'silver', 'gold', 'silver', 'rose', 'silver', 'warm'];
    const heights = [.92, .98, .9, 1, .94, .88, .96];
    row.innerHTML = Array.from({ length: n }, (_, i) =>
      flute({ finish: looks[i % looks.length] === 'gold' || looks[i % looks.length] === 'rose' ? 'silver' : looks[i % looks.length],
              lipFinish: looks[i % looks.length] === 'gold' ? 'gold' : looks[i % looks.length] === 'rose' ? 'rose' : undefined,
              orientation: 'v' })
    ).join('');
    const zoom = Number(row.dataset.zoom || 1);
    [...row.children].forEach((el, i) => {
      el.style.height = `${heights[i % heights.length] * 100 * zoom}%`;
      el.style.marginTop = `${(1 - heights[i % heights.length]) * 60}%`;
      el.dataset.depth = (i % 3) + 1;
    });
  });

  const catLooks = {
    student:      { finish: 'silver' },
    intermediate: { finish: 'silver', lipFinish: 'gold' },
    professional: { finish: 'rose', keyFinish: 'rose' },
    piccolo:      { finish: 'grenadilla', keyFinish: 'silver', scale: .52, keys: 8 },
    alto:         { finish: 'silver', scale: 1.18 },
    preowned:     { finish: 'warm' },
  };
  document.querySelectorAll('.cat').forEach((el) => {
    el.querySelector('.cat__art').innerHTML = flute(catLooks[el.dataset.flute] || {});
  });

  document.querySelectorAll('[data-part]').forEach((el) => { el.innerHTML = partSvg(el.dataset.part); });

  /* ---------- Hero entrance ---------- */
  const heroFlutes = document.querySelectorAll('.case__flutes .flute-v');
  heroFlutes.forEach((el, i) => {
    if (reduceMotion) return;
    el.animate(
      [{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 1400, delay: 200 + i * 110, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
    );
  });

  /* ---------- Reveal on scroll (staggered per group) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const sibs = [...e.target.parentElement.querySelectorAll(':scope > .reveal')];
      e.target.style.setProperty('--d', `${Math.max(0, sibs.indexOf(e.target)) * 0.09}s`);
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- Scroll-driven effects ---------- */
  const header = document.querySelector('.header');
  const story = document.querySelector('.story');
  const parts = {
    head: document.querySelector('[data-part="head"]'),
    body: document.querySelector('[data-part="body"]'),
    foot: document.querySelector('[data-part="foot"]'),
  };
  const steps = [...document.querySelectorAll('.story__step')];
  const rig = document.querySelector('.story__rig');
  const word = document.querySelector('[data-word]');
  const words = ['Headjoint', 'Body', 'Foot joint', 'Complete'];
  // Camera path: focus point (share of stage width) and zoom for each step
  const shots = [[0.2, 2.2], [0.565, 1.9], [0.865, 2.6], [0.5, 1]];
  const lerp = (a, b, t) => a + (b - a) * t;
  let lastIdx = -1;
  const bar = document.querySelector('.story__progress span');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function updateStory() {
    const rect = story.getBoundingClientRect();
    const total = story.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / total);
    const stageW = parts.head.parentElement.offsetWidth;

    // Each part glides in during its own window, then all three close together.
    const inP = (a) => ease(clamp((p - a) / 0.2));
    const join = ease(clamp((p - 0.66) / 0.2));
    const spread = (1 - join) * stageW * 0.035;
    const cfg = [
      ['head', 0.0, -1, -1],
      ['body', 0.2, 0, 1],
      ['foot', 0.4, 1, -1],
    ];
    cfg.forEach(([k, a, dir, vy]) => {
      const t = reduceMotion ? 1 : inP(a);
      const x = (1 - t) * dir * stageW * 0.12 + dir * spread;
      const y = (1 - t) * vy * 60 + (1 - join) * vy * 14;
      const rot = (1 - t) * dir * 8 + (1 - join) * dir * 2;
      parts[k].style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      parts[k].style.opacity = reduceMotion ? 1 : clamp(t * 1.4);
    });

    const idx = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.66 ? 2 : 3;
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    if (idx !== lastIdx) {
      word.classList.add('is-swapping');
      setTimeout(() => { word.textContent = words[idx]; word.classList.remove('is-swapping'); }, lastIdx < 0 ? 0 : 250);
      lastIdx = idx;
    }

    // Glide the camera between shots; smaller zoom on narrow screens
    const bounds = [0, 0.2, 0.4, 0.66];
    const from = shots[Math.max(0, idx - 1)], to = shots[idx];
    const t = idx === 0 ? 1 : ease(clamp((p - bounds[idx]) / 0.12));
    const zoomCap = window.innerWidth < 700 ? 1.6 : 1;
    const focus = lerp(from[0], to[0], t);
    const zoom = 1 + (lerp(from[1], to[1], t) - 1) * zoomCap;
    if (!reduceMotion) rig.style.transform = `scale(${zoom}) translateX(${(0.5 - focus) * stageW}px)`;
    bar.style.transform = `scaleX(${p})`;
  }

  function updateHeroParallax() {
    if (reduceMotion) return;
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    heroFlutes.forEach((el) => {
      el.style.transform = `translateY(${-y * 0.04 * el.dataset.depth}px)`;
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
      updateStory();
      updateHeroParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Announcement bar ---------- */
  const items = [...document.querySelectorAll('.announce__item')];
  let current = 0, timer;
  function show(next) {
    const prev = items[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    setTimeout(() => prev.classList.remove('is-leaving'), 500);
    current = (next + items.length) % items.length;
    items[current].classList.add('is-active');
  }
  const cycle = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 5000); };
  document.querySelectorAll('[data-announce]').forEach((b) =>
    b.addEventListener('click', () => { show(current + (b.dataset.announce === 'next' ? 1 : -1)); cycle(); })
  );
  if (!reduceMotion) cycle();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.has-menu > a').forEach((a) => a.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    e.preventDefault();
    a.parentElement.classList.toggle('is-open');
  }));
  nav.addEventListener('click', (e) => {
    if (e.target.matches('a') && !e.target.parentElement.classList.contains('has-menu')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  /* ---------- Chat bubble ---------- */
  const bubble = document.querySelector('.chat__bubble');
  setTimeout(() => bubble.classList.add('is-visible'), 2500);
  // Keep small screens clear: tuck the greeting away after a few seconds
  if (window.innerWidth < 700) setTimeout(() => bubble.classList.remove('is-visible'), 9000);
  bubble.querySelector('.chat__close').addEventListener('click', () => bubble.remove());

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
