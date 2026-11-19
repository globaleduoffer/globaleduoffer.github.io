/* Safe, progressive enhancement. Only the already-redacted same-origin images can enter the viewer. */
(() => {
  'use strict';
  const root = document.querySelector('.cv-page');
  const dialog = root?.querySelector('.cv-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.cv-pan img');
  const pan = dialog.querySelector('.cv-pan');
  const status = dialog.querySelector('.cv-zoom-status');
  let opener;
  let zoom = 1;
  function setZoom(value) {
    zoom = Math.min(3, Math.max(1, value));
    image.style.setProperty('--cv-zoom', `${zoom * 100}%`);
    status.textContent = ['Fit to view', '200% image view', '300% image view'][zoom - 1];
    dialog.querySelector('[data-zoom="out"]').disabled = zoom === 1;
    dialog.querySelector('[data-zoom="in"]').disabled = zoom === 3;
    pan.scrollTo(0, 0);
  }
  root.querySelectorAll('a.cv-view').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const target = new URL(link.href);
      if (target.origin !== location.origin || !target.pathname.includes('/assets/chsi-resource-v2/images/') || !(target.pathname.endsWith('-redacted-full.webp') || ["chsi-degree-verification-chinese-redacted.webp", "chsi-degree-verification-english-redacted.webp", "chsi-qualification-verification-chinese-redacted.webp", "chsi-qualification-verification-english-redacted.webp"].includes(target.pathname.split('/').pop()))) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = `${link.dataset.sampleLabel}; real sample with personal and traceable details permanently redacted`;
      dialog.querySelector('#cv-viewer-title').textContent = link.dataset.sampleLabel;
      setZoom(1);
      dialog.showModal();
    });
  });
  dialog.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    setZoom(button.dataset.zoom === 'reset' ? 1 : zoom + (button.dataset.zoom === 'in' ? 1 : -1));
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
})();
