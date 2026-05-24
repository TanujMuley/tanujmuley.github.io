/* =========================================================
   TANUJ MULEY — main.js
   Interactive layer: reveals, counters, tilt, ripple, etc.
   ========================================================= */

(function () {
  'use strict';

  // ─── READING PROGRESS BAR ───────────────────────────────
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const updateBar = () => {
      const doc  = document.documentElement;
      const pct  = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // ─── NAV: SCROLL SHADOW ─────────────────────────────────
  const header = document.querySelector('header');
  if (header) {
    const toggleScrolled = () => header.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', toggleScrolled, { passive: true });
    toggleScrolled();
  }

  // ─── SCROLL REVEAL ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const ro = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => ro.observe(el));
  }

  // ─── COUNTER ANIMATION ──────────────────────────────────
  function runCounter(el) {
    const end    = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur    = 1700;
    const t0     = performance.now();

    const tick = (now) => {
      const p      = Math.min((now - t0) / dur, 1);
      const eased  = 1 - Math.pow(1 - p, 3);          // ease-out cubic
      const val    = Number.isInteger(end)
        ? Math.floor(eased * end)
        : (eased * end).toFixed(1);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end + suffix;
    };
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      }),
      { threshold: 0.6 }
    );
    counters.forEach(el => co.observe(el));
  }

  // ─── CARD TILT ──────────────────────────────────────────
  document.querySelectorAll('.tilt').forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width  - 0.5;
        const y  = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-5px) scale(1.015)`;
        card.style.boxShadow = `${-x * 20}px ${-y * 20}px 50px rgba(99,102,241,0.12)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });

  // ─── RIPPLE ON BUTTONS ──────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r    = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;`;
      this.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  });

  // ─── FAQ ACCORDION ──────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    // Remove inline onclick (in case it exists) and use event delegation
    btn.removeAttribute('onclick');
    btn.addEventListener('click', () => {
      const item    = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ─── MOBILE NAV: CLOSE ON LINK CLICK ────────────────────
  const navMenu = document.querySelector('nav ul');
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMenu.classList.remove('open'))
    );
  }

  // ─── HERO VISUAL CARD: LIVE COUNTER ─────────────────────
  const savedNum = document.getElementById('vc-saved');
  if (savedNum) {
    let val = 0;
    const target = 47;
    const step   = () => {
      if (val < target) {
        val += 1;
        savedNum.textContent = val + ' min';
        setTimeout(step, 38);
      }
    };
    setTimeout(step, 1800);
  }

  // ─── TYPEWRITER EFFECT (hero subtitle) ──────────────────
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const text   = typeEl.dataset.text || typeEl.textContent;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    typeEl.textContent = '';
    typeEl.appendChild(cursor);

    let i = 0;
    const type = () => {
      if (i < text.length) {
        typeEl.insertBefore(document.createTextNode(text[i++]), cursor);
        setTimeout(type, 32);
      }
    };
    setTimeout(type, 600);
  }

  // ─── STAGGER CHILDREN OF .stagger ───────────────────────
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal', `reveal-d${Math.min(i + 1, 4)}`);
    });
    // Then observe them
    parent.querySelectorAll('.reveal').forEach(el => {
      if (revealEls.length) return; // already observed above
      const ro2 = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
      );
      ro2.observe(el);
    });
  });

})();
