/**
 * GreenLand Health Service — contact.js
 * Full contact form with real-time validation, field states, & submission.
 */

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ─── VALIDATORS ─── */
  const rules = {
    contactName:    { required: true, minLen: 2, label: 'Full name' },
    contactCompany: { required: false, label: 'Company' },
    contactEmail:   { required: true, email: true, label: 'Email' },
    contactPhone:   { required: false, phone: true, label: 'Phone' },
    contactSubject: { required: true, minLen: 3, label: 'Subject' },
    contactMessage: { required: true, minLen: 20, label: 'Message' },
  };

  function validateField(id) {
    const el  = document.getElementById(id);
    const err = document.getElementById(id + 'Err');
    if (!el) return true;

    const rule = rules[id];
    const val  = el.value.trim();
    let msg = '';

    if (rule.required && !val) {
      msg = `${rule.label} is required.`;
    } else if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    } else if (rule.phone && val && !/^[\+\d\s\-\(\)]{7,20}$/.test(val)) {
      msg = 'Please enter a valid phone number.';
    } else if (rule.minLen && val && val.length < rule.minLen) {
      msg = `${rule.label} must be at least ${rule.minLen} characters.`;
    }

    const isValid = !msg;
    el.classList.toggle('error',   !isValid);
    el.classList.toggle('success',  isValid && val.length > 0);
    if (err) {
      err.textContent = msg;
      err.classList.toggle('visible', !!msg);
    }
    return isValid;
  }

  /* ─── REAL-TIME VALIDATION ─── */
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  /* ─── PHONE FORMATTER ─── */
  const phoneEl = document.getElementById('contactPhone');
  if (phoneEl) {
    phoneEl.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/[^\d\+\s\-\(\)]/g, '');
    });
  }

  /* ─── CHARACTER COUNTER ─── */
  const msgEl      = document.getElementById('contactMessage');
  const charCount  = document.getElementById('charCount');
  const MAX_CHARS  = 1000;
  if (msgEl && charCount) {
    msgEl.setAttribute('maxlength', MAX_CHARS);
    msgEl.addEventListener('input', () => {
      const remaining = MAX_CHARS - msgEl.value.length;
      charCount.textContent = `${msgEl.value.length} / ${MAX_CHARS}`;
      charCount.style.color = remaining < 100 ? 'var(--clr-accent-dark)' : 'var(--clr-text-muted)';
    });
  }

  /* ─── SUBMIT ─── */
  const submitBtn  = document.getElementById('contactSubmit');
  const successBox = document.getElementById('contactSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(rules).map(id => validateField(id)).every(Boolean);
    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.form-control.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Disable button & show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending…`;

    // Collect data
    const payload = {
      name:    document.getElementById('contactName').value.trim(),
      company: document.getElementById('contactCompany').value.trim(),
      email:   document.getElementById('contactEmail').value.trim(),
      phone:   document.getElementById('contactPhone').value.trim(),
      subject: document.getElementById('contactSubject').value.trim(),
      message: document.getElementById('contactMessage').value.trim(),
      sent_at: new Date().toISOString(),
    };

    try {
      // Simulate network request (replace with real endpoint)
      await simulateSend(payload);

      // Success state
      form.reset();
      Object.keys(rules).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('success', 'error');
      });
      if (charCount) charCount.textContent = `0 / ${MAX_CHARS}`;

      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      window.GLS && window.GLS.toast({
        title:   'Message sent!',
        message: 'We'll respond within one business day.',
        type:    'success',
      });

    } catch (err) {
      window.GLS && window.GLS.toast({
        title:   'Something went wrong.',
        message: 'Please try again or email us directly.',
        type:    'error',
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <span>✉️</span>';
    }
  });

  /* ─── SIMULATION (remove & replace with fetch in production) ─── */
  function simulateSend(payload) {
    console.log('[GreenLand] Contact form payload:', payload);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Uncomment to test error path:
        // reject(new Error('Network error'));
        resolve({ ok: true });
      }, 1800);
    });
  }

  /* ─── RETRY / SEND AGAIN BUTTON ─── */
  const retryBtn = document.getElementById('contactRetry');
  if (retryBtn && successBox) {
    retryBtn.addEventListener('click', () => {
      successBox.hidden = true;
      document.getElementById('contactName').focus();
    });
  }

})();
