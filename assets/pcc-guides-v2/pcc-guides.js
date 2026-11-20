/* Progressive enhancement: every original guide remains in HTML and visible without JS. */
(() => {
  'use strict';
  const root = document.querySelector('.pg-page');
  if (!root) return;
  const button = root.querySelector('[data-pg-expand]');
  const more = root.querySelector('#pg-complex-more');
  if (button && more) {
    const total = root.querySelectorAll('[aria-labelledby="complex-cases"] .pg-card').length;
    const label = `View All ${total} Guides`;
    more.hidden = true;
    button.hidden = false;
    button.addEventListener('click', () => {
      const expand = button.getAttribute('aria-expanded') !== 'true';
      more.hidden = !expand;
      button.setAttribute('aria-expanded', String(expand));
      button.textContent = expand ? 'Show Fewer Guides ↑' : `${label} ↓`;
    });
  }
  root.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const hash = link.getAttribute('href');
    const target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (!target || !root.contains(target)) return;
    event.preventDefault();
    history.pushState(null, '', hash);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }));
})();
