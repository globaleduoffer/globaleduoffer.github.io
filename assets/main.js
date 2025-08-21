
(function(){
  const root = document.documentElement;
  function setLang(lang){
    root.classList.remove('lang-zh','lang-en');
    root.classList.add(lang==='en' ? 'lang-en' : 'lang-zh');
    try{ localStorage.setItem('lang', lang); }catch(e){}
    const zh = document.getElementById('btn-zh'), en = document.getElementById('btn-en');
    if(zh && en){ zh.classList.toggle('active', lang!=='en'); en.classList.toggle('active', lang==='en'); }
  }
  window._setLang = setLang;
  setLang((()=>{ try{ return localStorage.getItem('lang'); }catch(e){ return null } })() || 'zh');
  document.addEventListener('click', e=>{
    if(e.target && e.target.id==='btn-zh') setLang('zh');
    if(e.target && e.target.id==='btn-en') setLang('en');
    if(e.target && e.target.classList.contains('faq-q')){
      const ans = e.target.nextElementSibling;
      if(ans) ans.style.display = ans.style.display==='block' ? 'none' : 'block';
    }
  });
  try {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar .nav-link[data-file]').forEach(a=>{
      if(a.getAttribute('data-file')===path){ a.classList.add('active-link'); }
    });
  } catch(e){}
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
})();
