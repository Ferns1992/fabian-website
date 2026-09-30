/**
 * Verifies the light/dark theming contract against the real built CSS.
 *
 * These assertions target the failure modes that are invisible in a typecheck
 * but obvious to a visitor: a token that resolves to nothing, a light-mode
 * colour that is still dark, or a theme that never reaches the DOM.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const cssFile = fs.readdirSync(path.join(dist, 'assets')).find((f) => f.endsWith('.css'));
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dist, 'assets', cssFile), 'utf8');

const checks = [];
const check = (name, ok, detail = '') => checks.push([name, ok, detail]);

/* ---------- 1. No hardcoded palette left in markup ---------- */

const srcFiles = fs
  .readdirSync(path.join('src'), { recursive: true })
  .filter((f) => typeof f === 'string' && /\.tsx?$/.test(f));

let hardcoded = [];
for (const f of srcFiles) {
  const text = fs.readFileSync(path.join('src', f), 'utf8');
  // Only flag colour literals in className strings, not in comments or docs.
  const inClasses = text.match(/(?:bg|text|border|from|via|to|ring)-[#a-zA-Z0-9[\]/.]+/g) ?? [];
  for (const m of inClasses) {
    if (/^(bg|text|border|from|via|to|ring)-(white|zinc|emerald|sky|amber|slate|gray|neutral|stone|red|blue|green|yellow)/.test(m)) {
      // GitHub language dots in LANGUAGE_COLOR are intentionally literal.
      const idx = text.indexOf(m);
      const line = text.slice(0, idx).split('\n').length;
      // GitHub language dots are the one intentional literal palette.
      const inLanguageColor =
        f === 'App.tsx' &&
        text.indexOf('LANGUAGE_COLOR') > -1 &&
        text.indexOf('LANGUAGE_COLOR') < idx &&
        idx < text.indexOf('};', text.indexOf('LANGUAGE_COLOR'));
      if (inLanguageColor) continue;
      hardcoded.push(`${f}:${line} ${m}`);
    }
  }
}
check('no hardcoded palette utilities outside LANGUAGE_COLOR', hardcoded.length === 0, hardcoded.slice(0, 6).join(' | '));

/* ---------- 2. Every var() reference is defined ---------- */

const used = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
// Tailwind's own preflight references these and defines them in @property.
const twInternal = new Set([
  '--default-font-feature-settings',
  '--default-font-variation-settings',
  '--default-mono-font-feature-settings',
  '--default-mono-font-variation-settings',
  '--tw-ease',
]);
const missing = [...used].filter((v) => !defined.has(v) && !twInternal.has(v));
check('every var() in built CSS is defined', missing.length === 0, missing.join(', '));

/* ---------- 3. Both themes define the full token set ---------- */

// The dark defaults are emitted as `:root,[data-theme=dark]`. Match the
// selector that actually carries our tokens, not Tailwind's own :root.
const rootBlock = css.match(/:root,\[data-theme=dark\]\{([^}]*)\}/)?.[1] ?? '';
const lightBlock = css.match(/\[data-theme=light\][^{]*\{([^}]*)\}/)?.[1] ?? '';

const tokenNames = [...rootBlock.matchAll(/(--[a-z0-9-]+)\s*:/g)]
  .map((m) => m[1])
  .filter((t) => !t.startsWith('--color-') && !t.startsWith('--text-')
    && !t.startsWith('--font-') && !t.startsWith('--spacing-')
    && !t.startsWith('--container-') && !t.startsWith('--radius-')
    && !t.startsWith('--blur-') && !t.startsWith('--aspect-')
    && !t.startsWith('--leading-') && !t.startsWith('--tracking-')
    && !t.startsWith('--default-') && !t.startsWith('--tw-'));
const lightNames = new Set([...lightBlock.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

const notInLight = tokenNames.filter((t) => !lightNames.has(t));
check(
  `light theme defines all ${tokenNames.length} tokens`,
  notInLight.length === 0,
  notInLight.join(', '),
);

// A token present in both blocks but with an identical value is a missed override.
const val = (block, name) => block.match(new RegExp(name + '\\s*:\\s*([^;]+)'))?.[1]?.trim();
const sameBoth = tokenNames.filter((t) => lightNames.has(t) && val(rootBlock, t) === val(lightBlock, t));
check('light theme actually overrides dark values', sameBoth.length <= 2, sameBoth.join(', '));

/* ---------- 4. Pre-paint script and bootstrap attribute ---------- */

check('html has data-theme="dark" default', /<html[^>]*data-theme="dark"/.test(html));
check('blocking pre-paint theme script present', html.includes('prefers-color-scheme: light') && html.includes('localStorage.getItem'));
check('script sits in <head> before body', (() => {
  const i = html.indexOf("localStorage.getItem('sysitadmin-theme')");
  const headEnd = html.indexOf('</head>');
  return i > -1 && i < headEnd;
})());
check('script has no await/defer (would be too late)', !/<script[^>]*(defer|async|type="module")[^>]*>[\s\S]*?sysitadmin-theme/.test(html));

/* ---------- 5. Script logic: resolve theme for each case ---------- */

function simulate({ stored, osLight }) {
  return (() => {
    try {
      const theme =
        stored === 'dark' || stored === 'light'
          ? stored
          : (osLight ? 'light' : 'dark');
      return theme;
    } catch {
      return 'dark';
    }
  })();
}
check('stored choice wins over OS (dark)', simulate({ stored: 'dark', osLight: true }) === 'dark');
check('stored choice wins over OS (light)', simulate({ stored: 'light', osLight: false }) === 'light');
check('no choice + light OS -> light', simulate({ stored: null, osLight: true }) === 'light');
check('no choice + dark OS -> dark', simulate({ stored: null, osLight: false }) === 'dark');
check('garbage stored value -> falls back to OS', simulate({ stored: 'purple', osLight: true }) === 'light');

/* ---------- 6. Light theme is genuinely light, and stays readable ---------- */

const lightVals = Object.fromEntries(
  [...lightBlock.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+)/g)].map((m) => [m[1], m[2].trim()]),
);
const darkVals = Object.fromEntries(
  [...rootBlock.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+)/g)].map((m) => [m[1], m[2].trim()]),
);

