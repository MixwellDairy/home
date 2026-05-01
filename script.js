/* ============================
   Particle + scroll animations + easter eggs
   ============================ */

// ── Particles ──────────────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#7c3aed', '#2563eb', '#06b6d4', '#a78bfa', '#60a5fa'];
  const COUNT  = 70;

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


// ── Scroll progress bar ────────────────────────────────────────────────────
(function () {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();


// ── Hamburger menu ─────────────────────────────────────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


// ── Cursor glow ────────────────────────────────────────────────────────────
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  (function animate() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animate);
  })();
})();


// ── Intersection Observer (scroll-reveal) ─────────────────────────────────
(function () {
  const STAT_STAGGER_MS = 120;
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.stat').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * STAT_STAGGER_MS);
        });
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll(
    '.section-header, .project-card, .about-card, .stat, .stats-strip, .tl-item, .connect-card'
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


// ── Stagger timeline + connect card reveal ─────────────────────────────────
(function () {
  const STAGGER = 120;
  ['tl-item', 'connect-card'].forEach(cls => {
    const items = document.querySelectorAll('.' + cls);
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt(e.target.dataset.stagger || '0', 10);
          setTimeout(() => e.target.classList.add('visible'), idx * STAGGER);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach((el, i) => { el.dataset.stagger = i; io.observe(el); });
  });
})();


// ── Skill bars animation ───────────────────────────────────────────────────
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-row').forEach((el, i) => {
    el.dataset.stagger = i;
    io.observe(el);
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
      const ease = 1 - Math.pow(1 - progress, 3);
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
  if (window.matchMedia('(hover: none)').matches) return;
  const TILT_LIFT_PX = -6;
  const TILT_FACTOR  = 5;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(${TILT_LIFT_PX}px) rotateX(${-dy * TILT_FACTOR}deg) rotateY(${dx * TILT_FACTOR}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


// ── Magnetic buttons ──────────────────────────────────────────────────────
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.22;
      const dy   = (e.clientY - cy) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { el.style.transition = ''; }, 450);
    });
  });
})();


// ── Typewriter effect on hero gradient text ────────────────────────────────
(function () {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'that actually help.',
    'for real problems.',
    'that save you time.',
    "you'll actually use.",
    'built with ❤️ and ☕.',
  ];

  let phraseIdx = 0;
  let charIdx   = phrases[0].length;
  let deleting  = false;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx >= phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx <= 0) {
        deleting   = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        charIdx    = 0;
      }
      setTimeout(type, 38);
    }
  }

  // Kick off after the hero entrance animation
  setTimeout(type, 1800);
})();


// ── Project search + filter ────────────────────────────────────────────────
(function () {
  const input     = document.getElementById('project-search');
  const noResults = document.getElementById('no-results');
  const clearBtn  = document.getElementById('clear-search');
  const cards     = Array.from(document.querySelectorAll('.project-card'));
  const filterTabs = Array.from(document.querySelectorAll('.filter-tab'));
  if (!input) return;

  let activeFilter = 'all';
  let searchQuery  = '';

  function filterCards() {
    let visible = 0;
    const q = searchQuery.toLowerCase().trim();
    cards.forEach(card => {
      const name = card.querySelector('.card-title').textContent.toLowerCase();
      const desc = (card.querySelector('.card-description') || {}).textContent || '';
      const tags = (card.dataset.tags || '').toLowerCase();
      const cat  = card.dataset.category || '';

      const matchSearch = !q || name.includes(q) || desc.toLowerCase().includes(q) || tags.includes(q);
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const show = matchSearch && matchFilter;

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible > 0;
  }

  input.addEventListener('input', e => {
    searchQuery = e.target.value;
    filterCards();
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.filter;
      filterCards();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      searchQuery = '';
      activeFilter = 'all';
      filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      if (filterTabs[0]) { filterTabs[0].classList.add('active'); filterTabs[0].setAttribute('aria-selected', 'true'); }
      filterCards();
      input.focus();
    });
  }

  // ⌘K / Ctrl+K → focus search
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { input.focus(); input.select(); }, 400);
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.blur();
    }
  });
})();


// ── Toast notification helper ──────────────────────────────────────────────
function showToast(msg, duration) {
  duration = duration || 3500;
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}


// ── Emoji rain helper ──────────────────────────────────────────────────────
function launchEmojis(emojis, count) {
  const overlay = document.getElementById('ee-overlay');
  if (!overlay) return;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el  = document.createElement('div');
      el.className = 'ee-emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left     = Math.random() * 100 + 'vw';
      el.style.fontSize = (1.4 + Math.random() * 1.4) + 'rem';
      const dur = 2 + Math.random() * 2.5;
      el.style.animation = `eefall ${dur}s linear forwards`;
      overlay.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 300);
    }, i * 70);
  }
}


