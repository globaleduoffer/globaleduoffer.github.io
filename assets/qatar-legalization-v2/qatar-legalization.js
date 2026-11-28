/* Page-scoped Editorial V2 checklist, review guidance and TOC. No storage or automatic submission. */
(()=>{
'use strict';
/* PURE_ASSESS_START */
function assess(d){
 const r=d.requirements||[],has=v=>r.includes(v);
 const conflict=(has('none')||has('unsure'))&&r.length>1 ||
  d.availability==='missing'&&!!d.status&&!['unsure'].includes(d.status) ||
  d.status==='copy'&&['original','both'].includes(d.availability) ||
  d.status==='original'&&d.availability==='scan' ||
  d.translation==='none'&&has('translation');
 const uncertain=['type','location','status','use','availability','translation','deadline'].some(k=>!d[k]||['unsure','other'].includes(d[k]))||!r.length||has('unsure')||has('none');
 let route='Confirm the accepted document form and potential China MFA / authorized FAO → competent Qatar mission route, with Qatar MOFA only where required.';
 if(uncertain)route='A manual review of the available documents and recipient instructions is needed before confirming the applicable route.';
 if(d.status==='mfa')route='Confirm whether the existing China MFA / FAO certification meets the competent Qatar mission’s current intake requirements. Do not automatically repeat completed steps.';
 if(d.status==='apostilled')route='An Apostille alone should not be assumed to replace Qatar consular legalization. The applicable route should be confirmed before proceeding.';
 if(d.status==='mission')route='Review the existing Qatar diplomatic mission legalization and confirm any Qatar MOFA attestation or remaining recipient requirements before arranging further steps.';
 if(d.availability==='missing')route='Confirm how to obtain the required source document before planning subsequent preparation and authentication.';
 if(d.location==='separate')route='Hong Kong, Macau and Taiwan documents require separate route review. Do not apply the mainland China route automatically.';
 if(conflict)route='Some of your selections require clarification before the applicable legalization route can be confirmed.';
 const preparation={
 academic:'Confirm the degree or graduation certificate, corresponding transcript, consent documentation and any supporting evidence specified by the applicable instructions.',
 commercial:'Confirm the issuing or certifying authority, appropriate commercial certification route and company authorization records. Check whether the Certificate of Origin and invoice must be submitted together.',
 judicial:'Confirm the judicial document’s nature, issuing authority and applicable certification requirements.',
 personal:'Identify the exact personal record and accepted original, notarial or certified form.',
 multiple:'Review each document category separately; a single preparation route must not be assumed.',
 unsure:'Provide available document scans for preliminary human review; scans are not necessarily sufficient for formal processing.'
 }[d.type]||'Identify the exact document category and available source records.';
 const jurisdiction=d.location==='separate'?'Separate territorial route review is required. No mainland mission is assigned.':'No mission is assigned automatically from the selected location. Reconfirm issuing location, notarial office, China-side intake, document category and the Qatar mission’s current consular jurisdiction.';
 let additional='Confirm the recipient’s written instructions, accepted language and translation certification. A chosen language is not an official mandatory rule. The selected deadline is a request, not a processing-time commitment.';
 if(has('mofa'))additional+=' Confirm the Qatar MOFA service applicable to this filing.';
 if(has('support'))additional+=' Obtain the exact supporting-document instructions.';
 if(d.status==='copy'||d.availability==='scan')additional+=' Confirm whether originals or an accepted certified form are required; scans support preliminary review only.';
 if(uncertain)additional+=' Unspecified or uncertain choices require human confirmation.';
 return {route,preparation,jurisdiction,additional,next:conflict?'Clarify the inconsistent selections with the receiving organization before arranging a procedure.':'Request a preliminary document review and reconfirm current official requirements before submission.',conflict};
}
/* PURE_ASSESS_END */
const root=document.querySelector('.ga-qatar-legalization-v2');
if(!root||root.dataset.qatarInitialized)return;
root.dataset.qatarInitialized='true';
const $=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
async function copyText(text,status){
 if(!status)return;
 const old=status.parentNode.querySelector('.qatar-copy-fallback');if(old)old.remove();
 try{
  if(!navigator.clipboard||!window.isSecureContext)throw Error('unavailable');
  await navigator.clipboard.writeText(text);status.textContent='Copied to clipboard';return;
 }catch{
  const area=document.createElement('textarea');area.className='qatar-copy-fallback';area.readOnly=true;area.value=text;area.setAttribute('aria-label','Text available for manual copying');status.after(area);area.focus();area.select();
  let copied=false;try{copied=!!document.execCommand&&document.execCommand('copy')}catch{}
  if(copied){status.textContent='Copied to clipboard';area.remove()}else status.textContent='Automatic copying is unavailable. Select and copy the text below.';
 }
}
const checks=all('.ed-check'),count=$('#ed-count'),progress=$('#ed-progress'),checkStatus=$('#check-status');
function updateChecklist(){const n=checks.filter(b=>b.checked).length;if(count)count.textContent=n+' of '+checks.length+' completed ('+Math.round(n/checks.length*100)+'%)';if(progress){progress.max=checks.length;progress.value=n}}
checks.forEach(b=>b.addEventListener('change',updateChecklist));updateChecklist();
$('#check-copy')?.addEventListener('click',()=>copyText('China-to-Qatar Document Legalization Checklist\n\n'+checks.map(b=>(b.checked?'[x] ':'[ ] ')+b.value).join('\n')+'\n\nPreparation only; not confirmation of eligibility or acceptance.',checkStatus));
$('#check-reset')?.addEventListener('click',()=>{checks.forEach(b=>b.checked=false);updateChecklist();if(checkStatus){checkStatus.textContent='Checklist reset';const a=checkStatus.parentNode.querySelector('.qatar-copy-fallback');if(a)a.remove()}});
const fields=['type','location','status','use','availability','translation','deadline'],selects=fields.map(k=>$('#review-'+k)),reqs=all('input[name="review-requirement"]'),tool=$('#qatar-review')?.parentNode,wa=$('#review-whatsapp'),feedback=$('#review-feedback');
if(tool&&wa&&feedback&&selects.every(Boolean)&&reqs.length){
 const read=()=>Object.fromEntries([...fields.map((k,i)=>[k,selects[i].value]),['requirements',reqs.filter(b=>b.checked).map(b=>b.value)]]);
 function enforce(target){
  if(!reqs.includes(target)||!target.checked)return;
  if(['none','unsure'].includes(target.value))reqs.forEach(b=>{if(b!==target)b.checked=false});
  else reqs.forEach(b=>{if(['none','unsure'].includes(b.value))b.checked=false});
 }
 function update(){const result=assess(read());for(const k of ['route','preparation','jurisdiction','additional','next']){const el=$('#review-'+k);if(el)el.textContent=result[k]}return result}
 tool.addEventListener('change',e=>{enforce(e.target);update()});update();
 function message(){
  const labels=['Document type','Document issuing location','Current document status','Intended use in Qatar','Document availability','Translation requirements','Processing deadline'];
  const lines=selects.map((s,i)=>labels[i]+': '+(s.value?s.selectedOptions[0].textContent.trim():'Not specified'));
  lines.splice(4,0,'Receiving organization requirements: '+(reqs.filter(b=>b.checked).map(b=>b.closest('label').querySelector('span').textContent.trim()).join(', ')||'Not specified'));
  return 'Hello Global Attest,\n\nI would like to request a China-to-Qatar document legalization review.\n\n'+lines.join('\n')+'\n\nCould you please advise on the applicable legalization route, required documents, estimated processing time and service fee?\n\nThank you.';
 }
 $('#review-copy')?.addEventListener('click',()=>{const r=update();copyText(message()+'\n\nPreliminary guidance only:\n'+['route','preparation','jurisdiction','additional','next'].map(k=>r[k]).join('\n\n'),feedback)});
 $('#review-reset')?.addEventListener('click',()=>{selects.forEach(s=>s.value='');reqs.forEach(b=>b.checked=false);update();feedback.textContent='Review selections reset';const a=feedback.parentNode.querySelector('.qatar-copy-fallback');if(a)a.remove()});
 let nextOpenAt=0;
 wa.addEventListener('click',e=>{
  e.preventDefault();const now=Date.now();if(now<nextOpenAt){feedback.textContent='Please wait a moment before opening another enquiry.';return}nextOpenAt=now+800;
  // The DOM href stays a constant base URL: selections/text never reach link analytics.
  const url='https://wa.me/8617620130150?text='+encodeURIComponent(message());
  if(typeof window.trackGAEvent==='function')window.trackGAEvent('whatsapp_click',{event_category:'engagement',event_label:'qatar_legalization_review_tool'});
  try{window.open(url,'_blank','noopener,noreferrer');feedback.textContent='A WhatsApp window was requested. If it did not open, wait a moment and try again.'}catch{feedback.textContent='WhatsApp could not be opened. Please use another contact option.'}
 });
}
if('IntersectionObserver'in window){
 const links=all('.ed-toc a,.ed-mobile-toc a'),seen=new Set();
 const io=new IntersectionObserver(es=>{const hit=es.find(e=>e.isIntersecting);if(!hit)return;links.forEach(a=>{if(a.hash==='#'+hit.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -65% 0px'});
 links.forEach(a=>{const h=document.getElementById(a.hash.slice(1));if(h&&!seen.has(h)){seen.add(h);io.observe(h)}});
}
})();
