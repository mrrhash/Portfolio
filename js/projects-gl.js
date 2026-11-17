/* WebGL project grid — Three.js 0.160 + GSAP 3.12 (globals: gsap).
   Mount point: <div data-pgl [data-limit="N"]></div>
   The canvas is pinned (position: sticky) while the page scrolls natively, so
   the grid behaves like a normal section: no scroll hijacking. */
import * as THREE from 'three';

const BASE = 'images/projects/';

const SITES = [
  { n: '01', slug: 'mobifyze', title: 'Mobifyze', cat: 'Software', url: 'https://www.mobifyze.com/',
    desc: 'Marketing site for a full-stack mobile app development company, with an animated hero slider and clear calls to action.' },
  { n: '02', slug: 'authortune', title: 'AuthorTune', cat: 'Publishing', url: 'https://authortune.com/',
    desc: 'Publishing and author-services site that helps creators write, edit and publish professional books.' },
  { n: '03', slug: 's-hotel-group', title: 'S Hotel Group', cat: 'Hospitality', url: 'https://www.s-hotelgroup.com/',
    desc: 'Hospitality group site with a full-screen video hero and a brand switcher across its Dubai hotels and holiday homes.' },
  { n: '04', slug: 's-hotels-international', title: 'S Hotels International', cat: 'Hospitality', url: 'https://www.s-hotelsinternational.com/',
    desc: 'Long-term rentals and serviced stays in Al Barsha South, Dubai, with flexible monthly options.' },
  { n: '05', slug: 's19-hotels', title: 'S19 Hotel Al Jaddaf', cat: 'Hospitality', url: 'https://www.s19hotels.com/',
    desc: 'Three-star hotel near Dubai Creek with room listings, amenities and online booking.' },
  { n: '06', slug: 'sigma-plus-hotels', title: 'Sigma Plus Hotels', cat: 'Hospitality', url: 'https://sigmaplushotels.co.uk/',
    desc: 'Regency Square Suites in Brighton: suites, services, gallery, location and booking.' },
  { n: '07', slug: 'greater-lakewood', title: 'Greater Lakewood', cat: 'Classifieds', url: 'https://greaterlakewood.com/',
    desc: 'Community classifieds for local ads, rentals, jobs and services, all in one place.' },
  { n: '08', slug: 'tradelify', title: 'Tradelify', cat: 'Ecommerce', url: 'https://tradelify.co.uk/',
    desc: 'Online store for everyday apparel: tees, polos, hoodies, jackets, headwear and bags.' },
  { n: '09', slug: 'helpers-now', title: 'Helpers Now', cat: 'Services', url: 'https://helpersnow.co.uk/',
    desc: 'London cleaning services site with service pages, clear pricing and quick online quote requests.' },
  { n: '10', slug: 'oakwood-publishers', title: 'The OakWood Publishers', cat: 'Publishing', url: 'https://theoakwoodpublishers.com/', noImage: true,
    desc: 'Book publishing and author services: ghostwriting, editing, proofreading, formatting and cover design.' },
  { n: '11', slug: 'kayani-and-masood', title: 'Kayani & Masood', cat: 'Legal', url: 'https://kayaniandmasood.com/',
    desc: 'Website for a Karachi law chamber covering expertise, team profiles and news and insights.' },
  { n: '12', slug: 'mindweb', title: 'MindWeb', cat: 'Wellness', url: 'https://mindweb.uk/',
    desc: 'Landing page that routes visitors to the MetaMind and MindMend mental wellness platforms.' },
  { n: '13', slug: 'positive-vibes-match', title: 'Positive Vibes Match', cat: 'Community', url: 'https://positivevibesmatch.com/',
    desc: 'Dating and community site for people living with medical conditions.' },
  { n: '14', slug: 'andrew-morris', title: 'Andrew Morris', cat: 'Author', url: 'https://andrew-morris.webpixora.com/',
    desc: 'Author site for the book "Sandwiched", with a book page, trailer, testimonials and speaking enquiries.' },
  { n: '15', slug: 'iceman-refrigeration', title: 'Iceman Refrigeration', cat: 'Services', url: 'https://icemanrefrigerationservices.co.uk/',
    desc: 'Commercial refrigeration, cold room and air conditioning repair across the UK, with 24/7 call-outs.' },
  { n: '16', slug: 'no-judgment-media', title: 'No Judgment Media', cat: 'Film & Media', url: 'https://nojudgmentmedia.org/',
    desc: 'Film and coaching platform for writers, authors and creators, with services, trailers and a blog.' },
  { n: '17', slug: 'universal-auto-truck-repair', title: 'Universal Auto & Truck Repair', cat: 'Automotive', url: 'https://universalautoandtruckrepair.com/',
    desc: 'Heavy-duty truck, diesel and fleet repair in Los Angeles, with service pages and scheduling.' },
  { n: '18', slug: 'fargo-brothers', title: 'Fargo Brothers', cat: 'Entertainment', url: 'https://fargobrothers.com/',
    desc: 'Website for a classic-rock band: live shows for festivals, weddings, clubs and private events.' },
  { n: '19', slug: 'one-root', title: 'One Root', cat: 'Non-profit', url: 'https://1oneroot.org/',
    desc: 'Tree-planting non-profit site built around the idea of one person, one tree, one planet.' },
];

