/**
 * Generates the abstract cover art for the Insights cards.
 *
 * These are drawn as SVG and rasterised to WebP so the artwork stays
 * reproducible: edit the SVG below, re-run `npm run gen:covers`, and the
 * committed PNG/WebP output is rebuilt byte-for-byte from the same source.
 *
 * No photo libraries, no stock imagery — every cover is generated geometry,
 * which keeps the bundle small and avoids implying these posts exist yet.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'insights');

const W = 1200;
const H = 800;

const EMERALD = '#10b981';
const SKY = '#38bdf8';
const AMBER = '#f59e0b';
const INK = '#0a0a0a';

/** Deterministic pseudo-random so output never changes between runs. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111413"/>
      <stop offset="55%" stop-color="#0d0f0f"/>
      <stop offset="100%" stop-color="#090a0a"/>
    </linearGradient>
    <radialGradient id="glowA" cx="22%" cy="18%" r="62%">
      <stop offset="0%" stop-color="${EMERALD}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${EMERALD}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="82%" cy="88%" r="58%">
      <stop offset="0%" stop-color="${SKY}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
    <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>`;

const backdrop = `${defs}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>`;

/** Neural graph: nodes and edges, echoing a self-hosted model serving a request. */
function selfHostedAi() {
  const r = rng(20240310);
  const nodes = Array.from({ length: 26 }, () => ({
    x: 130 + r() * (W - 260),
    y: 110 + r() * (H - 220),
    rad: 3 + r() * 7,
  }));
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 205) edges.push({ a: nodes[i], b: nodes[j], o: 1 - d / 205 });
    }
  }
  return `${backdrop}
    <g>${edges
      .map(
        (e) =>
          `<line x1="${e.a.x.toFixed(1)}" y1="${e.a.y.toFixed(1)}" x2="${e.b.x.toFixed(1)}" y2="${e.b.y.toFixed(1)}" stroke="${EMERALD}" stroke-opacity="${(e.o * 0.4).toFixed(3)}" stroke-width="1.1"/>`,
      )
      .join('')}</g>
    <g>${nodes
      .map(
        (n, i) =>
          `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.rad.toFixed(1)}" fill="${i % 5 === 0 ? SKY : EMERALD}" fill-opacity="${i % 5 === 0 ? 0.85 : 0.5}"/>`,
      )
      .join('')}</g>
    <g filter="url(#soft)" opacity="0.55">
      <circle cx="330" cy="215" r="70" fill="${EMERALD}" fill-opacity="0.22"/>
      <circle cx="905" cy="600" r="86" fill="${SKY}" fill-opacity="0.18"/>
    </g>`;
}

/** Orchestrated pipeline: orthogonal connectors and stage nodes, like a workflow canvas. */
function n8nAutomation() {
  const r = rng(20240225);
  const lanes = 4;
  const boxes = [];
  for (let l = 0; l < lanes; l++) {
    const y = 150 + l * 165;
    let x = 90;
    for (let i = 0; i < 4; i++) {
      if (r() < 0.22) continue;
      const w = 105 + r() * 85;
      boxes.push({ x, y, w, h: 56, tone: r() });
      x += w + 70 + r() * 45;
    }
  }
  const paths = [];
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i];
    const b = boxes[i + 1];
    if (Math.abs(a.y - b.y) > 12) continue;
    const x1 = a.x + a.w;
    const x2 = b.x;
    const y1 = a.y + a.h / 2;
    const y2 = b.y + b.h / 2;
    const mid = x1 + (x2 - x1) / 2;
    paths.push(
      `<path d="M${x1} ${y1} L${mid} ${y1} L${mid} ${y2} L${x2 - 9} ${y2}" fill="none" stroke="${EMERALD}" stroke-opacity="0.5" stroke-width="2"/>`,
    );
  }
  return `${backdrop}
    <g>${paths.join('')}</g>
    <g>${boxes
      .map((b) => {
        const c = b.tone > 0.78 ? AMBER : b.tone > 0.5 ? SKY : EMERALD;
        return `<rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h}" rx="14" fill="${c}" fill-opacity="0.09" stroke="${c}" stroke-opacity="0.45" stroke-width="1.6"/>`;
      })
      .join('')}</g>`;
}

/** Concentric wavefronts from a transmitter, with a mesh lattice overlay. */
function esp32Lora() {
  const cx = 320;
  const cy = H / 2;
  const rings = Array.from({ length: 13 }, (_, i) => 70 + i * 74)
    .map(
      (rad, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${i % 3 === 0 ? SKY : EMERALD}" stroke-opacity="${(0.42 - i * 0.026).toFixed(3)}" stroke-width="${i % 3 === 0 ? 2.2 : 1.2}"/>`,
    )
    .join('');
  const pts = Array.from({ length: 5 }, (_, i) => 760 + (i % 2) * 150)
    .map((x, i) => ({ x, y: 150 + i * 125 }));
  return `${backdrop}
    <g>${rings}</g>
    <g stroke="${AMBER}" stroke-opacity="0.34" stroke-width="1.4" stroke-dasharray="7 9">
      ${pts.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"/>`).join('')}
    </g>
    <g>${pts
      .map(
        (p) =>
          `<rect x="${p.x - 17}" y="${p.y - 17}" width="34" height="34" rx="9" fill="${AMBER}" fill-opacity="0.14" stroke="${AMBER}" stroke-opacity="0.62" stroke-width="1.6"/>`,
      )
      .join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="30" fill="${EMERALD}" fill-opacity="0.2"/>
    <circle cx="${cx}" cy="${cy}" r="15" fill="${EMERALD}" fill-opacity="0.85"/>`;
}

/* ------------------------------------------------------------------ *
 * Video thumbnails (16:9)
 *
 * The Facebook share links return no Open Graph tags to a plain request,
 * so there is no real preview image to embed. These stand in as branded
 * placeholders rather than random stock photography, which at least looks
 * deliberate and costs nothing in page weight.
 * ------------------------------------------------------------------ */

const VW = 1200;
const VH = 675;

const videoBackdrop = `<svg width="${VW}" height="${VH}" viewBox="0 0 ${VW} ${VH}">
  <defs>
    <linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141615"/>
      <stop offset="60%" stop-color="#0e100f"/>
      <stop offset="100%" stop-color="#090a0a"/>
    </linearGradient>
    <radialGradient id="vg1" cx="30%" cy="24%" r="64%">
      <stop offset="0%" stop-color="${EMERALD}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${EMERALD}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vg2" cx="76%" cy="82%" r="56%">
      <stop offset="0%" stop-color="${SKY}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="vgrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${VW}" height="${VH}" fill="url(#vbg)"/>
  <rect width="${VW}" height="${VH}" fill="url(#vg1)"/>
  <rect width="${VW}" height="${VH}" fill="url(#vg2)"/>
  <rect width="${VW}" height="${VH}" fill="url(#vgrid)"/>`;

/** Alternating motifs so the four tiles are distinguishable at a glance. */
const VIDEO_THUMBS = [
  // 0: vertical code-like bars
  (r) => {
    const bars = Array.from({ length: 34 }, (_, i) => {
      const h = 40 + r() * 300;
      return `<rect x="${(90 + i * 30).toFixed(1)}" y="${(VH - h - 70).toFixed(1)}" width="11" height="${h.toFixed(1)}" rx="5" fill="${EMERALD}" fill-opacity="${(0.14 + r() * 0.3).toFixed(3)}"/>`;
    }).join('');
    return `${bars}`;
  },
  // 1: concentric rings
  (r) =>
    Array.from({ length: 9 }, (_, i) => {
      const rad = 55 + i * 52;
      return `<circle cx="600" cy="${VH / 2}" r="${rad}" fill="none" stroke="${i % 2 ? SKY : EMERALD}" stroke-opacity="${(0.36 - i * 0.03).toFixed(3)}" stroke-width="${i % 3 === 0 ? 2.4 : 1.3}"/>`;
    }).join(''),
  // 2: isometric stacked planes
  (r) => {
    const layers = Array.from({ length: 6 }, (_, i) => {
      const y = 150 + i * 72;
      const w = 520 - i * 26;
      return `<path d="M600 ${y} L${600 + w} ${y + 78} L600 ${y + 156} L${600 - w} ${y + 78} Z" fill="none" stroke="${i % 2 ? SKY : EMERALD}" stroke-opacity="${(0.4 - i * 0.045).toFixed(3)}" stroke-width="1.6"/>`;
    }).join('');
    return `${layers}`;
  },
  // 3: signal waveform
  (r) => {
    const pts = Array.from({ length: 72 }, (_, i) => {
      const x = 70 + i * 15.6;
      const amp = 40 + Math.abs(Math.sin(i * 0.42)) * 210 * (0.5 + r() * 0.5);
      return `${x.toFixed(1)} ${(VH / 2 - amp).toFixed(1)}`;
    }).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${EMERALD}" stroke-opacity="0.62" stroke-width="2.4" stroke-linejoin="round"/>
            <polyline points="${Array.from({ length: 72 }, (_, i) => `${(70 + i * 15.6).toFixed(1)} ${(VH / 2 + 40 + Math.abs(Math.cos(i * 0.31)) * 120).toFixed(1)}`).join(' ')}" fill="none" stroke="${SKY}" stroke-opacity="0.3" stroke-width="1.6"/>`;
  },
];

