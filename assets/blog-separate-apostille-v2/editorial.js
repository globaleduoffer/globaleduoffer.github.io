/* Reference TOC behavior without the PCC-only checklist dependency. FAQ uses native details/summary. */
(()=>{'use strict';const root=document.querySelector('.ed-page.sa-page');if(!root||!('IntersectionObserver'in window))return;
const toc=[...root.querySelectorAll('.ed-toc a[href^="#"]')];
const observer=new IntersectionObserver(entries=>{const hit=entries.find(entry=>entry.isIntersecting);if(!hit)return;
toc.forEach(link=>{if(link.hash==='#'+hit.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
},{rootMargin:'-10% 0px -65% 0px'});
toc.forEach(link=>{const heading=document.getElementById(link.hash.slice(1));if(heading)observer.observe(heading)});
})();
