/* =========================================================
   Respect reduced motion preference
   ========================================================= */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => { loader.classList.add('hidden'); }, REDUCE_MOTION ? 0 : 1900);
});

/* =========================================================
   NAVBAR: scroll state + mobile toggle
   ========================================================= */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function onScrollNav(){
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
onScrollNav();
window.addEventListener('scroll', onScrollNav);

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
const progressBar = document.getElementById('scrollProgress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop || document.body.scrollTop);
  const height = h.scrollHeight - h.clientHeight;
  progressBar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

/* =========================================================
   BACK TO TOP
   ========================================================= */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: REDUCE_MOTION ? 'auto' : 'smooth' });
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');
if (REDUCE_MOTION) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));
}

/* =========================================================
   ANIMATED STAT COUNTERS
   ========================================================= */
const counters = document.querySelectorAll('[data-count]');
function animateCounter(el){
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  function step(now){
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

/* =========================================================
   SKILL BAR FILL ON SCROLL
   ========================================================= */
const skillBars = document.querySelectorAll('.skill-bar span');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.level + '%';
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

/* =========================================================
   HERO ROLE TYPING ANIMATION
   ========================================================= */
const roles = [
  'First-Year Cybersecurity Student',
  'Ethical Hacking Enthusiast',
  'Future Security Analyst',
  'Linux & Networking Learner'
];
const roleEl = document.getElementById('typedRole');

function typeLoop(){
  if (REDUCE_MOTION) { roleEl.textContent = roles[0]; return; }
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 30);
    }
  }
  tick();
}
typeLoop();

/* =========================================================
   TERMINAL BOOT TYPING (hero signature element)
   ========================================================= */
const terminalScript = [
  { text: 'whoami', type: 'cmd' },
  { text: 'thewli_methusha — 1st Year Cybersecurity Student', type: 'out' },
  { text: 'cat interests.txt', type: 'cmd' },
  { text: 'network security · ethical hacking · linux · CTFs', type: 'out' },
  { text: 'status --learning', type: 'cmd' },
  { text: '[==========------] building fundamentals, one lab at a time', type: 'out' },
];

const termEl = document.getElementById('terminalTyped');

function typeTerminal(){
  if (!termEl) return;
  if (REDUCE_MOTION) {
    termEl.innerHTML = terminalScript.map(l => l.type === 'cmd' ? `<span class="prompt">$</span> ${l.text}` : l.text).join('\n');
    return;
  }
  let lineIndex = 0, charIndex = 0;
  let html = '';

  function renderCursorless(){
    return html;
  }

  function tick(){
    if (lineIndex >= terminalScript.length) return;
    const line = terminalScript[lineIndex];
    const prefix = line.type === 'cmd' ? '<span class="prompt">$</span> ' : '<span class="out">';
    const suffix = line.type === 'out' ? '</span>' : '';

    if (charIndex <= line.text.length) {
      const partial = line.text.slice(0, charIndex);
      termEl.innerHTML = html + prefix + partial + '<span class="term-cursor"></span>' + (charIndex === line.text.length ? suffix : '');
      charIndex++;
      setTimeout(tick, line.type === 'cmd' ? 65 : 20);
    } else {
      html += prefix + line.text + suffix + '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, 420);
    }
  }
  tick();
}
typeTerminal();

/* =========================================================
   MOUSE-FOLLOW GLOW
   ========================================================= */
const glow = document.getElementById('mouseGlow');
if (glow && !REDUCE_MOTION && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.setProperty('--mx', `${e.clientX}px`);
    glow.style.setProperty('--my', `${e.clientY}px`);
  });
} else if (glow) {
  glow.style.display = 'none';
}

/* =========================================================
   MATRIX-STYLE BACKGROUND (subtle, hero only)
   ========================================================= */
(function matrixBg(){
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas || REDUCE_MOTION) return;
  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;
  const chars = '01アカサタナ01HACK01SEC01NET01<>/*-+#0101';

  function resize(){
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    columns = Math.floor(width / 18);
    drops = Array(columns).fill(0).map(() => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(11,16,32,0.12)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00E5FF';
    ctx.font = '14px monospace';
    for (let i = 0; i < columns; i++){
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================================================
   CONTACT FORM (front-end only demo submission)
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = '> message queued — thanks for reaching out. I\'ll reply soon.';
    formNote.classList.add('show');
    contactForm.reset();
    document.querySelectorAll('.skill-bar span').forEach(() => {});
    setTimeout(() => formNote.classList.remove('show'), 5000);
  });
}