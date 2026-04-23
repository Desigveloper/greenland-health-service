/**
 * GreenLand Health Service — consultation.js
 * Multi-step form: validation per step, progress bar, submit
 */

(function () {
  'use strict';

  const form      = document.getElementById('consultationForm');
  if (!form) return;

  let currentStep = 1;
  const TOTAL     = 3;

  /* ─── FIELD RULES per step ─── */
  const stepRules = {
    1: {
      consultFullName: { required: true, minLen: 2, label: 'Full name' },
      consultEmail:    { required: true, email: true, label: 'Work email' },
      consultRole:     { required: true, minLen: 2, label: 'Role / Title' },
      consultPhone:    { required: false, phone: true, label: 'Phone' },
    },
    2: {
      consultOrg:      { required: true, minLen: 2, label: 'Organisation name' },
      consultIndustry: { required: true, label: 'Industry' },
      consultSize:     { required: true, label: 'Company size' },
      consultCountry:  { required: true, label: 'Country' },
    },
    3: {
      consultServices: { required: true, label: 'Service interest' },
      consultTimeline: { required: true, label: 'Timeline' },
      consultNeeds:    { required: true, minLen: 20, label: 'Additional needs' },
    },
  };

  /* ─── VALIDATOR ─── */
  function validateField(id, rule) {
    const el  = document.getElementById(id);
    const err = document.getElementById(id + 'Err');
    if (!el) return true;

    const val = el.value.trim();
    let msg   = '';

    if (rule.required && !val) {
      msg = `${rule.label} is required.`;
    } else if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    } else if (rule.phone && val && !/^[\+\d\s\-\(\)]{7,20}$/.test(val)) {
      msg = 'Please enter a valid phone number.';
    } else if (rule.minLen && val && val.length < rule.minLen) {
      msg = `${rule.label} must be at least ${rule.minLen} characters.`;
    }

    const valid = !msg;
    el.classList.toggle('error',    !valid);
    el.classList.toggle('success',  valid && val.length > 0);
    if (err) { err.textContent = msg; err.classList.toggle('visible', !!msg); }
    return valid;
  }

  function validateStep(step) {
    const rules  = stepRules[step] || {};
    return Object.entries(rules).map(([id, r]) => validateField(id, r)).every(Boolean);
  }

  /* ─── ATTACH real-time listeners ─── */
  Object.values(stepRules).forEach(stepObj => {
    Object.entries(stepObj).forEach(([id, rule]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur',  () => validateField(id, rule));
      el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(id, rule); });
    });
  });

  /* ─── UI HELPERS ─── */
  function showStep(n) {
    document.querySelectorAll('.form-panel').forEach((p, i) => {
      p.classList.toggle('active', i + 1 === n);
    });
    updateStepBar(n);
    updateNavButtons(n);
    // Scroll form into view
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateStepBar(n) {
    document.querySelectorAll('.step-item').forEach((item, i) => {
      const step = i + 1;
      item.classList.toggle('active', step === n);
      item.classList.toggle('done',   step < n);
      // update circle content
      const circle = item.querySelector('.step-circle');
      if (circle) circle.textContent = step < n ? '✓' : step;
    });
    document.querySelectorAll('.step-connector').forEach((c, i) => {
      c.classList.toggle('done', i + 1 < n);
    });
    // progress bar
    const bar = document.getElementById('progressFill');
    if (bar) bar.style.width = `${((n - 1) / (TOTAL - 1)) * 100}%`;
  }

  function updateNavButtons(n) {
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const subBtn  = document.getElementById('submitBtn');
    if (backBtn) backBtn.style.display = n > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = n < TOTAL ? 'flex' : 'none';
    if (subBtn)  subBtn.style.display  = n === TOTAL ? 'flex' : 'none';
  }

  /* ─── NAVIGATION ─── */
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < TOTAL) {
        currentStep++;
        showStep(currentStep);
      }
    });
  }
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) { currentStep--; showStep(currentStep); }
    });
  }

  /* ─── SUBMIT ─── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const subBtn = document.getElementById('submitBtn');
    subBtn.disabled = true;
    subBtn.innerHTML = `<span class="btn-spinner"></span> Submitting…`;

    const payload = {
      step1: {
        name:  document.getElementById('consultFullName')?.value.trim(),
        email: document.getElementById('consultEmail')?.value.trim(),
        role:  document.getElementById('consultRole')?.value.trim(),
        phone: document.getElementById('consultPhone')?.value.trim(),
      },
      step2: {
        org:      document.getElementById('consultOrg')?.value.trim(),
        industry: document.getElementById('consultIndustry')?.value,
        size:     document.getElementById('consultSize')?.value,
        country:  document.getElementById('consultCountry')?.value.trim(),
      },
      step3: {
        services: document.getElementById('consultServices')?.value,
        timeline: document.getElementById('consultTimeline')?.value,
        needs:    document.getElementById('consultNeeds')?.value.trim(),
      },
      sent_at: new Date().toISOString(),
    };

    try {
      await simulateSend(payload);
      // Show success panel
      document.getElementById('consultationForm').style.display = 'none';
      const success = document.getElementById('consultSuccess');
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

      window.GLS && window.GLS.toast({
        title: 'Request submitted!',
        message: 'A senior consultant will reach out within one business day.',
        type: 'success',
      });
    } catch {
      window.GLS && window.GLS.toast({ title: 'Submission failed.', message: 'Please try again.', type: 'error' });
      subBtn.disabled = false;
      subBtn.innerHTML = 'Submit Request →';
    }
  });

  function simulateSend(data) {
    console.log('[GreenLand] Consultation payload:', data);
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  /* ─── INIT ─── */
  showStep(1);

})();
