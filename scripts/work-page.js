/* ═══════════════════════════════════════════════════════
   PROJECTS DATA
═══════════════════════════════════════════════════════ */
const PROJECTS = [
  { tag: '// Project 01', title: 'Drumly', icon: '🥁',
    desc: 'AI-powered drum machine that learns your groove. Generates patterns from natural language, adapts to your style in real time, and never misses a beat — even when you do.',
    techs: ['React', 'Web Audio API', 'ML', 'Tone.js'], link: 'projects/drumly.html' },
  { tag: '// Project 02', title: 'WorkBoard', icon: '📋',
    desc: 'Brutalist project management for people who hate project management. No fluff. No onboarding. Just tasks, deadlines, and cold hard truth.',
    techs: ['Vue.js', 'Supabase', 'PostgreSQL', 'Figma'], link: 'projects/wb.html' },
  { tag: '// Project 03', title: 'Drum Machine', icon: '🎛️',
    desc: 'Old school meets new school. Classic MPC-style beat sequencer rebuilt for the browser — 16-step grid, sample pads, swing quantisation, maximum vibe.',
    techs: ['Vanilla JS', 'Web Audio API', 'CSS Grid', 'Canvas'], link: 'projects/drumM.html' },
  { tag: '// Project 04', title: 'Balance Sheet AI', icon: '📊',
    desc: 'Drag in a financial statement, get back clarity. AI reads the numbers, flags anomalies, and explains what the balance sheet actually means — in English, not accountant.',
    techs: ['Python', 'Claude API', 'Pandas', 'Chart.js'], link: 'projects/balance_sheet_analyzer.html' }
];

/* ═══════════════════════════════════════════════════════
   TERMINAL MODAL
═══════════════════════════════════════════════════════ */
function openTerminal(idx) {
  const p = PROJECTS[idx];
  document.getElementById('t-tag').textContent = p.tag;
  document.getElementById('t-title').textContent = p.title;
  document.getElementById('t-desc').textContent = p.desc;
  const chips = document.getElementById('t-chips');
  chips.innerHTML = '';
  p.techs.forEach(t => {
    const span = document.createElement('span');
    span.className = 't-chip'; span.textContent = t;
    chips.appendChild(span);
  });
  document.getElementById('t-link').href = p.link;
  document.getElementById('terminal-bg').classList.add('open');
  playBowDraw();
}
function closeTerminal() {
  document.getElementById('terminal-bg').classList.remove('open');
}
document.getElementById('t-close').addEventListener('click', closeTerminal);
document.getElementById('terminal-bg').addEventListener('click', e => {
  if (e.target === document.getElementById('terminal-bg')) closeTerminal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTerminal(); });

/* ═══════════════════════════════════════════════════════
   NAV BURGER
═══════════════════════════════════════════════════════ */
const burger = document.getElementById('nav-burger');
const drawer = document.getElementById('nav-drawer');
burger.addEventListener('click', () => { drawer.classList.toggle('open'); haptic(30); });
document.addEventListener('click', e => {
  if (!burger.contains(e.target) && !drawer.contains(e.target)) drawer.classList.remove('open');
});

/* ═══════════════════════════════════════════════════════
   HAPTIC
═══════════════════════════════════════════════════════ */
function haptic(ms) { if (navigator.vibrate) navigator.vibrate(ms); }

/* ═══════════════════════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════════════════════ */
let AC = null;
function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function playBowDraw() {
  const ac = getAC(); const t = ac.currentTime;
  const osc = ac.createOscillator(); const g = ac.createGain();
  osc.connect(g); g.connect(ac.destination);
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + .35);
  g.gain.setValueAtTime(.08, t); g.gain.linearRampToValueAtTime(0, t + .35);
  osc.start(t); osc.stop(t + .35);
}
function playRelease() {
  const ac = getAC(); const t = ac.currentTime;
  const osc = ac.createOscillator(); const g = ac.createGain();
  osc.type = 'sawtooth'; osc.connect(g); g.connect(ac.destination);
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + .12);
  g.gain.setValueAtTime(.15, t); g.gain.linearRampToValueAtTime(0, t + .18);
  osc.start(t); osc.stop(t + .18);
  const buf = ac.createBuffer(1, ac.sampleRate * .08, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(); const ng = ac.createGain();
  src.buffer = buf; src.connect(ng); ng.connect(ac.destination);
  ng.gain.setValueAtTime(.06, t); ng.gain.linearRampToValueAtTime(0, t + .08);
  src.start(t);
}
function playImpact() {
  const ac = getAC(); const t = ac.currentTime;
  const buf = ac.createBuffer(1, ac.sampleRate * .18, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * .04));
  const src = ac.createBufferSource(); const g = ac.createGain();
  src.buffer = buf; src.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(.22, t); g.gain.linearRampToValueAtTime(0, t + .18);
  src.start(t);
}
function playBullseye() {
  const ac = getAC(); const t = ac.currentTime;
  [880, 1108, 1320].forEach((f, i) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t + i * .06);
    g.gain.linearRampToValueAtTime(.12, t + i * .06 + .04);
    g.gain.linearRampToValueAtTime(0, t + i * .06 + .3);
    o.start(t + i * .06); o.stop(t + i * .06 + .3);
  });
}
function playMissionComplete() {
  const ac = getAC(); const t = ac.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination); o.frequency.value = f;
    g.gain.setValueAtTime(0, t + i * .1);
    g.gain.linearRampToValueAtTime(.14, t + i * .1 + .05);
    g.gain.linearRampToValueAtTime(0, t + i * .1 + .5);
    o.start(t + i * .1); o.stop(t + i * .1 + .5);
  });
}

