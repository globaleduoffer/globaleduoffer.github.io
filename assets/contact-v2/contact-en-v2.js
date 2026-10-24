/* Existing FormSubmit AJAX workflow, with Contact-only validation and copy controls.
   No form values are passed to analytics. Submission success requires the service's confirmation. */
(function () {
  'use strict';
  var form = document.getElementById('contactForm');
  if (!form) return;
  var name = form.elements.name, message = form.elements.message;
  var code = document.getElementById('countryCode');
  var phone = document.getElementById('whatsappNumber');
  var full = document.getElementById('whatsappFull');
  var phoneError = document.getElementById('phone-error');
  var count = document.getElementById('message-count');
  var success = document.getElementById('formSuccess');
  var failure = document.getElementById('formError');
  var button = form.querySelector('button[type="submit"]');
  var original = button.innerHTML, started = false, submitting = false;
  function track(event, error) {
    if (typeof window.trackGAEvent === 'function') window.trackGAEvent(event, {form_id: 'contactForm', error_type: error});
  }
  function start() { if (!started) { started = true; track('form_start'); } }
  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your full name.');
    message.setCustomValidity(message.value.trim() ? '' : 'Please describe your case.');
    var digits = phone.value.replace(/\D/g, '');
    var combined = code.value.replace(/\D/g, '') + digits;
    var valid = !!code.value && /^[\d\s().-]+$/.test(phone.value.trim()) && digits.length >= 5 && combined.length >= 7 && combined.length <= 15 && !/^0+$/.test(digits);
    phone.setCustomValidity(valid ? '' : 'Choose a country code and enter a valid international phone number (7–15 digits including the code).');
    full.value = valid ? code.value.replace(/[^+\d]/g, '') + digits : '';
    count.textContent = message.value.length + ' / 1000';
    if (phone.hasAttribute('aria-invalid')) {
      phone.setAttribute('aria-invalid', String(!valid));
      phoneError.hidden = valid;
      phoneError.textContent = valid ? '' : phone.validationMessage;
    }
    [name, message].forEach(function (field) { if (field.hasAttribute('aria-invalid')) field.setAttribute('aria-invalid', String(!field.validity.valid)); });
  }
  form.addEventListener('input', function (event) {
    start(); validate();
    if (event.target.hasAttribute('aria-invalid')) event.target.setAttribute('aria-invalid', String(!event.target.validity.valid));
  });
  form.addEventListener('change', function () { start(); validate(); });
  form.addEventListener('invalid', function (event) {
    event.target.setAttribute('aria-invalid', 'true');
    if (event.target === phone || event.target === code) {
      phoneError.hidden = false;
      phoneError.textContent = phone.validationMessage || 'Please choose your international dialing code.';
    }
  }, true);
  // Re-evaluate custom validity before native constraint validation on click / Enter.
  button.addEventListener('click', validate);
  form.addEventListener('keydown', function (event) { if (event.key === 'Enter') validate(); });
  validate();
  form.addEventListener('submit', async function (event) {
    event.preventDefault(); validate();
    if (submitting || !form.reportValidity()) return;
    start(); submitting = true; var began = Date.now(); form.dataset.submitState = 'sending'; delete form.dataset.submitError; success.hidden = true; failure.hidden = true;
    button.disabled = true; button.textContent = 'Sending…'; form.setAttribute('aria-busy', 'true');
    var controller = new AbortController(), timeout = setTimeout(function () { controller.abort(); }, 60000);
    var errorType = 'network';
    try {
      var response = await fetch(form.action, {method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}, signal: controller.signal});
      form.dataset.submitStatus = String(response.status);
      if (!response.ok) { errorType = 'http'; throw new Error('Submission failed'); }
      errorType = 'invalid_response'; var result = await response.json();
      if (!result || (result.success !== true && result.success !== 'true')) { errorType = 'service'; throw new Error('Submission not confirmed'); }
      form.dataset.submitState = 'confirmed'; track('form_submit_success'); form.reset(); started = false;
      form.querySelectorAll('[aria-invalid]').forEach(function (field) { field.removeAttribute('aria-invalid'); });
      phoneError.hidden = true; validate(); success.hidden = false; success.focus();
    } catch (error) {
      form.dataset.submitState = 'unconfirmed'; form.dataset.submitError = error.name === 'AbortError' ? 'timeout' : errorType;
      track('form_submit_error', form.dataset.submitError);
      failure.hidden = false; failure.focus();
    } finally {
      form.dataset.submitDuration = String(Date.now() - began); clearTimeout(timeout); submitting = false; button.disabled = false; button.innerHTML = original; form.removeAttribute('aria-busy');
    }
  });
  document.querySelectorAll('.contact-v2 [data-copy]').forEach(function (copy) {
    copy.addEventListener('click', async function () {
      var status = document.getElementById('copy-status');
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        status.textContent = 'Copied: ' + copy.dataset.copy;
        var label = copy.getAttribute('aria-label'); copy.setAttribute('aria-label', 'Copied');
        setTimeout(function () { copy.setAttribute('aria-label', label); }, 2000);
      } catch (_) { status.textContent = 'Copy is unavailable. Please select and copy the contact information shown.'; }
    });
  });
})();
