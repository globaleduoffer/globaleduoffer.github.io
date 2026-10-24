/* Contact page scoped copy, derived from the existing PCC/Apostille safe-position
   algorithm. Moves only the original floating link; never rewrites links or events. */
(function () {
  'use strict';
  var main = document.querySelector('main.contact-v2');
  var link = document.querySelector('body > a.wa-float');
  if (!main || !link || window.gaWhatsAppSafeInitialized) return;
  window.gaWhatsAppSafeInitialized = true;
  var mobile = window.matchMedia('(max-width: 768px)');
  var prefix = 'cv2';
  var boxes = [], frame = 0, dirty = true, preferredBottom = 18;

  function storeRect(rect) {
    if (rect.width > 1 && rect.height > 1) boxes.push({
      left: rect.left + window.scrollX, right: rect.right + window.scrollX,
      top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY
    });
  }
  function rebuild() {
    boxes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node, range = document.createRange();
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!node.textContent.trim() || !parent || parent.closest(
        'script,style,noscript,.wa-float,.visually-hidden,[aria-hidden="true"]')) continue;
      if (getComputedStyle(parent).visibility === 'hidden') continue;
      range.selectNodeContents(node);
      Array.prototype.forEach.call(range.getClientRects(), storeRect);
    }
    /* Protect whole interactive targets, including summary padding and +/- controls.
       Non-interactive headings are protected by their actual text lines above;
       their full-width empty boxes are not incorrectly treated as text. */
    document.querySelectorAll('a[href],button,summary,input,textarea,select,img,svg,video,iframe').forEach(function (element) {
      if (element === link || element.closest('.wa-float,.visually-hidden,[aria-hidden="true"]')) return;
      if (getComputedStyle(element).visibility === 'hidden') return;
      Array.prototype.forEach.call(element.getClientRects(), storeRect);
    });
    dirty = false;
  }
  function useExistingAppearance() {
    if (prefix) {
      link.classList.toggle(prefix + '-wa-managed', mobile.matches);
      link.setAttribute('data-' + prefix + '-wa-ready', '');
      link.removeAttribute('data-' + prefix + '-wa-suppressed');
    }
    /* Read the existing breakpoint's bottom offset before applying our override. */
    link.removeAttribute('data-ga-wa-safe');
    var parsed = parseFloat(getComputedStyle(link).bottom);
    preferredBottom = isFinite(parsed) ? Math.max(8, parsed) : 18;
    link.setAttribute('data-ga-wa-safe', '');
  }
  function update() {
    frame = 0;
    if (dirty) { useExistingAppearance(); rebuild(); }
    var rect = link.getBoundingClientRect();
    var height = document.documentElement.clientHeight;
    var upper = 12, lower = height - preferredBottom;
    function lowestSlot(clearance) {
      var intervals = [];
      boxes.forEach(function (box) {
        if (box.right - window.scrollX + clearance <= rect.left || box.left - window.scrollX - clearance >= rect.right) return;
        var top = box.top - window.scrollY - clearance, bottom = box.bottom - window.scrollY + clearance;
        if (bottom > upper && top < lower) intervals.push([Math.max(upper, top), Math.min(lower, bottom)]);
      });
      intervals.sort(function (a, b) { return a[0] - b[0]; });
      var cursor = upper, last = null;
      intervals.forEach(function (interval) {
        if (interval[0] - cursor >= rect.height) last = [cursor, interval[0]];
        cursor = Math.max(cursor, interval[1]);
      });
      if (lower - cursor >= rect.height) last = [cursor, lower];
      return last;
    }
    var clearance = 12, slot = lowestSlot(clearance);
    if (!slot) { clearance = 8; slot = lowestSlot(clearance); }
    if (slot) {
      link.style.setProperty('--ga-wa-safe-bottom', Math.ceil(height - slot[1]) + 'px');
      link.removeAttribute('data-ga-wa-suppressed');
      link.setAttribute('data-ga-wa-gap', String(clearance));
    } else {
      /* Existing safe-position fallback: temporarily avoid a dense viewport or
         full-height menu; do not remove the link. Inline WhatsApp CTAs remain. */
      link.setAttribute('data-ga-wa-suppressed', '');
    }
    link.setAttribute('data-ga-wa-ready', '');
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function invalidate() { dirty = true; schedule(); }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', invalidate, {passive: true});
  window.addEventListener('load', invalidate);
  window.addEventListener('pageshow', invalidate);
  document.addEventListener('load', invalidate, true);
  document.addEventListener('toggle', invalidate, true);
  ['shown.bs.dropdown','hidden.bs.dropdown','shown.bs.collapse','hidden.bs.collapse'].forEach(function (name) {
    document.addEventListener(name, invalidate);
  });
  mobile.addEventListener('change', invalidate);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(invalidate);
    [main, document.querySelector('nav.navbar'), document.querySelector('footer')].forEach(function (element) {
      if (element) observer.observe(element);
    });
  }
  if (document.fonts) {
    document.fonts.ready.then(invalidate);
    document.fonts.addEventListener('loadingdone', invalidate);
  }
  invalidate();
})();
