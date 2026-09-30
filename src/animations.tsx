import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

/* ------------------------------------------------------------------ *
 * Environment probes
 * ------------------------------------------------------------------ */

/** True on touch/coarse-pointer devices, where hover effects are meaningless. */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return coarse;
}

/** Shortcuts for building conditional variants without littering the tree. */
export function useMotionPrefs() {
  const reduce = useReducedMotion();
  return {
    reduce: !!reduce,
    /** Duration to use for a transition: 0 when the user asked for less motion. */
    dur: (seconds: number) => (reduce ? 0 : seconds),
  };
}

/* ------------------------------------------------------------------ *
 * Scroll reveal
 * ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  once?: boolean;
  amount?: number;
  duration?: number;
};

/** Fades + translates its children into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  x = 0,
  scale = 1,
  blur = 6,
  once = true,
  amount = 0.25,
  duration = 0.75,
}: RevealProps) {
  const { reduce } = useMotionPrefs();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers any <StaggerItem> descendants. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  amount = 0.15,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
}) {
  const { reduce } = useMotionPrefs();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child of <Stagger>. Animates itself when the parent enters view. */
export function StaggerItem({
  children,
  className,
  y = 22,
  x = 0,
  scale = 1,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
  as?: 'div' | 'li' | 'span' | 'a';
}) {
  const { reduce } = useMotionPrefs();
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y, x, scale, filter: 'blur(5px)' },
        show: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

/**
 * Splits text into words (optionally characters) and reveals each one
 * out of an overflow-hidden mask. The original string stays available to
 * screen readers via aria-label; the visual pieces are hidden from it.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  gap = 0.045,
  by = 'word',
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  gap?: number;
  by?: 'word' | 'char';
  once?: boolean;
}) {
  const { reduce } = useMotionPrefs();

  const words = text.split(' ');

  if (reduce) {
    return (
      <span className={className} aria-label={text}>
        {text}
      </span>
    );
  }

  let cursor = 0;

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => {
        const start = cursor;
        cursor += word.length + 1;

        const pieces =
          by === 'char'
            ? Array.from(word).map((ch, ci) => ({ ch, key: `c${ci}` }))
            : [{ ch: word, key: 'w' }];

        return (
          <span
            key={`w${wi}`}
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
          >
            {pieces.map(({ ch, key }, pi) => (
              <motion.span
                key={key}
                className={`inline-block ${wordClassName ?? ''}`}
                initial={{ y: '115%', opacity: 0, rotate: by === 'char' ? 8 : 0 }}
                whileInView={{ y: '0%', opacity: 1, rotate: 0 }}
                viewport={{ once, amount: 0.4 }}
                transition={{
                  duration: 0.85,
                  delay: delay + (start + pi) * gap,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        );
      })}
    </span>
  );
}

/** Gradient text with a slow shimmer sweep. */
export function ShimmerText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`animate-shimmer bg-clip-text text-transparent ${className ?? ''}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Pointer interactions
 * ------------------------------------------------------------------ */

/** Nudges its child toward the cursor while hovered. */
export function Magnetic({
  children,
  className,
  strength = 0.4,
  padding = 0,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  padding?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const { reduce } = useMotionPrefs();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (coarse || reduce) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    [coarse, reduce, strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      data-magnetic={padding ? String(padding) : undefined}
    >
      {children}
    </motion.div>
  );
}

/**
 * Card with two combined effects: a cursor-tracked radial spotlight and a
 * subtle 3D tilt. Both are skipped on touch and under reduced motion.
 */
export function Card({
  children,
  className = '',
  tilt = 8,
  spotlight = true,
  glow = 'rgba(16,185,129,0.13)',
  lift = -6,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  spotlight?: boolean;
  glow?: string;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const { reduce } = useMotionPrefs();
  const inactive = coarse || reduce;

  const px = useMotionValue('50%');
  const py = useMotionValue('50%');
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);

  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const shx = useSpring(hx, { stiffness: 220, damping: 22 });
  const shy = useSpring(hy, { stiffness: 220, damping: 22 });

  const background = useMotionTemplate`radial-gradient(260px circle at ${px} ${py}, ${glow}, transparent 72%)`;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (inactive) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      px.set(nx * 100 + '%');
      py.set(ny * 100 + '%');
      ry.set((nx - 0.5) * 2 * tilt);
      rx.set(-(ny - 0.5) * 2 * tilt);
      hx.set(0);
      hy.set(lift);
    },
    [inactive, lift, px, py, rx, ry, tilt],
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    hx.set(0);
    hy.set(0);
  }, [hx, hy, rx, ry]);

  return (
    <motion.div
      ref={ref}
      className={`group relative ${className}`}
      style={
        inactive
          ? undefined
          : { rotateX: srx, rotateY: sry, x: shx, y: shy, transformPerspective: 1000 }
      }
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {spotlight && !inactive ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Numbers
 * ------------------------------------------------------------------ */

/**
 * Counts up to `value` the first time it scrolls into view.
 * Accepts strings like "100+" and animates only the numeric part.
 */
export function CountUp({
  value,
  duration = 1.9,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { reduce } = useMotionPrefs();
  const [display, setDisplay] = useState(() => value);

  // Must be memoised: value.match() allocates a fresh array each render, and
  // a changing identity here would restart the animation on every update.
  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d[\d,]*)(.*)$/s);
    if (!m) return null;
    return {
      prefix: m[1],
      target: parseInt(m[2].replace(/,/g, ''), 10),
      suffix: m[3],
    };
  }, [value]);

  useEffect(() => {
    if (!parsed) return;
    const { prefix, target, suffix } = parsed;

    if (reduce) {
      setDisplay(value);
      return;
    }

    if (!inView) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${prefix}${Math.round(v)}${suffix}`),
      onComplete: () => setDisplay(value),
    });

    return () => controls.stop();
  }, [inView, duration, reduce, value, parsed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Chrome
 * ------------------------------------------------------------------ */

/** Thin emerald progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  const { reduce } = useMotionPrefs();

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent to-accent-2"
      style={{ scaleX }}
    />
  );
}

/** Soft trailing glow that follows the pointer. Desktop only, very low opacity. */
export function CursorGlow() {
  const coarse = useCoarsePointer();
  const { reduce } = useMotionPrefs();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (coarse || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 160);
      y.set(e.clientY - 160);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, [coarse, reduce, x, y]);

  if (coarse || reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-80 w-80 rounded-full bg-pointer-glow blur-3xl"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    />
  );
}

