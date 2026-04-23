# GreenLand Health Service

> Enterprise occupational healthcare, workforce wellness, and compliance consulting — aligned with international standards.

## 🌿 Overview

A complete, production-ready, mobile-first marketing website for **GreenLand Health Service**. Built with semantic HTML5, modern CSS, and vanilla JavaScript — no frameworks, no build tools required.

---

## 📁 Project Structure

```
greenland-health-service/
├── index.html              # Home page
├── pages/
│   ├── about.html          # About page
│   ├── services.html       # Services page
│   ├── consultation.html   # Consultation (multi-step form)
│   └── contact.html        # Contact page
├── assets/
│   ├── css/
│   │   ├── style.css       # Design tokens, reset, utilities
│   │   ├── components.css  # Navbar, footer, cards, forms, toast
│   │   └── pages.css       # Page-specific layouts
│   └── js/
│       ├── main.js         # Navbar, hamburger, scroll animations, toast
│       ├── consultation.js # Multi-step form logic & validation
│       └── contact.js      # Contact form validation & submission
├── .htaccess               # Apache: caching, compression, security headers
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **5 full pages** | Home, About, Services, Consultation, Contact |
| **Mobile-first** | Fully responsive, tested down to 320px |
| **Multi-step form** | 3-step consultation form with per-step validation |
| **Contact form** | Real-time validation, char counter, success state, toast |
| **Scroll animations** | IntersectionObserver-based fade-in animations |
| **Sticky navbar** | Scroll-aware with mobile hamburger drawer |
| **Active nav links** | Auto-detected from current page |
| **Accessibility** | ARIA labels, roles, live regions, semantic HTML |
| **SEO ready** | Meta tags, semantic headings, descriptive titles |
| **Apache config** | Gzip, caching, security headers via .htaccess |

---

## 🎨 Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--clr-primary` | `#1a7a4a` | Forest green — primary brand |
| `--clr-primary-dark` | `#0f5233` | Deep green — dark surfaces |
| `--clr-primary-deep` | `#0d2b1e` | Near-black green — hero/nav bg |
| `--clr-accent` | `#f5a623` | Warm amber — CTAs, highlights |
| `--clr-accent-dark` | `#d4891a` | Amber hover states |

---

## 🚀 Getting Started

### Open locally (no server needed)
```bash
# Simply open index.html in your browser
open index.html
```

### Serve with a local dev server (recommended)
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then visit: `http://localhost:8080`

---

## 🔌 Connecting a Real Backend

The contact and consultation forms are now configured for **Netlify Forms** (automatic form handling for Netlify deployments). When deployed on Netlify, form submissions will be processed automatically and can be viewed in your Netlify dashboard.

### Netlify Forms Setup
The forms are already configured with:
- `data-netlify="true"` attribute
- Hidden form-name field for identification
- Honeypot spam protection field

**To enable form notifications:**
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Forms**
3. Enable form detection
4. Add email notifications for form submissions

### Alternative Options

#### Option A — REST API (fetch)
If you prefer a custom backend, replace the `form.submit()` call in the JS files with:

```js
async function sendToAPI(payload) {
  const res = await fetch('https://your-api.com/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
```

#### Option B — Formspree (no backend)
Replace `form.submit()` with:

```js
// Get your endpoint from formspree.io
const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function sendToFormspree(payload) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
```
```

### Option C — EmailJS
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

---

## 🌐 Deployment

### Static hosting (Netlify / Vercel / GitHub Pages)
```bash
# Netlify CLI
netlify deploy --prod --dir .

# GitHub Pages — push to gh-pages branch
# Vercel — connect repo, deploy root directory
```

### Apache server
Upload all files to your `public_html` or `www` directory. The included `.htaccess` handles:
- Gzip/Brotli compression
- Browser caching (1 year for assets)
- Security headers (XSS, clickjacking, MIME sniffing)
- HTTPS redirect

### Nginx
```nginx
server {
  root /var/www/greenland-health;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  gzip on;
  gzip_types text/css application/javascript text/html;
}
```

---

## ♿ Accessibility

- Semantic HTML5 elements (`<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<aside>`)
- ARIA roles and labels on interactive elements
- Live regions (`aria-live="polite"`) for form feedback and toasts
- Keyboard-navigable forms and navigation
- Sufficient colour contrast (WCAG AA compliant palette)
- Focus styles preserved

---

## 🔒 Security

- No external JS dependencies (no CDN attack surface)
- Form data never leaves the browser until you configure an endpoint
- `.htaccess` sets `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`
- Input sanitisation should be enforced server-side before persisting data

---

## 📝 Customisation Checklist

- [ ] Update contact details (email, phone, address) in all pages
- [ ] Replace placeholder team members in `index.html` and `about.html`
- [ ] Add real team photos to `assets/images/`
- [x] Configure forms for Netlify Forms (automatic form handling)
- [ ] Add Google Analytics or Plausible tracking snippet to `<head>`
- [ ] Update `<meta>` descriptions per page
- [ ] Add a real favicon (replace the SVG emoji favicon)
- [ ] Update social media links in footer
- [ ] Set real social media Open Graph image

---

## 📄 License

© 2026 GreenLand Health Service. All rights reserved.
