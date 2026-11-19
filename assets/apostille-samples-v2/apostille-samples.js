/* Progressive image zoom; FAQ uses native, keyboard-accessible details/summary. */
(() => {
  'use strict';
  const root = document.querySelector('.aps-page');
  if (!root) return;
  const viewer = root.querySelector('.aps-viewer');
  let opener;
  if (viewer && typeof viewer.showModal === 'function') {
    const image = viewer.querySelector('img');
    const status = viewer.querySelector('.aps-zoom-status');
    const pan = viewer.querySelector('.aps-viewer-pan');
    const setZoom = (value) => {
      const zoom = Math.max(1, Math.min(3, value));
      viewer.dataset.zoom = String(zoom);
      status.textContent = ['Fit to view', 'Enlarged view', 'Maximum zoom'][zoom - 1];
      pan.scrollTo(0, 0);
      viewer.querySelector('[data-aps-zoom="out"]').disabled = zoom === 1;
      viewer.querySelector('[data-aps-zoom="in"]').disabled = zoom === 3;
    };
    root.querySelectorAll('.aps-open-sample').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        opener = link;
        image.src = link.href;
        image.alt = link.dataset.sampleLabel || "Permanently redacted document sample";
        viewer.querySelector("#aps-viewer-title").textContent = link.dataset.sampleLabel || "Redacted Document Sample";
        setZoom(1);
        viewer.showModal();
      });
    });
    viewer.querySelectorAll('[data-aps-zoom]').forEach((button) => {
      button.addEventListener('click', () => {
        const zoom = Number(viewer.dataset.zoom);
        setZoom(button.dataset.apsZoom === 'reset' ? 1 : zoom + (button.dataset.apsZoom === 'in' ? 1 : -1));
      });
    });
    viewer.querySelector('[data-aps-close]').addEventListener('click', () => viewer.close());
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
