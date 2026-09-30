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