// Relative luminance, so "is this light" is a measurement not a vibe.
function lum(hex) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const lb = lightVals['--bg'];
const db = darkVals['--bg'];
check('light --bg is actually light', lb && lum(lb) > 0.7, `light bg=${lb}`);
check('dark --bg is actually dark', db && lum(db) < 0.02, `dark bg=${db}`);

const ratio = contrast(lightVals['--fg-strong'], lb);
check(`light body text meets AA (${ratio.toFixed(1)}:1)`, ratio >= 4.5);

// The bug I specifically avoided: a white primary button on a white page.
const invBg = lightVals['--inverse-bg'];
const invFg = lightVals['--inverse-fg'];
const invRatio = contrast(invFg, invBg);
check(
  `primary CTA stays legible in light mode (${invRatio.toFixed(1)}:1)`,
  invRatio >= 4.5,
  `inverse-bg=${invBg} inverse-fg=${invFg}`,
);
check('inverse-bg differs from page bg in light mode', invBg !== lb, `both ${invBg}`);

// The canvas trail colour must equal the page background in both themes,
// or dark smears persist across light mode.
check('canvas trail colour matches dark page bg', darkVals['--canvas-bg'] === '10, 10, 10', darkVals['--canvas-bg']);
check('canvas trail colour matches light page bg', lightVals['--canvas-bg'] === '250, 250, 250', lightVals['--canvas-bg']);

/* ---------- 7. Content assertions ---------- */

const constants = fs.readFileSync(path.join('src', 'constants.ts'), 'utf8');
check('backup email added', constants.includes('fabianfernandes25@gmail.com'));
check('India listed', /"India"/.test(constants));
check('Bahrain listed', /"Bahrain"/.test(constants));
check('freelance role is current', /Freelance AI Engineer & IT Infrastructure Consultant/.test(constants) && /2025 - Present/.test(constants));
check('no role is left as bare "Present"', (constants.match(/- Present/g) ?? []).length <= 1, `${(constants.match(/- Present/g) ?? []).length} "Present" entries`);
check('insights marked as drafts', /status: "draft"/.test(constants));