/* ═══════════════════════════════════════════════════════
   HERO CANVAS — realistic helicopter based on CAD reference
═══════════════════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('hero-canvas');
  const ctx = cv.getContext('2d');
  let W, H, T = 0;
  const rain = [], lightning = [];
  let ltimer = 70, lflash = 0;
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const heli = {
    x: -280, y: 0, entryP: 0, state: 'enter',
    bladeAngle: 0, bladeSpin: 0,
    spotAngle: 0, spotTarget: 0, spotDir: 1, scanT: 0,
    wobbleT: 0
  };

  function resize() {
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.scale(DPR, DPR);
    heli.patrolY = H * .22;
    rain.length = 0;
    const n = W < 640 ? 80 : 220;
    for (let i = 0; i < n; i++)
      rain.push({ x: Math.random() * W, y: Math.random() * H, s: 5.5 + Math.random() * 5, l: 11 + Math.random() * 16, op: Math.random() * .28 + .06, dx: -.8 });
  }
  window.addEventListener('resize', resize); resize();

  const BLDGS = [];
  function buildCity() {
    BLDGS.length = 0;
    for (let x = -20; x < W + 100;) {
      const bw = 22 + Math.random() * 62, bh = 70 + Math.random() * 290;
      const wins = [];
      for (let c = 0; c < Math.floor(bw / 13); c++)
        for (let r = 0; r < Math.floor(bh / 18); r++)
          if (Math.random() > .38) wins.push({ c, r, ph: Math.random() * Math.PI * 2, s: Math.random() * .007 + .001 });
      BLDGS.push({ x, w: bw, h: bh, wins });
      x += bw + 2 + Math.random() * 10;
    }
  }
  buildCity(); window.addEventListener('resize', buildCity);

  function drawCity() {
    const base = H - Math.max(55, H * .10);
    BLDGS.forEach(b => {
      const g = ctx.createLinearGradient(b.x, base - b.h, b.x, base);
      g.addColorStop(0, '#060C06'); g.addColorStop(1, '#090F09');
      ctx.fillStyle = g; ctx.fillRect(b.x, base - b.h, b.w, b.h);
      if (W > 480) b.wins.forEach(w => {
        const v = Math.sin(T * w.s + w.ph);
        const op = v > .65 ? .22 : v > .2 ? .09 : .02;
        ctx.fillStyle = `rgba(57,255,20,${op})`;
        ctx.fillRect(b.x + 5 + w.c * 13, base - b.h + 8 + w.r * 18, 7, 9);
      });
      const ba = .35 + .35 * Math.sin(T * .028 + b.x * .01);
      ctx.beginPath(); ctx.arc(b.x + b.w / 2, base - b.h - 1, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,50,30,${ba})`; ctx.fill();
    });
    ctx.fillStyle = '#050B05'; ctx.fillRect(0, base, W, H - base);
    const hg = ctx.createLinearGradient(0, base - 28, 0, base + 55);
    hg.addColorStop(0, 'rgba(57,255,20,.10)'); hg.addColorStop(.4, 'rgba(57,255,20,.03)'); hg.addColorStop(1, 'transparent');
    ctx.fillStyle = hg; ctx.fillRect(0, base - 28, W, 83);
  }

  function drawRain() {
    rain.forEach(r => {
      r.y += r.s; r.x += r.dx;
      if (r.y > H) { r.y = -18; r.x = Math.random() * W; }
      if (r.x < -5) r.x = W + 5;
      ctx.globalAlpha = r.op;
      ctx.strokeStyle = 'rgba(160,235,160,1)'; ctx.lineWidth = .65;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + r.dx * 2.5, r.y + r.l); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  function mkLightning() {
    ltimer = 95 + Math.random() * 160; lflash = 10;
    const sx = W * .15 + Math.random() * W * .7;
    const pts = [{ x: sx, y: 0 }]; let cx = sx, cy = 0;
    while (cy < H * .65) { cy += 22 + Math.random() * 38; cx += -50 + Math.random() * 100; pts.push({ x: cx, y: cy }); }
    const bolt = { pts, life: 28, maxLife: 28, branches: [] };
    for (let b = 0; b < 2; b++) {
      const bi = Math.floor(1 + Math.random() * (pts.length - 2));
      const bp = pts[bi]; const bpts = [{ x: bp.x, y: bp.y }]; let bx = bp.x, by = bp.y;
      for (let i = 0; i < 4; i++) { by += 16 + Math.random() * 20; bx += -32 + Math.random() * 64; bpts.push({ x: bx, y: by }); }
      bolt.branches.push(bpts);
    }
    lightning.push(bolt);
  }

  function drawLightning() {
    if (lflash > 0) { ctx.fillStyle = `rgba(200,255,200,${lflash / 10 * .035})`; ctx.fillRect(0, 0, W, H); lflash--; }
    for (let i = lightning.length - 1; i >= 0; i--) {
      const l = lightning[i]; l.life--;
      const a = easeOut(l.life / l.maxLife);
      ctx.strokeStyle = `rgba(57,255,20,${a * .5})`; ctx.lineWidth = a * 5.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); l.pts.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
      ctx.strokeStyle = `rgba(225,255,225,${a * .9})`; ctx.lineWidth = a * 1.6;
      ctx.beginPath(); l.pts.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
      l.branches.forEach(b => {
        ctx.strokeStyle = `rgba(180,255,200,${a * .38})`; ctx.lineWidth = a * .9;
        ctx.beginPath(); b.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
      });
      if (l.life <= 0) lightning.splice(i, 1);
    }
    if (--ltimer <= 0) mkLightning();
  }

  function updateHeli() {
    heli.bladeSpin = lerp(heli.bladeSpin, .46, .05);
    heli.bladeAngle += heli.bladeSpin;
    heli.wobbleT += .019;
    const wobble = Math.sin(heli.wobbleT) * 3 + Math.cos(heli.wobbleT * 1.7) * 1.2;
    if (heli.state === 'enter') {
      heli.entryP = Math.min(1, heli.entryP + .005);
      const ep = easeOut(heli.entryP);
      heli.x = lerp(-280, W * .55, ep);
      heli.y = lerp(H * .12, H * .22 + wobble, ep);
      if (heli.entryP >= 1) heli.state = 'patrol';
    } else {
      heli.x += .36; heli.y = lerp(heli.y, H * .22 + wobble, .07);
      if (heli.x > W + 280) { heli.x = -280; heli.y = H * .12; heli.state = 'enter'; heli.entryP = 0; }
    }
    heli.scanT++;
    if (heli.scanT % 300 === 0) heli.spotDir *= -1;
    heli.spotTarget = Math.max(-.58, Math.min(.58, heli.spotTarget + .005 * heli.spotDir));
    heli.spotAngle = lerp(heli.spotAngle, heli.spotTarget, .038);
  }

  function drawSpotlight() {
    const hx = heli.x, hy = heli.y + 32; // from belly
    const beamLen = H * .62, spread = .19, ang = Math.PI / 2 + heli.spotAngle;
    const cone = ctx.createRadialGradient(hx, hy, 0, hx, hy, beamLen);
    cone.addColorStop(0, 'rgba(220,255,220,.17)');
    cone.addColorStop(.3, 'rgba(200,255,200,.07)');
    cone.addColorStop(.65, 'rgba(180,255,180,.025)');
    cone.addColorStop(1, 'rgba(57,255,20,0)');
    ctx.save(); ctx.beginPath(); ctx.moveTo(hx, hy);
    ctx.lineTo(hx + Math.cos(ang - spread) * beamLen, hy + Math.sin(ang - spread) * beamLen);
    ctx.arc(hx, hy, beamLen, ang - spread, ang + spread);
    ctx.lineTo(hx, hy); ctx.fillStyle = cone; ctx.fill(); ctx.restore();
    // motes
    ctx.save(); ctx.globalAlpha = .16;
    for (let m = 0; m < 5; m++) {
      const mt = (T * .011 + m * .66) % 1;
      const mx = hx + Math.cos(ang) * beamLen * mt + Math.sin(T * .04 + m * 2.1) * 11;
      const my = hy + Math.sin(ang) * beamLen * mt;
      ctx.beginPath(); ctx.arc(mx, my, 2.5 * (1 - mt), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,255,200,1)'; ctx.fill();
    }
    ctx.restore();
  }

  /* ── Realistic helicopter draw (CAD-reference silhouette) ── */
  function drawHeli() {
    const hx = heli.x, hy = heli.y;
    // scale: ~200 wide in canvas units. nose faces right.
    const S = Math.min(W, 700) < 500 ? .75 : 1; // shrink on very small screens
    ctx.save();
    ctx.translate(hx, hy);
    ctx.scale(S, S);

    // subtle bank
    const bank = heli.state === 'enter' ? -.03 : .012;
    ctx.rotate(bank);

    const fc = '#0A140A'; // fuselage fill
    const sc = 'rgba(57,255,20,.22)'; // stroke

    // ── MAIN ROTOR BLADES (top) ──
    ctx.save();
    ctx.translate(0, -38);
    ctx.rotate(heli.bladeAngle);
    ctx.strokeStyle = 'rgba(170,240,170,.55)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
      // swept blade shape
      ctx.quadraticCurveTo(Math.cos(a) * 55 + Math.sin(a) * 8, Math.sin(a) * 55 - Math.cos(a) * 8,
        Math.cos(a) * 110 + Math.sin(a) * 5, Math.sin(a) * 110 - Math.cos(a) * 5);
      ctx.stroke();
    }
    // rotor hub
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#0C1A0C'; ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.4)'; ctx.lineWidth = 1; ctx.stroke();
    // hub detail (hex shape)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      i === 0 ? ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4) : ctx.lineTo(Math.cos(a) * 4, Math.sin(a) * 4);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(57,255,20,.3)'; ctx.lineWidth = .8; ctx.stroke();
    ctx.restore();

    // ── TAIL BOOM ──
    ctx.fillStyle = fc;
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-150, -2);
    ctx.lineTo(-158, 4);
    ctx.lineTo(-150, 10);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = sc; ctx.lineWidth = .6; ctx.stroke();

    // ── TAIL FIN (vertical stabilizer — like CAD) ──
    ctx.fillStyle = fc;
    ctx.beginPath();
    ctx.moveTo(-140, -2);
    ctx.lineTo(-148, -34); // top of fin
    ctx.lineTo(-158, -28);
    ctx.lineTo(-158, 4);
    ctx.lineTo(-140, 4);
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = sc; ctx.lineWidth = .6; ctx.stroke();
    // horizontal stabilizer
    ctx.fillStyle = fc;
    ctx.beginPath();
    ctx.moveTo(-138, 2);
    ctx.lineTo(-158, -8);
    ctx.lineTo(-162, -5);
    ctx.lineTo(-142, 6);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // ── TAIL ROTOR (right side, rear) ──
    ctx.save();
    ctx.translate(-158, -14);
    // outer ring
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(57,255,20,.35)'; ctx.lineWidth = 1.2; ctx.stroke();
    // inner hub
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0C1A0C'; ctx.fill(); ctx.strokeStyle = 'rgba(57,255,20,.4)'; ctx.lineWidth = .8; ctx.stroke();
    // blades (5 around ring, like CAD)
    for (let i = 0; i < 5; i++) {
      const a = heli.bladeAngle * 1.8 + i * (Math.PI * 2 / 5);
      ctx.strokeStyle = 'rgba(155,230,155,.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12); ctx.stroke();
    }
    ctx.restore();

    // ── MAIN FUSELAGE ──
    ctx.fillStyle = fc;
    ctx.beginPath();
    // Based on CAD: bulky mid-section, tapers to nose, rounds at top
    ctx.moveTo(90, -30);   // top-front nose transition
    ctx.bezierCurveTo(110, -32, 118, -22, 116, -8);  // nose curve
    ctx.lineTo(116, 18);   // chin
    ctx.lineTo(100, 28);   // underside front
    ctx.lineTo(-10, 30);   // belly
    ctx.lineTo(-10, -8);   // rear belly-fuselage join
    ctx.lineTo(-10, -30);  // rear top
    ctx.lineTo(90, -30);   // close
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = sc; ctx.lineWidth = .7; ctx.stroke();

    // ── NOSE BUBBLE / COCKPIT AREA ──
    // Large panoramic cockpit glass (like CAD — big wrap-around)
    ctx.fillStyle = 'rgba(18,48,18,.82)';
    ctx.beginPath();
    ctx.moveTo(90, -28);
    ctx.bezierCurveTo(108, -30, 115, -20, 113, -6);
    ctx.lineTo(113, 10);
    ctx.lineTo(95, 20);
    ctx.lineTo(78, 12);
    ctx.lineTo(78, -22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.25)'; ctx.lineWidth = .8; ctx.stroke();
    // glass sheen
    ctx.strokeStyle = 'rgba(120,220,120,.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(86, -26); ctx.bezierCurveTo(106, -28, 112, -16, 110, -4); ctx.stroke();

    // ── COCKPIT DOOR / FRAME (CAD shows door lines) ──
    ctx.strokeStyle = 'rgba(57,255,20,.18)'; ctx.lineWidth = .7;
    // door seam vertical
    ctx.beginPath(); ctx.moveTo(50, -28); ctx.lineTo(50, 28); ctx.stroke();
    // window in door
    ctx.fillStyle = 'rgba(18,48,18,.7)';
    ctx.beginPath(); ctx.roundRect(54, -22, 20, 18, 2); ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.22)'; ctx.lineWidth = .7; ctx.stroke();

    // ── ENGINE / TRANSMISSION FAIRING (top hump, CAD shows prominent box) ──
    ctx.fillStyle = '#0C180C';
    ctx.beginPath();
    ctx.moveTo(-5, -30);
    ctx.lineTo(75, -30);
    ctx.lineTo(75, -44);
    ctx.lineTo(60, -52); // top of fairing
    ctx.lineTo(20, -52);
    ctx.lineTo(5, -44);
    ctx.lineTo(-5, -38);
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = 'rgba(57,255,20,.28)'; ctx.lineWidth = .7; ctx.stroke();
    // exhaust port (top right of fairing)
    ctx.fillStyle = '#080E08';
    ctx.beginPath(); ctx.roundRect(62, -48, 14, 8, 1); ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.2)'; ctx.lineWidth = .6; ctx.stroke();

    // ── BELLY EQUIPMENT BOX (CAD shows square underbelly box) ──
    ctx.fillStyle = '#0B160B';
    ctx.beginPath();
    ctx.moveTo(10, 28);
    ctx.lineTo(80, 28);
    ctx.lineTo(80, 44);
    ctx.lineTo(10, 44);
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = 'rgba(57,255,20,.18)'; ctx.lineWidth = .6; ctx.stroke();
    // inner detail lines on belly box
    ctx.strokeStyle = 'rgba(57,255,20,.12)'; ctx.lineWidth = .5;
    ctx.beginPath(); ctx.moveTo(30, 28); ctx.lineTo(30, 44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(60, 28); ctx.lineTo(60, 44); ctx.stroke();

    // ── SEARCHLIGHT (nose-bottom, like CAD) ──
    ctx.fillStyle = '#091209';
    ctx.beginPath(); ctx.arc(105, 8, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.35)'; ctx.lineWidth = .8; ctx.stroke();
    // lens glow
    const lensAlpha = .3 + .25 * Math.sin(T * .03);
    ctx.beginPath(); ctx.arc(105, 8, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,255,220,${lensAlpha})`; ctx.fill();

    // ── LANDING SKIDS (CAD shows wide tubular skids) ──
    ctx.strokeStyle = 'rgba(57,255,20,.35)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    // front strut
    ctx.beginPath(); ctx.moveTo(70, 44); ctx.lineTo(55, 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, 44); ctx.lineTo(28, 62); ctx.stroke();
    // rear strut
    ctx.beginPath(); ctx.moveTo(20, 44); ctx.lineTo(10, 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, 30); ctx.lineTo(-5, 62); ctx.stroke();
    // skid tubes (horizontal)
    ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(-10, 62); ctx.lineTo(70, 62); ctx.stroke();
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-8, 64); ctx.lineTo(68, 64); ctx.stroke();
    // rear skid
    ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(-12, 62); ctx.lineTo(-4, 58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(65, 62); ctx.lineTo(75, 57); ctx.stroke();

    // ── NAV LIGHTS ──
    const blink = (T % 22 < 11);
    ctx.beginPath(); ctx.arc(116, -8, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = blink ? 'rgba(255,80,30,.95)' : 'rgba(90,20,10,.4)'; ctx.fill();
    ctx.beginPath(); ctx.arc(-150, 4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = blink ? 'rgba(255,255,255,.8)' : 'rgba(60,60,60,.3)'; ctx.fill();
    // anti-collision strobe (bottom)
    const strobe = Math.sin(T * .18) > .85;
    if (strobe) {
      ctx.beginPath(); ctx.arc(45, 44, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,60,60,.9)'; ctx.fill();
    }

    // ── REGISTRATION / MARKINGS (thin stripe like real police heli) ──
    ctx.fillStyle = 'rgba(57,255,20,.12)';
    ctx.beginPath(); ctx.fillRect(-8, -2, 100, 3);

    ctx.restore();
  }

  function loop() {
    T++;
    ctx.clearRect(0, 0, W, H);
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#010602'); sky.addColorStop(.55, '#040D05'); sky.addColorStop(1, '#071008');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    const mg = ctx.createRadialGradient(W * .8, H * .13, 0, W * .8, H * .13, 22);
    mg.addColorStop(0, 'rgba(225,255,225,.14)'); mg.addColorStop(1, 'rgba(57,255,20,0)');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(W * .8, H * .13, 22, 0, Math.PI * 2); ctx.fill();
    drawCity(); drawRain(); updateHeli(); drawSpotlight(); drawHeli(); drawLightning();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ═══════════════════════════════════════════════════════
   STATS COUNTER
═══════════════════════════════════════════════════════ */
function countUp(id, target, dur) {
  const el = document.getElementById(id);
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
  }
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    statsObs.disconnect();
    setTimeout(() => countUp('sn1', 4, 900), 0);
    setTimeout(() => countUp('sn2', 847, 1200), 200);
    setTimeout(() => countUp('sn3', 1, 600), 400);
    setTimeout(() => countUp('sn4', 3000, 1400), 600);
  }
}, { threshold: .5 });
statsObs.observe(document.getElementById('stats'));

/* ═══════════════════════════════════════════════════════
   GAME ENGINE — real arrow flight arc + mobile cards
═══════════════════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('gc');
  const ctx = cv.getContext('2d');
  const GW = 1200, GH = 580;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = GW * DPR; cv.height = GH * DPR;
  ctx.scale(DPR, DPR);
  cv.style.width = '100%'; cv.style.height = 'auto';

  const mob = () => window.innerWidth < 900;

  let T = 0;
  let mx = GW / 2, my = GH / 2;
  let smx = GW / 2, smy = GH / 2;
  let arrowsLeft = PROJECTS.length;
  let shotsFired = 0, shotsHit = 0;

  // Physics
  const GRAVITY = 0.28;
  const DRAG = 0.9992;

  // Arrow flight states: each has x,y,vx,vy, trail[], progress(0-1 for arc), done, hitIdx
  let flyingArrows = [];
  let stuckArrows = [];
  let particles = [];
  let camShake = { x: 0, y: 0, life: 0 };
  let slowmo = 0;
  let bowPull = 0;
  let shotFlash = 0; // brief screen flash on fire

  const lerp = (a, b, t) => a + (b - a) * t;
  const dist = (ax, ay, bx, by) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const easeOut3 = t => 1 - Math.pow(1 - t, 3);

  // Rain
  const rain2 = [];
  for (let i = 0; i < 60; i++)
    rain2.push({ x: Math.random() * GW, y: Math.random() * GH, s: 3.5 + Math.random() * 4, l: 9 + Math.random() * 12 });

  // Archer origin
  const BX = 80, BY = GH - 110;

  // Targets: slightly higher up on mobile so cards can show below
  const COLS = [200, 470, 740, 1010];
  const targets = PROJECTS.map((p, i) => ({
    x: COLS[i], y: GH * .40,
    r: 52,
    hit: false, hitT: 0, hitScale: 1,
    fp: i * 1.4,
    hovered: false, scanLine: 0,
    cardAlpha: 0,  // for mobile card fade-in
    proj: p
  }));

  const G_BLDGS = [];
  for (let x = -20; x < GW + 60;) {
    const bw = 28 + Math.random() * 65, bh = 60 + Math.random() * 270;
    const wins = [];
    for (let c = 0; c < Math.floor(bw / 12); c++)
      for (let r = 0; r < Math.floor(bh / 16); r++)
        if (Math.random() > .42) wins.push({ c, r, ph: Math.random() * Math.PI * 2, s: Math.random() * .007 + .001 });
    G_BLDGS.push({ x, w: bw, h: bh, wins });
    x += bw + 1 + Math.random() * 8;
  }

  function canvasPos(cx, cy) {
    const r = cv.getBoundingClientRect();
    return { x: (cx - r.left) * (GW / r.width), y: (cy - r.top) * (GH / r.height) };
  }

  /* ══════════════════════════════════════
     FIRE — launches real arc toward target
  ══════════════════════════════════════ */
  function fire(aimX, aimY) {
    if (arrowsLeft <= 0) return;
    shotsFired++;
    arrowsLeft--;
    playRelease();
    haptic(18);
    shotFlash = 8;

    // Find nearest target within snap radius
    let snapIdx = -1, closestD = Infinity;
    targets.forEach((tg, i) => {
      if (tg.hit) return;
      const ey = tg.y + Math.sin(T * .013 + tg.fp) * 10;
      const d = dist(aimX, aimY, tg.x, ey);
      const snapR = mob() ? 130 : 80;
      if (d < snapR && d < closestD) { closestD = d; snapIdx = i; }
    });

    if (snapIdx >= 0) {
      // Launch a REAL physics arrow that travels to the target
      const tg = targets[snapIdx];
      const targetY = tg.y + Math.sin(T * .013 + tg.fp) * 10;
      const dx = tg.x - BX, dy = targetY - BY;
      const travelFrames = 28; // ~0.47s at 60fps
      // vx to reach target in travelFrames
      const vx = dx / travelFrames;
      // vy: solve y = BY + vy*t + 0.5*G*t^2 at t=travelFrames
      // vy = (dy - 0.5*G*travelFrames^2) / travelFrames
      const vy = (dy - 0.5 * GRAVITY * travelFrames * travelFrames) / travelFrames;

      flyingArrows.push({
        x: BX, y: BY,
        vx, vy,
        done: false, age: 0,
        hitIdx: snapIdx,        // guaranteed hit
        hitAt: travelFrames,    // frame to trigger hit
        trail: [],
        targetX: tg.x, targetY
      });
    } else {
      // Free-aim physics arrow (misses)
      const dx = aimX - BX, dy = aimY - BY;
      const d = Math.sqrt(dx * dx + dy * dy);
      const spd = clamp(d * .05, 12, 26);
      flyingArrows.push({
        x: BX, y: BY, vx: (dx / d) * spd, vy: (dy / d) * spd,
        done: false, age: 0, hitIdx: -1, hitAt: -1, trail: []
      });
    }
  }

  function spawnParticles(x, y, n, spd, color) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = spd * (.4 + Math.random() * .9);
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.8, life: 1, decay: .016 + Math.random() * .013, size: 2.5 + Math.random() * 4.5, color, ring: false });
    }
  }
  function spawnSmoke(x, y) {
    for (let i = 0; i < 9; i++) {
      const a = (Math.random() - .5) * .8 - Math.PI / 2, s = .8 + Math.random() * 2;
      particles.push({ x: x + (Math.random() - .5) * 8, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: .006, size: 8 + Math.random() * 16, color: '', ring: false, smoke: true });
    }
  }
  function spawnRing(x, y) {
    particles.push({ x, y, vx: 0, vy: 0, life: 1, decay: .02, size: 0, maxR: 90, ring: true });
  }

  function onHit(idx) {
    const tg = targets[idx];
    if (tg.hit) return;
    tg.hit = true; tg.hitT = T; tg.hitScale = 1.35;
    shotsHit++;
    playImpact(); setTimeout(playBullseye, 80);
    haptic([60, 40, 80]);
    spawnParticles(tg.x, tg.y, 24, 7.5, 'rgba(57,255,20,1)');
    spawnParticles(tg.x, tg.y, 12, 5, 'rgba(200,168,48,1)');
    spawnParticles(tg.x, tg.y, 7, 3, 'rgba(255,255,255,.85)');
    spawnSmoke(tg.x, tg.y); spawnRing(tg.x, tg.y);
    camShake = { x: 0, y: 0, life: 24 };
    slowmo = 55;
    stuckArrows.push({ x: tg.x, y: tg.y, ang: -.2 + Math.random() * .4 });
    if (targets.every(t => t.hit)) { setTimeout(playMissionComplete, 400); haptic([100, 60, 100, 60, 200]); }
    setTimeout(() => openTerminal(idx), 600);
  }

  function updateGame() {
    const dt = slowmo > 0 ? .2 : 1;
    if (slowmo > 0) slowmo--;
    if (shotFlash > 0) shotFlash--;
    bowPull = lerp(bowPull, .5 + .5 * Math.sin(T * .024), .06);
    smx = lerp(smx, mx, .1); smy = lerp(smy, my, .1);

    flyingArrows = flyingArrows.filter(a => {
      if (a.done) return false;
      a.age++;
      a.trail.push({ x: a.x, y: a.y });
      if (a.trail.length > 18) a.trail.shift();

      a.vx *= DRAG; a.vy += GRAVITY * dt;
      a.x += a.vx * dt; a.y += a.vy * dt;

      // Guaranteed hit at scheduled frame
      if (a.hitIdx >= 0 && a.age >= a.hitAt) {
        // snap to exact target position cleanly
        a.x = a.targetX; a.y = a.targetY;
        onHit(a.hitIdx); a.done = true; return false;
      }

      // Collision check for free-aim arrows
      if (a.hitIdx < 0) {
        targets.forEach((tg, i) => {
          if (tg.hit || a.done) return;
          const ey = tg.y + Math.sin(T * .013 + tg.fp) * 10;
          if (dist(a.x, a.y, tg.x, ey) < tg.r) { onHit(i); a.done = true; }
        });
      }

      if (a.x > GW + 80 || a.y > GH + 80 || a.x < -80) { a.done = true; return false; }
      return true;
    });

    particles = particles.filter(p => {
      p.x += p.vx; p.y += p.vy;
      if (!p.smoke && !p.ring) p.vy += .17;
      p.vx *= .93; p.life -= p.decay;
      return p.life > 0;
    });

    targets.forEach(tg => {
      if (tg.hit) {
        tg.hitScale = lerp(tg.hitScale, 1, .09);
        tg.cardAlpha = Math.min(1, tg.cardAlpha + .04);
      }
    });

    if (camShake.life > 0) {
      const i = camShake.life / 24;
      camShake.x = (Math.random() - .5) * 7 * i; camShake.y = (Math.random() - .5) * 4 * i; camShake.life--;
    } else { camShake.x = 0; camShake.y = 0; }
  }

  /* ── DRAW BG ── */
  function drawBG() {
    const sky = ctx.createLinearGradient(0, 0, 0, GH);
    sky.addColorStop(0, '#010203'); sky.addColorStop(.38, '#041008'); sky.addColorStop(.8, '#071408'); sky.addColorStop(1, '#0A1A0D');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, GW, GH);
    const base = GH - 90;
    G_BLDGS.forEach(b => {
      const g = ctx.createLinearGradient(b.x, base - b.h, b.x, base);
      g.addColorStop(0, '#050B05'); g.addColorStop(1, '#080F08');
      ctx.fillStyle = g; ctx.fillRect(b.x, base - b.h, b.w, b.h);
      b.wins.forEach(w => {
        const v = Math.sin(T * w.s + w.ph), op = v > .5 ? .17 : v > .1 ? .06 : .015;
        ctx.fillStyle = `rgba(57,255,20,${op})`; ctx.fillRect(b.x + 4 + w.c * 12, base - b.h + 8 + w.r * 16, 7, 8);
      });
    });
    ctx.fillStyle = '#050B05'; ctx.fillRect(0, base, GW, GH - base);
    const hg = ctx.createLinearGradient(0, base - 22, 0, base + 45);
    hg.addColorStop(0, 'rgba(57,255,20,.09)'); hg.addColorStop(1, 'transparent');
    ctx.fillStyle = hg; ctx.fillRect(0, base - 22, GW, 67);
    ctx.strokeStyle = 'rgba(57,255,20,.13)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(GW, base); ctx.stroke();
    rain2.forEach(r => {
      r.y += r.s; r.x -= .7; if (r.y > GH) { r.y = -10; r.x = Math.random() * GW; } if (r.x < 0) r.x = GW;
      ctx.strokeStyle = 'rgba(160,225,160,.08)'; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + 2, r.y + r.l); ctx.stroke();
    });
    targets.forEach((tg, i) => {
      ctx.fillStyle = 'rgba(57,255,20,.30)'; ctx.font = '600 10px Oswald'; ctx.textAlign = 'center';
      ctx.fillText(`${(i + 1) * 20}m`, tg.x, base + 21);
    });
  }

  /* ── DRAW TARGET ── */
  function drawTarget(tg) {
    const yf = Math.sin(T * .013 + tg.fp) * 10;
    const wy = tg.hit ? Math.sin(T * .055) * 1.6 * Math.max(0, 1 - (T - tg.hitT) / 100) : yf;
    const ty = tg.y + wy;
    const base = GH - 90;

    // shadow
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.beginPath(); ctx.ellipse(tg.x, base + 14, tg.r * .52, 5.5, 0, 0, Math.PI * 2); ctx.fill();

    // pole
    const pg = ctx.createLinearGradient(0, ty + tg.r, 0, base);
    pg.addColorStop(0, 'rgba(57,255,20,.28)'); pg.addColorStop(1, 'rgba(57,255,20,.04)');
    ctx.strokeStyle = pg; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(tg.x, ty + tg.r); ctx.lineTo(tg.x, base); ctx.stroke();

    // hover scan
    if (tg.hovered && !tg.hit) {
      tg.scanLine = (tg.scanLine || 0) + 2.5;
      if (tg.scanLine > tg.r * 2 + 20) tg.scanLine = 0;
      const sg = ctx.createRadialGradient(tg.x, ty, 0, tg.x, ty, tg.r * 2.8);
      sg.addColorStop(0, 'rgba(43,255,200,.14)'); sg.addColorStop(1, 'rgba(43,255,200,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(tg.x, ty, tg.r * 2.8, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(tg.x, ty, tg.r, 0, Math.PI * 2); ctx.clip();
      ctx.strokeStyle = 'rgba(43,255,200,.4)'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(tg.x - tg.r, ty - tg.r + tg.scanLine); ctx.lineTo(tg.x + tg.r, ty - tg.r + tg.scanLine); ctx.stroke();
      ctx.restore();
    }

    // rings with bounce scale
    ctx.save(); ctx.translate(tg.x, ty); ctx.scale(tg.hitScale, tg.hitScale);
    [{ r: 1.00, c: '#8B1A1A' }, { r: .82, c: '#CC2020' }, { r: .64, c: '#111111' },
     { r: .50, c: '#1A1A1A' }, { r: .36, c: '#1A3A8B' }, { r: .22, c: '#2255CC' }, { r: .10, c: '#39FF14' }
    ].forEach(({ r, c }) => { ctx.beginPath(); ctx.arc(0, 0, tg.r * r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); });
    [.82, .64, .50, .36, .22, .10].forEach(rf => {
      ctx.beginPath(); ctx.arc(0, 0, tg.r * rf, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = .5; ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(0, 0, tg.r * .045, 0, Math.PI * 2); ctx.fillStyle = '#FFD700'; ctx.fill();
    ctx.restore();

    // hit glow
    if (tg.hit) {
      const age = Math.min(1, (T - tg.hitT) / 90), pulse = .5 + .3 * Math.sin(T * .1);
      const grd = ctx.createRadialGradient(tg.x, ty, 0, tg.x, ty, tg.r * 3.5);
      grd.addColorStop(0, `rgba(57,255,20,${.22 * pulse * (1 - age * .4)})`); grd.addColorStop(1, 'rgba(57,255,20,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(tg.x, ty, tg.r * 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 17px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(57,255,20,${.65 + .35 * Math.sin(T * .1)})`; ctx.fillText('✓', tg.x, ty + 6);
    }

    // project label above
    const labelY = ty - tg.r - 14;
    ctx.fillStyle = tg.hit ? 'rgba(57,255,20,.38)' : 'rgba(57,255,20,.88)';
    ctx.font = '700 13px Oswald'; ctx.textAlign = 'center';
    ctx.fillText(tg.proj.title.toUpperCase(), tg.x, labelY);
    ctx.fillStyle = tg.hit ? 'rgba(57,255,20,.22)' : 'rgba(57,255,20,.48)';
    ctx.font = '600 9px Rajdhani';
    ctx.fillText(tg.hit ? '✓ OPENED' : '[ TAP / SHOOT ]', tg.x, labelY - 13);

    // stuck arrows
    stuckArrows.filter(sa => dist(sa.x, sa.y, tg.x, tg.y) < 55).forEach(sa => {
      ctx.save(); ctx.translate(sa.x, ty); ctx.rotate(sa.ang);
      ctx.strokeStyle = 'rgba(57,255,20,.82)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(12, 0); ctx.stroke();
      ctx.fillStyle = 'rgba(200,225,200,.93)'; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(6, -3); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill();
      ctx.restore();
    });

    /* ── MOBILE PROJECT CARD (appears below target after hit) ── */
    if (mob() && tg.hit && tg.cardAlpha > 0) {
      drawMobileCard(tg, ty);
    }
  }

  function drawMobileCard(tg, ty) {
    const p = tg.proj;
    const cx = tg.x, cardW = 220, cardH = 100;
    const cx2 = clamp(cx, cardW / 2 + 10, GW - cardW / 2 - 10);
    const cy = ty + tg.r + 28;
    const a = tg.cardAlpha;

    // card background
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(3,8,12,.96)';
    ctx.beginPath();
    ctx.roundRect(cx2 - cardW / 2, cy, cardW, cardH, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.55)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // project name
    ctx.fillStyle = '#39FF14';
    ctx.font = '700 14px Oswald';
    ctx.textAlign = 'center';
    ctx.fillText(p.title.toUpperCase(), cx2, cy + 22);

    // desc (truncated)
    ctx.fillStyle = 'rgba(200,220,200,.75)';
    ctx.font = '500 10px Rajdhani';
    const words = p.desc.split(' ');
    let line = '', lines = [], maxW = cardW - 20;
    words.forEach(w => {
      const test = line + (line ? ' ' : '') + w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    lines.push(line);
    lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, cx2, cy + 40 + i * 14));

    // "Open" button strip
    ctx.fillStyle = 'rgba(57,255,20,.18)';
    ctx.beginPath(); ctx.roundRect(cx2 - cardW / 2 + 10, cy + cardH - 26, cardW - 20, 18, 3); ctx.fill();
    ctx.fillStyle = '#39FF14'; ctx.font = '700 10px Oswald';
    ctx.fillText('→ OPEN PROJECT', cx2, cy + cardH - 13);

    ctx.restore();
  }

  /* ── DRAW ARCHER ── */
  function drawArcher() {
    const breathe = Math.sin(T * .018) * 1.1 + Math.cos(T * .031) * .5;
    const ang = Math.atan2(smy - BY, smx - BX);

    ctx.save();
    ctx.translate(BX, BY + breathe * .3);

    // shadow
    ctx.fillStyle = 'rgba(0,8,0,.22)';
    ctx.beginPath(); ctx.ellipse(0, 30, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // legs
    ctx.strokeStyle = '#0C180C'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-8, 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 27); ctx.stroke();

    // torso
    ctx.fillStyle = '#0B160B';
    ctx.beginPath(); ctx.ellipse(-3, -20, 10, 18, ang * .05, 0, Math.PI * 2); ctx.fill();

    // quiver on back
    ctx.fillStyle = '#0F1C0F';
    ctx.beginPath(); ctx.roundRect(-18, -36, 9, 24, 2); ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,20,.2)'; ctx.lineWidth = .6; ctx.stroke();
    for (let i = 0; i < Math.min(arrowsLeft, 3); i++) {
      ctx.strokeStyle = 'rgba(57,255,20,.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-15 + i * 2.5, -35); ctx.lineTo(-15 + i * 2.5, -14); ctx.stroke();
    }

    // head
    ctx.fillStyle = '#0B160B';
    ctx.beginPath(); ctx.arc(-4, -40, 13, 0, Math.PI * 2); ctx.fill();
    // eye glow
    const ex = -1 + Math.cos(ang) * 5, ey = -40 + Math.sin(ang) * 2.5;
    ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(43,255,200,1)'; ctx.fill();
    ctx.beginPath(); ctx.arc(ex, ey, 8, 0, Math.PI * 2); ctx.fillStyle = 'rgba(43,255,200,.12)'; ctx.fill();

    // BOW + ARROW — rotated to aim
    ctx.rotate(ang);

    // bow limbs
    ctx.strokeStyle = '#7B6018'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.quadraticCurveTo(-24, -13, 0, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 56); ctx.quadraticCurveTo(-24, 13, 0, 0); ctx.stroke();

    // bowstring with draw-back
    const pull = bowPull * 13;
    ctx.strokeStyle = 'rgba(215,200,155,.7)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(-pull, 0); ctx.lineTo(0, 56); ctx.stroke();

    // nocked arrow
    if (arrowsLeft > 0) {
      const as = -pull;
      // shaft
      ctx.strokeStyle = 'rgba(43,255,200,.95)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(as, 0); ctx.lineTo(60, 0); ctx.stroke();
      // head
      ctx.fillStyle = 'rgba(205,230,205,.95)';
      ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(54, -3); ctx.lineTo(54, 3); ctx.closePath(); ctx.fill();
      // fletching
      ctx.fillStyle = 'rgba(255,175,25,.9)';
      ctx.beginPath(); ctx.moveTo(as + 10, 0); ctx.lineTo(as - 3, -7); ctx.lineTo(as + 4, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(as + 10, 0); ctx.lineTo(as - 3, 7); ctx.lineTo(as + 4, 0); ctx.closePath(); ctx.fill();

      // tension glow
      if (bowPull > .4) {
        ctx.strokeStyle = `rgba(43,255,200,${(bowPull - .4) * .28})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(0, -56); ctx.quadraticCurveTo(-24, -13, 0, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 56); ctx.quadraticCurveTo(-24, 13, 0, 0); ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ── DRAW FLYING ARROWS ── */
  function drawFlyingArrows() {
    flyingArrows.forEach(a => {
      if (a.done) return;
      // angle from velocity
      const ang = Math.atan2(a.vy, a.vx);

      // Glowing trail
      a.trail.forEach((p, i) => {
        const frac = i / a.trail.length;
        const r = 3 * frac;
        // trail fades and shrinks
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57,255,20,${frac * .32})`; ctx.fill();
      });

      // Motion blur streak (line behind)
      if (a.trail.length > 3) {
        const t0 = a.trail[Math.max(0, a.trail.length - 5)];
        const grad = ctx.createLinearGradient(t0.x, t0.y, a.x, a.y);
        grad.addColorStop(0, 'rgba(57,255,20,0)');
        grad.addColorStop(1, 'rgba(57,255,20,.45)');
        ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(a.x, a.y); ctx.stroke();
      }

      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(ang);

      // shaft
      ctx.strokeStyle = 'rgba(57,255,20,.95)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(14, 0); ctx.stroke();

      // head with slight shine
      ctx.fillStyle = 'rgba(205,230,205,.95)';
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(8, -3.5); ctx.lineTo(8, 3.5); ctx.closePath(); ctx.fill();

      // fletching
      ctx.fillStyle = 'rgba(255,175,25,.92)';
      ctx.beginPath(); ctx.moveTo(-19, 0); ctx.lineTo(-28, -6); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-19, 0); ctx.lineTo(-28, 6); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fill();

      ctx.restore();
    });
  }

  /* ── DRAW PARTICLES ── */
  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      if (p.ring) {
        const r = p.maxR * (1 - p.life);
        ctx.globalAlpha = p.life * .55;
        ctx.strokeStyle = 'rgba(57,255,20,1)'; ctx.lineWidth = 2 * p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
      } else if (p.smoke) {
        ctx.globalAlpha = p.life * .20;
        ctx.fillStyle = 'rgba(35,60,35,1)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.7 - p.life * .5), 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  }

  /* ── AIM LINE ── */
  function drawAimLine() {
    ctx.save();
    ctx.setLineDash([5, 11]); ctx.lineDashOffset = -(T * .55);
    ctx.strokeStyle = 'rgba(57,255,20,.055)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(BX, BY); ctx.lineTo(smx, smy); ctx.stroke();
    ctx.restore();
  }

  /* ── CROSSHAIR ── */
  function drawCrosshair() {
    const r = 17 + Math.sin(T * .07) * 2.8;
    ctx.save(); ctx.translate(smx, smy); ctx.rotate(T * .007);
    ctx.strokeStyle = 'rgba(43,255,200,.82)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * (r + 4), Math.sin(a) * (r + 4));
      ctx.lineTo(Math.cos(a) * (r + 11), Math.sin(a) * (r + 11)); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(43,255,200,.9)'; ctx.fill();
    ctx.restore();
  }

  /* ── HUD ── */
  function updateHUD() {
    const hitN = targets.filter(t => t.hit).length;
    document.getElementById('hudtxt').textContent =
      hitN === PROJECTS.length ? '// Arsenal Fully Unlocked — You Are The Arrow' :
        hitN > 0 ? `// ${hitN}/${PROJECTS.length} Targets Hit` : '// Star City Range — Aim True';
    const ammoEl = document.getElementById('ammo'); ammoEl.innerHTML = '';
    for (let i = 0; i < PROJECTS.length; i++) {
      const p2 = document.createElement('div');
      p2.className = 'apip' + (i >= arrowsLeft ? ' gone' : '');
      ammoEl.appendChild(p2);
    }
    const acc = shotsFired > 0 ? Math.round(shotsHit / shotsFired * 100) + '%' : '—';
    document.getElementById('acc-badge').textContent = `ACCURACY: ${acc}`;
    const msg = document.getElementById('gmsg');
    if (hitN === PROJECTS.length) msg.textContent = 'All targets eliminated. You are the Arrow.';
    else if (arrowsLeft === 0) msg.textContent = 'Quiver empty — refresh to reload';
    else msg.textContent = mob() ? 'Tap a target circle to fire & open' : 'Move to aim · click to shoot · hit target to open';
  }

  /* ── SHOT FLASH OVERLAY ── */
  function drawShotFlash() {
    if (shotFlash > 0) {
      ctx.fillStyle = `rgba(57,255,20,${shotFlash / 8 * .05})`;
      ctx.fillRect(0, 0, GW, GH);
    }
  }

  function loop() {
    T++;
    updateGame();
    ctx.save();
    if (camShake.life > 0) ctx.translate(camShake.x, camShake.y);
    ctx.clearRect(-10, -10, GW + 20, GH + 20);
    drawBG();
    drawShotFlash();
    drawAimLine();
    targets.forEach(drawTarget);
    drawFlyingArrows();
    drawParticles();
    drawArcher();
    drawCrosshair();
    ctx.restore();
    updateHUD();
    requestAnimationFrame(loop);
  }
  loop();

  function updateHover(gx, gy) {
    let over = false;
    targets.forEach(tg => {
      tg.hovered = !tg.hit && dist(gx, gy, tg.x, tg.y) < tg.r * 1.7;
      if (tg.hovered) over = true;
    });
    cv.classList.toggle('target-hover', over);
  }

  /* ── CLICK / TAP ── */
  cv.addEventListener('mousemove', e => {
    const p = canvasPos(e.clientX, e.clientY); mx = p.x; my = p.y; updateHover(mx, my);
  });
  cv.addEventListener('click', e => {
    if (arrowsLeft <= 0) return;
    const p = canvasPos(e.clientX, e.clientY); fire(p.x, p.y);
  });

  // Mobile: tap on card "Open" area
  cv.addEventListener('touchend', e => {
    const p = canvasPos(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    targets.forEach((tg, i) => {
      if (!tg.hit || !mob()) return;
      const ty = tg.y + Math.sin(T * .013 + tg.fp) * 10;
      const cardW = 220, cardH = 100;
      const cx2 = clamp(tg.x, cardW / 2 + 10, GW - cardW / 2 - 10);
      const cy = ty + tg.r + 28;
      const btnY = cy + cardH - 26;
      if (p.x >= cx2 - cardW / 2 + 10 && p.x <= cx2 + cardW / 2 - 10 && p.y >= btnY && p.y <= btnY + 18) {
        openTerminal(i);
      }
    });
  });

  cv.addEventListener('touchstart', e => {
    const p = canvasPos(e.touches[0].clientX, e.touches[0].clientY);
    mx = p.x; my = p.y; updateHover(mx, my);
    const closeToTarget = targets.some(tg => !tg.hit && dist(p.x, p.y, tg.x, tg.y) < 130);
    if (closeToTarget) { e.preventDefault(); fire(p.x, p.y); }
  }, { passive: false });

  cv.addEventListener('touchmove', e => {
    const p = canvasPos(e.touches[0].clientX, e.touches[0].clientY); mx = p.x; my = p.y; updateHover(mx, my);
  }, { passive: true });

  document.getElementById('shoot-btn').addEventListener('click', e => { e.stopPropagation(); fire(mx, my); });
  document.getElementById('shoot-btn').addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); fire(mx, my); }, { passive: false });

  const KEYS = {};
  document.addEventListener('keydown', e => { KEYS[e.code] = true; });
  document.addEventListener('keyup', e => { KEYS[e.code] = false; });
  setInterval(() => {
    const step = 7;
    if (KEYS['ArrowLeft']) mx = Math.max(0, mx - step);
    if (KEYS['ArrowRight']) mx = Math.min(GW, mx + step);
    if (KEYS['ArrowUp']) my = Math.max(0, my - step);
    if (KEYS['ArrowDown']) my = Math.min(GH, my + step);
    if (KEYS['Space'] || KEYS['Enter']) { KEYS['Space'] = false; KEYS['Enter'] = false; fire(mx, my); }
  }, 16);
})();