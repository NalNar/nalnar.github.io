var FONT_URL    = 'https://raw.githubusercontent.com/google/fonts/main/ofl/borel/Borel-Regular.ttf';
var SVG_W       = 720;
var HELLO_SIZE  = 250;
var HELLO_Y     = 168;
var WD_SIZE     = 200;
var WD_Y        = 195;
var STROKE_W    = 2;


/* ============================================================
   HELPERS
   ============================================================ */

function after(ms, fn) { setTimeout(fn, ms); }

/* Animate a single <path> drawing on */
function animatePath(el, done) {
  var len = el.getTotalLength();
  el.style.strokeDasharray  = len;
  el.style.strokeDashoffset = len;
  el.style.opacity          = '1';
  el.style.transition       = 'none';
  after(20, function () {
    var dur = Math.max(90, len * 0.5);
    el.style.transition = 'stroke-dashoffset ' + dur + 'ms cubic-bezier(0.4,0,0.2,1)';
    el.style.strokeDashoffset  = '0';
    after(dur, done || function () {});
  });
}

/* Draw paths one after another */
function animateSequence(paths, i, done) {
  if (i >= paths.length) { if (done) done(); return; }
  animatePath(paths[i], function () {
    animateSequence(paths, i + 1, done);
  });
}

/* Build SVG path elements from font glyphs */
function buildGlyphs(font, text, group, gradId, fontSize, yBaseline) {
  var x     = 0;
  var scale = (1 / font.unitsPerEm) * fontSize;
  var paths = [];

  for (var i = 0; i < text.length; i++) {
    var glyph    = font.charToGlyph(text[i]);
    var pathData = glyph.getPath(x, yBaseline, fontSize);
    var d        = pathData.toPathData(3);

    if (d && d.length > 10) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      el.setAttribute('d', d);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'url(#' + gradId + ')');
      el.setAttribute('stroke-width', STROKE_W);
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.style.opacity = '0';
      group.appendChild(el);
      paths.push(el);
    }

    x += (glyph.advanceWidth || 0) * scale;
  }

  return { paths: paths, totalWidth: x };
}

/* Center a <g> horizontally in the SVG */
function centerGroup(group, totalWidth) {
  var offset = (SVG_W - totalWidth) / 2;
  group.setAttribute('transform', 'translate(' + offset + ',0)');
  return offset;
}


/* ============================================================
   HELLO SVG ANIMATION
   ============================================================ */

opentype.load(FONT_URL, function (err, font) {
  if (err) { console.error('Font failed to load:', err); return; }

  var hGroup     = document.getElementById('hello-group');
  var wGroup     = document.getElementById('wd-group');
  var strikeLine = document.getElementById('strike-line');

  /* Build glyph paths */
  var hResult = buildGlyphs(font, 'hello',  hGroup, 'hg', HELLO_SIZE, HELLO_Y);
  var wResult = buildGlyphs(font, 'world!', wGroup, 'wg', WD_SIZE,    WD_Y);

  /* Center both rows */
  centerGroup(hGroup, hResult.totalWidth);
  centerGroup(wGroup, wResult.totalWidth);

  /* Animation sequence */
  after(0, function () {

    /* 1. Draw "hello" letter by letter */
    animateSequence(hResult.paths, 0, function () {

      /* 2. Fill hello solid */
      hResult.paths.forEach(function (p) { p.setAttribute('fill', 'url(#hg)'); });

      after(150, function () {

        /* 3. Draw strikethrough */
        strikeLine.style.transition       = 'stroke-dashoffset 0.55s ease';
        strikeLine.style.strokeDashoffset = '0';

        after(250, function () {

          /* 4. Dim hello */
          hGroup.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1)';
          hGroup.style.opacity    = '0.18';

          after(350, function () {

            /* 5. Draw "world!" letter by letter */
            wGroup.style.opacity = '1';
            animateSequence(wResult.paths, 0, function () {

              /* 6. Fill "world!" solid */
              wResult.paths.forEach(function (p) { p.setAttribute('fill', 'url(#wg)'); });
            });
          });
        });
      });
    });
  });
});


/* ============================================================
   WELCOME BUTTON
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('.home-button');
  if (!button) return;

  button.addEventListener('click', function () {
    button.textContent = 'Welcome!';
    setTimeout(function () {
      window.location.href = 'about_me.html';
    }, 250);
  });
});


/* ============================================================
   AUDIO — AUTOPLAY ON LOAD WITH CINEMATIC FADE-IN
   ============================================================ */

window.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById('bg-music');
  var btn   = document.getElementById('audio-btn');
  if (!audio || !btn) return;

  /* Restore playback position across page navigations */
  var savedTime = parseFloat(localStorage.getItem('audioTime') || '0');
  if (savedTime > 0) audio.currentTime = savedTime;

  /* Save position every second */
  setInterval(function () {
    if (!audio.paused) localStorage.setItem('audioTime', audio.currentTime);
  }, 1000);

  /* Labels */
  var LABEL_PLAY  = 'Created by Suno & Me | ▶ Click to Listen - Mirrorball Funk';
  var LABEL_PAUSE = 'Created by Suno & Me | ⏸ Pause - Mirrorball Funk';

  /* Smooth volume fade-in from 0 → target */
  function fadeIn(target, stepMs) {
    audio.volume = 0;
    var fade = setInterval(function () {
      audio.volume = Math.min(audio.volume + 0.03, target);
      if (audio.volume >= target) clearInterval(fade);
    }, stepMs || 60);
  }

  /* ── Attempt silent autoplay on load ── */
  audio.volume = 0;
  audio.play()
    .then(function () {
      /* Autoplay allowed — fade in smoothly */
      fadeIn(0.72);
      btn.textContent = LABEL_PAUSE;
    })
    .catch(function () {
      /* Autoplay blocked (common on mobile) —
         wait for any user gesture, then start */
      btn.textContent = LABEL_PLAY;

      function onFirstGesture() {
        audio.play().then(function () {
          fadeIn(0.72);
          btn.textContent = LABEL_PAUSE;
        });
        document.removeEventListener('click',      onFirstGesture);
        document.removeEventListener('touchstart', onFirstGesture);
        document.removeEventListener('keydown',    onFirstGesture);
      }

      document.addEventListener('click',      onFirstGesture, { once: true });
      document.addEventListener('touchstart', onFirstGesture, { once: true });
      document.addEventListener('keydown',    onFirstGesture, { once: true });
    });

  /* ── Button toggles pause / play ── */
  btn.addEventListener('click', function (e) {
    /* Stop this click from also firing the 'onFirstGesture' listener */
    e.stopPropagation();

    if (audio.paused) {
      audio.play().then(function () {
        btn.textContent = LABEL_PAUSE;
      });
    } else {
      audio.pause();
      btn.textContent = LABEL_PLAY;
    }
  });
});