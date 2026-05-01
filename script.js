/* ============================
   Particle + scroll animations
   ============================ */

// ── Particles ──────────────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#7c3aed', '#2563eb', '#06b6d4', '#a78bfa', '#60a5fa'];
  const COUNT  = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(0.8, 2.5),
      vx:    rand(-0.25, 0.25),
      vy:    rand(-0.4, -0.08),
      alpha: rand(0.2, 0.7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) Object.assign(p, createParticle(), { y: H + 10 });
      if (p.x < -10 || p.x > W + 10) Object.assign(p, createParticle());
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();


// ── Nav scroll class ───────────────────────────────────────────────────────
(function () {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ── Intersection Observer (scroll-reveal) ─────────────────────────────────
(function () {
  const STAT_STAGGER_MS = 120;
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // stagger children for stats strip
        e.target.querySelectorAll('.stat').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * STAT_STAGGER_MS);
        });
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll(
    '.section-header, .project-card, .about-card, .stat, .stats-strip'
  ).forEach(el => io.observe(el));
})();


// ── Stagger project card reveal ────────────────────────────────────────────
(function () {
  const CARD_STAGGER_MS = 80;
  const cards = document.querySelectorAll('.project-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = parseInt(e.target.dataset.index || '0', 10);
        setTimeout(() => e.target.classList.add('visible'), idx * CARD_STAGGER_MS);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((c, i) => {
    c.dataset.index = i;
    io.observe(c);
  });
})();


// ── Animated counter for stats ─────────────────────────────────────────────
(function () {
  function animateCount(el, target, suffix) {
    let start = null;
    const duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => io.observe(el));
})();


// ── Mouse-parallax tilt on project cards ───────────────────────────────────
(function () {
  const TILT_LIFT_PX  = -6;
  const TILT_FACTOR   = 5;
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(${TILT_LIFT_PX}px) rotateX(${-dy * TILT_FACTOR}deg) rotateY(${dx * TILT_FACTOR}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();