const COVERS = [
  ['self-hosted-ai', selfHostedAi],
  ['n8n-automation', n8nAutomation],
  ['esp32-lora', esp32Lora],
];

await mkdir(outDir, { recursive: true });

for (const [name, draw] of COVERS) {
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${draw()}</svg>`,
  );
  const target = path.join(outDir, `${name}.webp`);
  await sharp(svg, { density: 144 }).webp({ quality: 78, effort: 6 }).toFile(target);
  const meta = await sharp(target).metadata();
  console.log(`${name}.webp  ${meta.width}x${meta.height}`);
}

console.log(`\nwrote ${COVERS.length} covers to public/insights/`);

/* ---- video thumbnails ---- */

const videoDir = path.join(root, 'public', 'videos');
await mkdir(videoDir, { recursive: true });

const VIDEO_SEEDS = [11, 22, 33, 44];

for (let i = 0; i < VIDEO_THUMBS.length; i++) {
  const draw = VIDEO_THUMBS[i];
  const inner = draw(rng(VIDEO_SEEDS[i]));
  const svg = Buffer.from(
    `${videoBackdrop}${inner}</svg>`,
  );
  const target = path.join(videoDir, `video-${i + 1}.webp`);
  await sharp(svg, { density: 144 }).webp({ quality: 78, effort: 6 }).toFile(target);
  const meta = await sharp(target).metadata();
  console.log(`videos/video-${i + 1}.webp  ${meta.width}x${meta.height}`);
}

console.log(`\nwrote ${VIDEO_THUMBS.length} thumbnails to public/videos/`);
/* ------------------------------------------------------------------ *
 * App card artwork
 *
 * One abstract composition per deployed app, keyed by slug, so the grid
 * reads as a set rather than eight identical placeholders. Each is a
 * schematic of what the app actually does: a map trace for GPS, ledger
 * lines for accounting, a scan frame for OCR, and so on.
 * ------------------------------------------------------------------ */

const AW = 900;
const AH = 600;

const appBackdrop = (tint) => `<svg width="${AW}" height="${AH}" viewBox="0 0 ${AW} ${AH}">
  <defs>
    <linearGradient id="abg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141615"/>
      <stop offset="58%" stop-color="#0e100f"/>
      <stop offset="100%" stop-color="#090a0a"/>
    </linearGradient>
    <radialGradient id="ag" cx="26%" cy="20%" r="66%">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="${tint}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="agrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M36 0H0V36" fill="none" stroke="#ffffff" stroke-opacity="0.038" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${AW}" height="${AH}" fill="url(#abg)"/>
  <rect width="${AW}" height="${AH}" fill="url(#ag)"/>
  <rect width="${AW}" height="${AH}" fill="url(#agrid)"/>`;

const g = (inner, tint) => `${appBackdrop(tint)}${inner}</svg>`;

/** Each entry returns SVG markup drawn over the tinted backdrop. */
const APP_ART = {
  // Fleet GPS: route trace with waypoints
  'fleet-gps': (r, c) => {
    const pts = Array.from({ length: 9 }, (_, i) => [
      120 + i * 82 + r() * 34,
      380 - Math.sin(i * 0.8) * 130 - r() * 40,
    ]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' ');
    return g(`<path d="${d}" fill="none" stroke="${c}" stroke-opacity="0.72" stroke-width="2.6" stroke-dasharray="1 0"/>
      ${pts.map((p, i) => `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="${i === 4 ? 11 : 5}" fill="${i === 4 ? EMERALD : c}" fill-opacity="${i === 4 ? 0.95 : 0.55}"/>`).join('')}
      <circle cx="${pts[4][0].toFixed(0)}" cy="${pts[4][1].toFixed(0)}" r="26" fill="none" stroke="${EMERALD}" stroke-opacity="0.34" stroke-width="1.4"/>`, c);
  },
  // Modern ERP: stacked inventory boxes on shelves
  'modern-erp': (r, c) => g(Array.from({ length: 3 }, (_, row) => {
    const y = 150 + row * 130;
    return `<rect x="120" y="${y + 96}" width="660" height="3" fill="#ffffff" fill-opacity="0.07"/>` +
      Array.from({ length: 5 - row }, (_, i) => {
        const w = 54 + r() * 34;
        return `<rect x="${(150 + i * 128).toFixed(0)}" y="${(y + 96 - (60 + r() * 30)).toFixed(0)}" width="${w.toFixed(0)}" height="${(60 + r() * 30).toFixed(0)}" rx="7" fill="${r() > 0.72 ? SKY : c}" fill-opacity="${(0.14 + r() * 0.22).toFixed(3)}" stroke="${r() > 0.72 ? SKY : c}" stroke-opacity="0.4" stroke-width="1.2"/>`;
      }).join('');
  }).join(''), c),
  // Driver Ledger: fuel gauge with tick marks
  'driver-ledger': (r, c) => {
    const cx = AW / 2, cy = 330, R = 190;
    const ticks = Array.from({ length: 33 }, (_, i) => {
      const a = Math.PI * (1 + i / 32);
      const x1 = cx + Math.cos(a) * (R - 22), y1 = cy - Math.sin(a) * (R - 22);
      const x2 = cx + Math.cos(a) * R, y2 = cy - Math.sin(a) * R;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-opacity="${(0.22 + (i / 32) * 0.4).toFixed(3)}" stroke-width="2"/>`;
    }).join('');
    const na = Math.PI * (1 + 0.72);
    return g(`${ticks}
      <path d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(na) * (R - 40)).toFixed(1)}" y2="${(cy - Math.sin(na) * (R - 40)).toFixed(1)}" stroke="${EMERALD}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="13" fill="${EMERALD}" fill-opacity="0.9"/>
      <text x="${cx}" y="${cy + 78}" font-family="monospace" font-size="46" fill="#ffffff" fill-opacity="0.16" text-anchor="middle">FUEL</text>`, c);
  },
  // DocChat: scan frame over document lines
  'docchat': (r, c) => {
    const lines = Array.from({ length: 9 }, (_, i) => {
      const w = 300 + r() * 220;
      return `<rect x="228" y="${(178 + i * 28).toFixed(0)}" width="${w.toFixed(0)}" height="8" rx="4" fill="#ffffff" fill-opacity="${(0.05 + r() * 0.06).toFixed(3)}"/>`;
    }).join('');
    return g(`${lines}
      <rect x="196" y="146" width="508" height="308" rx="14" fill="none" stroke="${c}" stroke-opacity="0.45" stroke-width="1.8"/>
      <path d="M196 214 V160 a14 14 0 0 1 14-14 H268" fill="none" stroke="${EMERALD}" stroke-width="3" stroke-linecap="round"/>
      <path d="M704 386 V440 a14 14 0 0 1 -14 14 H632" fill="none" stroke="${EMERALD}" stroke-width="3" stroke-linecap="round"/>
      <rect x="196" y="146" width="508" height="308" fill="${EMERALD}" fill-opacity="0.05"/>
      <rect x="196" y="292" width="508" height="3" fill="${EMERALD}" fill-opacity="0.7"/>`, c);
  },
  // LedgerFlow: double-entry ledger columns
  'ledgerflow': (r, c) => g(`<line x1="450" y1="120" x2="450" y2="490" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const y = 158 + i * 44;
      const deb = 120 + r() * 130, cred = 120 + r() * 130;
      return `<rect x="${(200 - deb).toFixed(0)}" y="${y}" width="${deb.toFixed(0)}" height="10" rx="5" fill="${c}" fill-opacity="0.42"/>
        <rect x="470" y="${y}" width="${cred.toFixed(0)}" height="10" rx="5" fill="${EMERALD}" fill-opacity="0.42"/>`;
    }).join('')}
    <text x="450" y="530" font-family="monospace" font-size="34" fill="#ffffff" fill-opacity="0.15" text-anchor="middle">DR | CR</text>`, c),
  // Nexus: node graph
  'nexus': (r, c) => {
    const nodes = Array.from({ length: 11 }, () => ({ x: 150 + r() * 600, y: 130 + r() * 340 }));
    let e = '';
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 210) e += `<line x1="${nodes[i].x.toFixed(0)}" y1="${nodes[i].y.toFixed(0)}" x2="${nodes[j].x.toFixed(0)}" y2="${nodes[j].y.toFixed(0)}" stroke="${c}" stroke-opacity="${(0.34 - d / 900).toFixed(3)}" stroke-width="1.1"/>`;
      }
    return g(`${e}${nodes.map((n, i) => `<rect x="${(n.x - 13).toFixed(0)}" y="${(n.y - 13).toFixed(0)}" width="26" height="26" rx="7" fill="${i % 4 === 0 ? EMERALD : c}" fill-opacity="${i % 4 === 0 ? 0.85 : 0.45}"/>`).join('')}`, c);
  },
  // Terminal Hub: prompt caret and command rows
  'terminal-hub': (r, c) => g(`<rect x="150" y="130" width="600" height="340" rx="16" fill="#ffffff" fill-opacity="0.02" stroke="${c}" stroke-opacity="0.34" stroke-width="1.6"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const y = 190 + i * 44;
      const w = 200 + r() * 260;
      return `<text x="192" y="${y}" font-family="monospace" font-size="21" fill="${c}" fill-opacity="0.6">$</text>
        <rect x="216" y="${y - 13}" width="${w.toFixed(0)}" height="9" rx="4.5" fill="#ffffff" fill-opacity="${(0.09 + r() * 0.07).toFixed(3)}"/>`;
    }).join('')}
    <rect x="216" y="${190 + 5 * 44 - 13}" width="12" height="20" fill="${EMERALD}"/>`, c),
  // Video Auto Poster: film frames and a play glyph
  'ytposter': (r, c) => g(`<rect x="140" y="150" width="620" height="300" rx="16" fill="none" stroke="${c}" stroke-opacity="0.4" stroke-width="1.8"/>
    ${Array.from({ length: 7 }, (_, i) => `<rect x="${(140 + i * 88.6).toFixed(0)}" y="150" width="3" height="300" fill="#ffffff" fill-opacity="0.07"/>`).join('')}
    <path d="M418 250 L418 350 L510 300 Z" fill="${EMERALD}" fill-opacity="0.88"/>
    <rect x="140" y="118" width="180" height="12" rx="6" fill="#ffffff" fill-opacity="0.1"/>
    <rect x="330" y="118" width="120" height="12" rx="6" fill="#ffffff" fill-opacity="0.07"/>`, c),
};

const APP_TINTS = {
  'fleet-gps': EMERALD, 'modern-erp': SKY, 'driver-ledger': AMBER,
  docchat: EMERALD, ledgerflow: SKY, nexus: EMERALD,
  'terminal-hub': SKY, ytposter: '#f43f5e',
};
const APP_SEEDS = {
  'fleet-gps': 101, 'modern-erp': 202, 'driver-ledger': 303, docchat: 404,
  ledgerflow: 505, nexus: 606, 'terminal-hub': 707, ytposter: 808,
};

const appDir = path.join(root, 'public', 'apps');
await mkdir(appDir, { recursive: true });

for (const [slug, draw] of Object.entries(APP_ART)) {
  const svg = Buffer.from(draw(rng(APP_SEEDS[slug]), APP_TINTS[slug]));
  const target = path.join(appDir, `${slug}.webp`);
  await sharp(svg, { density: 144 }).webp({ quality: 80, effort: 6 }).toFile(target);
  console.log(`apps/${slug}.webp`);
}
console.log(`\nwrote ${Object.keys(APP_ART).length} app artworks to public/apps/`);
