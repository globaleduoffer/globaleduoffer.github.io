/* Degree Apostille FAQ only; navigation uses the existing Bootstrap implementation. */
(function () {
 'use strict';
 var control=document.querySelector('.da-v2 .da-expand');
 var group=document.getElementById('da-main-faq');
 if(!control||!group)return;
 var items=Array.prototype.slice.call(group.querySelectorAll('details'));
 function sync(){var open=items.every(function(item){return item.open;});control.textContent=open?'Collapse all':'Expand all';control.setAttribute('aria-expanded',String(open));}
 control.addEventListener('click',function(){var expand=!items.every(function(item){return item.open;});items.forEach(function(item){item.open=expand;});sync();});
 items.forEach(function(item){item.addEventListener('toggle',sync);});
 sync();
})();
