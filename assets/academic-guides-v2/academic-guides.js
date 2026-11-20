/* Page-only anchor enhancement; all guide links and native details work without JavaScript. */
(() => {
  'use strict';
  const root = document.querySelector('.cg-page');
  if (!root) return;
  root.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const hash = link.getAttribute('href');
    const target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (!target || !root.contains(target)) return;
    event.preventDefault();
    history.pushState(null, '', hash);
    target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
  }));
})();
