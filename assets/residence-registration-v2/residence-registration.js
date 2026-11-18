/* Progressive image zoom; FAQ uses native, keyboard-accessible details/summary. */
(() => {
  'use strict';
  const root = document.querySelector('.rr-v2');
  if (!root) return;
  const viewer = root.querySelector('.rr-viewer');
  let opener;
  if (viewer && typeof viewer.showModal === 'function') {
    const image = viewer.querySelector('img');
    const status = viewer.querySelector('.rr-zoom-status');
    const pan = viewer.querySelector('.rr-viewer-pan');
    const setZoom = (value) => {
      const zoom = Math.max(1, Math.min(3, value));
      viewer.dataset.zoom = String(zoom);
      status.textContent = ['Fit to view', 'Enlarged view', 'Maximum zoom'][zoom - 1];
      pan.scrollTo(0, 0);
      viewer.querySelector('[data-rr-zoom="out"]').disabled = zoom === 1;
      viewer.querySelector('[data-rr-zoom="in"]').disabled = zoom === 3;
    };
    root.querySelectorAll('.rr-open-sample').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        opener = link;
        image.src = link.href;
        setZoom(1);
        viewer.showModal();
      });
    });
    viewer.querySelectorAll('[data-rr-zoom]').forEach((button) => {
      button.addEventListener('click', () => {
        const zoom = Number(viewer.dataset.zoom);
        setZoom(button.dataset.rrZoom === 'reset' ? 1 : zoom + (button.dataset.rrZoom === 'in' ? 1 : -1));
      });
    });
    viewer.querySelector('[data-rr-close]').addEventListener('click', () => viewer.close());
    viewer.addEventListener('close', () => opener?.focus());
  }
  root.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const destination = document.getElementById(link.getAttribute('href').slice(1));
      if (!destination || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.replaceState(null, '', link.getAttribute('href'));
      destination.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