/**
 * Intro overlay: counts 0 -> 100, then lifts away.
 * Shown at most once per browser session and always cleans up its own
 * scroll lock, so a failed animation can never trap the page.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const { reduce } = useMotionPrefs();
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (reduce) return false;
    try {
      if (sessionStorage.getItem('fm-intro-seen')) return false;
    } catch {
      /* private mode — just play it */
    }
    return true;
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!active) return;

    const lock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const controls = animate(0, 100, {
      duration: 1.15,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => {
        try {
          sessionStorage.setItem('fm-intro-seen', '1');
        } catch {
          /* ignore */
        }
        document.body.style.overflow = lock;
        setActive(false);
        onDone?.();
      },
    });

    // Safety net: never leave the page locked if the animation is interrupted.
    const failsafe = window.setTimeout(() => {
      document.body.style.overflow = lock;
      setActive(false);
      onDone?.();
    }, 4000);

    return () => {
      controls.stop();
      window.clearTimeout(failsafe);
      document.body.style.overflow = lock;
    };
  }, [active, onDone]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-semibold tracking-tight text-fg-strong"
            >
              FABIAN<span className="text-accent">.</span>
            </motion.p>
          </div>

          <div className="mt-6 h-px w-40 overflow-hidden bg-hairline sm:w-64">
            <motion.div
              className="h-full origin-left bg-accent"
              style={{ scaleX: pct / 100 }}
            />
          </div>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-fg-faint tabular-nums">
            {String(pct).padStart(3, '0')}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ *
 * Sections
 * ------------------------------------------------------------------ */

/** Infinite horizontal ticker. Content is duplicated and translated -50%. */
export function Marquee({
  children,
  speed = 34,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const { reduce } = useMotionPrefs();
  if (reduce) {
    return (
      <div className={`flex flex-wrap justify-center gap-2 ${className ?? ''}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative flex overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex shrink-0 items-center gap-2 pr-2"
        animate={{ x: ['0%', '-100%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}

/** Vertical rule that draws itself downward as the section scrolls in. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const { reduce } = useMotionPrefs();

  if (reduce) return <div className={`bg-hairline ${className ?? ''}`} />;

  return (
    <div ref={ref} className={`h-full w-px bg-hairline ${className ?? ''}`}>
      <motion.div
        className="h-full w-full origin-top bg-gradient-to-b from-accent/70 via-accent/40 to-transparent"
        style={{ scaleY }}
      />
    </div>
  );
}

/** Heading block with an icon that rotates in and an underline that wipes across. */
export function SectionHeading({
  children,
  icon: Icon,
  id,
}: {
  children: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  id?: string;
}) {
  const { reduce } = useMotionPrefs();

  return (
    <div className="mb-10" id={id}>
      <Reveal y={16} blur={4} duration={0.6}>
        <div className="flex items-center gap-3">
          {Icon ? (
            <motion.span
              className="grid h-9 w-9 place-items-center rounded-lg bg-elev ring-1 ring-inset ring-hairline"
              initial={reduce ? false : { rotate: -25, scale: 0.6, opacity: 0 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            >
              <Icon className="h-[18px] w-[18px] text-accent/80" />
            </motion.span>
          ) : null}
          <h2 className="text-2xl font-medium tracking-tight text-fg-strong md:text-3xl">
            {children}
          </h2>
        </div>
      </Reveal>

      {!reduce ? (
        <motion.div
          className="mt-4 h-px origin-left bg-gradient-to-r from-accent/50 via-hairline to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <div className="mt-4 h-px bg-hairline" />
      )}
    </div>
  );
}

/** Fixed film-grain layer. Purely decorative. */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[4] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Hero portrait: mask reveal, gentle parallax, and a slow idle float. */
export function ParallaxPortrait({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const { reduce } = useMotionPrefs();

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        style={reduce ? undefined : { y }}
        initial={reduce ? false : { opacity: 0, scale: 1.08, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {reduce ? (
          children
        ) : (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
