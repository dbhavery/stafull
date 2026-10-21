/* StaFull marketing interactions, nav, scroll-reveal, live hero card. Vanilla, no deps. */
(function () {
  // ---- mobile menu ----
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- scroll reveal ----
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    var els = document.querySelectorAll('[data-rise]');
    Array.prototype.forEach.call(els, function (el, i) { el.style.transitionDelay = (Math.min(i, 6) * 55) + 'ms'; io.observe(el); });
  }

  // ---- year ----
  var y = document.getElementById('year'); if (y) y.textContent = '2026';

  // ---- live hero delivery scene ----
  var fill = document.getElementById('scene-fill');
  var hose = document.getElementById('scene-hose');
  if (hose && !reduce) { var off = 0; setInterval(function () { off = (off - 2) % 16; hose.setAttribute('stroke-dashoffset', off); }, 90); }
  if (fill && !reduce) {
    var CAP = 60, PUMP = 3.94, OURS = 3.79, pct = 42;
    var pctEl = document.getElementById('scene-pct'), saveEl = document.getElementById('scene-save');
    var t = setInterval(function () {
      pct += 1.0 + (pct % 3) * 0.15;
      if (pct >= 100) pct = 100;
      var gal = (pct / 100) * CAP;
      fill.style.width = pct.toFixed(1) + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      if (saveEl) saveEl.textContent = '$' + (gal * (PUMP - OURS)).toFixed(2);
      if (pct >= 100) { clearInterval(t); var l = document.querySelector('.sc-label'); if (l) l.textContent = 'Delivery complete · Ford F-250'; }
    }, 900);
  }
})();
