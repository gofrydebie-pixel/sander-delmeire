/* ==========================================================================
   THEME SWITCHER
   --------------------------------------------------------------------------
   Swaps the data-theme attribute on <html>. Every colour and font in the
   site reads from tokens.css, so that one attribute changes the whole
   design direction.

   The switch in the header is temporary scaffolding so Sander can compare
   directions. Set REVIEW_MODE to false to remove it and ship one direction.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Configuration --------------------------------------------------- */

  var REVIEW_MODE = true;   // false hides the theme switch entirely
  var SHOW_FLAGS  = true;   // false hides the yellow unverified-copy markers

  var THEMES = [
    { id: 'klei',     label: 'Klei',     note: 'warm, ambachtelijk' },
    { id: 'praktijk', label: 'Praktijk', note: 'rustig, klinisch' }
  ];

  var STORAGE_KEY = 'sd-theme';
  var DEFAULT = THEMES[0].id;


  /* --- State ----------------------------------------------------------- */

  function read() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return THEMES.some(function (t) { return t.id === v; }) ? v : null;
    } catch (e) {
      return null;
    }
  }

  function write(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* private mode */ }
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') || DEFAULT;
  }

  function apply(id) {
    document.documentElement.setAttribute('data-theme', id);
    write(id);
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeBtn === id));
    });
  }

  function cycle() {
    var i = THEMES.findIndex(function (t) { return t.id === current(); });
    apply(THEMES[(i + 1) % THEMES.length].id);
  }


  /* --- Boot ------------------------------------------------------------ */
  /* An inline script in <head> sets data-theme before first paint so there
     is no flash. This re-applies it once the DOM is ready, which also
     syncs the button states. */

  apply(read() || DEFAULT);

  if (!SHOW_FLAGS) {
    document.body.setAttribute('data-flags', 'off');
  }


  /* --- Theme switch (in the header) ---------------------------------- */

  if (!REVIEW_MODE) return;
  if (new URLSearchParams(location.search).get('review') === '0') return;

  var header = document.querySelector('.site-header__inner');
  if (!header) return;

  var bar = document.createElement('div');
  bar.className = 'theme-switch';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Ontwerp kiezen');
  bar.title = 'Ontwerp wisselen (toets T)';

  THEMES.forEach(function (t) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-switch__btn';
    btn.dataset.themeBtn = t.id;
    btn.title = t.note;
    btn.setAttribute('aria-pressed', String(t.id === current()));
    btn.textContent = t.label;
    btn.addEventListener('click', function () { apply(t.id); });
    bar.appendChild(btn);
  });

  // Before the mobile menu button, so the switch stays outside the menu
  header.insertBefore(bar, header.querySelector('.nav-toggle'));

  document.addEventListener('keydown', function (e) {
    if (e.key !== 't' && e.key !== 'T') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var el = document.activeElement;
    if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
    cycle();
  });
})();
