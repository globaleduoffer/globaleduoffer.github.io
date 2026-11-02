/* Page-only filters; native case disclosures remain usable without JavaScript. */
(function () {
  'use strict';
  var page = document.querySelector('body.ga-cases-page');
  if (!page || page.dataset.casesInitialized) return;
  page.dataset.casesInitialized = 'true';
  var cards = Array.from(page.querySelectorAll('.cs-card'));
  var filters = page.querySelector('.cs-filters');
  var buttons = Array.from(page.querySelectorAll('[data-filter]'));
  var more = page.querySelector('#cs-load-more');
  var status = page.querySelector('#cs-results-status');
  var empty = page.querySelector('.cs-empty');
  var selected = 'all';
  var limit = 6;
  function render() {
    var matched = cards.filter(function (card) { return selected === 'all' || card.dataset.category === selected; });
    cards.forEach(function (card) { card.hidden = matched.indexOf(card) === -1 || matched.indexOf(card) >= limit; });
    buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.filter === selected)); });
    more.hidden = matched.length <= limit;
    empty.hidden = matched.length > 0;
    status.textContent = matched.length ? '显示 ' + matched.length + ' 条案例中的 ' + Math.min(limit, matched.length) + ' 条。' : '此分类目前暂无案例。';
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { selected = button.dataset.filter; limit = 6; render(); }); });
  more.addEventListener('click', function () {
    var firstHidden = cards.find(function (card) { return card.hidden && (selected === 'all' || card.dataset.category === selected); });
    limit = cards.length; render();
    if (firstHidden) { firstHidden.setAttribute('tabindex', '-1'); firstHidden.focus({preventScroll:true}); firstHidden.scrollIntoView({block:'start'}); }
  });
  page.querySelectorAll('[data-open-record]').forEach(function (link) { link.addEventListener('click', function () {
    var record = document.getElementById(link.dataset.openRecord);
    if (record) { var disclosure = record.querySelector('details'); if (disclosure) disclosure.open = true; }
  }); });
  function revealHash() {
    var id; try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    var target = document.getElementById(id);
    var card = target && target.closest('.cs-card');
    if (card && card.hidden) { selected = 'all'; limit = cards.length; render(); }
    if (card) { var disclosure = card.querySelector('details'); if (disclosure) disclosure.open = true; card.scrollIntoView({block:'start'}); }
  }
  filters.hidden = false;
  render(); revealHash();
  window.addEventListener('hashchange', revealHash);
  // Hide rather than relocate the floating control when it could cover text,
  // links or the footer. Inline WhatsApp consultation links stay available.
  var floating = page.querySelector('.cs-wa-float');
  var menu = page.querySelector('#nav');
  var footer = page.querySelector('.ga-footer');
  var pending = false;
  function safePosition() {
    pending = false;
    var focused = document.activeElement === floating;
    var menuOpen = menu && (menu.classList.contains('show') || menu.classList.contains('collapsing')) && window.innerWidth < 1200;
    var footerVisible = footer && footer.getBoundingClientRect().top < window.innerHeight;
    var r = floating.getBoundingClientRect();
    // Retain the normal footprint even after display:none, so it can reappear.
    if (!r.width) r = {left:window.innerWidth - (window.innerWidth < 576 ? 62 : 152),right:window.innerWidth-14,top:window.innerHeight-66,bottom:window.innerHeight-14};
    var collision = Array.from(page.querySelectorAll('main a, main button, main summary, main p, main h2, main h3')).some(function (el) {
      if (!el.getClientRects().length) return false;
      var b = el.getBoundingClientRect();
      return b.right > r.left-8 && b.left < r.right+8 && b.bottom > r.top-8 && b.top < r.bottom+8;
    });
    floating.hidden = !focused && (menuOpen || footerVisible || collision);
  }
  function schedule() { if (!pending) { pending = true; window.requestAnimationFrame(safePosition); } }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  page.addEventListener('toggle', schedule, true);
  page.addEventListener('click', schedule);
  ['shown.bs.collapse','hidden.bs.collapse','show.bs.collapse','hide.bs.collapse'].forEach(function (name) { page.addEventListener(name, schedule); });
  schedule();
})();