// ═══════════════════════ EASTER EGGS ═══════════════════════════════════════

// 1. Konami code  ↑↑↓↓←→←→BA
(function () {
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        triggerKonami();
      }
    } else {
      idx = (e.key === KONAMI[0]) ? 1 : 0;
    }
  });

  function triggerKonami() {
    showToast('🎉 CHEAT CODE ACTIVATED — You found Easter Egg #1!', 5000);
    launchEmojis(['\u{1F389}','\u2728','\u{1F38A}','\u2B50','\u{1F4AB}','\u{1F31F}'], 45);
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      const original = badge.innerHTML;
      badge.innerHTML = '<span class="dot"></span> Easter Egg Found! 🎉';
      setTimeout(() => { badge.innerHTML = original; }, 4500);
    }
  }
})();


// 2. Click logo 7× → Dairy Mode
(function () {
  const logo = document.getElementById('nav-logo');
  if (!logo) return;
  let clicks = 0;
  let resetTimer;

  logo.addEventListener('click', () => {
    clicks++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clicks = 0; }, 2000);
    if (clicks >= 7) {
      clicks = 0;
      showToast('🐄 DAIRY MODE ACTIVATED — Got milk? 🥛', 5000);
      launchEmojis(['🐄','🥛','🧀','🧈','🐮','🫙'], 55);
    }
  });
})();


// 3. Type "dairy" anywhere (outside inputs) → secret message
(function () {
  let buffer = '';
  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-5);
      if (buffer === 'dairy') {
        buffer = '';
        showToast('🥛 Fresh batch incoming… You found Easter Egg #3!', 4500);
        launchEmojis(['🥛','🐄','✨','💜'], 22);
      }
    }
  });
})();


// 4. Click the "100% Open Source" stat 5× → secret message
(function () {
  const stat = document.getElementById('secret-stat');
  if (!stat) return;
  let clicks = 0;

  stat.style.cursor = 'pointer';
  stat.addEventListener('click', () => {
    clicks++;
    if (clicks === 5) {
      clicks = 0;
      showToast('🔓 100% vibes · 100% open source · 100% dairy-free… or is it? 🐄', 5000);
      launchEmojis(['🔓','⭐','🐄','✨'], 25);
    }
  });
})();


// 5. Secret connect card click → easter egg
(function () {
  const card = document.getElementById('secret-connect');
  if (!card) return;
  let clicks = 0;

  card.addEventListener('click', () => {
    clicks++;
    if (clicks === 3) {
      clicks = 0;
      showToast('🐄 You clicked the secret card 3 times. Respect.', 4000);
      launchEmojis(['🐄','💜','⭐'], 20);
    }
  });
})();


// ── Console easter egg ─────────────────────────────────────────────────────
(function () {
  console.log(
    '%c███╗   ███╗██╗██╗  ██╗██╗    ██╗███████╗██╗     ██╗\n' +
    '%c████╗ ████║██║╚██╗██╔╝██║    ██║██╔════╝██║     ██║\n' +
    '%c██╔████╔██║██║ ╚███╔╝ ██║ █╗ ██║█████╗  ██║     ██║\n' +
    '%c██║╚██╔╝██║██║ ██╔██╗ ██║███╗██║██╔══╝  ██║     ██║\n' +
    '%c██║ ╚═╝ ██║██║██╔╝ ██╗╚███╔███╔╝███████╗███████╗███████╗\n' +
    '%c╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚══════╝',
    'color:#a78bfa;font-family:monospace;font-size:9px;line-height:1.4;',
    'color:#9b72f5;font-family:monospace;font-size:9px;line-height:1.4;',
    'color:#8a60ed;font-family:monospace;font-size:9px;line-height:1.4;',
    'color:#7c3aed;font-family:monospace;font-size:9px;line-height:1.4;',
    'color:#6d28d9;font-family:monospace;font-size:9px;line-height:1.4;',
    'color:#5b21b6;font-family:monospace;font-size:9px;line-height:1.4;'
  );
  console.log('%cHey there, curious dev! 👋', 'color:#60a5fa;font-size:18px;font-weight:bold;');
  console.log('%cYou found the console easter egg.', 'color:#9090a8;font-size:13px;');
  console.log(
    '%cType %cmixwell()%c in the console for a surprise!',
    'color:#9090a8;font-size:13px;',
    'color:#34d399;font-size:13px;font-weight:bold;',
    'color:#9090a8;font-size:13px;'
  );

  window.mixwell = function () {
    showToast('🐄 Hello from MixwellDairy! +100 dev points for finding the hidden function!', 5500);
    launchEmojis(['🐄','🥛','⭐','✨','🎉','💜'], 35);
    console.log('%c🐄 +100 dev points — you called mixwell()!', 'color:#34d399;font-size:14px;font-weight:bold;');
  };
})();