const SANS = '"Geist", ui-sans-serif, system-ui, sans-serif';
const SERIF = '"Newsreader", ui-serif, Georgia, serif';
const BG = '#131313';
const INK = '#ededeb';
const MUTE = '#8a8a88';
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(pointer: coarse)').matches;

const root = document.querySelector('[data-pgl]');
if (root) init(root);

function srgb(v) { return Math.pow(v, 2.2); }

async function init(root) {
  const limit = Math.min(parseInt(root.dataset.limit, 10) || SITES.length, SITES.length);
  const data = SITES.slice(0, limit);

  root.classList.add('pgl');
  root.innerHTML = `
    <ul class="pgl-sr">${data.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} — ${s.cat}</a></li>`).join('')}</ul>
    <div class="pgl-stage"><div class="pgl-sticky"><canvas class="pgl-canvas" aria-hidden="true"></canvas></div></div>
    <div class="pgl-bubble" aria-hidden="true">View</div>
    <div class="pgl-lb" aria-hidden="true">
      <div class="pgl-lb-bg"></div>
      <div class="pgl-lb-card" role="dialog" aria-modal="true" aria-label="Project preview">
        <div class="pgl-lb-media"><img alt="" /><div class="pgl-lb-ph"></div></div>
        <div class="pgl-lb-head"><span class="pgl-lb-title"></span><span class="pgl-lb-cat"></span></div>
        <p class="pgl-lb-desc"></p>
        <div class="pgl-lb-actions">
          <a class="pgl-lb-visit" target="_blank" rel="noopener noreferrer">Visit website &#8599;</a>
          <button class="pgl-lb-close" type="button">Close</button>
        </div>
      </div>
    </div>`;

  const stage = root.querySelector('.pgl-stage');
  const sticky = root.querySelector('.pgl-sticky');
  const canvas = root.querySelector('.pgl-canvas');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch (e) {
    return fallback(root, data);
  }
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(BG, 1);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`500 12px ${SANS}`),
        document.fonts.load(`400 17px ${SERIF}`),
        document.fonts.load(`italic 400 16px ${SERIF}`),
        document.fonts.ready,
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch (e) { /* fall through with system fonts */ }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 1, 10000);
  const geo = new THREE.PlaneGeometry(1, 1);
  const raycaster = new THREE.Raycaster();
  const clock = new THREE.Clock();

  /* ---------- layout constants (px) ---------- */
  const PAD = 8, GAP = 8, ROW_GAP = 40, LABELS_H = 47;
  const HEAD_Y = 110, HEAD_TO_GRID = 80, FOOT_GAP = 90;

  let W = 0, H = 0, cols = 3, tw = 0, th = 0, pitch = 0, gridTop = 0, stageH = 0, camZ = 0, isMobile = false;

  /* ---------- canvas text helper ---------- */
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(w * DPR));
    c.height = Math.max(2, Math.ceil(h * DPR));
    const x = c.getContext('2d');
    x.scale(DPR, DPR);
    draw(x);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }
  function textMesh(tex, w, h, order) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    m.scale.set(w, h, 1);
    m.renderOrder = order;
    scene.add(m);
    return m;
  }

  /* ---------- shaders ---------- */
  const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
  const SK = srgb(0.085).toFixed(5);
  const CHIP_BASE = srgb(0.05).toFixed(5);

  const TILE_FRAG = `
    uniform sampler2D uTex; uniform sampler2D uTex2;
    uniform float uMix; uniform float uReveal; uniform float uTime; uniform float uAlpha;
    varying vec2 vUv;
    void main(){
      float sweep = fract(uTime * 0.6);
      float band = smoothstep(0.18, 0.0, abs((vUv.x + vUv.y) * 0.5 - sweep)) * 0.035;
      vec3 sk = vec3(${SK} + band);
      vec3 m = mix(texture2D(uTex, vUv).rgb, texture2D(uTex2, vUv).rgb, uMix);
      gl_FragColor = vec4(mix(sk, m, uReveal), uAlpha);
    }`;

  const CHIP_FRAG = `
    uniform sampler2D uTex; uniform sampler2D uTex2; uniform sampler2D uLabel;
    uniform float uMix; uniform float uReveal; uniform float uAlpha;
    uniform vec4 uRect; uniform vec2 uBlur;
    varying vec2 vUv;
    vec3 tileCol(vec2 uv){
      vec3 a = texture2D(uTex, uv).rgb;
      if (uMix > 0.001) a = mix(a, texture2D(uTex2, uv).rgb, uMix);
      return a;
    }
    void main(){
      vec2 tuv = uRect.xy + vUv * uRect.zw;
      vec3 acc = vec3(0.0);
      for (int i = 0; i < 32; i++) {
        float fi = float(i);
        float r = sqrt((fi + 0.5) / 32.0);
        float a = fi * 2.39996323;
        acc += tileCol(clamp(tuv + vec2(cos(a), sin(a)) * r * uBlur, 0.0, 1.0));
      }
      acc /= 32.0;
      vec3 base = mix(vec3(${SK}), acc, uReveal);
      base = mix(base, vec3(${CHIP_BASE}), 0.45);
      vec4 lab = texture2D(uLabel, vUv);
      gl_FragColor = vec4(mix(base, lab.rgb, lab.a), uAlpha);
    }`;

  const POST_FRAG = `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    const float BAND = 0.08;
    const float STRENGTH = 1.0;
    vec3 enc(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
    void main(){
      float y = vUv.y;
      float t = 0.0; float dir = 0.0;
      if (y > 1.0 - BAND) { t = (y - (1.0 - BAND)) / BAND; dir = -1.0; }
      else if (y < BAND)  { t = (BAND - y) / BAND; dir = 1.0; }
      vec3 col;
      if (dir == 0.0) {
        col = texture2D(tDiffuse, vUv).rgb;
      } else {
        float sag = 1.0 - sqrt(max(0.0, 1.0 - t * t));
        float shift = dir * sag * BAND * STRENGTH;
        vec3 acc = vec3(0.0); vec3 wsum = vec3(0.0);
        for (int i = 0; i < 16; i++) {
          float s = float(i) / 15.0;
          float off = (s - 0.5) * 0.01 * t * 30.0 * BAND;
          vec3 w = vec3(smoothstep(0.8, 0.2, s),
                        smoothstep(0.0, 0.5, s) * smoothstep(1.0, 0.5, s),
                        smoothstep(0.2, 0.8, s));
          vec3 smp = texture2D(tDiffuse, vec2(vUv.x, clamp(vUv.y + shift + off, 0.0, 1.0))).rgb;
          acc += smp * w; wsum += w;
        }
        col = acc / max(wsum, vec3(0.0001));
      }
      gl_FragColor = vec4(enc(max(col, 0.0)), 1.0);
    }`;

  /* ---------- post-processing target ---------- */
  let rt = null;
  const postScene = new THREE.Scene();
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const postMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null } }, vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`, fragmentShader: POST_FRAG, depthTest: false, depthWrite: false,
  });
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

  /* ---------- placeholder texture ---------- */
  const blank = new THREE.DataTexture(new Uint8Array([20, 20, 20, 255]), 1, 1);
  blank.colorSpace = THREE.SRGBColorSpace;
  blank.needsUpdate = true;
  const timeU = { value: 0 };

  /* ---------- items ---------- */
  const items = data.map((s, i) => {
    const u = {
      uTex: { value: blank }, uTex2: { value: blank },
      uMix: { value: 0 }, uReveal: { value: 0 }, uTime: timeU, uAlpha: { value: 0 },
    };
    const tile = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: u, vertexShader: VERT, fragmentShader: TILE_FRAG, transparent: true, depthTest: false, depthWrite: false,
    }));
    tile.renderOrder = 0;
    scene.add(tile);

    // frosted index chip
    const label = `${String(i + 1).padStart(2, '0')}  ${s.cat}`;
    const m = document.createElement('canvas').getContext('2d');
    m.font = `500 12px ${SANS}`;
    const cw = Math.ceil(m.measureText(label).width) + 16, ch = 24;
    const chipU = {
      uTex: u.uTex, uTex2: u.uTex2, uMix: u.uMix, uReveal: u.uReveal, uAlpha: u.uAlpha,
      uLabel: { value: canvasTex(cw, ch, (x) => {
        x.font = `500 12px ${SANS}`; x.fillStyle = INK; x.textBaseline = 'alphabetic';
        x.fillText(label, 8, 6 + 12);
      }) },
      uRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uBlur: { value: new THREE.Vector2(0.1, 0.1) },
    };
    const chip = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: chipU, vertexShader: VERT, fragmentShader: CHIP_FRAG, transparent: true, depthTest: false, depthWrite: false,
    }));
    chip.scale.set(cw, ch, 1);
    chip.renderOrder = 3;
    scene.add(chip);

    const TW = 360;
    const title = textMesh(canvasTex(TW, 16, (x) => {
      x.font = `500 12px ${SANS}`; x.fillStyle = INK; x.textBaseline = 'alphabetic';
      x.fillText(s.title, 0, 12);
    }), TW, 16, 1);
    const cat = textMesh(canvasTex(TW, 17, (x) => {
      x.font = `400 13px ${SERIF}`; x.fillStyle = MUTE; x.textBaseline = 'alphabetic';
      x.fillText(s.cat, 0, 13);
    }), TW, 17, 1);

    return {
      s, i, u, chipU, tile, chip, title, cat, cw, ch, TW,
      col: 0, row: 0, x: 0, y: 0, left: 0,
      st: { appear: 0, rise: 60 }, seen: false, loading: false, altLoading: false, loaded: false,
    };
  });

  /* ---------- headline + footer (canvas text) ---------- */
  const head = { mesh: null, tex: null, state: { p: 0 }, started: false, rand: [] };
  const foot = { mesh: null };

  function headlineParts() {
    const a = isMobile ? 'A Curated Selection of Websites and' : 'A Curated Selection of ';
    const b = isMobile ? 'Web Applications' : 'Websites and Web Applications';
    return isMobile
      ? [[{ t: a, font: `500 16px ${SANS}`, ls: '-0.16px', color: INK }], [{ t: b, font: `400 17px ${SERIF}`, ls: '0px', color: INK }]]
      : [[{ t: a, font: `500 16px ${SANS}`, ls: '-0.16px', color: INK }, { t: b, font: `400 17px ${SERIF}`, ls: '0px', color: INK }]];
  }

  const GLYPHS = ['.', ':', '·', ',', ';', '_'];
  function drawHeadline(p) {
    if (!head.tex) return;
    const c = head.tex.image, x = c.getContext('2d');
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    x.clearRect(0, 0, W, 64);
    x.textBaseline = 'alphabetic';
    const lines = headlineParts();
    let total = 0; lines.forEach((l) => l.forEach((pt) => { total += pt.t.length; }));
    let k = 0;
    lines.forEach((line, li) => {
      // measure line
      let lw = 0;
      const widths = line.map((pt) => { x.font = pt.font; x.letterSpacing = pt.ls; const w = x.measureText(pt.t).width; lw += w; return w; });
      let cx = (W - lw) / 2;
      const by = 22 + li * 20;
      line.forEach((pt) => {
        x.font = pt.font; x.letterSpacing = pt.ls; x.fillStyle = pt.color;
        for (const ch of pt.t) {
          const adv = x.measureText(ch).width;
          if (!head.rand[k]) head.rand[k] = Math.random();
          const done = p >= 0.7 * (k / total) + 0.3 * head.rand[k];
          if (ch !== ' ') x.fillText(done ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0], cx, by);
          cx += adv; k++;
        }
      });
    });
    x.letterSpacing = '0px';
    head.tex.needsUpdate = true;
  }

  function buildHeadline() {
    if (head.mesh) { scene.remove(head.mesh); head.mesh.material.map.dispose(); head.mesh.material.dispose(); }
    head.tex = canvasTex(W, 64, () => {});
    head.mesh = textMesh(head.tex, W, 64, 1);
    head.mesh.material.opacity = head.started ? 1 : 0;
    head.rand = [];
    drawHeadline(head.started ? head.state.p : 0);
  }

  function buildFooter() {
    if (foot.mesh) { scene.remove(foot.mesh); foot.mesh.material.map.dispose(); foot.mesh.material.dispose(); }
    const tex = canvasTex(W, 24, (x) => {
      x.font = `400 13px ${SERIF}`; x.fillStyle = MUTE; x.textBaseline = 'alphabetic';
      if (isMobile) {
        x.textAlign = 'left'; x.fillText('Hassan Raza', PAD + 4, 16);
        x.textAlign = 'right'; x.fillText('Selected Work', W - PAD - 4, 16);
      } else {
        x.textAlign = 'center'; x.fillText('Hassan Raza — Selected Work', W / 2, 16);
      }
    });
    foot.mesh = textMesh(tex, W, 24, 1);
    foot.mesh.material.opacity = 1;
  }

  /* ---------- layout ---------- */
  function layout() {
    W = stage.clientWidth || window.innerWidth;
    H = window.innerHeight;
    isMobile = W <= 640;
    cols = W > 1024 ? 3 : W > 640 ? 2 : 1;
    tw = (W - PAD * 2 - GAP * (cols - 1)) / cols;
    th = (tw * 9) / 16;
    pitch = th + LABELS_H + ROW_GAP;
    gridTop = HEAD_Y + HEAD_TO_GRID;
    const rows = Math.ceil(items.length / cols);
    const gridBottom = gridTop + rows * pitch - ROW_GAP;
    stageH = Math.max(gridBottom + FOOT_GAP + 40, H);
    stage.style.height = stageH + 'px';
    sticky.style.height = H + 'px';

    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camZ = H / 2 / Math.tan(THREE.MathUtils.degToRad(17.5));
    camera.updateProjectionMatrix();

    if (rt) rt.dispose();
    rt = new THREE.WebGLRenderTarget(Math.floor(W * DPR), Math.floor(H * DPR), { samples: 4, type: THREE.HalfFloatType, depthBuffer: false });
    rt.texture.colorSpace = THREE.LinearSRGBColorSpace;

    items.forEach((it) => {
      it.col = it.i % cols; it.row = Math.floor(it.i / cols);
      it.left = PAD + it.col * (tw + GAP);
      it.x = it.left + tw / 2;
      it.y = gridTop + it.row * pitch + th / 2;
      it.tile.scale.set(tw, th, 1);
      it.chipU.uRect.value.set(PAD / tw, 1 - (PAD + it.ch) / th, it.cw / tw, it.ch / th);
      it.chipU.uBlur.value.set(40 / tw, 40 / th);
    });

    buildHeadline();
    head.mesh.position.set(W / 2, -HEAD_Y, 1);
    buildFooter();
    foot.mesh.position.set(W / 2, -(gridBottom + 60), 1);
  }

  function place() {
    items.forEach((it) => {
      const r = it.st.rise;
      it.tile.position.set(it.x, -(it.y + r), 0);
      it.chip.position.set(it.left + PAD + it.cw / 2, -(it.y - th / 2 + PAD + it.ch / 2 + r), 2);
      const ty = it.y + th / 2 + 12 + 8 + r;
      it.title.position.set(it.left + it.TW / 2, -ty, 1);
      it.cat.position.set(it.left + it.TW / 2, -(ty + 8 + 6 + 8.5), 1);
      const a = it.st.appear;
      it.u.uAlpha.value = a;
      it.title.material.opacity = a;
      it.cat.material.opacity = a;
    });
  }

  /* ---------- image loading ---------- */
  function loadImg(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });
  }
  function toTex(im) {
    const c = document.createElement('canvas');
    c.width = 960; c.height = Math.round((960 * im.naturalHeight) / im.naturalWidth);
    const x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(im, 0, 0, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }
  function placeholderTex(s) {
    return canvasTex(960, 540, (x) => {
      const g = x.createLinearGradient(0, 0, 960, 540);
      g.addColorStop(0, '#1d1a14'); g.addColorStop(1, '#0d0c0a');
      x.fillStyle = g; x.fillRect(0, 0, 960, 540);
      x.textAlign = 'center'; x.fillStyle = INK; x.font = `300 54px ${SERIF}`;
      x.fillText(s.title, 480, 270);
      x.fillStyle = MUTE; x.font = `500 18px ${SANS}`;
      x.fillText(s.url.replace(/^https?:\/\//, '').replace(/\/$/, ''), 480, 316);
    });
  }

  function loadPrimary(it) {
    if (it.loading) return;
    it.loading = true;
    const done = (tex) => {
      it.u.uTex.value = tex;
      if (it.u.uTex2.value === blank) it.u.uTex2.value = tex;
      it.loaded = true;
      REDUCED ? (it.u.uReveal.value = 1) : gsap.to(it.u.uReveal, { value: 1, duration: 0.8, ease: 'power2.out' });
    };
    if (it.s.noImage) return done(placeholderTex(it.s));
    loadImg(`${BASE}${it.s.n}-${it.s.slug}.jpg`).then((im) => done(toTex(im))).catch(() => done(placeholderTex(it.s)));
  }
  function loadAlt(it) {
    if (it.altLoading || it.s.noImage) return;
    it.altLoading = true;
    loadImg(`${BASE}${it.s.n}-${it.s.slug}-b.jpg`).then((im) => { it.u.uTex2.value = toTex(im); }).catch(() => {});
  }

  /* ---------- hover / click ---------- */
  const bubble = root.querySelector('.pgl-bubble');
  gsap.set(bubble, { x: -100, y: -100, scale: 0.6, opacity: 0 });
  const bx = gsap.quickTo(bubble, 'x', { duration: 0.5, ease: 'power3.out' });
  const by = gsap.quickTo(bubble, 'y', { duration: 0.5, ease: 'power3.out' });

  let hovered = null, pointer = null;
  const desktop = () => W > 1024 && !COARSE;

  function setPlay(it) {
    if (hovered === it) return;
    if (hovered) gsap.to(hovered.u.uMix, { value: 0, duration: 0.45, ease: 'power2.out', overwrite: true });
    hovered = it;
    if (it) { loadAlt(it); gsap.to(it.u.uMix, { value: 1, duration: 0.45, ease: 'power2.out', overwrite: true }); }
  }

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    pointer = { x: e.clientX, y: e.clientY };
    if (desktop()) { bx(e.clientX - 32); by(e.clientY - 32); }
  });
  canvas.addEventListener('pointerleave', () => {
    pointer = null;
    if (desktop()) { setPlay(null); gsap.to(bubble, { opacity: 0, scale: 0.6, duration: 0.6, ease: 'power4.out', overwrite: true }); canvas.style.cursor = 'default'; }
  });

  function hit(cx, cy) {
    const r = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    // ignore the refracted lens bands: they are not reliable click targets
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(items.map((it) => it.tile), false);
    if (!hits.length) return null;
    return items.find((it) => it.tile === hits[0].object) || null;
  }

  canvas.addEventListener('click', (e) => { const it = hit(e.clientX, e.clientY); if (it && it.st.appear > 0.3) openLB(it); });

  /* ---------- lightbox ---------- */
  const lb = root.querySelector('.pgl-lb');
  const lbBg = lb.querySelector('.pgl-lb-bg');
  const lbCard = lb.querySelector('.pgl-lb-card');
  const lbImg = lb.querySelector('img');
  const lbPh = lb.querySelector('.pgl-lb-ph');
  let lbOpen = false;

  function openLB(it) {
    lbOpen = true;
    lb.querySelector('.pgl-lb-title').textContent = it.s.title;
    lb.querySelector('.pgl-lb-cat').textContent = it.s.cat;
    lb.querySelector('.pgl-lb-desc').textContent = it.s.desc;
    lb.querySelector('.pgl-lb-visit').href = it.s.url;
    if (it.s.noImage) { lbImg.style.display = 'none'; lbPh.style.display = 'flex'; lbPh.textContent = it.s.title; }
    else { lbPh.style.display = 'none'; lbImg.style.display = 'block'; lbImg.src = `${BASE}${it.s.n}-${it.s.slug}.jpg`; lbImg.alt = `${it.s.title} website preview`; }
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('pgl-lock');
    gsap.fromTo(lbBg, { opacity: 0 }, { opacity: 1, duration: 0.45 });
    gsap.fromTo(lbCard, { opacity: 0, scale: 0.94, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'expo.out' });
    lb.querySelector('.pgl-lb-close').focus({ preventScroll: true });
  }
  function closeLB() {
    if (!lbOpen) return;
    lbOpen = false;
    gsap.to(lbBg, { opacity: 0, duration: 0.3 });
    gsap.to(lbCard, { opacity: 0, scale: 0.97, duration: 0.3, onComplete: () => {
      lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lbImg.removeAttribute('src');
      document.documentElement.classList.remove('pgl-lock');
    } });
  }
  lbBg.addEventListener('click', closeLB);
  lb.querySelector('.pgl-lb-close').addEventListener('click', closeLB);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });

  /* ---------- frame loop ---------- */
  let visible = false, raf = 0, bubbleOn = false, lastPlayPick = 0;

  function reveal(it) {
    it.seen = true;
    const delay = 0.35 + 0.08 * it.col + 0.06 * (it.row % 3);
    if (REDUCED) { it.st.appear = 1; it.st.rise = 0; return; }
    gsap.to(it.st, { appear: 1, duration: 0.9, ease: 'power2.out', delay });
    gsap.to(it.st, { rise: 0, duration: 1.2, ease: 'expo.out', delay });
  }
  function startHeadline() {
    head.started = true;
    if (REDUCED) { head.mesh.material.opacity = 1; drawHeadline(1); return; }
    gsap.to(head.mesh.material, { opacity: 1, duration: 0.3 });
    gsap.to(head.state, { p: 1, duration: 1.1, ease: 'power2.out', onUpdate: () => drawHeadline(head.state.p) });
  }

  function frame() {
    if (!visible) { raf = 0; return; }
    raf = requestAnimationFrame(frame);
    timeU.value = clock.getElapsedTime();

    const rect = stage.getBoundingClientRect();
    const off = Math.min(Math.max(-rect.top, 0), Math.max(stageH - H, 0));
    camera.position.set(W / 2, -(off + H / 2), camZ);
    camera.updateMatrixWorld();

    if (!head.started && rect.top < H * 0.8 && rect.bottom > 0) startHeadline();

    for (const it of items) {
      if (!it.seen && it.y - th / 2 < off + H - 30 && it.y + th / 2 > off) reveal(it);
      if (!it.loading && it.y - th / 2 < off + H * 2.6 && it.y + th / 2 > off - H * 0.6) loadPrimary(it);
    }
    place();

    if (desktop()) {
      if (pointer && !lbOpen) {
        const it = hit(pointer.x, pointer.y);
        canvas.style.cursor = it ? 'pointer' : 'default';
        if (it !== hovered) {
          setPlay(it);
          if (it && !bubbleOn) { bubbleOn = true; gsap.to(bubble, { opacity: 1, scale: 1, duration: 0.75, ease: 'power4.out', overwrite: true }); }
          if (!it && bubbleOn) { bubbleOn = false; gsap.to(bubble, { opacity: 0, scale: 0.6, duration: 0.6, ease: 'power4.out', overwrite: true }); }
        }
      }
    } else if (performance.now() - lastPlayPick > 250) {
      lastPlayPick = performance.now();
      const mid = off + H / 2;
      let best = null, bd = Infinity;
      for (const it of items) { const d = Math.abs(it.y - mid); if (d < bd && it.loaded) { bd = d; best = it; } }
      if (best && bd < th) setPlay(best);
    }

    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    postMat.uniforms.tDiffuse.value = rt.texture;
    renderer.render(postScene, postCam);
  }

  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }, { rootMargin: '150px 0px' });

  layout();
  place();
  io.observe(stage);
  let rz = 0;
  new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { if (stage.clientWidth !== W || window.innerHeight !== H) { layout(); place(); } }); }).observe(stage);
  window.addEventListener('resize', () => { if (window.innerHeight !== H) { layout(); place(); } });

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); });
}

/* ---------- plain HTML fallback (no WebGL) ---------- */
function fallback(root, data) {
  root.classList.add('pgl-fallback');
  root.innerHTML = `<div class="pgl-fb-grid">${data.map((s) => `
    <a class="pgl-fb-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
      ${s.noImage ? `<div class="pgl-fb-ph">${s.title}</div>` : `<img loading="lazy" src="${BASE}${s.n}-${s.slug}.jpg" alt="${s.title} website preview" />`}
      <span class="pgl-fb-title">${s.title}</span><span class="pgl-fb-cat">${s.cat}</span>
    </a>`).join('')}</div>`;
}
