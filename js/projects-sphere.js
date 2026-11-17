/* Selected Projects: interactive 3D sphere (Three.js CSS3DRenderer + GSAP).
   Mount point: <div data-sphere></div>
   Add, remove or edit projects in the PROJECTS array below; nothing else needs to change. */
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const IMG = 'images/projects/';

const PROJECTS = [
  { image: '01-mobifyze.jpg', title: 'Mobifyze', category: 'Software', url: 'https://www.mobifyze.com/',
    description: 'Marketing site for a full-stack mobile app development company, with an animated hero slider and clear calls to action.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'GSAP', 'Swiper'] },
  { image: '02-authortune.jpg', title: 'AuthorTune', category: 'Publishing', url: 'https://authortune.com/',
    description: 'Publishing and author-services site that helps creators write, edit and publish professional books.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'jQuery', 'GSAP'] },
  { image: '03-s-hotel-group.jpg', title: 'S Hotel Group', category: 'Hospitality', url: 'https://www.s-hotelgroup.com/',
    description: 'Hospitality group site with a full-screen video hero and a brand switcher across its Dubai hotels and holiday homes.',
    tech: ['WordPress', 'Bootstrap', 'jQuery', 'JavaScript'] },
  { image: '04-s-hotels-international.jpg', title: 'S Hotels International', category: 'Hospitality', url: 'https://www.s-hotelsinternational.com/',
    description: 'Long-term rentals and serviced stays in Al Barsha South, Dubai, with flexible monthly options.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'jQuery', 'Slick'] },
  { image: '05-s19-hotels.jpg', title: 'S19 Hotel Al Jaddaf', category: 'Hospitality', url: 'https://www.s19hotels.com/',
    description: 'Three-star hotel near Dubai Creek with room listings, amenities and online booking.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'jQuery'] },
  { image: '06-sigma-plus-hotels.jpg', title: 'Sigma Plus Hotels', category: 'Hospitality', url: 'https://sigmaplushotels.co.uk/',
    description: 'Regency Square Suites in Brighton: suites, services, gallery, location and booking.',
    tech: ['WordPress', 'Elementor', 'Swiper', 'jQuery'] },
  { image: '07-greater-lakewood.jpg', title: 'Greater Lakewood', category: 'Classifieds', url: 'https://greaterlakewood.com/',
    description: 'Community classifieds for local ads, rentals, jobs and services, all in one place.',
    tech: ['Laravel', 'Bootstrap', 'jQuery'] },
  { image: '08-tradelify.jpg', title: 'Tradelify', category: 'Ecommerce', url: 'https://tradelify.co.uk/',
    description: 'Online store for everyday apparel: tees, polos, hoodies, jackets, headwear and bags.',
    tech: ['Laravel', 'HTML5', 'CSS3', 'JavaScript'] },
  { image: '09-helpers-now.jpg', title: 'Helpers Now', category: 'Services', url: 'https://helpersnow.co.uk/',
    description: 'London cleaning services site with service pages, clear pricing and quick online quote requests.',
    tech: ['WordPress', 'Bootstrap', 'GSAP', 'Swiper', 'jQuery'] },
  { image: null, title: 'The OakWood Publishers', category: 'Publishing', url: 'https://theoakwoodpublishers.com/',
    description: 'Book publishing and author services: ghostwriting, editing, proofreading, formatting and cover design.',
    tech: ['HTML5', 'CSS3', 'JavaScript'] },
  { image: '11-kayani-and-masood.jpg', title: 'Kayani & Masood', category: 'Legal', url: 'https://kayaniandmasood.com/',
    description: 'Website for a Karachi law chamber covering expertise, team profiles and news and insights.',
    tech: ['WordPress', 'Elementor', 'jQuery'] },
  { image: '12-mindweb.jpg', title: 'MindWeb', category: 'Wellness', url: 'https://mindweb.uk/',
    description: 'Landing page that routes visitors to the MetaMind and MindMend mental wellness platforms.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'] },
  { image: '13-positive-vibes-match.jpg', title: 'Positive Vibes Match', category: 'Community', url: 'https://positivevibesmatch.com/',
    description: 'Dating and community site for people living with medical conditions.',
    tech: ['WordPress', 'Bootstrap', 'jQuery'] },
  { image: '14-andrew-morris.jpg', title: 'Andrew Morris', category: 'Author', url: 'https://andrew-morris.webpixora.com/',
    description: 'Author site for the book "Sandwiched", with a book page, trailer, testimonials and speaking enquiries.',
    tech: ['WordPress', 'Elementor', 'Swiper', 'jQuery'] },
  { image: '15-iceman-refrigeration.jpg', title: 'Iceman Refrigeration', category: 'Services', url: 'https://icemanrefrigerationservices.co.uk/',
    description: 'Commercial refrigeration, cold room and air conditioning repair across the UK, with 24/7 call-outs.',
    tech: ['WordPress', 'Elementor', 'jQuery'] },
  { image: '16-no-judgment-media.jpg', title: 'No Judgment Media', category: 'Film & Media', url: 'https://nojudgmentmedia.org/',
    description: 'Film and coaching platform for writers, authors and creators, with services, trailers and a blog.',
    tech: ['WordPress', 'Elementor', 'Swiper', 'jQuery'] },
  { image: '17-universal-auto-truck-repair.jpg', title: 'Universal Auto & Truck Repair', category: 'Automotive', url: 'https://universalautoandtruckrepair.com/',
    description: 'Heavy-duty truck, diesel and fleet repair in Los Angeles, with service pages and scheduling.',
    tech: ['WordPress', 'Elementor', 'Bootstrap', 'Tailwind CSS', 'Swiper', 'jQuery'] },
  { image: '18-fargo-brothers.jpg', title: 'Fargo Brothers', category: 'Entertainment', url: 'https://fargobrothers.com/',
    description: 'Website for a classic-rock band: live shows for festivals, weddings, clubs and private events.',
    tech: ['WordPress', 'Elementor', 'jQuery'] },
  { image: '19-one-root.jpg', title: 'One Root', category: 'Non-profit', url: 'https://1oneroot.org/',
    description: 'Tree-planting non-profit site built around the idea of one person, one tree, one planet.',
    tech: ['WordPress', 'Elementor', 'Slick', 'jQuery'] },
];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.querySelector('[data-sphere]');
if (root) init(root);

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function init(root) {
  const section = root.closest('.sphere-section') || root;
  const N = PROJECTS.length;

  /* ---------- scene ---------- */
  const renderer = new CSS3DRenderer();
  renderer.domElement.className = 'sp-renderer';
  root.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 10, 6000);
  const group = new THREE.Group();
  scene.add(group);

  let W = 0, H = 0, R = 300, D = 800;

  /* ---------- cards ---------- */
  const cards = PROJECTS.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'sp-card';
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.setAttribute('aria-label', `${p.title}, ${p.category}. Open project details`);
    el.innerHTML = `
      <div class="sp-face">
        ${p.image
          ? `<img src="${IMG}${esc(p.image)}" alt="" draggable="false" decoding="async" ${i < 8 ? '' : 'loading="lazy"'} />`
          : `<div class="sp-noimg"><span>${esc(p.title)}</span></div>`}
        <div class="sp-meta"><strong>${esc(p.title)}</strong><span>${esc(p.category)}</span></div>
      </div>`;
    const obj = new CSS3DObject(el);
    group.add(obj);
    return { p, i, el, face: el.firstElementChild, obj, intro: 0, hover: false, scale: 1, roll: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (((i * 7) % 5) - 2) * 0.05) };
  });

  /* ---------- layout ---------- */
  function layout() {
    W = root.clientWidth || window.innerWidth;
    H = root.clientHeight || window.innerHeight;
    const base = Math.min(W * 0.9, H * 1.15);
    R = Math.max(base * 0.5, 170);
    const cw = Math.max(R * 0.46, 150), ch = (cw * 9) / 16;
    // camera distance keeps front cards near 1:1 size at any screen height
    D = R + ((H / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.05;
    camera.aspect = W / H;
    camera.position.set(0, 0, D);
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
    root.style.setProperty('--sp-w', cw + 'px');
    root.style.setProperty('--sp-h', ch + 'px');

    // Fibonacci sphere: even spread over 360 degrees, cards face outward
    const golden = Math.PI * (3 - Math.sqrt(5));
    cards.forEach((c, i) => {
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      c.obj.position.set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
      // face outward from the sphere centre (+z of the card points along the surface normal)
      const n = c.obj.position.clone().normalize();
      const up = Math.abs(n.y) > 0.999 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
      c.obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(n, new THREE.Vector3(), up));
    });
  }

  /* ---------- rotation state ---------- */
  const ang = { x: 0, y: 0 };          // angular velocity (rad per 60fps frame)
  const AUTO = { x: 0.0004, y: 0.0016 };
  const qx = new THREE.Quaternion(), qy = new THREE.Quaternion();
  const AX = new THREE.Vector3(1, 0, 0), AY = new THREE.Vector3(0, 1, 0);
  group.quaternion.setFromEuler(new THREE.Euler(0.35, -0.5, 0));

  let lastInput = performance.now();
  let dragging = false, dragMoved = 0, last = null, paused = false, hoverCount = 0, speed = 1;

  const clampV = (v, m) => Math.max(-m, Math.min(m, v));
  const poke = () => { lastInput = performance.now(); };

  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; dragMoved = 0; last = { x: e.clientX, y: e.clientY };
    root.classList.add('is-dragging'); poke();
  }
  function onMove(e) {
    if (paused) return;
    if (dragging) {
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      dragMoved += Math.abs(dx) + Math.abs(dy);
      ang.y = clampV(dx * 0.006, 0.12);
      ang.x = clampV(dy * 0.006, 0.12);
      rotate(ang.x, ang.y);
      poke();
    } else if (e.pointerType === 'mouse') {
      // free mouse movement nudges the sphere with inertia
      if (last) {
        ang.y = clampV(ang.y + (e.clientX - last.x) * 0.0007, 0.05);
        ang.x = clampV(ang.x + (e.clientY - last.y) * 0.0007, 0.05);
      }
      last = { x: e.clientX, y: e.clientY };
      poke();
    }
  }
  function onUp() { dragging = false; root.classList.remove('is-dragging'); poke(); }
  function rotate(x, y) {
    qy.setFromAxisAngle(AY, y); qx.setFromAxisAngle(AX, x);
    group.quaternion.premultiply(qy).premultiply(qx);
  }
  root.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') last = null; });

  /* ---------- hover ---------- */
  cards.forEach((c) => {
    c.el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      c.hover = true; hoverCount++;
      gsap.to(c, { scale: 1.14, duration: REDUCED ? 0 : 0.5, ease: 'power3.out', overwrite: true });
      c.el.classList.add('is-hover');
    });
    c.el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || !c.hover) return;
      c.hover = false; hoverCount = Math.max(0, hoverCount - 1);
      gsap.to(c, { scale: 1, duration: REDUCED ? 0 : 0.5, ease: 'power3.out', overwrite: true });
      c.el.classList.remove('is-hover');
    });
    c.el.addEventListener('click', () => { if (dragMoved < 6) openModal(c); });
    c.el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(c); }
    });
    c.el.addEventListener('focus', () => { c.el.classList.add('is-hover'); });
    c.el.addEventListener('blur', () => { if (!c.hover) c.el.classList.remove('is-hover'); });
  });

  /* ---------- modal ---------- */
  const modal = document.createElement('div');
  modal.className = 'sp-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="sp-modal-bg"></div>
    <div class="sp-modal-card" role="dialog" aria-modal="true" aria-labelledby="sp-modal-title" tabindex="-1">
      <button class="sp-modal-x" type="button" aria-label="Close project details">&times;</button>
      <div class="sp-modal-media"><img alt="" /><div class="sp-modal-ph"></div></div>
      <div class="sp-modal-body">
        <p class="sp-modal-cat"></p>
        <h3 id="sp-modal-title" class="sp-modal-title"></h3>
        <p class="sp-modal-desc"></p>
        <p class="sp-modal-label">Technologies used</p>
        <ul class="sp-modal-tech"></ul>
        <div class="sp-modal-actions">
          <a class="sp-modal-visit" target="_blank" rel="noopener noreferrer">Visit Live Website <span aria-hidden="true">&#8599;</span></a>
          <button class="sp-modal-close" type="button">Close</button>
        </div>
      </div>
    </div>`;
  section.appendChild(modal);
  const mBg = modal.querySelector('.sp-modal-bg');
  const mCard = modal.querySelector('.sp-modal-card');
  const mImg = modal.querySelector('.sp-modal-media img');
  const mPh = modal.querySelector('.sp-modal-ph');
  let openCard = null, opener = null, closing = false;

  function openModal(c) {
    if (openCard) return;
    openCard = c; opener = document.activeElement; paused = true; closing = false;
    const p = c.p;
    modal.querySelector('.sp-modal-cat').textContent = p.category;
    modal.querySelector('.sp-modal-title').textContent = p.title;
    modal.querySelector('.sp-modal-desc').textContent = p.description;
    modal.querySelector('.sp-modal-tech').innerHTML = p.tech.map((t) => `<li>${esc(t)}</li>`).join('');
    modal.querySelector('.sp-modal-visit').href = p.url;
    if (p.image) { mPh.style.display = 'none'; mImg.style.display = 'block'; mImg.src = IMG + p.image; mImg.alt = `${p.title} website preview`; }
    else { mImg.style.display = 'none'; mImg.removeAttribute('src'); mPh.style.display = 'flex'; mPh.textContent = p.title; }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('sp-lock');
    if (REDUCED) { gsap.set([mBg, mCard], { opacity: 1, y: 0, scale: 1 }); }
    else {
      gsap.fromTo(mBg, { opacity: 0 }, { opacity: 1, duration: 0.45 });
      gsap.fromTo(mCard, { opacity: 0, y: 28, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' });
    }
    mCard.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!openCard || closing) return;
    closing = true;
    const done = () => {
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('sp-lock');
      mImg.removeAttribute('src');
      const o = opener; openCard = null; opener = null; paused = false; closing = false; poke();
      if (o && o.focus) o.focus({ preventScroll: true });
    };
    if (REDUCED) return done();
    gsap.to(mBg, { opacity: 0, duration: 0.35 });
    gsap.to(mCard, { opacity: 0, y: 18, scale: 0.97, duration: 0.35, ease: 'power2.in', onComplete: done });
  }
  mBg.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  modal.querySelector('.sp-modal-x').addEventListener('click', closeModal);
  modal.querySelector('.sp-modal-close').addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (!openCard) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = [...mCard.querySelectorAll('button, a[href]')];
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === mCard)) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- render loop ---------- */
  const wp = new THREE.Vector3(), cam = new THREE.Vector3(), dir = new THREE.Vector3(), tc = new THREE.Vector3();
  const ZERO = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  const mat = new THREE.Matrix4(), wq = new THREE.Quaternion(), gInv = new THREE.Quaternion();
  const LEAN = 0.65;
  let visible = false, raf = 0, prev = performance.now();

  function frame(now) {
    if (!visible) { raf = 0; return; }
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - prev) / 16.667, 3);
    prev = now;

    if (!paused) {
      const idle = !dragging && now - lastInput > 1500 && !REDUCED;
      const tx = idle ? AUTO.x : 0, ty = idle ? AUTO.y : 0;
      if (!dragging) {
        const f = 1 - Math.pow(1 - 0.035, dt);
        ang.x += (tx - ang.x) * f;
        ang.y += (ty - ang.y) * f;
        // slow down while hovering a card
        speed += ((hoverCount > 0 ? 0.15 : 1) - speed) * (1 - Math.pow(0.9, dt));
        rotate(ang.x * dt * speed, ang.y * dt * speed);
      }
    }

    group.updateMatrixWorld(true);
    cam.set(0, 0, D);
    gInv.copy(group.quaternion).invert();
    for (const c of cards) {
      c.obj.getWorldPosition(wp);
      const t = (wp.z + R) / (2 * R);                          // 0 = far side, 1 = nearest
      // lean every card toward the viewer so the whole sphere stays readable (never a flat ring)
      dir.copy(wp).normalize().multiplyScalar(1 - LEAN).addScaledVector(tc.copy(cam).sub(wp).normalize(), LEAN).normalize();
      mat.lookAt(dir, ZERO, UP);
      wq.setFromRotationMatrix(mat);
      c.obj.quaternion.copy(gInv).multiply(wq).multiply(c.roll);
      const bright = 0.32 + 0.68 * Math.pow(Math.max(t, 0), 1.2);   // foreground brighter, background darker
      const op = c.hover || c.el === document.activeElement ? 1 : bright * c.intro;
      c.el.style.opacity = op.toFixed(3);
      c.el.style.zIndex = Math.round(t * 1000);
      c.face.style.transform = `scale(${c.scale.toFixed(3)})`;
    }
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible && !raf) { prev = performance.now(); raf = requestAnimationFrame(frame); }
  }, { rootMargin: '100px' });

  layout();
  io.observe(root);
  let rz = 0;
  new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { if (root.clientWidth !== W || root.clientHeight !== H) layout(); }); }).observe(root);

  // entrance: cards bloom in one after another, once the section is on screen
  const ioIntro = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    ioIntro.disconnect();
    if (REDUCED) cards.forEach((c) => { c.intro = 1; });
    else gsap.to(cards, { intro: 1, duration: 1.1, ease: 'power2.out', stagger: 0.06 });
  }, { threshold: 0.25 });
  ioIntro.observe(root);
}
