/* Progressive safe-image viewing; links still work when JavaScript is unavailable. */
(() => {
  'use strict';
  const root = document.querySelector('.es-page');
  const dialog = root?.querySelector('.es-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const pan = dialog.querySelector('.es-pan');
  const status = dialog.querySelector('.es-zoom-status');
  let opener;
  let zoom = 1;
  function setZoom(value) {
    zoom = Math.max(1, Math.min(3, value));
    image.style.setProperty('--es-zoom', `${zoom * 100}%`);
    status.textContent = ['Fit to view', '200% image view', '300% image view'][zoom - 1];
    dialog.querySelector('[data-zoom="out"]').disabled = zoom === 1;
    dialog.querySelector('[data-zoom="in"]').disabled = zoom === 3;
    pan.scrollTo(0, 0);
  }
  root.querySelectorAll('.es-view').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = `${link.dataset.sampleLabel}: personal and traceable details permanently redacted`;
      dialog.querySelector('#es-viewer-title').textContent = link.dataset.sampleLabel;
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
