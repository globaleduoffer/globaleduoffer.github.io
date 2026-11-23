(()=>{'use strict';const root=document.querySelector('.ed-page');if(!root)return;
if('IntersectionObserver'in window){const toc=[...root.querySelectorAll('.ed-toc a')];const io=new IntersectionObserver(es=>{const hit=es.find(e=>e.isIntersecting);if(!hit)return;toc.forEach(a=>{if(a.hash==='#'+hit.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -65% 0px'});toc.forEach(a=>{const h=document.getElementById(a.hash.slice(1));if(h)io.observe(h)})}
})();
