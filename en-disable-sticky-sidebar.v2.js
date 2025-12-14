/**
 * EN pages – Disable sticky sidebar via JS (optional helper)
 * Use this only if a sticky plugin keeps re-injecting inline styles/classes.
 */
(function () {
  function isEnglishPage() {
    return document.documentElement && document.documentElement.lang === 'en';
  }

  function neutralize(node) {
    if (!node || !node.style) return;
    node.style.position = 'static';
    node.style.top = 'auto';
    node.style.bottom = 'auto';
    node.style.left = 'auto';
    node.style.right = 'auto';
    node.style.transform = 'none';
    node.classList.remove('is-sticky','sticky','affix','affixed','sidebar-sticky','widget-sticky','theiaStickySidebar','sticky-sidebar');
  }

  function run() {
    if (!isEnglishPage()) return;

    // Neutralize any nodes currently acting sticky
    var candidates = document.querySelectorAll(
      '.theiaStickySidebar, .sticky-sidebar, .is-sticky, .sticky, .affix, .affixed, .sidebar-sticky, .widget-sticky, [style*="position:sticky"], [style*="position: fixed"], [style*="position:fixed"]'
    );
    candidates.forEach(neutralize);

    // Also neutralize common sidebar containers if present
    var containers = document.querySelectorAll('.right-sidebar, .sidebar, .sidebar-wrap, aside');
    containers.forEach(neutralize);
  }

  document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);

  // If a plugin re-applies styles on scroll, keep re-neutralizing lightly
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      run();
      ticking = false;
    });
  }, { passive: true });
})();