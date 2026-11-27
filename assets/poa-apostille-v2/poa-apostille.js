/* Reuses the PCC editorial checklist and TOC patterns, with POA-specific review guidance. */
(()=>{
'use strict';
const root=document.querySelector('body.poa-apostille-v2 .poa-apostille-page');
if(!root||root.dataset.poaApostilleInitialized)return;
root.dataset.poaApostilleInitialized='true';
const boxes=[...root.querySelectorAll('.ed-check')],out=root.querySelector('#ed-count'),bar=root.querySelector('#ed-progress'),copy=root.querySelector('.ed-copy'),status=root.querySelector('.ed-copy-status');
if(boxes.length&&out&&bar&&copy&&status){
 const update=()=>{const count=boxes.filter(b=>b.checked).length;out.textContent=count+' of '+boxes.length+' confirmed';bar.max=boxes.length;bar.value=count};
 boxes.forEach(b=>b.addEventListener('change',update));copy.hidden=false;update();
 copy.addEventListener('click',async()=>{
  const text='My Power of Attorney Apostille Checklist\n\n'+boxes.map(b=>(b.checked?'[x] ':'[ ] ')+b.value).join('\n')+'\n\nThis checklist is for preliminary preparation only and does not establish the legal validity of a power of attorney, authentication eligibility or guaranteed acceptance by the receiving organization.';
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


const tool=root.querySelector('section[aria-labelledby="poa-review"]');
if(tool){
 const use=tool.querySelector('#review-use'),country=tool.querySelector('#review-country'),title=tool.querySelector('#review-result-title'),primary=tool.querySelector('#review-assessment'),typeHint=tool.querySelector('#review-document-hint'),useHint=tool.querySelector('#review-use-hint'),requirementsNote=tool.querySelector('#review-requirements'),wa=tool.querySelector('#review-whatsapp'),openStatus=tool.querySelector('#review-open-status');
 const requirementBoxes=[...tool.querySelectorAll('input[name="review-requirement"]')];
 if(use&&country&&title&&primary&&typeHint&&useHint&&requirementsNote&&wa&&openStatus&&requirementBoxes.length){
  const type=()=>tool.querySelector('input[name="review-type"]:checked');
  const form=()=>tool.querySelector('input[name="review-form"]:checked');
  const label=el=>el?.closest('label')?.querySelector('span')?.textContent.trim()||'Not specified';
  const choice=el=>el.value?el.selectedOptions[0].textContent.trim():'Not specified';
  const unsure=requirementBoxes.find(b=>b.value==='unsure');
  const statusAdvice={
   draft:['Confirm Requirements Before Signing',"Confirm the receiving authority's required template, wording, scope of authorization, signature procedure, witness requirements and required notarial act before signing your power of attorney."],
   private:['Review the Required Official Act','Your privately signed power of attorney may require an appropriate notarial or other official certification step before authentication. Confirm whether the existing signature is acceptable or whether re-signing is required.'],
   witness:['Confirm the Required Witness and Certification Procedure','A witnessed signature does not automatically establish eligibility for an Apostille. Confirm whether the receiving authority requires an additional notarial or other official act.'],
   company:['Confirm Corporate Signing Authority','A company signature or seal alone does not establish Apostille eligibility. Review the signing authority, supporting corporate documents and any required official certification.'],
   notarized:['Review the Existing Notarial Certificate',"Confirm the nature and scope of the existing notarial act and whether it meets the receiving authority's requirements and the applicable authentication procedure."],
   copy:['Confirm the Accepted Document Form','A copy or scanned document may be useful for preliminary review. Confirm whether an original, certified copy or another eligible document form is required for formal processing.'],
   electronic:['Confirm Electronic Document Acceptance','Confirm whether the competent authority and receiving organization accept the electronic document, its signature method and any associated official certification.'],
   unsure:['Clarify Your Current Document Status','Further clarification of your power of attorney and its current document form is recommended before selecting a preparation or authentication route.']
  };
  const typeAdvice={
   corporate:'The receiving authority may also require supporting evidence of corporate signing or representative authority.',
   personal:'Confirm any identity, personal appearance, signature and witness requirements applicable to your intended use.'
  };
  const corporateUse='Confirm the scope of corporate authorization and any supporting evidence of signing authority.';
  const useAdvice={
   property:'Confirm whether the relevant property authority requires prescribed wording, specific authorization clauses or a particular execution procedure.',
   estate:'Confirm whether the receiving organization requires additional estate-related documents or specific authorization wording.',
   bank:"Confirm the bank's own power of attorney requirements, as financial institutions may require prescribed forms or additional verification.",
   legal:'Confirm the applicable representation requirements with the receiving court, authority or qualified legal professional.',
   corporate:corporateUse,commercial:corporateUse
  };
  const requirementAdvice={
   template:'Obtain the required template and confirm its wording before arranging the signing or notarization procedure.',
   signature:'Confirm the required signing procedure and any witness qualifications before executing the document.',
   notarization:'Confirm the required type and scope of the notarial act.',
   apostille:'An Apostille has been requested. The applicable Convention framework and eligible official act still need confirmation.',
   legalization:'Confirm whether consular legalization is the applicable authentication route for this document and destination.',
   translation:'Confirm the accepted translation language, translator qualifications and required translation format.',
   original:'Confirm the exact original or certified document form accepted by the receiving organization.',
   other:'Clarify any other requirements directly with the receiving organization.'
  };
  const clarify='Further clarification from the receiving authority is recommended before selecting an authentication route.';
  const conflict='Both Apostille and consular legalization have been selected. Clarify the intended authentication route with the receiving authority before arranging either procedure.';
  const enforce=target=>{
   if(target===unsure&&unsure.checked)requirementBoxes.forEach(b=>{if(b!==unsure)b.checked=false});
   else if(target&&requirementBoxes.includes(target)&&target!==unsure&&target.checked){if(unsure)unsure.checked=false}
   else if(unsure?.checked)requirementBoxes.forEach(b=>{if(b!==unsure)b.checked=false});
  };
  const selected=()=>requirementBoxes.filter(b=>b.checked);
  const update=()=>{
   const advice=statusAdvice[form()?.value]||statusAdvice.unsure;title.textContent=advice[0];primary.textContent=advice[1];
   typeHint.textContent=typeAdvice[type()?.value]||'';
   useHint.textContent=useAdvice[use.value]||'Confirm the recipient’s document preparation and execution requirements for your intended use.';
   const requirements=selected();const values=requirements.map(b=>b.value);const lines=[];
   if(!requirements.length||values.includes('unsure'))lines.push(clarify);
   else{
    if(values.includes('apostille')&&values.includes('legalization'))lines.push(conflict);
    requirements.forEach(b=>lines.push(requirementAdvice[b.value]));
   }
   requirementsNote.textContent=lines.join('\n\n');
  };
  tool.addEventListener('change',event=>{enforce(event.target);update()});enforce(null);update();
  let nextOpenAt=0;
  wa.addEventListener('click',event=>{
   event.preventDefault();const now=Date.now();
   if(now<nextOpenAt){openStatus.textContent='Please wait a moment before opening another review enquiry.';return}
   nextOpenAt=now+800;
   const requirements=selected().map(label);
   const message='Hello Global Attest,\n\nI would like to request a preliminary review of my Power of Attorney notarization and authentication requirements.\n\nPower of Attorney type: '+label(type())+'\nIntended use: '+choice(use)+'\nCurrent document status: '+label(form())+'\nDestination country / region: '+choice(country)+'\nReceiving authority requirements: '+(requirements.length?requirements.join(', '):'Not specified')+'\n\nCould you please advise on the appropriate document preparation, signing, notarization and authentication requirements?\n\nThank you.';
   if(typeof window.trackGAEvent==='function')window.trackGAEvent('whatsapp_click',{event_category:'engagement',event_label:'poa_apostille_review_tool',link_url:'https://wa.me/8617620130150'});
   try{
    window.open('https://wa.me/8617620130150?text='+encodeURIComponent(message),'_blank','noopener');
    openStatus.textContent='A WhatsApp review window was requested. If it did not open, wait a moment and try again.';
   }catch{openStatus.textContent='WhatsApp could not be opened. Wait a moment and try again, or use another WhatsApp link on this page.'}
  });
 }
}
if('IntersectionObserver'in window){
 const links=[...root.querySelectorAll('.ed-toc a')];
 const observer=new IntersectionObserver(entries=>{const hit=entries.find(e=>e.isIntersecting);if(!hit)return;links.forEach(a=>{if(a.hash==='#'+hit.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -65% 0px'});
 links.forEach(a=>{const section=document.getElementById(a.hash.slice(1));if(section)observer.observe(section)});
}
})();
