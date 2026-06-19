/* =========================================
   SAHITHYA P A — Portfolio JS
   ========================================= */

/* === LOADER === */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

/* === PARTICLES CANVAS === */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.5 ? 250 : 190; // indigo or cyan
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(W * H / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

// Draw connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* === NAVBAR SCROLL === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  // Back to top
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);
});

/* === HAMBURGER === */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* === THEME TOGGLE === */
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  iconMoon.style.display = isDark ? 'block' : 'none';
  iconSun.style.display = isDark ? 'none' : 'block';
});

/* === TYPING ANIMATION === */
const phrases = ['Full Stack Developer', 'Java Programmer', 'AI Enthusiast', 'Problem Solver'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const phrase = phrases[phraseIndex];
  if (isDeleting) {
    charIndex--;
    typedEl.textContent = phrase.substring(0, charIndex);
  } else {
    charIndex++;
    typedEl.textContent = phrase.substring(0, charIndex);
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === phrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(type, delay);
}
type();

/* === SCROLL REVEAL === */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
        // Animate skill bars & score bars inside
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        entry.target.querySelectorAll('.score-fill').forEach(bar => {
          // width already set inline, just trigger reflow
          const w = bar.style.width;
          bar.style.width = '0';
          requestAnimationFrame(() => { bar.style.width = w; });
        });
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* Skill bars on section reveal */
const skillSection = document.getElementById('skills');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
if (skillSection) skillObserver.observe(skillSection);

/* Score bars */
const eduSection = document.getElementById('education');
const eduObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.score-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => { bar.style.width = w; });
      });
      eduObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
if (eduSection) eduObserver.observe(eduSection);

/* === STATS COUNTER === */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimal = el.dataset.decimal;
  const duration = 2000;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    if (decimal) {
      el.textContent = value.toFixed(0);
    } else {
      el.textContent = Math.floor(value);
    }
    if (progress < 1) requestAnimationFrame(step);
    else {
      el.textContent = decimal ? target + '.' + decimal : target;
    }
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => animateCounter(el));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
if (statsSection) statsObserver.observe(statsSection);

/* === CONTACT FORM === */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.textContent = '⏳';
    setTimeout(() => {
      btnText.textContent = 'Sent!';
      btnIcon.textContent = '✓';
      btn.style.background = 'linear-gradient(135deg, #64FFDA, #28C840)';
      document.getElementById('form-success').style.display = 'block';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.textContent = '→';
        btn.style.background = '';
        document.getElementById('form-success').style.display = 'none';
      }, 4000);
    }, 1500);
  });
}

/* === BACK TO TOP === */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* === ACTIVE NAV LINK === */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* === ACTIVE NAV STYLE === */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--text) !important; } .nav-link.active::after { transform: scaleX(1); }`;
document.head.appendChild(style);
