import { useEffect, useRef } from 'react';
import { useCoarsePointer, useMotionPrefs } from '../animations';

/* ------------------------------------------------------------------ *
 * Flow-field particle field.
 *
 * Particles are advected through a curl-ish noise field and drawn with
 * additive blending, so dense regions bloom. Trails come from painting a
 * low-alpha background over the previous frame rather than clearing it.
 *
 * Plain 2D canvas on purpose: no shader-compile risk, no dependency, and
 * a few hundred particles is far cheaper than any WebGL setup.
 * ------------------------------------------------------------------ */

const BG = '10, 10, 10'; // #0a0a0a, matches the page background
const DPR_CAP = 2;

const PALETTE = [
  [16, 185, 129], // emerald
  [52, 211, 153], // lighter emerald
  [56, 189, 248], // sky
  [148, 163, 184], // slate
] as const;

/* --- value noise ---------------------------------------------------- */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function noise2D(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

export default function FlowField({ density = 0.00009 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coarse = useCoarsePointer();
  const { reduce } = useMotionPrefs();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; px: number; py: number; life: number; c: readonly [number, number, number] };
    let particles: P[] = [];

    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawn = (initial: boolean): P => {
      const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 10,
        px: 0,
        py: 0,
        life: 0,
        c: [r, g, b] as const,
      };
    };

    const seed = () => {
      const target = Math.round(
        Math.min(320, Math.max(60, width * height * density)),
      );
      particles = Array.from({ length: target }, () => spawn(true));
    };

    const step = () => {
      // Fade the previous frame instead of clearing: this is what makes trails.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(${BG}, 0.075)`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 1;

      const t = performance.now() * 0.00006;
      const scale = 0.0022;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;

        // Two decorrelated noise samples give a divergence-free-ish field.
        const n1 = noise2D(p.x * scale + t, p.y * scale - t);
        const n2 = noise2D(p.x * scale + 31.4 - t, p.y * scale + 17.7 + t);
        const angle = n1 * Math.PI * 4;
        const force = (n2 - 0.5) * 1.5;

        let vx = Math.cos(angle) * 0.42 + force * 0.3;
        let vy = Math.sin(angle) * 0.42 - force * 0.3;

        // Gentle attraction to the pointer.
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 1) {
            const pull = (1 - d2 / 26000) * 0.85;
            const d = Math.sqrt(d2);
            vx += (dx / d) * pull;
            vy += (dy / d) * pull;
          }
        }

        p.x += vx;
        p.y += vy;
        p.life += 1;

        // Recycle once a particle leaves the frame or ages out.
        if (
          p.x < -20 || p.x > width + 20 ||
          p.y < -20 || p.y > height + 20 ||
          p.life > 460
        ) {
          particles[i] = spawn(false);
          continue;
        }

        const [r, g, b] = p.c;
        const fade = Math.min(1, p.life / 40) * Math.min(1, (460 - p.life) / 120);
        const alpha = 0.16 * fade;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(step);
    };

    /** One static, non-animated frame for reduced-motion users. */
    const renderStatic = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        const [r, g, b] = p.c;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onLeave = () => {
      mouse.active = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce && !coarse) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduce || coarse) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, reduce, coarse]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
