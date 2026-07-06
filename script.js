/* =================================================================
   PORTFOLIO - Islam Mohammed Salman Abu Al-Sayed
   JavaScript - Premium Interactions & Animations
   ================================================================= */

'use strict';

/* ===== CONFIGURATION ===== */
const CONFIG = {
  typedStrings: [
    'Translator & Interpreter',
    'Legal Translator',
    'Content Writer',
    'English Teacher',
    'CAT Tools Expert',
  ],
  typedSpeed: 70,
  typedBackSpeed: 40,
  typedBackDelay: 2000,
  particleCount: 60,
  loaderDuration: 2800,
};

/* ===== UTILITY ===== */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ===== DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();   // ← Must be FIRST so theme applies before paint
  initLoader();
  initCursor();
  initScrollProgress();
  initNavbar();
  initTyped();
  initRevealAnimations();
  initCounters();
  initSkillBars();
  initParticles();
  initCardTilt();
  initGallery();
  initLightbox();
  initContactForm();
  initBackToTop();
  initMobileMenu();
  initMagneticButtons();
  initParallax();
  initSmoothScroll();
});

/* ===================================================================
   LOADER
   =================================================================== */
function initLoader() {
  const loader = $('#loader');
  const bar = $('.loader-bar');
  const count = $('.loader-count');
  let progress = 0;

  const interval = setInterval(() => {
    const step = Math.random() * 12 + 3;
    progress = Math.min(progress + step, 100);
    bar.style.width = progress + '%';
    count.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        triggerHeroAnimation();
      }, 400);
    }
  }, 60);
}

/* ===================================================================
   HERO ENTRANCE ANIMATION
   =================================================================== */
function triggerHeroAnimation() {
  const elements = $$('.hero-animate');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.8s ease ${i * 0.12}s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });
}

/* ===================================================================
   CUSTOM CURSOR
   =================================================================== */
function initCursor() {
  const cursor = $('.cursor');
  const follower = $('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const followCursor = () => {
    followerX = lerp(followerX, mouseX, 0.12);
    followerY = lerp(followerY, mouseY, 0.12);
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(followCursor);
  };
  followCursor();

  // Hover effects
  const hoverTargets = $$('a, button, .skill-card, .project-card, .cert-card, .social-card, .gallery-item, .timeline-content, input, textarea, .filter-btn');

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ===================================================================
   SCROLL PROGRESS
   =================================================================== */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = (scrollTop / docHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ===================================================================
   NAVBAR
   =================================================================== */
function initNavbar() {
  const navbar = $('#navbar');
  const links = $$('.nav-link');
  const sections = $$('section[id]');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav(sections, links);
  }, { passive: true });

  // Smooth nav clicks
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = $(href);
        if (target) {
          const offset = navbar.offsetHeight + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
}

function updateActiveNav(sections, links) {
  const offset = 200;
  sections.forEach(section => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ===================================================================
   TYPED.JS ANIMATION
   =================================================================== */
function initTyped() {
  const el = $('#typed-text');
  if (!el) return;

  // Use Typed.js if available
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: CONFIG.typedStrings,
      typeSpeed: CONFIG.typedSpeed,
      backSpeed: CONFIG.typedBackSpeed,
      backDelay: CONFIG.typedBackDelay,
      loop: true,
      showCursor: false,
    });
  } else {
    // Fallback manual implementation
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = CONFIG.typedStrings[stringIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? CONFIG.typedBackSpeed : CONFIG.typedSpeed;

      if (!isDeleting && charIndex === current.length) {
        delay = CONFIG.typedBackDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % CONFIG.typedStrings.length;
      }

      setTimeout(type, delay);
    };

    type();
  }
}

/* ===================================================================
   INTERSECTION OBSERVER - REVEAL ANIMATIONS
   =================================================================== */
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ===================================================================
   ANIMATED COUNTERS
   =================================================================== */
function initCounters() {
  const counters = $$('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = eased * target;
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

/* ===================================================================
   SKILL PROGRESS BARS
   =================================================================== */
function initSkillBars() {
  const bars = $$('.skill-progress-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = target + '%';
        }, 300);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ===================================================================
   PARTICLE SYSTEM
   =================================================================== */
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(59, 130, 246, ${this.opacity})`
        : Math.random() > 0.5
          ? `rgba(139, 92, 246, ${this.opacity})`
          : `rgba(6, 182, 212, ${this.opacity})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect nearby particles
  const connectParticles = () => {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(animate);
  };

  animate();
}

/* ===================================================================
   CARD TILT EFFECT (Vanilla Tilt)
   =================================================================== */
function initCardTilt() {
  const cards = $$('.skill-card, .cert-card, .project-card, .social-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * -10;
      const tiltY = x * 10;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s ease, box-shadow 0.4s ease';
    });
  });
}

