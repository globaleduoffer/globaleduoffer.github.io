/* Page-local floating WhatsApp avoidance. FAQ uses native, keyboard-accessible details. */
(function () {
  'use strict';
  var page=document.querySelector('body.ga-canada-page');
  if(!page || page.dataset.canadaReady) return;
  page.dataset.canadaReady='true';
  var floating=page.querySelector('.cp-wa-float'), menu=page.querySelector('#nav'), footer=page.querySelector('.ga-footer'), pending=false;
  if(!floating) return;
  function update(){
    pending=false;
    var small=window.innerWidth<576, width=small?50:140;
    var box={left:window.innerWidth-width-14,right:window.innerWidth-14,top:window.innerHeight-66,bottom:window.innerHeight-14};
    var menuOpen=menu && window.innerWidth<1200 && (menu.classList.contains('show')||menu.classList.contains('collapsing'));
    var footerVisible=footer && footer.getBoundingClientRect().top<window.innerHeight;
    var collision=Array.from(page.querySelectorAll('main a,main summary,main p,main h2,main h3,main li,main dt,main dd')).some(function(el){
      if(!el.getClientRects().length)return false;
      var r=el.getBoundingClientRect();
      return r.bottom>box.top-10 && r.top<box.bottom+10 && r.right>box.left-10 && r.left<box.right+10;
    });
    floating.hidden=document.activeElement!==floating && !!(menuOpen||footerVisible||collision);
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  ['scroll','resize','load','pageshow'].forEach(function(event){window.addEventListener(event,schedule,{passive:true});});
  ['toggle','shown.bs.collapse','hidden.bs.collapse','shown.bs.dropdown','hidden.bs.dropdown'].forEach(function(event){document.addEventListener(event,schedule,true);});
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(page);
  if(document.fonts)document.fonts.ready.then(schedule);
  schedule();
})();
