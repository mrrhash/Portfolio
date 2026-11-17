/* Selected Projects: simple coverflow slider + project popup.
   Data lives in projects-data.js. Needs GSAP (global) only for the popup animation. */
import { PROJECTS, IMG } from './projects-data.js';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.querySelector('[data-slider]');
if (root) init(root);

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function init(root) {
  const section = root.closest('.slider-section') || root;
  const N = PROJECTS.length;
  let index = Math.min(2, N - 1);       // active slide
  let cw = 420, step = 330;             // card width, distance between slide centres

  root.classList.add('ps');
  root.innerHTML = `
    <div class="ps-viewport" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Selected projects. Use the left and right arrow keys to browse.">
      <div class="ps-track">
        ${PROJECTS.map((p, i) => `
          <button class="ps-card" type="button" data-i="${i}" aria-label="${esc(p.title)}, ${esc(p.category)}. ${i + 1} of ${N}">
            ${p.image
              ? `<img src="${IMG}${esc(p.image)}" alt="" draggable="false" decoding="async" ${i < 6 ? '' : 'loading="lazy"'} />`
              : `<span class="ps-noimg"><span>${esc(p.title)}</span></span>`}
          </button>`).join('')}
      </div>
    </div>
    <div class="ps-caption" aria-live="polite">
      <span class="ps-cat"></span>
      <strong class="ps-title"></strong>
      <span class="ps-hint">Click the project to see details</span>
    </div>
    <div class="ps-controls">
      <button class="ps-btn ps-prev" type="button" aria-label="Previous project">&#8592;</button>
      <span class="ps-count" aria-hidden="true"></span>
      <button class="ps-btn ps-next" type="button" aria-label="Next project">&#8594;</button>
    </div>
    <div class="ps-bar" aria-hidden="true"><span></span></div>`;

  const viewport = root.querySelector('.ps-viewport');
  const track = root.querySelector('.ps-track');
  const cards = [...root.querySelectorAll('.ps-card')];
  const capCat = root.querySelector('.ps-cat');
  const capTitle = root.querySelector('.ps-title');
  const caption = root.querySelector('.ps-caption');
  const count = root.querySelector('.ps-count');
  const barFill = root.querySelector('.ps-bar span');

  /* ---------- layout ---------- */
  function size() {
    const W = viewport.clientWidth;
    cw = W > 1000 ? Math.min(W * 0.34, 480) : W > 640 ? W * 0.5 : W * 0.72;
    step = cw * 0.8;
    root.style.setProperty('--cw', cw + 'px');
    root.style.setProperty('--ch', (cw * 9) / 16 + 'px');
    render(index);
  }

  // pos can be fractional while dragging
  function render(pos) {
    cards.forEach((card, i) => {
      const off = i - pos, a = Math.abs(off), s = Math.sign(off);
      const x = off * step;
      const rot = -s * Math.min(a, 2.2) * 24;
      const z = -Math.min(a, 3) * 140;
      const scale = Math.max(1 - a * 0.07, 0.7);
      const op = a < 0.5 ? 1 : Math.max(0, 0.78 - (a - 1) * 0.36 - (a < 1 ? (a - 0.5) * 0.0 : 0));
      const blur = a <= 1 ? 0 : Math.min((a - 1) * 2.5, 6);
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${scale})`;
      card.style.opacity = a < 0.5 ? 1 : Math.max(op, 0).toFixed(3);
      card.style.filter = blur ? `blur(${blur.toFixed(1)}px)` : 'none';
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.style.pointerEvents = a > 3.2 ? 'none' : 'auto';
      const active = Math.round(pos) === i;
      card.classList.toggle('is-active', active);
      card.tabIndex = active ? 0 : -1;
    });
  }

  function updateMeta() {
    const p = PROJECTS[index];
    capCat.textContent = p.category;
    capTitle.textContent = p.title;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    barFill.style.width = ((index + 1) / N) * 100 + '%';
    if (!REDUCED) gsap.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }

  function goTo(i, instant) {
    const n = Math.max(0, Math.min(N - 1, i));
    const changed = n !== index;
    index = n;
    track.classList.toggle('is-instant', !!instant);
    render(index);
    if (changed || instant) updateMeta();
  }

  /* ---------- drag / swipe ---------- */
  let down = null, dragged = false;
  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    dragged = false;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!dragged && Math.abs(dx) > 6) {
      dragged = true;
      track.classList.add('is-instant');
      viewport.classList.add('is-dragging');
    }
    if (dragged) render(index - dx / step);
  });
  function end(e) {
    if (!down) return;
    const dx = e.clientX - down.x;
    const v = dx / Math.max(performance.now() - down.t, 1);     // px per ms
    down = null;
    viewport.classList.remove('is-dragging');
    track.classList.remove('is-instant');
    if (!dragged) return;
    let move = Math.round(-dx / step);
    if (move === 0 && (Math.abs(dx) > step * 0.18 || Math.abs(v) > 0.5)) move = dx < 0 ? 1 : -1;
    goTo(index + move);
    render(index);
    setTimeout(() => { dragged = false; }, 0);
  }
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  // horizontal trackpad swipes
  let wheelLock = 0;
  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    e.preventDefault();
    const now = performance.now();
    if (now - wheelLock < 450) return;
    wheelLock = now;
    goTo(index + (e.deltaX > 0 ? 1 : -1));
  }, { passive: false });

  /* ---------- controls ---------- */
  root.querySelector('.ps-prev').addEventListener('click', () => goTo(index - 1));
  root.querySelector('.ps-next').addEventListener('click', () => goTo(index + 1));
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
  });

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (dragged) return;
      if (i !== index) goTo(i);
      else openModal(i, card);
    });
    card.addEventListener('focus', () => { if (i !== index) goTo(i); });
  });

  /* ---------- modal ---------- */
  const modal = document.createElement('div');
  modal.className = 'ps-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="ps-modal-bg"></div>
    <div class="ps-modal-card" role="dialog" aria-modal="true" aria-labelledby="ps-modal-title" tabindex="-1">
      <button class="ps-modal-x" type="button" aria-label="Close project details">&times;</button>
      <div class="ps-modal-media"><img alt="" /><div class="ps-modal-ph"></div></div>
      <div class="ps-modal-body">
        <p class="ps-modal-cat"></p>
        <h3 id="ps-modal-title" class="ps-modal-title"></h3>
        <p class="ps-modal-desc"></p>
        <p class="ps-modal-label">Technologies used</p>
        <ul class="ps-modal-tech"></ul>
        <div class="ps-modal-actions">
          <a class="ps-modal-visit" target="_blank" rel="noopener noreferrer">Visit Live Website <span aria-hidden="true">&#8599;</span></a>
          <button class="ps-modal-close" type="button">Close</button>
        </div>
      </div>
    </div>`;
  section.appendChild(modal);
  const mBg = modal.querySelector('.ps-modal-bg');
  const mCard = modal.querySelector('.ps-modal-card');
  const mImg = modal.querySelector('.ps-modal-media img');
  const mPh = modal.querySelector('.ps-modal-ph');
  let isOpen = false, opener = null, closing = false;

  function openModal(i, from) {
    if (isOpen) return;
    isOpen = true; closing = false; opener = from || document.activeElement;
    const p = PROJECTS[i];
    modal.querySelector('.ps-modal-cat').textContent = p.category;
    modal.querySelector('.ps-modal-title').textContent = p.title;
    modal.querySelector('.ps-modal-desc').textContent = p.description;
    modal.querySelector('.ps-modal-tech').innerHTML = p.tech.map((t) => `<li>${esc(t)}</li>`).join('');
    modal.querySelector('.ps-modal-visit').href = p.url;
    if (p.image) { mPh.style.display = 'none'; mImg.style.display = 'block'; mImg.src = IMG + p.image; mImg.alt = `${p.title} website preview`; }
    else { mImg.style.display = 'none'; mImg.removeAttribute('src'); mPh.style.display = 'flex'; mPh.textContent = p.title; }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ps-lock');
    if (!REDUCED) {
      gsap.fromTo(mBg, { opacity: 0 }, { opacity: 1, duration: 0.45 });
      gsap.fromTo(mCard, { opacity: 0, y: 28, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' });
    }
    mCard.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!isOpen || closing) return;
    closing = true;
    const done = () => {
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('ps-lock');
      mImg.removeAttribute('src');
      isOpen = false; closing = false;
      if (opener && opener.focus) opener.focus({ preventScroll: true });
      opener = null;
    };
    if (REDUCED) return done();
    gsap.to(mBg, { opacity: 0, duration: 0.35 });
    gsap.to(mCard, { opacity: 0, y: 18, scale: 0.97, duration: 0.35, ease: 'power2.in', onComplete: done });
  }
  mBg.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  modal.querySelector('.ps-modal-x').addEventListener('click', closeModal);
  modal.querySelector('.ps-modal-close').addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const f = [...mCard.querySelectorAll('button, a[href]')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === mCard)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- go ---------- */
  size();
  updateMeta();
  new ResizeObserver(() => size()).observe(viewport);
}
