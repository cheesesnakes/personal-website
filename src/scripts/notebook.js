// Theme toggle, index tabs that follow the scroll, and the reef toy.

const root = document.documentElement;

const listeners = [];

const onTheme = (fn) => listeners.push(fn);

const setupTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}

  const btn = document.getElementById('theme');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const dark = current ? current === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    listeners.forEach((fn) => fn());
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => listeners.forEach((fn) => fn()));
};

const setupTabs = () => {
  const tabs = [...document.querySelectorAll('.tabs a')];
  if (!tabs.length) return;

  const byId = Object.fromEntries(tabs.map((a) => [a.getAttribute('href').slice(1), a]));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const tab = byId[e.target.dataset.tab || e.target.id];
      if (!tab) return;
      tabs.forEach((a) => a.removeAttribute('aria-current'));
      tab.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
};

const setupReef = () => {
  const cv = document.getElementById('reef');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pred = { x: -999, y: -999, on: false };
  let W = 0, H = 0, ink = '#1D5566', muted = '#56635D', flee = 110, fish = [], visible = true;

  const readColors = () => {
    const s = getComputedStyle(root);
    ink = s.getPropertyValue('--ballpoint').trim() || ink;
    muted = s.getPropertyValue('--muted').trim() || muted;
  };

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = () => {
    fish = Array.from({ length: 38 }, () => {
      const a = Math.random() * 6.28;
      return { x: W * .3 + Math.random() * W * .4, y: H * .3 + Math.random() * H * .4, vx: Math.cos(a), vy: Math.sin(a), s: 5 + Math.random() * 3 };
    });
  };

  const point = (e) => {
    const r = cv.getBoundingClientRect();
    pred.x = e.clientX - r.left; pred.y = e.clientY - r.top; pred.on = true;
  };

  const step = () => {
    const cx = fish.reduce((t, f) => t + f.x, 0) / fish.length;
    const cy = fish.reduce((t, f) => t + f.y, 0) / fish.length;

    fish.forEach((f) => {
      let ax = 0, ay = 0;

      if (!reduced) {
        ax += (cx - f.x) * .0006 + (Math.random() - .5) * .08;
        ay += (cy - f.y) * .0006 + (Math.random() - .5) * .08;
      }

      fish.forEach((o) => {
        if (o === f) return;
        const dx = f.x - o.x, dy = f.y - o.y, d = dx * dx + dy * dy;
        if (d < 220 && d > 0) { ax += dx / d * 1.2; ay += dy / d * 1.2; }
      });

      if (pred.on) {
        const dx = f.x - pred.x, dy = f.y - pred.y, d = Math.hypot(dx, dy);
        if (d < flee && d > 0) { const k = (flee - d) / flee; ax += dx / d * k * 1.4; ay += dy / d * k * 1.4; }
      }

      const m = 14;
      if (f.x < m) ax += .3; if (f.x > W - m) ax -= .3;
      if (f.y < m) ay += .3; if (f.y > H - m) ay -= .3;

      f.vx = (f.vx + ax) * .96; f.vy = (f.vy + ay) * .96;

      const sp = Math.hypot(f.vx, f.vy), max = reduced ? 2 : 3.2, min = reduced ? 0 : .6;
      if (sp > max) { f.vx *= max / sp; f.vy *= max / sp; }
      else if (sp < min && sp > 0) { f.vx *= min / sp; f.vy *= min / sp; }

      f.x += f.vx; f.y += f.vy;
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = muted; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let x = 0; x <= W; x += 18) {
      const y = H - 14 - Math.sin(x * .05) * 6 - Math.sin(x * .013) * 8;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    fish.forEach((f) => {
      const s = f.s;
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(Math.atan2(f.vy, f.vx)); ctx.beginPath();
      ctx.moveTo(s * 1.4, 0); ctx.quadraticCurveTo(0, -s * .8, -s, 0); ctx.quadraticCurveTo(0, s * .8, s * 1.4, 0);
      ctx.moveTo(-s, 0); ctx.lineTo(-s * 1.8, -s * .6); ctx.lineTo(-s * 1.8, s * .6); ctx.closePath();
      ctx.stroke(); ctx.restore();
    });

    if (pred.on) {
      ctx.setLineDash([4, 5]); ctx.strokeStyle = muted; ctx.beginPath();
      ctx.arc(pred.x, pred.y, flee, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ink; ctx.font = '16px Kalam, cursive'; ctx.fillText('you', pred.x + 8, pred.y - 8);
    }
  };

  cv.addEventListener('pointermove', point);
  cv.addEventListener('pointerdown', point);
  cv.addEventListener('pointerleave', () => { pred.on = false; });

  document.querySelectorAll('[data-reef]').forEach((b) => b.addEventListener('click', () => {
    flee = b.dataset.reef === 'protected' ? 110 : 38;
    document.querySelectorAll('[data-reef]').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  }));

  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(cv);

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
  onTheme(readColors);

  const loop = () => { if (visible) { step(); draw(); } requestAnimationFrame(loop); };

  readColors(); size(); spawn(); loop();
};

setupTheme();
setupTabs();
setupReef();
