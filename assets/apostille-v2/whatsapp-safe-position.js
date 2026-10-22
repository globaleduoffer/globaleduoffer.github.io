/* Apostille V2 preview only: move the existing floating link, never the page content.
   No click listener, URL rewrite, analytics change, or shared-code dependency. */
(function () {
  'use strict';
  var main = document.querySelector('main.apostille-v2');
  var link = document.querySelector('body > a.wa-float');
  if (!main || !link) return;
  var small = window.matchMedia('(max-width: 768px)');
  var boxes = [], frame = 0, dirty = true;
  var gap = 12, edge = 18;

  function storeRect(rect) {
    if (rect.width > 1 && rect.height > 1) {
      boxes.push({left: rect.left + window.scrollX, right: rect.right + window.scrollX,
        top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY});
    }
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
    /* Protect whole heading areas, click targets and images, including the background illustration. */
    document.querySelectorAll('h1,h2,h3,h4,h5,h6,a[href],button,summary,input,textarea,select,img,svg,video,iframe').forEach(function (element) {
      if (element === link || element.closest('.wa-float,.visually-hidden,[aria-hidden="true"]')) return;
      if (getComputedStyle(element).visibility === 'hidden') return;
      /* FAQ summaries include a visible plus/minus control in the right gutter.
         Protect the complete click target, including that control. */
      Array.prototype.forEach.call(element.getClientRects(), storeRect);
    });
    dirty = false;
  }
  function update() {
    frame = 0;
    if (!small.matches) {
      link.classList.remove('av2-wa-managed');
      link.removeAttribute('data-av2-wa-ready');
      link.removeAttribute('data-av2-wa-gap');
      link.removeAttribute('data-av2-wa-suppressed');
      link.style.removeProperty('--av2-wa-bottom');
      return;
    }
    link.classList.add('av2-wa-managed');
    if (dirty) rebuild();
    var rect = link.getBoundingClientRect();
    var height = document.documentElement.clientHeight;
    var lower = height - edge, upper = 12;
    function lowestSlot(clearance) {
      var intervals = [];
      boxes.forEach(function (box) {
        if (box.right - window.scrollX + clearance <= rect.left || box.left - window.scrollX - clearance >= rect.right) return;
        var top = box.top - window.scrollY - clearance;
        var bottom = box.bottom - window.scrollY + clearance;
        if (bottom > upper && top < lower) intervals.push([Math.max(upper, top), Math.min(lower, bottom)]);
      });
      intervals.sort(function (a, b) { return a[0] - b[0]; });
      var cursor = upper, slots = [];
      intervals.forEach(function (interval) {
        if (interval[0] - cursor >= rect.height) slots.push([cursor, interval[0]]);
        cursor = Math.max(cursor, interval[1]);
      });
      if (lower - cursor >= rect.height) slots.push([cursor, lower]);
      return slots.length ? slots[slots.length - 1] : null;
    }
    var clearance = gap, last = lowestSlot(clearance);
    if (!last) { clearance = 8; last = lowestSlot(clearance); }
    if (last) {
      /* Stay near the original corner; use an 8px minimum only in a dense viewport. */
      link.style.setProperty('--av2-wa-bottom', Math.ceil(height - last[1]) + 'px');
      link.setAttribute('data-av2-wa-gap', String(clearance));
      link.removeAttribute('data-av2-wa-suppressed');
    } else {
      /* A full-screen menu / dense viewport must not be covered. Inline WhatsApp links remain. */
      link.setAttribute('data-av2-wa-suppressed', '');
    }
    link.setAttribute('data-av2-wa-ready', '');
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
  small.addEventListener('change', invalidate);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(invalidate);
    [main, document.querySelector('nav.navbar'), document.querySelector('.ga-footer')].forEach(function (element) {
      if (element) observer.observe(element);
    });
  }
  if (document.fonts) {
    document.fonts.ready.then(invalidate);
    document.fonts.addEventListener('loadingdone', invalidate);
  }
  invalidate();
})();
