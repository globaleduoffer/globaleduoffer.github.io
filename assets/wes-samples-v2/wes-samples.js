/* Progressive enhancement: only approved, flattened, redacted report images. */
(() => {
  'use strict';
  const root = document.querySelector('.ws-page');
  const dialog = root?.querySelector('.ws-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.ws-pan img');
  const pan = dialog.querySelector('.ws-pan');
  const status = dialog.querySelector('.ws-zoom-status');
  const allowed = ['summary', 'course-by-course', 'continuation', 'terms'].map(key => `wes-${key}-redacted-full.webp`);
  let zoom = 1;
  let opener;
  function setZoom(value) {
    zoom = Math.min(3, Math.max(1, value));
    image.style.setProperty('--ws-zoom', `${zoom * 100}%`);
    status.textContent = zoom === 1 ? 'Fit to view' : `${zoom * 100}% image view`;
    dialog.querySelector('[data-zoom="out"]').disabled = zoom === 1;
    dialog.querySelector('[data-zoom="in"]').disabled = zoom === 3;
    pan.scrollTo(0, 0);
  }
  root.querySelectorAll('a.ws-view').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || !target.pathname.includes('/assets/wes-samples-v2/images/') || !allowed.includes(target.pathname.split('/').pop())) return;
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = `${link.dataset.sampleLabel}; personal identifiers and individual academic results permanently redacted`;
    dialog.querySelector('#ws-viewer-title').textContent = link.dataset.sampleLabel;
    setZoom(1);
    dialog.showModal();
  }));
  image.addEventListener('error', () => { status.textContent = 'Image unavailable. Close the viewer and try opening the sample in a new tab.'; });
  dialog.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => setZoom(button.dataset.zoom === 'reset' ? 1 : zoom + (button.dataset.zoom === 'in' ? 1 : -1))));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
})();
