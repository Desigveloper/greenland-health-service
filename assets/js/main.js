/**
 * GreenLand Health Service — main.js
 * Navbar · Hamburger · Scroll animations · Active nav · Smooth scroll
 */

(function () {
  'use strict';

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 40);
    }
    lastScroll = y;
  }, { passive: true });

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navDrawer  = document.getElementById('navDrawer');

  if (hamburger && navDrawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer on link click
    navDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navDrawer.contains(e.target)) {
        navDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── ACTIVE NAV LINK ─── */
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const isActive = href === path || (path === '' && href === 'index.html');
      link.classList.toggle('active', isActive);
    });
  }
  setActiveNav();

  /* ─── FADE-IN SCROLL ANIMATIONS ─── */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── SMOOTH SCROLL for hash links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── TOAST UTILITY (global) ─── */
  window.GLS = window.GLS || {};

  window.GLS.toast = function ({ title = '', message = '', type = 'success', duration = 5000 } = {}) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <span class="toast-icon" id="toastIcon"></span>
        <div>
          <p class="toast-title" id="toastTitle"></p>
          <p class="toast-msg"   id="toastMsg"></p>
        </div>`;
      document.body.appendChild(toast);
    }

    document.getElementById('toastIcon').textContent  = type === 'success' ? '✅' : '❌';
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMsg').textContent   = message;
    toast.className = type === 'error' ? 'toast--error' : '';
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  };

  /* ─── CURRENT YEAR in footer ─── */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
