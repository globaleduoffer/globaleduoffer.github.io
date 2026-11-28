/* Reuses the PCC editorial checklist and TOC patterns, with route-specific review guidance. */
(()=>{
'use strict';
const root=document.querySelector('body.pcc-legalization-v2 .pcc-legalization-page');
if(!root||root.dataset.pccLegalizationInitialized)return;
root.dataset.pccLegalizationInitialized='true';
const boxes=[...root.querySelectorAll('.ed-check')],out=root.querySelector('#ed-count'),bar=root.querySelector('#ed-progress'),copy=root.querySelector('.ed-copy'),status=root.querySelector('.ed-copy-status');
if(boxes.length&&out&&bar&&copy&&status){
 const update=()=>{const count=boxes.filter(b=>b.checked).length;out.textContent=count+' of '+boxes.length+' confirmed';bar.max=boxes.length;bar.value=count};
 boxes.forEach(b=>b.addEventListener('change',update));copy.hidden=false;update();
 copy.addEventListener('click',async()=>{
  const text='My China PCC Authentication Checklist\n\n'+boxes.map(b=>(b.checked?'[x] ':'[ ] ')+b.value).join('\n')+'\n\nThis checklist is for preliminary preparation only and does not establish authentication eligibility or guaranteed acceptance by the receiving organization.';
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



const tool=root.querySelector('section[aria-labelledby="authentication-review"]');
if(tool){
 const use=tool.querySelector('#review-use'),country=tool.querySelector('#review-country'),docTitle=tool.querySelector('#review-document-title'),docText=tool.querySelector('#review-document-text'),routeTitle=tool.querySelector('#review-route-title'),routeText=tool.querySelector('#review-route-text'),requirementsNote=tool.querySelector('#review-requirements-notes'),useNote=tool.querySelector('#review-use-notes'),locationNote=tool.querySelector('#review-location-notes'),existingNote=tool.querySelector('#review-existing-notes'),wa=tool.querySelector('#review-whatsapp'),openStatus=tool.querySelector('#review-open-status');
 const boxes=[...tool.querySelectorAll('input[name="review-requirement"]')];
 if(use&&country&&docTitle&&docText&&routeTitle&&routeText&&requirementsNote&&useNote&&locationNote&&existingNote&&wa&&openStatus&&boxes.length){
  const form=()=>tool.querySelector('input[name="review-form"]:checked');
  const location=()=>tool.querySelector('input[name="review-location"]:checked');
  const label=el=>el?.closest('label')?.querySelector('span')?.textContent.trim()||'Not specified';
  const choice=el=>el.value?el.selectedOptions[0].textContent.trim():'Not specified';
  const unsure=boxes.find(b=>b.value==='unsure');
  const statusAdvice={
   missing:['Confirm Your Police Certificate Application First','Before arranging an Apostille or consular legalization, confirm whether you can obtain the required Chinese police certificate and which document form will be accepted by the receiving authority.'],
   original:['Review the Required Document Preparation','Review your original Chinese police certificate and confirm whether notarization, translation or another official preparation step is required before authentication.'],
   notarized:['Review Your Existing Notarial Certificate','Confirm whether your existing notarial certificate is in the accepted form and whether any further authentication is required for its intended overseas use.'],
   apostilled:['Confirm Acceptance of Your Existing Apostille',"Review the existing Apostille, underlying document and receiving authority's requirements before arranging any additional procedure."],
   legalized:['Confirm Acceptance of Your Existing Legalization',"Review the existing legalization and confirm whether it satisfies the receiving authority's requirements for the intended use."],
   copy:['Confirm the Accepted Document Form','A copy or scanned document may be useful for preliminary review. Confirm whether an original, certified copy or another eligible document form is required for formal processing.'],
   electronic:['Confirm Electronic Document Acceptance','Confirm whether the relevant authorities and receiving organization accept the electronic police certificate and its available official verification or certification format.'],
   unsure:['Clarify Your Current Document Status','Further clarification of your police certificate and its current document form is recommended before selecting an authentication procedure.']
  };
  const routeAdvice={
   conflict:['Conflicting Authentication Requirements',"Your selections include both a request for authentication and an indication that no additional authentication is required. Clarify the receiving authority's instructions before arranging any procedure."],
   both:['Clarify the Requested Authentication Route','Both Apostille and consular legalization have been selected. These are different authentication routes and should not automatically be arranged as consecutive steps. Confirm the exact requirement with the receiving authority before proceeding.'],
   apostille:['Apostille Route — Subject to Confirmation',"An Apostille has been requested. Confirm that the applicable Convention framework and the document's official form support the requested authentication procedure."],
   legalization:['Consular Legalization Route — Subject to Confirmation','Consular legalization has been requested. Confirm the applicable authentication framework and the requirements of the relevant Chinese and destination-country authorities.'],
   none:['Additional Authentication May Not Be Required','If the receiving authority accepts your current document form without an Apostille or consular legalization, additional authentication may not be necessary. Confirm any remaining notarization, translation or submission requirements.'],
   unknown:["Confirm the Receiving Authority's Requirements",'Ask the receiving authority whether it requires notarization, an Apostille, consular legalization, translation or another document form before selecting an authentication route.']
  };
  const extraAdvice={
   'pcc-original':'Confirm whether the original Chinese police certificate must be submitted separately or together with any notarial or authentication documents.',
   notarization:'Confirm the required type and scope of the notarial certificate.',
   translation:'Confirm the accepted translation language, translator qualifications and required translation format.',
   original:'Confirm the exact original or certified document form accepted by the receiving organization.',
   other:"Obtain the receiving authority's written instructions for any additional document preparation requirements."
  };
  const useAdvice={
   immigration:"Confirm the immigration authority's accepted police certificate format, translation requirements and document recency requirements.",
   visa:'Confirm the specific document instructions for your visa or residence permit application.',
   employment:'Confirm the requirements of your employer and any relevant work permit or regulatory authority.',
   licensing:'Confirm the document requirements of the relevant professional registration or licensing body.',
   education:'Confirm the document format and authentication requirements specified by the educational institution or relevant authority.'
  };
  const locationAdvice={
   china:'Confirm the available document preparation and authentication arrangements based on your current document and the relevant issuing or authentication authorities.',
   overseas:'Remote assistance may be possible, depending on the document form, original-document availability and applicable authorization requirements.'
  };
  const selected=()=>boxes.filter(b=>b.checked);
  const enforce=target=>{
   if(target===unsure&&unsure.checked)boxes.forEach(b=>{if(b!==unsure)b.checked=false});
   else if(target&&boxes.includes(target)&&target!==unsure&&target.checked){if(unsure)unsure.checked=false}
   else if(unsure?.checked)boxes.forEach(b=>{if(b!==unsure)b.checked=false});
  };
  const update=()=>{
   const status=form()?.value||'unsure',current=statusAdvice[status]||statusAdvice.unsure;docTitle.textContent=current[0];docText.textContent=current[1];
   const requirements=selected(),values=requirements.map(b=>b.value);
   const apo=values.includes('apostille'),legal=values.includes('legalization'),none=values.includes('none');
   let route='unknown';
   if(none&&(apo||legal))route='conflict';
   else if(apo&&legal)route='both';
   else if(apo)route='apostille';
   else if(legal)route='legalization';
   else if(none)route='none';
   const result=routeAdvice[route];routeTitle.textContent=result[0];routeText.textContent=result[1];
   requirementsNote.textContent=requirements.map(b=>extraAdvice[b.value]).filter(Boolean).join('\n\n');
   useNote.textContent=useAdvice[use.value]||'Confirm the receiving organization’s preparation and submission requirements for your intended use.';
   locationNote.textContent=locationAdvice[location()?.value]||'';
   existingNote.textContent=['apostilled','legalized'].includes(status)?'An existing authentication is not by itself an instruction to repeat it or add another authentication. Confirm acceptance of the existing documents first.':'';
  };
  tool.addEventListener('change',event=>{enforce(event.target);update()});enforce(null);update();
  let nextOpenAt=0;
  wa.addEventListener('click',event=>{
   event.preventDefault();const now=Date.now();
   if(now<nextOpenAt){openStatus.textContent='Please wait a moment before opening another review enquiry.';return}
   nextOpenAt=now+800;
   const requirements=selected().map(label);
   const message='Hello Global Attest,\n\nI would like to request a preliminary review of the authentication requirements for my Chinese police certificate.\n\nDestination country / region: '+choice(country)+'\nIntended use: '+choice(use)+'\nCurrent document status: '+label(form())+'\nReceiving authority requirements: '+(requirements.length?requirements.join(', '):'Not specified')+'\nCurrent location: '+label(location())+'\n\nCould you please advise whether any further notarization, an Apostille, consular legalization or translation may be required for my document?\n\nThank you.';
   if(typeof window.trackGAEvent==='function')window.trackGAEvent('whatsapp_click',{event_category:'engagement',event_label:'pcc_legalization_review_tool',link_url:'https://wa.me/8617620130150'});
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
