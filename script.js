document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar: scroll shadow + active link highlight ---- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

  /* ---- FAQ accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-header');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(other => {
        other.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').classList.remove('open');
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ---- Wishlist button toggle ---- */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const svg    = btn.querySelector('svg');
      const active = btn.dataset.active === 'true';
      btn.dataset.active      = String(!active);
      svg.style.fill          = !active ? '#e05a5a' : 'none';
      svg.style.stroke        = !active ? '#e05a5a' : 'currentColor';
      svg.style.color         = !active ? '#e05a5a' : '#bbb';
    });
  });

  /* ---- Contact form submission ---- */
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast("Message sent! We'll get back to you soon.", 'success');
    form.reset();
  });

  /* ---- Toast notification ---- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position:   'fixed',
      bottom:     '28px',
      right:      '28px',
      padding:    '14px 24px',
      borderRadius: '4px',
      fontSize:   '14px',
      fontFamily: "'Inter', sans-serif",
      fontWeight: '500',
      color:      '#fff',
      background: type === 'success' ? '#1D3557' : '#c0392b',
      boxShadow:  '0 4px 20px rgba(0,0,0,0.2)',
      zIndex:     '9999',
      opacity:    '0',
      transform:  'translateY(12px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll-reveal (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll(
    '.product-card, .why-item, .test-card, .faq-item, .story-content, .hero-content'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

});