/* Client-side enhancement of the complete, crawlable HTML article directory. */
(function () {
  'use strict';
  const root = document.querySelector('.blog-v2');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll('.bl-card'));
  const search = root.querySelector('#blog-search');
  const form = root.querySelector('.bl-search');
  const pager = root.querySelector('.bl-pagination');
  const status = root.querySelector('#blog-results');
  const empty = root.querySelector('.bl-empty');
  const pageSize = 9;
  const categories = new Set(cards.map(card => card.dataset.category));
  categories.add('All Articles'); categories.add('Other Guides');
  const index = cards.map(card => ({card, category: card.dataset.category, text: (card.textContent + ' ' + card.querySelector('a').getAttribute('href')).toLowerCase()}));
  let state = {category: 'All Articles', q: '', page: 1};
  function readURL() {
    const p = new URL(location.href).searchParams;
    state = {category: categories.has(p.get('category')) ? p.get('category') : 'All Articles', q: (p.get('q') || '').slice(0, 200), page: Math.max(1, parseInt(p.get('page'), 10) || 1)};
    search.value = state.q;
  }
  function urlFor(page) {
    const u = new URL('blog.html', location.href);
    if (state.category !== 'All Articles') u.searchParams.set('category', state.category);
    if (state.q) u.searchParams.set('q', state.q);
    if (page > 1) u.searchParams.set('page', page);
    u.hash = 'all-articles';
    return u.pathname + u.search + u.hash;
  }
  function pageLink(label, page, disabled, current) {
    const e = document.createElement(disabled ? 'span' : 'a');
    e.textContent = label;
    if (disabled) e.setAttribute('aria-disabled', 'true');
    else { e.href = urlFor(page); e.dataset.page = page; }
    if (current) e.setAttribute('aria-current', 'page');
    if (label === '←') e.setAttribute('aria-label', 'Previous page');
    if (label === '→') e.setAttribute('aria-label', 'Next page');
    return e;
  }
  function render(historyMode) {
    const words = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matched = index.filter(x => (state.category === 'All Articles' || x.category === state.category) && words.every(word => x.text.includes(word)));
    const pages = Math.max(1, Math.ceil(matched.length / pageSize));
    state.page = Math.min(state.page, pages);
    const shown = new Set(matched.slice((state.page - 1) * pageSize, state.page * pageSize).map(x => x.card));
    cards.forEach(card => { card.hidden = !shown.has(card); });
    root.querySelectorAll('.bl-filter').forEach(link => {
      const active = link.dataset.category === state.category;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
    empty.hidden = matched.length !== 0;
    status.textContent = matched.length ? 'Showing ' + ((state.page - 1) * pageSize + 1) + '–' + Math.min(state.page * pageSize, matched.length) + ' of ' + matched.length + ' articles' : '0 articles';
    pager.replaceChildren();
    pager.hidden = matched.length <= pageSize;
    if (!pager.hidden) {
      pager.append(pageLink('←', state.page - 1, state.page === 1, false));
      for (let p = 1; p <= pages; p++) pager.append(pageLink(String(p), p, false, p === state.page));
      pager.append(pageLink('→', state.page + 1, state.page === pages, false));
    }
    document.dispatchEvent(new Event('blog:results-changed'));
    if (historyMode) history[historyMode + 'State'](null, '', urlFor(state.page));
  }
  root.addEventListener('click', function (event) {
    const link = event.target.closest('a[data-category], a[data-page]');
    if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (link.dataset.category) { state.category = link.dataset.category; state.page = 1; }
    else state.page = Number(link.dataset.page);
    render('push');
    root.querySelector('#all-articles').scrollIntoView({block: 'start', behavior: 'auto'});
  });
  search.addEventListener('input', function () {state.q = search.value.slice(0,200); state.page = 1; render('replace');});
  form.addEventListener('submit', function (event) {event.preventDefault(); state.q = search.value.slice(0,200); state.page = 1; render('replace');});
  window.addEventListener('popstate', function () {readURL(); render();});
  readURL(); render();
  const year = document.getElementById('y');
  if (year) year.textContent = new Date().getFullYear();
})();
/* Blog-only adaptation of the existing safe-position algorithm. Shared source stays unchanged. */
/* Three-page targeted fix, derived from the existing PCC/Apostille safe-position
   algorithm. Moves only the original floating link; never rewrites links or events. */
(function () {
  'use strict';
  var main = document.querySelector('main.blog-v2');
  var link = document.querySelector('body > a.wa-float');
  if (!main || !link || window.gaBlogWhatsAppSafeInitialized) return;
  window.gaBlogWhatsAppSafeInitialized = true;
  var mobile = window.matchMedia('(max-width: 768px)');
  var prefix = main.matches('main.pcc-v3') ? 'pcc' : main.matches('main.apostille-v2') ? 'av2' : null;
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
  document.addEventListener('blog:results-changed', invalidate);
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
