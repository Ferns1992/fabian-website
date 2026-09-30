import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { pretendToBeVisual: true, url: 'https://sysitadmin.com/', runScripts: 'dangerously' },
);
const { window } = dom;

window.matchMedia = (q) => ({
  matches: false, media: q, onchange: null,
  addEventListener() {}, removeEventListener() {},
  addListener() {}, removeListener() {}, dispatchEvent: () => false,
});
window.HTMLCanvasElement.prototype.getContext = () => null;
window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
window.scrollTo = () => {};
window.Element.prototype.scrollIntoView = () => {};

class IO {
  constructor(cb, opts) { this.cb = cb; this.opts = opts ?? {}; }
  observe(t) { this.cb([{ target: t, isIntersecting: true, intersectionRatio: 1 }], this); }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
window.IntersectionObserver = IO;

const errors = [];
const origError = console.error;
console.error = (...a) => { errors.push(a.map(String).join(' ')); origError(...a); };

window.eval(fs.readFileSync(fileURLToPath(new URL('./.countup.bundle.js', import.meta.url)), 'utf8'));

const doc = window.document;
const read = () =>
  [...doc.querySelectorAll('[data-probe]')].map((el) => el.textContent.trim());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sample the animation. duration is 0.4s, so sample well past completion.
const samples = [];
for (let i = 0; i < 26; i++) {
  samples.push(read());
  await sleep(60);
}

const VALUES = ['11+', '14+', '100+', '3+'];
const num = (s) => parseInt(String(s).replace(/\D/g, ''), 10);

const checks = [];

// 1. Must finish at the exact target, not an approximation.
for (let i = 0; i < VALUES.length; i++) {
  checks.push([`settles exactly at "${VALUES[i]}"`, samples.at(-1)[i] === VALUES[i]]);
}

// 2. The actual regression: after completing, it must NOT restart.
//    The old code re-ran the effect every render, so the number kept
//    dropping back toward 0 instead of holding its final value.
let restarts = 0;
for (let i = 0; i < VALUES.length; i++) {
  const col = samples.map((s) => num(s[i]));
  const final = col.at(-1);
  // Once the animation has had time to finish, allow no drop backwards.
  const afterSettle = col.slice(10);
  const drops = afterSettle.filter((v, k) => k > 0 && v < afterSettle[k - 1]);
  if (drops.length > 0) restarts++;
  checks.push([
    `${VALUES[i]} holds steady after settling (no restart)`,
    drops.length === 0 && final === num(VALUES[i]),
  ]);
}

// 3. It must actually animate, not just snap to the final value.
for (let i = 0; i < VALUES.length; i++) {
  const col = samples.map((s) => num(s[i]));
  const distinct = new Set(col).size;
  checks.push([`${VALUES[i]} animates through intermediate values`, distinct >= 3]);
}

// 4. No runaway render loop: total text churn should be bounded.
const churn = samples.reduce((a, s, i) => (i > 0 && s.join() !== samples[i - 1].join() ? a + 1 : a), 0);
checks.push([`render churn bounded (${churn} changes)`, churn < 90]);

let failed = 0;
for (const [name, ok] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

console.log('\ntrace of "14+" over time: ' + samples.map((s) => num(s[1])).join(','));
const real = errors.filter((e) => !/not wrapped in act|Not implemented/i.test(e));
console.log(`unexpected console.error: ${real.length}`);
for (const e of real.slice(0, 5)) console.log('  ! ' + e.slice(0, 200));

console.log(failed === 0 && real.length === 0 ? '\nCOUNTUP TEST: PASS' : `\nCOUNTUP TEST: ${failed} failed`);
process.exit(failed === 0 && real.length === 0 ? 0 : 1);