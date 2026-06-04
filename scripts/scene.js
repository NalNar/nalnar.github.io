/**
 * scene.js — Bright airy sky background for nalinnarayan.com
 * Layered canvas: gradient sky + drifting clouds + soft floating motes
 * Sits behind everything. Zero DOM interference with existing Hello animation.
 */

(function () {
  /* ── Canvas ── */
  const canvas = document.createElement("canvas");
  canvas.id = "sky-canvas";
  canvas.style.cssText = [
    "position:fixed", "inset:0", "width:100%", "height:100%",
    "pointer-events:none", "z-index:0",
  ].join(";");
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  /* ── Sky gradient stops ── */
  const SKY_TOP    = "#c9e8f5";   // soft cerulean
  const SKY_MID    = "#e8f4fb";   // almost white-blue
  const SKY_BOTTOM = "#fdf6ee";   // warm ivory horizon

  /* ── Helpers ── */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

  /* ══════════════════════════════════════════
     CLOUDS
  ══════════════════════════════════════════ */
  class Cloud {
    constructor(startOffscreen) {
      this.reset(startOffscreen);
    }

    reset(offscreen) {
      this.w      = rand(180, 420);
      this.h      = this.w * rand(0.28, 0.48);
      this.x      = offscreen ? -this.w - 40 : rand(-this.w, canvas.width + this.w);
      this.y      = rand(0.04, 0.52) * canvas.height;
      this.speed  = rand(0.12, 0.38);
      this.alpha  = rand(0.55, 0.92);
      this.puffs  = this.buildPuffs();
    }

    buildPuffs() {
      // Each cloud = 5-9 overlapping circles
      const n = randInt(5, 9);
      const p = [];
      for (let i = 0; i < n; i++) {
        p.push({
          ox: rand(0, this.w),
          oy: rand(this.h * 0.3, this.h * 0.85),
          r:  rand(this.h * 0.35, this.h * 0.75),
        });
      }
      return p;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);

      // soft shadow under cloud
      ctx.shadowColor = "rgba(160,200,230,0.25)";
      ctx.shadowBlur  = 18;

      const grd = ctx.createRadialGradient(
        this.w / 2, this.h / 2, this.h * 0.1,
        this.w / 2, this.h / 2, this.w * 0.6
      );
      grd.addColorStop(0,   "rgba(255,255,255,1)");
      grd.addColorStop(0.6, "rgba(240,248,255,0.96)");
      grd.addColorStop(1,   "rgba(220,238,252,0.4)");

      ctx.fillStyle = grd;
      ctx.beginPath();
      for (const p of this.puffs) {
        ctx.moveTo(p.ox + p.r, p.oy);
        ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.speed;
      if (this.x > canvas.width + this.w + 40) this.reset(true);
    }
  }

  /* ══════════════════════════════════════════
     FLOATING MOTES (tiny soft orbs / light dust)
  ══════════════════════════════════════════ */
  class Mote {
    constructor() { this.reset(true); }

    reset(anywhere) {
      this.x     = rand(0, canvas.width);
      this.y     = anywhere ? rand(0, canvas.height) : canvas.height + 10;
      this.r     = rand(1.5, 5.5);
      this.vy    = -rand(0.08, 0.32);   // drift upward
      this.vx    = rand(-0.12, 0.12);
      this.alpha = rand(0.15, 0.55);
      this.color = this.pickColor();
    }

    pickColor() {
      const palette = [
        "255,200,180",   // soft coral
        "200,210,255",   // lavender-blue
        "255,230,160",   // warm yellow
        "180,230,255",   // ice blue
        "240,200,255",   // blush
      ];
      return palette[randInt(0, palette.length - 1)];
    }

    draw() {
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grd.addColorStop(0,   `rgba(${this.color},${this.alpha})`);
      grd.addColorStop(1,   `rgba(${this.color},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    update() {
      this.x += this.vx + Math.sin(Date.now() * 0.0004 + this.y) * 0.08;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
  }

  /* ══════════════════════════════════════════
     SUN GLARE (static soft orb top-right)
  ══════════════════════════════════════════ */
  function drawSun() {
    const sx = canvas.width * 0.82;
    const sy = canvas.height * 0.12;
    const sr = canvas.width * 0.18;
    const g  = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    g.addColorStop(0,   "rgba(255,248,220,0.55)");
    g.addColorStop(0.3, "rgba(255,235,180,0.25)");
    g.addColorStop(1,   "rgba(255,235,180,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ── Initialise objects ── */
  const CLOUD_COUNT = 9;
  const MOTE_COUNT  = 55;

  const clouds = Array.from({ length: CLOUD_COUNT }, () => new Cloud(false));
  const motes  = Array.from({ length: MOTE_COUNT  }, () => new Mote());

  /* ── Render loop ── */
  function frame() {
    const W = canvas.width, H = canvas.height;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,   SKY_TOP);
    sky.addColorStop(0.5, SKY_MID);
    sky.addColorStop(1,   SKY_BOTTOM);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Sun glare
    drawSun();

    // Clouds (back layer — slower, more transparent)
    clouds.slice(0, 4).forEach(c => { c.update(); c.draw(); });

    // Motes
    motes.forEach(m => { m.update(); m.draw(); });

    // Clouds (front layer)
    clouds.slice(4).forEach(c => { c.update(); c.draw(); });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

})();