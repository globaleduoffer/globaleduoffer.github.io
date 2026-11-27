/* Reuses the PCC editorial checklist and TOC patterns, with corporate-specific review guidance. */
(()=>{
'use strict';
const root=document.querySelector('body.commercial-apostille-v2 .commercial-apostille-page');
if(!root||root.dataset.commercialApostilleInitialized)return;
root.dataset.commercialApostilleInitialized='true';
const boxes=[...root.querySelectorAll('.ed-check')],out=root.querySelector('#ed-count'),bar=root.querySelector('#ed-progress'),copy=root.querySelector('.ed-copy'),status=root.querySelector('.ed-copy-status');
if(boxes.length&&out&&bar&&copy&&status){
 const update=()=>{const count=boxes.filter(b=>b.checked).length;out.textContent=count+' of '+boxes.length+' confirmed';bar.max=boxes.length;bar.value=count};
 boxes.forEach(b=>b.addEventListener('change',update));copy.hidden=false;update();
 copy.addEventListener('click',async()=>{
  const text='My Corporate Document Apostille Checklist\n\n'+boxes.map(b=>(b.checked?'[x] ':'[ ] ')+b.value).join('\n')+'\n\nThis checklist is for preliminary preparation only and does not establish document eligibility, corporate authority or guaranteed acceptance by the receiving organization.';
  try{
   if(!navigator.clipboard||!window.isSecureContext)throw Error('clipboard unavailable');
   await navigator.clipboard.writeText(text);
   const previous=root.querySelector('.ed-copy-fallback');if(previous)previous.remove();
   status.textContent='Copied to clipboard';
  }catch{
   status.textContent='Copy is unavailable in this browser. Select and copy the checklist below.';
   let area=root.querySelector('.ed-copy-fallback');
   if(!area){area=document.createElement('textarea');area.className='ed-copy-fallback';area.setAttribute('aria-label','Checklist text to copy');area.readOnly=true;status.after(area)}
   area.value=text;area.focus();area.select();
  }
 });
}

const tool=root.querySelector('section[aria-labelledby="corporate-review"]');
if(tool){
 const type=tool.querySelector('#review-type'),use=tool.querySelector('#review-use'),country=tool.querySelector('#review-country'),primary=tool.querySelector('#review-assessment'),requirementsNote=tool.querySelector('#review-requirements'),hint=tool.querySelector('#review-document-hint'),wa=tool.querySelector('#review-whatsapp'),openStatus=tool.querySelector('#review-open-status');
 const requirementBoxes=[...tool.querySelectorAll('input[name="review-requirement"]')];
 if(type&&use&&country&&primary&&requirementsNote&&hint&&wa&&openStatus&&requirementBoxes.length){
  const unsure=requirementBoxes.find(b=>b.value==='unsure');
  const form=()=>tool.querySelector('input[name="review-form"]:checked');
  const checkedRequirements=()=>requirementBoxes.filter(b=>b.checked);
  const label=el=>el?el.closest('label').querySelector('span').textContent.trim():'Not specified';
  const choice=el=>el.value?el.selectedOptions[0].textContent.trim():'Not specified';
  const formAdvice={
   government:'Confirm the issuing authority, accepted document version and eligibility for the requested authentication procedure. Additional preparation may still be required depending on the document and recipient.',
   registry:"Confirm whether the registry extract is an officially issued record and whether its current form meets the receiving authority's requirements.",
   private:'Your document may need an appropriate notarial or other official certification step before authentication. The required document form, signatures, seals and corporate authority evidence should be reviewed.',
   copy:'Your copy may be useful for preliminary review. Confirm whether an original, certified copy or another eligible document form is required for formal processing.',
   certified:'Review the nature and scope of the existing certification to determine whether it is suitable for the requested authentication procedure and accepted by the receiving authority.',
   electronic:'Confirm whether the competent authority and overseas recipient accept the electronic document or require an officially issued paper version or another certified form.',
   website:'A public website printout may not be equivalent to an officially issued registry record. Confirm whether a formal extract or another certified document is required.',
   unsure:'Select or clarify your available document form to receive general preparation guidance.'
  };
  const requirementsAdvice={
   apostille:'An Apostille has been requested. The applicable Convention framework and eligible document form still need confirmation.',
   notarization:'Confirm the required type and scope of notarization before arranging further document preparation.',
   legalization:'Confirm whether consular legalization is the applicable authentication route for this document and destination.',
   translation:'Confirm the accepted translation language, translator qualifications and required translation format.',
   original:'Confirm the exact original or certified document form accepted by the receiving organization.',
   other:'Clarify any other requirements directly with the receiving organization.'
  };
  const clarify='Further clarification from the receiving authority is recommended before selecting an authentication route.';
  const conflict='Both Apostille and consular legalization have been selected. Clarify the intended authentication route with the receiving authority before arranging either procedure.';
  const authorityHint='The receiving authority may also require supporting evidence of corporate signing or representative authority.';
  const contractHint='The nature of the commercial document and any applicable Convention exclusions should be reviewed before selecting an authentication route.';
  const enforceRequirements=target=>{
   if(!unsure)return;
   if(target===unsure&&unsure.checked)requirementBoxes.forEach(b=>{if(b!==unsure)b.checked=false});
   else if(target&&requirementBoxes.includes(target)&&target!==unsure&&target.checked)unsure.checked=false;
   else if(unsure.checked)requirementBoxes.forEach(b=>{if(b!==unsure)b.checked=false});
  };
  const updateAssessment=()=>{
   const current=form(),values=checkedRequirements().map(b=>b.value),lines=[];
   primary.textContent=formAdvice[current?current.value:'unsure']||formAdvice.unsure;
   if(!values.length||values.includes('unsure'))lines.push(clarify);
   else{
    if(values.includes('apostille')&&values.includes('legalization'))lines.push(conflict);
    values.forEach(v=>{if(requirementsAdvice[v])lines.push(requirementsAdvice[v])});
   }
   requirementsNote.textContent=lines.join('\n\n');
   hint.textContent=['poa','board','shareholder'].includes(type.value)?authorityHint:type.value==='contract'?contractHint:'';
  };
  tool.addEventListener('change',event=>{enforceRequirements(event.target);updateAssessment()});
  enforceRequirements(null);updateAssessment();
  let nextOpenAt=0;
  wa.addEventListener('click',event=>{
   event.preventDefault();
   const now=Date.now();
   if(now<nextOpenAt){openStatus.textContent='Please wait a moment before opening another review enquiry.';return}
   nextOpenAt=now+800;
   const selected=checkedRequirements().map(label);
   const message='Hello Global Attest,\n\nI would like to request a preliminary review of my Chinese company document authentication requirements.\n\nDocument type: '+choice(type)+'\nCurrent document form: '+label(form())+'\nIntended use: '+choice(use)+'\nDestination country / region: '+choice(country)+'\nReceiving authority requirements: '+(selected.length?selected.join(', '):'Not specified')+'\n\nCould you please advise on the appropriate document preparation and authentication requirements?\n\nThank you.';
   if(typeof window.trackGAEvent==='function')window.trackGAEvent('whatsapp_click',{event_category:'engagement',event_label:'commercial_apostille_review_tool',link_url:'https://wa.me/8617620130150'});
   // The fixed anchor and event parameters never expose selections or the encoded message to outbound-link tracking.
   try{
    window.open('https://wa.me/8617620130150?text='+encodeURIComponent(message),'_blank','noopener');
    openStatus.textContent='A WhatsApp review window was requested. If it did not open, wait a moment and try again.';
   }catch{
    openStatus.textContent='WhatsApp could not be opened. Wait a moment and try again, or use another WhatsApp link on this page.';
   }
  });
 }
}
if('IntersectionObserver'in window){
 const links=[...root.querySelectorAll('.ed-toc a')];
 const observer=new IntersectionObserver(entries=>{const hit=entries.find(e=>e.isIntersecting);if(!hit)return;links.forEach(a=>{if(a.hash==='#'+hit.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -65% 0px'});
 links.forEach(a=>{const section=document.getElementById(a.hash.slice(1));if(section)observer.observe(section)});
}
})();
