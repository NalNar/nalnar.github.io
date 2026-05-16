/**
 * birds.js — Canvas-based flapping birds for nalinnarayan.com
 * Uses HTML5 Canvas + requestAnimationFrame for smooth flapping flight.
 */

(function () {
  const BIRD_COUNT   = 11;
  const DURATION_MIN = 4500;   // ms
  const DURATION_MAX = 8000;
  const DELAY_MAX    = 3000;

  /* ── Canvas overlay ── */
  const canvas = document.createElement("canvas");
  canvas.style.cssText = [
    "position:fixed", "inset:0", "width:100%", "height:100%",
    "pointer-events:none", "z-index:999",
  ].join(";");
  document.body.appendChild(canvas);

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const ctx = canvas.getContext("2d");

  /* ── Gradient colours matching your site ── */
  function makeGradient(x, width) {
    const g = ctx.createLinearGradient(x, 0, x + width, 0);
    g.addColorStop(0,    "#d8d7ee");
    g.addColorStop(0.28, "#ff8e6b");
    g.addColorStop(0.62, "#7ea8ff");
    g.addColorStop(1,    "#f2e76b");
    return g;
  }

  /* ── Helper ── */
  function rand(min, max) { return min + Math.random() * (max - min); }

  /* ── Bird shape: draw one bird centred at (0,0) facing right ──
       wingPhase: 0 = neutral, goes -1 (up) to +1 (down)           */
  function drawBird(wingPhase, size) {
    const w  = size;          // half-wingspan each side
    const by = wingPhase * w * 0.55;  // wing tip Y offset

    ctx.beginPath();
    // left wing
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-w * 0.5, by * 0.6, -w, by);
    ctx.quadraticCurveTo(-w * 0.5, by * 0.3 + size * 0.18, 0, size * 0.12);
    // right wing
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo( w * 0.5, by * 0.6,  w, by);
    ctx.quadraticCurveTo( w * 0.5, by * 0.3 + size * 0.18, 0, size * 0.12);
    ctx.fill();

    // body
    ctx.beginPath();
    ctx.ellipse(size * 0.3, size * 0.04, size * 0.35, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.arc(size * 0.65, -size * 0.04, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // beak
    ctx.beginPath();
    ctx.moveTo(size * 0.76, -size * 0.04);
    ctx.lineTo(size * 0.95,  size * 0.01);
    ctx.lineTo(size * 0.76,  size * 0.05);
    ctx.fill();
  }

  /* ── Bird instances ── */
  const birds = [];
  const startTime = performance.now();

  for (let i = 0; i < BIRD_COUNT; i++) {
    const delay    = rand(0, DELAY_MAX);
    const duration = rand(DURATION_MIN, DURATION_MAX);
    const size     = rand(14, 32);
    const yStart   = rand(0.07, 0.93) * window.innerHeight;
    const yEnd     = yStart + rand(-120, 120);
    const flapFreq = rand(2.5, 4.5);   // flaps per second

    birds.push({ delay, duration, size, yStart, yEnd, flapFreq, done: false });
  }

  /* ── Render loop ── */
  function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allDone = true;

    birds.forEach(b => {
      const elapsed = now - startTime - b.delay;
      if (elapsed < 0) { allDone = false; return; }

      const t = elapsed / b.duration;   // 0 → 1
      if (t >= 1) { b.done = true; return; }
      allDone = false;

      const xStart = -80;
      const xEnd   = canvas.width + 80;
      const x = xStart + (xEnd - xStart) * t;
      const y = b.yStart + (b.yEnd - b.yStart) * t;

      // fade in/out at edges
      const alpha = t < 0.06 ? t / 0.06 : t > 0.92 ? (1 - t) / 0.08 : 1;

      // wing phase: sine wave → -1 to +1
      const wingPhase = Math.sin(elapsed / 1000 * b.flapFreq * Math.PI * 2);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      // gradient per bird based on current X position
      ctx.fillStyle = makeGradient(-b.size, b.size * 2.2);

      // glow
      ctx.shadowColor = "rgba(200,180,255,0.6)";
      ctx.shadowBlur  = 8;

      drawBird(wingPhase, b.size);
      ctx.restore();
    });

    if (allDone) {
      canvas.remove();
      window.removeEventListener("resize", resize);
    } else {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);

})();
