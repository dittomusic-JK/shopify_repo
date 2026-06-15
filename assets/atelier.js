/* Riffride Atelier — motion & audio mini-player.
   - Reveals elements with .atl-reveal as they scroll into view.
   - Drives the docked audio mini-player (#atl-player).
   Any element with [data-atl-play] starts a track:
     data-atl-title="..."  (label shown in the player)
     data-atl-src="..."    (optional audio URL; if absent, runs a silent preview)
*/
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveals ---- */
  function initReveals() {
    var els = document.querySelectorAll('.atl-reveal');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Audio mini-player ---- */
  function initPlayer() {
    var player = document.getElementById('atl-player');
    if (!player) return;

    var btn = player.querySelector('[data-atl-toggle]');
    var titleEl = player.querySelector('[data-atl-track]');
    var fill = player.querySelector('[data-atl-fill]');
    var audio = new Audio();
    var simTimer = null;
    var simPct = 0;
    var playing = false;

    function setIcon() {
      if (!btn) return;
      btn.innerHTML = playing
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
    function open() { player.classList.add('is-open'); }
    function stopSim() { if (simTimer) { clearInterval(simTimer); simTimer = null; } }
    function startSim() {
      stopSim();
      simTimer = setInterval(function () {
        simPct = (simPct + 0.5) % 100;
        if (fill) fill.style.width = simPct.toFixed(1) + '%';
      }, 90);
    }

    audio.addEventListener('timeupdate', function () {
      if (audio.duration && fill) fill.style.width = ((audio.currentTime / audio.duration) * 100).toFixed(1) + '%';
    });

    function play(title, src) {
      open();
      if (titleEl && title) titleEl.textContent = title;
      playing = true; setIcon();
      if (src) {
        stopSim();
        if (audio.src !== src) { audio.src = src; }
        audio.currentTime = 0;
        audio.play().catch(function () { /* autoplay blocked — wait for toggle */ });
      } else {
        simPct = 0; if (fill) fill.style.width = '0%';
        startSim();
      }
    }

    function toggle() {
      playing = !playing; setIcon();
      if (!audio.src) { playing ? startSim() : stopSim(); return; }
      playing ? audio.play().catch(function () {}) : audio.pause();
    }

    if (btn) btn.addEventListener('click', toggle);
    document.querySelectorAll('[data-atl-play]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        play(el.getAttribute('data-atl-title'), el.getAttribute('data-atl-src'));
      });
    });
    setIcon();
  }

  function init() { initReveals(); initPlayer(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