/* ===================================================================
   GALLERY
   =================================================================== */
function initGallery() {
  const items = $$('.gallery-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.94) translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

/* ===================================================================
   LIGHTBOX (GLightbox)
   =================================================================== */
function initLightbox() {
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.gallery-zoom',
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
      openEffect: 'zoom',
      closeEffect: 'fade',
    });
  } else {
    // Fallback simple lightbox
    $$('.gallery-zoom').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.gallery-item');
        const img = item?.querySelector('img');
        if (!img) return;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;background:rgba(2,6,23,0.95);z-index:99998;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
        `;
        const image = document.createElement('img');
        image.src = img.src;
        image.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;';
        overlay.appendChild(image);
        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
      });
    });
  }
}

/* ===================================================================
   CONTACT FORM
   =================================================================== */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i> Sending...';

    // Simulate sending
    setTimeout(() => {
      const formEl = form.querySelector('.contact-form-fields');
      const success = form.querySelector('.form-success');
      if (formEl) formEl.style.display = 'none';
      if (success) success.classList.add('show');
    }, 1800);
  });
}

/* ===================================================================
   BACK TO TOP
   =================================================================== */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===================================================================
   MOBILE MENU
   =================================================================== */
function initMobileMenu() {
  const toggle = $('.nav-toggle');
  const overlay = $('.nav-mobile-overlay');
  const closeBtn = $('.nav-mobile-close');
  const mobileLinks = $$('.nav-mobile-link');

  if (!toggle || !overlay) return;

  const openMenu = () => {
    toggle.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggle.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    overlay.classList.contains('active') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        setTimeout(() => {
          const target = $(href);
          if (target) {
            const navH = $('#navbar')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 350);
      }
    });
  });
}

/* ===================================================================
   MAGNETIC BUTTONS
   =================================================================== */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;

  $$('.btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

/* ===================================================================
   PARALLAX
   =================================================================== */
function initParallax() {
  if (window.innerWidth < 1024) return;

  const orbs = $$('.hero-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.08;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // Mouse parallax on hero
  const hero = $('#hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPct = (clientX / innerWidth - 0.5) * 2;
    const yPct = (clientY / innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 8;
      orb.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
    });
  });
}

/* ===================================================================
   SMOOTH SCROLL
   =================================================================== */
function initSmoothScroll() {
  // Smooth scroll for all anchor links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        const navH = $('#navbar')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ===================================================================
   ANIMATED GRADIENT BACKGROUND (Hero)
   =================================================================== */
(function initGradientAnimation() {
  let angle = 0;
  const hero = $('#hero');
  if (!hero) return;

  const animate = () => {
    angle = (angle + 0.2) % 360;
    // subtle hue rotation on orbs
    requestAnimationFrame(animate);
  };

  animate();
})();

/* ===================================================================
   SCROLL-TRIGGERED SECTION CLASSES
   =================================================================== */
(function initSectionObserver() {
  const sections = $$('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => observer.observe(s));
})();

/* ===================================================================
   PROJECT CARD HOVER - Enhanced
   =================================================================== */
(function initProjectHover() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.tech-tag').forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 0.04}s`;
        tag.style.transform = 'translateY(-2px)';
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.tech-tag').forEach(tag => {
        tag.style.transitionDelay = '0s';
        tag.style.transform = '';
      });
    });
  });
})();

/* ===================================================================
   TIMELINE ANIMATION
   =================================================================== */
(function initTimeline() {
  const items = $$('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const dot = el.querySelector('.timeline-dot-inner');
        const content = el.querySelectorAll('.timeline-content');

        setTimeout(() => {
          if (dot) {
            dot.style.transform = 'scale(1.3)';
            setTimeout(() => { dot.style.transform = ''; }, 300);
          }
          content.forEach((c, ci) => {
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, ci * 100);
          });
        }, i * 120);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.querySelectorAll('.timeline-content').forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
      c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    observer.observe(item);
  });
})();

/* ===================================================================
   FLOATING CARDS - Enhanced float
   =================================================================== */
(function initFloatingCards() {
  $$('.hero-floating-card').forEach((card, i) => {
    let offset = 0;
    const speed = 0.03 + i * 0.01;
    const amplitude = 6 + i * 2;
    const startPhase = i * (Math.PI * 2 / 3);

    const animate = () => {
      offset += speed;
      const y = Math.sin(offset + startPhase) * amplitude;
      card.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    };

    // Remove CSS animation, use JS
    card.style.animation = 'none';
    animate();
  });
})();

