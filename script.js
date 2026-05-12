import posthog from 'posthog-js'

posthog.init('phc_wzTH2xXgFCypcF8phpQffq7KuG5Qike5F2vcpnvRrCdH', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30'
})

var FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/borel/Borel-Regular.ttf';
var SVG_W       = 720;
var HELLO_SIZE  = 148;
var HELLO_Y     = 168;
var WD_SIZE     = 110;
var WD_Y        = 195;
var STROKE_W    = 2;

/* ── helpers ── */
function after(ms, fn) { setTimeout(fn, ms); }

/* animate a single <path> drawing on */
function animatePath(el, done) {
  var len = el.getTotalLength();
  el.style.strokeDasharray  = len;
  el.style.strokeDashoffset = len;
  el.style.opacity = '1';
  el.style.transition = 'none';
  after(20, function () {
    var dur = Math.max(350, len * 1.6);
    el.style.transition = 'stroke-dashoffset ' + dur + 'ms cubic-bezier(0.4,0,0.2,1)';
    el.style.strokeDashoffset = '0';
    after(dur + 80, done || function () {});
  });
}

/* draw paths one after another */
function animateSequence(paths, i, done) {
  if (i >= paths.length) { if (done) done(); return; }
  animatePath(paths[i], function () {
    animateSequence(paths, i + 1, done);
  });
}

/* build SVG path elements from font glyphs, return {paths, totalWidth} */
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

/* center a <g> horizontally in the SVG */
function centerGroup(group, totalWidth) {
  var offset = (SVG_W - totalWidth) / 2;
  group.setAttribute('transform', 'translate(' + offset + ',0)');
  return offset;
}

/* ── main ── */
opentype.load(FONT_URL, function (err, font) {
  if (err) { console.error('Font failed to load:', err); return; }

  var hGroup     = document.getElementById('hello-group');
  var wGroup     = document.getElementById('wd-group');
  var strikeLine = document.getElementById('strike-line');

  /* build glyph paths for the text */
  var hResult = buildGlyphs(font, 'hello',   hGroup, 'hg', HELLO_SIZE, HELLO_Y);
  // initially thought to write webdev but changed to grader
  var wResult = buildGlyphs(font, 'world!', wGroup, 'wg', WD_SIZE,    WD_Y);
  
  /* center both rows */
  var hOffset = centerGroup(hGroup, hResult.totalWidth);
  centerGroup(wGroup, wResult.totalWidth);


  /* ── animation sequence ── */
  after(400, function () {

    /* 1. draw hello letter by letter */
    animateSequence(hResult.paths, 0, function () {

      /* 2. fill hello solid */
      hResult.paths.forEach(function (p) { p.setAttribute('fill', 'url(#hg)'); });

      after(350, function () {

        /* 3. draw strikethrough */
        strikeLine.style.transition = 'stroke-dashoffset 0.55s ease';
        strikeLine.style.strokeDashoffset = '0';

        after(650, function () {

          /* 4. dim hello */
          hGroup.style.transition = 'opacity 0.5s ease';
          hGroup.style.opacity    = '0.18';

          after(450, function () {

            /* 5. draw Web Dev letter by letter */
            wGroup.style.opacity = '1';
            animateSequence(wResult.paths, 0, function () {

              /* 6. fill Web Dev solid */
              wResult.paths.forEach(function (p) { p.setAttribute('fill', 'url(#wg)'); });
            });
          });
        });
      });
    });
  });
});


// Welcome button
document.addEventListener('DOMContentLoaded', function() {

    const button = document.querySelector('.home-button');

    if(button){

        button.addEventListener('click', function() {

            // CHANGE TEXT

            button.textContent = 'Welcome!';


            // GO TO PAGE AFTER DELAY

            setTimeout(function(){

                window.location.href = 'about_me.html';

            }, 250);

        });

    }

});

// Music Controls
window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-music");
  const btn   = document.getElementById("audio-btn");

  if (!audio || !btn) return;

  const savedTime = localStorage.getItem("audioTime");
  if (savedTime) audio.currentTime = parseFloat(savedTime);

  let unlocked = false;

  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    audio.play().then(() => {
      btn.textContent = "Created by Suno & Me | ⏸ Pause Mirrorball Funk";
    });
  };

  // Try immediately
  audio.play()
    .then(() => {
      unlocked = true;
      btn.textContent = "Created by Suno & Me | ⏸ Pause Mirrorball Funk";
    })
    .catch(() => {
      btn.textContent = "Created by Suno & Me | ▶ Click to Listen Mirrorball Funk";
      // Any click anywhere unlocks it
      document.addEventListener("click", unlock, { once: true });
    });

  // Button toggles pause/play
  btn.addEventListener("click", () => {
    if (!unlocked) {
      unlock();
      return;
    }
    if (audio.paused) {
      audio.play();
      btn.textContent = "Created by Suno & Me | ⏸ Pause Mirrorball Funk";
    } else {
      audio.pause();
      btn.textContent = "Created by Suno & Me | ▶ Click to Listen Mirrorball Funk";
    }
  });

  setInterval(() => {
    localStorage.setItem("audioTime", audio.currentTime);
  }, 1000);
});