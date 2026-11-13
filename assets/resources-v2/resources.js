/* Progressive enhancement. All resource links are present in the source HTML. */
(function(){
 'use strict';
 var root=document.querySelector('main.rs-v2');if(!root)return;
 var form=root.querySelector('.rs-search'),input=root.querySelector('#resource-search'),clear=root.querySelector('.rs-clear'),status=root.querySelector('#resource-results'),empty=root.querySelector('.rs-empty'),all=root.querySelector('.rs-all-link'),cards=Array.from(root.querySelectorAll('.rs-resource-card')),categories=Array.from(root.querySelectorAll('.rs-category-card'));
 var valid=new Set(categories.map(function(x){return x.dataset.category;}));
 var state={category:'all',q:''};
 var labels=new Map(categories.map(function(a){return[a.dataset.category,a.querySelector('strong').textContent];}));
 var index=cards.map(function(card){return{card:card,category:card.dataset.category,text:(card.textContent+' '+labels.get(card.dataset.category)+' '+card.dataset.keywords+' '+card.querySelector('a').getAttribute('href')).toLowerCase()};});
 function read(){var p=new URL(location.href).searchParams;state.category=valid.has(p.get('category'))?p.get('category'):'all';state.q=(p.get('q')||'').slice(0,160);input.value=state.q;}
 function updateURL(mode){var u=new URL(location.href);u.search='';if(state.category!=='all')u.searchParams.set('category',state.category);if(state.q)u.searchParams.set('q',state.q);history[mode+'State'](null,'',u.pathname+u.search+u.hash);}
 function render(mode){var words=state.q.trim().toLowerCase().split(/\s+/).filter(Boolean),count=0;index.forEach(function(x){var show=(state.category==='all'||x.category===state.category)&&words.every(function(w){return x.text.includes(w);});x.card.hidden=!show;if(show)count++;});categories.forEach(function(a){if(a.dataset.category===state.category)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});clear.hidden=!state.q;empty.hidden=count!==0;status.textContent=count===cards.length&&state.category==='all'&&!state.q?'Showing all '+cards.length+' resources':count+' resource'+(count===1?'':'s')+' found';if(mode)updateURL(mode);document.dispatchEvent(new Event('resources:results-changed'));}
 function toResults(){var title=root.querySelector('#resources-heading');title.focus({preventScroll:true});root.querySelector('#resource-list').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
 input.addEventListener('input',function(){state.q=input.value.slice(0,160);render('replace');});
 form.addEventListener('submit',function(e){e.preventDefault();state.q=input.value.slice(0,160);render('replace');toResults();});
 clear.addEventListener('click',function(){state.q='';input.value='';render('replace');input.focus();});
 categories.forEach(function(a){a.addEventListener('click',function(e){if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();state.category=a.dataset.category;render('push');toResults();});});
 all.addEventListener('click',function(e){if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();state.category='all';state.q='';input.value='';render('push');toResults();});
 window.addEventListener('popstate',function(){read();render();});
 read();render();
})();

/* Existing floating WhatsApp safe-position method, scoped to Resources only. */
/* Three-page targeted fix, derived from the existing PCC/Apostille safe-position
   algorithm. Moves only the original floating link; never rewrites links or events. */
(function () {
  'use strict';
  var main = document.querySelector('main.rs-v2');
  var link = document.querySelector('body > a.wa-float');
  if (!main || !link || window.gaWhatsAppSafeInitialized) return;
  window.gaWhatsAppSafeInitialized = true;
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
