/***********************
 * CONFIG
 ***********************/
const MIDNIGHT_TARGET = new Date('2026-01-01T00:00:00+05:30'); // IST midnight
const AUTO_DELAY_TO_MESSAGE_MS = 6000;
const AUTO_DELAY_TO_FINAL_MS   = 70000;
const AUTO_DELAY_BACK_TO_COUNTDOWN_MS = 10000;
const HIDE_TEST_BUTTON = true;

/***********************
 * UTIL: Page navigation
 ***********************/
const pages = ['page-countdown', 'page-birthday', 'page-message', 'page-final'];
let currentPage = 'page-countdown';

function showPage(id) {
  pages.forEach(pid => {
    const el = document.getElementById(pid);
    if (!el) return;
    el.style.display = (pid === id) ? 'flex' : 'none';
    if (pid === id) el.classList.add('active'); else el.classList.remove('active');
  });
  currentPage = id;
}
showPage('page-countdown');

/***********************
 * AUDIO
 ***********************/
const bgMusic = document.getElementById('bgMusic');
async function tryPlayMusic() {
  if (!bgMusic) return;
  try { await bgMusic.play(); } catch (e) {}
}
tryPlayMusic();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tryPlayMusic();
});
window.addEventListener('click', tryPlayMusic, { once: true });

/***********************
 * COUNTDOWN
 ***********************/
const dEl = document.getElementById('days');
const hEl = document.getElementById('hours');
const mEl = document.getElementById('minutes');
const sEl = document.getElementById('seconds');

function updateCountdown() {
  const now = new Date();
  const diff = MIDNIGHT_TARGET - now;
  if (diff <= 0) {
    dEl.textContent = '00'; hEl.textContent = '00'; mEl.textContent = '00'; sEl.textContent = '00';
    triggerMidnight();
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  dEl.textContent = String(days).padStart(2, '0');
  hEl.textContent = String(hours).padStart(2, '0');
  mEl.textContent = String(minutes).padStart(2, '0');
  sEl.textContent = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

/***********************
 * CONFETTI
 ***********************/
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confettiPieces = [];
  const colors = ['#ffffff', '#ff3b6b', '#111111', '#0d47a1', '#c2185b', '#f8bbd0'];
  for (let i = 0; i < 300; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      rotation: Math.random() * Math.PI,
      vr: (-0.05 + Math.random() * 0.1)
    });
  }
  confettiActive = true;
  requestAnimationFrame(drawConfetti);
  setTimeout(() => { confettiActive = false; }, 6000);
}

function drawConfetti() {
  if (!confettiActive) { ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height); return; }
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;
    if (p.y > confettiCanvas.height + 20) { p.y = -10; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  });
  requestAnimationFrame(drawConfetti);
}

/***********************
 * HEARTS & BALLOONS
 ***********************/
const heartsContainer = document.getElementById('floatingHearts');
const balloonsContainer = document.getElementById('floatingBalloons');

function spawnHearts() {
  for (let i=0; i<20; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.style.left = Math.random()*100 + '%';
    h.style.animationDelay = (Math.random()*4) + 's';
    h.style.opacity = 0.3 + Math.random()*0.7;
    heartsContainer.appendChild(h);
  }
}
function spawnBalloons() {
  const colors = ['#ff3b6b', '#ffffff', '#111111', '#0d47a1', '#f06292'];
  for (let i=0; i<12; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    const c = colors[Math.floor(Math.random()*colors.length)];
    b.style.background = c;
    b.style.left = Math.random()*100 + '%';
    b.style.animationDelay = (Math.random()*5) + 's';
    balloonsContainer.appendChild(b);
  }
}
spawnHearts();
spawnBalloons();

/***********************
 * MIDNIGHT FLOW
 ***********************/
let midnightTriggered = false;
function triggerMidnight() {
  if (midnightTriggered) return;
  midnightTriggered = true;

  showPage('page-birthday');
  launchConfetti();
  animateKiss();

  setTimeout(() => { showPage('page-message'); }, AUTO_DELAY_TO_MESSAGE_MS);
  setTimeout(() => { showPage('page-final'); }, AUTO_DELAY_TO_MESSAGE_MS + AUTO_DELAY_TO_FINAL_MS);
  setTimeout(() => {
    showPage('page-countdown');
    midnightTriggered = false;
  }, AUTO_DELAY_TO_MESSAGE_MS + AUTO_DELAY_TO_FINAL_MS + AUTO_DELAY_BACK_TO_COUNTDOWN_MS);
}

/***********************
 * Cartoon kiss animation
 ***********************/
function animateKiss() {
  const kissL = document.getElementById('kissL');
  const kissR = document.getElementById('kissR');
  const kissHearts = document.getElementById('kissHearts');
  if (!kissL || !kissR) return;

  let t = 0;
  const interval = setInterval(() => {
    t += 1;
    kissL.setAttribute('d', `M80 68 q${6 + Math.sin(t/2)*2} 4 ${12 + Math.sin(t/2)*2} 0`);
    kissR.setAttribute('d', `M108 68 q${-6 - Math.sin(t/2)*2} 4 ${-12 - Math.sin(t/2)*2} 0`);
  }, 120);

  if (kissHearts) {
    kissHearts.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
    kissHearts.style.transform = 'translateY(-8px) scale(1.05)';
    kissHearts.style.opacity = '0.9';
    setTimeout(() => {
      kissHearts.style.transform = 'translateY(-16px) scale(1.12)';
      kissHearts.style.opacity = '1';
    }, 800);
  }
  setTimeout(() => clearInterval(interval), 6000);
}

/***********************
 * TEST FLOW BUTTON
 ***********************/
const testBtn = document.getElementById('testFlowBtn');
if (HIDE_TEST_BUTTON && testBtn) {
  testBtn.style.display = 'none';
} else if (testBtn) {
  testBtn.addEventListener('click', () => { triggerMidnight(); });
}