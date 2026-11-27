/* Reuses the PCC editorial checklist and TOC patterns, with page-local route guidance. */
(()=>{
'use strict';
const root=document.querySelector('body.pcc-apostille-v2 .pcc-apostille-page');
if(!root||root.dataset.pccApostilleInitialized)return;
root.dataset.pccApostilleInitialized='true';
const boxes=[...root.querySelectorAll('.ed-check')],out=root.querySelector('#ed-count'),bar=root.querySelector('#ed-progress'),copy=root.querySelector('.ed-copy'),status=root.querySelector('.ed-copy-status');
if(boxes.length&&out&&bar&&copy&&status){
 const update=()=>{const count=boxes.filter(b=>b.checked).length;out.textContent=count+' of '+boxes.length+' confirmed';bar.max=boxes.length;bar.value=count};
 boxes.forEach(b=>b.addEventListener('change',update));copy.hidden=false;update();
 copy.addEventListener('click',async()=>{
  const text='My PCC Authentication Checklist\n\n'+boxes.map(b=>(b.checked?'[x] ':'[ ] ')+b.value).join('\n')+'\n\nThis checklist is for preliminary preparation only and does not establish document eligibility or guarantee acceptance by the receiving authority.';
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
const guide=root.querySelector('section[aria-labelledby="route-guide"]');
if(guide){
 const country=guide.querySelector('#route-country'),assessment=guide.querySelector('#route-assessment'),note=guide.querySelector('#route-document-note'),wa=guide.querySelector('#route-whatsapp');
 if(country&&assessment&&note&&wa){
  const selected=name=>guide.querySelector('input[name="route-'+name+'"]:checked');
  const label=el=>el?el.closest('label').querySelector('span').textContent.trim():'Not specified';
  const assessments={
   police:'An Apostille is not explicitly indicated in the selected instruction. Review the complete requirements before arranging additional authentication.',
   notarized:'Confirm the required notarial document and its accepted format. Any additional authentication requirements should be checked separately.',
   apostilled:'An Apostille has been explicitly requested. Confirm the applicable authentication route, the eligible underlying document and any required notarization or translation before proceeding.',
   legalized:'Clarify whether consular legalization or another authentication procedure is intended, and confirm the applicable requirements.',
   unsure:'Further clarification from the receiving authority is recommended before selecting an authentication route.'
  };
  const notes={
   none:'Your underlying China PCC application requirements should also be reviewed.',
   original:'Confirm whether your original police-issued document requires notarization or another preparation step before authentication.',
   notarial:'The existing notarial certificate should be reviewed to confirm whether it is suitable for the requested authentication procedure.',
   scan:'A scanned copy may be useful for preliminary review, but formal submission requirements and the need for originals must be confirmed.',
   other:'Clarify the available document type before planning formal submission.'
  };
  const updateRoute=()=>{const req=selected('requirement'),doc=selected('document');assessment.textContent=assessments[req?req.value:'unsure']||assessments.unsure;note.textContent=doc?(notes[doc.value]||''):''};
  guide.addEventListener('change',updateRoute);updateRoute();
  wa.addEventListener('click',event=>{
   event.preventDefault();
   const destination=country.value?country.selectedOptions[0].textContent.trim():'Not specified';
   const message='Hello Global Attest,\n\nI would like a preliminary review of my China Police Certificate authentication requirements.\n\nDestination country: '+destination+'\nReceiving authority requirement: '+label(selected('requirement'))+'\nAvailable document: '+label(selected('document'))+'\nCurrent location: '+label(selected('location'))+'\n\nCould you please advise which document preparation and authentication requirements need to be confirmed?\n\nThank you.';
   // Keep the anchor and analytics link_url free of form data; open the encoded message only after this deliberate click.
   window.open('https://wa.me/8617620130150?text='+encodeURIComponent(message),'_blank','noopener');
  });
 }
}
if('IntersectionObserver'in window){
 const links=[...root.querySelectorAll('.ed-toc a')];
 const observer=new IntersectionObserver(entries=>{const hit=entries.find(e=>e.isIntersecting);if(!hit)return;links.forEach(a=>{if(a.hash==='#'+hit.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -65% 0px'});
 links.forEach(a=>{const section=document.getElementById(a.hash.slice(1));if(section)observer.observe(section)});
}
})();
