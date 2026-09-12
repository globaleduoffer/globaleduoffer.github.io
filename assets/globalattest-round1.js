/* Only loaded by index.html and contact-en.html. No form values enter analytics. */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!window.gaRound1Initialized) {
    window.gaRound1Initialized = true;
    window.gtag('js', new Date());
    window.gtag('config', 'G-VDC1P9N84P');
  }
  var events = ['service_click', 'contact_click', 'whatsapp_click', 'form_start', 'form_submit_success', 'form_submit_error'];
  window.trackGAEvent = function (name, params) {
    if (events.indexOf(name) === -1) return;
    var safe = {event_category: 'engagement'};
    params = params || {};
    if (params.form_id === 'contactForm') safe.form_id = 'contactForm';
    if (['network', 'http', 'invalid_response', 'service', 'timeout'].indexOf(params.error_type) !== -1) safe.error_type = params.error_type;
    // Labels are developer-authored constants from the HTML, never input values.
    if (typeof params.event_label === 'string') safe.event_label = params.event_label;
    if (params.link_url) {
      try {
        var url = new URL(params.link_url, window.location.href);
        if (url.origin === window.location.origin) safe.link_url = url.pathname;
        else if (url.origin === 'https://wa.me' && url.pathname === '/8617620130150') safe.link_url = 'https://wa.me/8617620130150';
      } catch (_) {}
    }
    try { window.gtag('event', name, safe); } catch (_) {}
  };
  // Compatibility for existing inline handlers: observe only; leave the browser in control.
  window.trackAndNavigate = function (event, name, params) {
    window.trackGAEvent(name, params);
    return true;
  };
  function trackLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    if (event.type === 'click' && link.hasAttribute('onclick')) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var name = link.dataset.gaEvent;
    if (!name && url.origin === 'https://wa.me' && url.pathname === '/8617620130150') name = 'whatsapp_click';
    if (!name && url.origin === location.origin && url.pathname === '/contact-en.html') name = 'contact_click';
    if (!name && url.origin === location.origin && ['china-police-certificate.html', 'china-police-certificate-canada-pr.html', 'document-legalization.html', 'wes-en.html', 'degree-verification.html', 'study-in-china.html'].indexOf(url.pathname.slice(1)) !== -1) name = 'service_click';
    if (!name) return;
    var placement = link.closest('.wa-float') ? 'floating' : link.closest('.navbar') ? 'navbar' : link.closest('.hero-section') ? 'hero' : link.closest('footer') ? 'footer' : 'content';
    window.trackGAEvent(name, {event_label: link.dataset.gaLabel || placement + '_' + name, link_url: link.href});
  }
  document.addEventListener('click', trackLink);
  document.addEventListener('auxclick', trackLink);
})();
