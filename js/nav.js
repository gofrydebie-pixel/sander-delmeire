/* ==========================================================================
   MOBILE MENU
   --------------------------------------------------------------------------
   Opens and closes the header menu on small screens. Closes again after a
   link is tapped, on Escape, and when the screen grows to desktop width.
   ========================================================================== */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');
  if (!header || !btn || !menu) return;

  function set(open) {
    header.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu');
  }

  btn.addEventListener('click', function () {
    set(btn.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) set(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') set(false);
  });

  var desktop = window.matchMedia('(min-width: 56rem)');
  var onChange = function (m) { if (m.matches) set(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else if (desktop.addListener) desktop.addListener(onChange);
})();