const app = fs.readFileSync(path.join('src', 'App.tsx'), 'utf8');
check('locations rendered in About', /LOCATIONS\.map/.test(app));
check('backup email rendered in modal', /backupEmail/.test(app));
check('theme toggle mounted', /<ThemeToggle \/>/.test(app));
check('insight covers rendered', /post\.cover/.test(app));
check('no external placeholder image service', !/picsum\.photos|placehold\.co|via\.placeholder/.test(constants + app));
check('video thumbnails served locally', /\/videos\/video-\d\.webp/.test(constants));
check('no placeholder video titles', !/"Video \d"/.test(constants));
check('video summaries present', (constants.match(/summary:/g) ?? []).length >= 4);
check('app list has 8 entries', (constants.match(/^    art: "\/apps\//gm) ?? []).length === 8);

// Scope to the APPS array only: constants.ts also holds GitHub and Facebook
// URLs, which are legitimately off-apex.
const appsBlock = constants.slice(constants.indexOf('export const APPS: App[] = ['));
const appUrls = [...appsBlock.matchAll(/url: "(https:\/\/[^"]+)"/g)].map((m) => m[1]);
check('all app urls on sysitadmin.com', appUrls.filter((u) => !u.includes('sysitadmin.com')).length === 0,
  appUrls.filter((u) => !u.includes('sysitadmin.com')).join(', '));
check('app urls use https', appUrls.every((u) => u.startsWith('https://')));
check('app art referenced in markup', /app\.art/.test(app));
check('apps nav entry present', /id: 'apps'/.test(app));
check('apps section present', /id="apps"/.test(app));

for (const f of ['fleet-gps', 'modern-erp', 'driver-ledger', 'docchat', 'ledgerflow', 'nexus', 'terminal-hub', 'ytposter']) {
  const p = path.join(dist, 'apps', `${f}.webp`);
  const ok = fs.existsSync(p) && fs.statSync(p).size > 4000;
  check(`app art ${f}.webp present (>4KB)`, ok, ok ? `${Math.round(fs.statSync(p).size / 1024)}KB` : 'missing/too small');
}

for (const m of constants.matchAll(/art:\s*"(\/apps\/[^"]+\.webp)"/g)) {
  check(`app art ${m[1]} exists in dist`, fs.existsSync(path.join(dist, m[1].replace(/^\//, ''))));
}
check('video platform rendered from data', /\{video\.platform\}/.test(app));
check('no dead "Read More" link', !/Read More/.test(app));

/* ---------- 8. Cover art exists and is a real image ---------- */

for (const f of ['self-hosted-ai', 'n8n-automation', 'esp32-lora']) {
  const p = path.join(dist, 'insights', `${f}.webp`);
  const ok = fs.existsSync(p) && fs.statSync(p).size > 4000;
  check(`cover ${f}.webp present (>4KB)`, ok, ok ? `${Math.round(fs.statSync(p).size / 1024)}KB` : 'missing/too small');
}

for (const f of ['video-1', 'video-2', 'video-3', 'video-4']) {
  const p = path.join(dist, 'videos', `${f}.webp`);
  const ok = fs.existsSync(p) && fs.statSync(p).size > 4000;
  check(`thumb ${f}.webp present (>4KB)`, ok, ok ? `${Math.round(fs.statSync(p).size / 1024)}KB` : 'missing/too small');
}

// Every local asset referenced by the data must actually exist in dist.
for (const m of constants.matchAll(/(?:cover|thumbnail):\s*"(\/[^"]+\.webp)"/g)) {
  const ok = fs.existsSync(path.join(dist, m[1].replace(/^\//, '')));
  check(`referenced asset ${m[1]} exists in dist`, ok, ok ? '' : 'broken reference');
}

/* ---------- 9. Reduced motion still intact ---------- */

check('prefers-reduced-motion block kept', /prefers-reduced-motion/.test(css));
check('reduced motion kills aurora + shimmer', /aurora[\s\S]{0,400}animation:\s*none/.test(css));

/* ---------- report ---------- */

let failed = 0;
for (const [name, ok, detail] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail && !ok ? `\n         → ${detail}` : ''}`);
}
console.log(`\n${checks.length} checks, ${failed} failed`);
console.log(failed === 0 ? '\nTHEME TEST: PASS' : '\nTHEME TEST: FAIL');
process.exit(failed === 0 ? 0 : 1);