/* ===================================================================
   SCROLL ANIMATIONS - Additional polish
   =================================================================== */
(function initScrollAnimations() {
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Parallax for section backgrounds
        $$('.section-bg-parallax').forEach(el => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          el.style.backgroundPositionY = `calc(50% + ${center * 0.15}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ===================================================================
   CSS Keyframe Injection (for JS-triggered animations)
   =================================================================== */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes slideInFromLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInFromRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }
    .section.in-view .stat-card { animation: scaleIn 0.5s ease both; }
  `;
  document.head.appendChild(style);
})();

/* ===================================================================
   FORM INPUT ANIMATIONS
   =================================================================== */
(function initFormAnimations() {
  $$('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused');
    });
  });
})();

/* ===================================================================
   SOCIAL CARD HOVER RIPPLE
   =================================================================== */
(function initRipple() {
  $$('.social-card, .btn-primary, .form-submit').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position:absolute;
        left:${x - size/2}px;
        top:${y - size/2}px;
        width:${size}px;
        height:${size}px;
        background:rgba(255,255,255,0.08);
        border-radius:50%;
        transform:scale(0);
        animation:rippleEffect 0.6s linear;
        pointer-events:none;
        z-index:0;
      `;

      // Ensure parent is positioned
      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);
})();

/* ===================================================================
   LAZY LOAD IMAGES
   =================================================================== */
(function initLazyLoad() {
  const imgs = $$('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ===================================================================
   ACTIVE SECTION HIGHLIGHT
   =================================================================== */
(function initActiveSectionHighlight() {
  const sections = $$('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = $(`a[href="#${id}"]`);
      if (link) {
        if (entry.isIntersecting) {
          $$('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

/* ===================================================================
   WINDOW RESIZE HANDLER
   =================================================================== */
window.addEventListener('resize', debounce(() => {
  if (window.innerWidth >= 1024) {
    const overlay = $('.nav-mobile-overlay');
    if (overlay?.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}, 250));

function debounce(fn, wait) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ===================================================================
   HERO SCROLL INDICATOR FADE
   =================================================================== */
(function initScrollIndicator() {
  const indicator = $('.hero-scroll');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 200);
    indicator.style.opacity = opacity;
  }, { passive: true });
})();

/* ===================================================================
   PERFORMANCE: Reduce animations when page is hidden
   =================================================================== */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
  } else {
    document.documentElement.style.removeProperty('--transition-fast');
  }
});

/* ===================================================================
   THEME TOGGLE — Light / Dark Mode
   =================================================================== */
function initThemeToggle() {
  const html = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  /* ── Determine initial theme ── */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === LIGHT || saved === DARK) return saved;
    // Respect OS preference on first visit
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return LIGHT;
    }
    return DARK; // Default
  }

  /* ── Apply theme to <html> ── */
  function applyTheme(theme) {
    if (theme === LIGHT) {
      html.setAttribute('data-theme', LIGHT);
    } else {
      html.removeAttribute('data-theme');
    }
    updateToggles(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /* ── Sync all toggle buttons' aria-labels and title ── */
  function updateToggles(theme) {
    const isLight = theme === LIGHT;
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    const title = isLight ? 'Switch to dark mode' : 'Switch to light mode';

    $$('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', title);
    });
  }

  /* ── Toggle handler ── */
  function handleToggle() {
    const current = html.getAttribute('data-theme') === LIGHT ? LIGHT : DARK;
    applyTheme(current === LIGHT ? DARK : LIGHT);
  }

  /* ── Init ── */
  const initial = getInitialTheme();
  // Apply without animation on first load by briefly suppressing transitions
  html.style.setProperty('--transition-fast', '0s');
  html.style.setProperty('--transition-normal', '0s');
  html.style.setProperty('--transition-slow', '0s');
  applyTheme(initial);
  // Re-enable transitions after first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html.style.removeProperty('--transition-fast');
      html.style.removeProperty('--transition-normal');
      html.style.removeProperty('--transition-slow');
    });
  });

  /* ── Attach click listeners to desktop + mobile toggles ── */
  const desktopBtn = $('#theme-toggle');
  const mobileBtn  = $('#theme-toggle-mobile');

  if (desktopBtn) desktopBtn.addEventListener('click', handleToggle);
  if (mobileBtn)  mobileBtn.addEventListener('click', handleToggle);

  /* ── Watch OS preference changes live ── */
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually chosen a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? LIGHT : DARK);
      }
    });
  }
}
