import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  Mail,
  Menu,
  Pencil,
  Play,
  Radio,
  Terminal,
  User,
  X,
  Zap,
  Radar,
  Boxes,
  Rocket,
  Fuel,
  ScanText,
  Calculator,
  LayoutGrid,
  TerminalSquare,
  Youtube,
} from 'lucide-react';
import {
  APPS,
  APP_ICONS,
  BLOG_POSTS,
  EXPERIENCE,
  GITHUB_REPOS,
  LOCATIONS,
  PERSONAL_INFO,
  PORTFOLIO,
  SKILLS,
  STATS,
  TECH_BADGES,
  VIDEOS,
} from './constants';
import FlowField from './canvas/FlowField';
import { ThemeToggle } from './theme';
import {
  Card,
  CountUp,
  CursorGlow,
  DrawLine,
  Magnetic,
  Marquee,
  NoiseOverlay,
  ParallaxPortrait,
  Preloader,
  Reveal,
  ScrollProgress,
  SectionHeading,
  ShimmerText,
  SplitText,
  Stagger,
  StaggerItem,
  useMotionPrefs,
} from './animations';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'apps', label: 'Apps' },
  { id: 'videos', label: 'Videos' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Icon key from constants -> component. Kept explicit rather than importing
 * from a barrel, so an unknown key is a type error instead of a runtime crash.
 */
const APP_ICON_COMPONENTS = {
  Radar,
  Boxes,
  Fuel,
  ScanText,
  Calculator,
  LayoutGrid,
  TerminalSquare,
  Youtube,
} as const;

const LANGUAGE_COLOR: Record<string, string> = {
  TypeScript: 'bg-accent-2/70',
  JavaScript: 'bg-amber-400/70',
  Python: 'bg-accent/70',
  HTML: 'bg-orange-400/70',
  CSS: 'bg-pink-400/70',
  EJS: 'bg-teal-400/70',
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = `${PERSONAL_INFO.name} | IT & AI Engineer`;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);

      // Pick the section whose top is the last one above the reading line,
      // rather than the first that merely overlaps it.
      const line = 160;
      let current = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
      }

      // At the very bottom the last section can never reach the line.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isHireModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isHireModalOpen]);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsHireModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-bg font-sans text-fg antialiased selection:bg-accent/30 selection:text-fg-strong">
      <Preloader />
      <ScrollProgress />

      {/* --- ambient background stack --- */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FlowField />
        <div className="grid-backdrop absolute inset-0" />
        <div className="aurora absolute -top-[20%] left-[15%] h-[45vh] w-[45vh] rounded-full bg-aurora-emerald blur-[130px]" />
        <div className="aurora absolute right-[10%] top-[35%] h-[38vh] w-[38vh] rounded-full bg-aurora-sky blur-[130px]" style={{ animationDelay: '-7s' }} />
        <div className="aurora absolute bottom-[5%] left-[45%] h-[32vh] w-[32vh] rounded-full bg-aurora-amber blur-[120px]" style={{ animationDelay: '-14s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
      </div>

      <CursorGlow />
      <ThemeToggle />
      <NoiseOverlay />

      {/* --- nav --- */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <motion.a
            href="#home"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg font-semibold tracking-tight text-fg-strong"
          >
            FABIAN<span className="text-accent">.</span>
          </motion.a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-fg-strong'
                    : 'text-fg-subtle hover:text-fg'
                }`}
              >
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-elev-hover ring-1 ring-inset ring-hairline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </a>
            ))}

            <Magnetic className="ml-3" strength={0.25}>
              <button
                onClick={() => setIsHireModalOpen(true)}
                className="rounded-full border border-hairline bg-elev-hover px-5 py-2 text-sm font-medium text-fg-strong transition-colors hover:bg-elev-hover"
              >
                Hire Me
              </button>
            </Magnetic>
          </div>

          <button
            className="text-fg-strong md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 pt-28 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2 px-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeAll}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="border-b border-hairline py-4 text-2xl font-medium text-fg-muted"
                >
                  {item.label}
                </motion.a>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHireModalOpen(true);
                }}
                className="mt-6 rounded-xl bg-accent py-4 font-semibold text-accent-fg"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* --- hire modal --- */}
      <AnimatePresence>
        {isHireModalOpen ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
              className="absolute inset-0 bg-scrim backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-hairline bg-bg-solid p-8 shadow-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fg-strong/20 to-transparent" />
              <button
                onClick={closeAll}
                aria-label="Close"
                className="absolute right-4 top-4 text-fg-faint transition-colors hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 14, delay: 0.1 }}
                  className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-elev"
                >
                  <Mail className="h-7 w-7 text-accent" />
                </motion.div>
                <h3 className="mb-2 text-2xl font-medium text-fg-strong">Let's Work Together</h3>
                <p className="text-sm text-fg-subtle">
                  Remote IT support, AI automation, or a full build.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="group flex items-center justify-between rounded-xl border border-accent bg-accent-soft/40 p-4 transition-colors hover:bg-accent-soft"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-fg-strong">
                      {PERSONAL_INFO.email}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-fg-faint transition-transform group-hover:translate-x-1" />
                </a>

                {PERSONAL_INFO.backupEmail && (
                  <a
                    href={`mailto:${PERSONAL_INFO.backupEmail}`}
                    className="group flex items-center justify-between rounded-xl border border-hairline bg-elev p-4 transition-colors hover:border-hairline-strong hover:bg-elev-hover"
                  >
                    <span className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-fg-subtle" />
                      <span className="text-sm font-medium text-fg">
                        {PERSONAL_INFO.backupEmail}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-faint">
                      Backup
                    </span>
                  </a>
                )}
              </div>

              <div className="mt-8 border-t border-hairline pt-6 text-center">
                <p className="text-[11px] font-medium uppercase tracking-wider text-fg-faint">
                  Available for freelance &amp; full-time
                </p>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-hairline bg-elev-hover text-fg backdrop-blur-xl transition-colors hover:bg-elev-hover"
          >
            <ChevronRight className="h-5 w-5 -rotate-90" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32">
        {/* ============ HERO ============ */}
        <section
          id="home"
          className="mb-28 flex min-h-[88vh] flex-col items-center gap-16 pt-8 lg:flex-row lg:justify-between"
        >
          <div className="z-10 max-w-2xl flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-elev px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-fg-muted"
            >
              <span className="halo relative inline-flex h-1.5 w-1.5 text-accent">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available for Projects
            </motion.div>

            <h1 className="mb-6 text-5xl font-medium leading-[0.92] tracking-tight text-fg-strong sm:text-7xl lg:text-8xl">
              <SplitText text="Hi, I'm" delay={0.25} />
              <br />
              <SplitText
                text="Fabian Milton"
                delay={0.42}
                className="block"
                wordClassName="animate-shimmer bg-clip-text text-transparent"
              />
            </h1>

            <Reveal delay={0.75} y={18} blur={4}>
              <p className="mb-4 max-w-lg text-base font-light leading-relaxed text-fg-muted md:text-lg">
                {PERSONAL_INFO.title}.
              </p>
            </Reveal>

            <Reveal delay={0.85} y={18} blur={4}>
              <p className="mb-10 max-w-lg text-sm font-light leading-relaxed text-fg-subtle">
                Self-hosted AI platforms, container orchestration, and the unglamorous
                infrastructure that keeps it all running. Based in the Philippines,
                working with clients worldwide.
              </p>
            </Reveal>

            <div className="flex flex-wrap items-center gap-5">
              <Magnetic strength={0.3}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsHireModalOpen(true)}
                  className="group flex items-center gap-2.5 rounded-xl bg-inverse-bg px-8 py-4 font-medium text-inverse-fg transition-colors hover:bg-inverse-bg-hover"
                >
                  Let's Talk
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Magnetic>

              <Magnetic strength={0.35}>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-hairline px-5 py-4 text-sm font-medium text-fg-muted transition-colors hover:border-hairline-strong hover:text-fg-strong"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Magnetic>
            </div>

            <Stagger
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-4"
              gap={0.09}
              delay={0.2}
            >
              {STATS.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="text-2xl font-medium text-fg-strong md:text-3xl">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-subtle">
                    {stat.label}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* portrait */}
          <div className="relative flex flex-1 justify-center lg:justify-end">
            <ParallaxPortrait className="relative w-72 md:w-[380px]">
              <div className="relative aspect-[4/5] w-full">
                <div className="absolute inset-8 rounded-full bg-accent-soft/10 blur-[90px]" />
                <div className="absolute -inset-1 rounded-[56px] border border-hairline" />
                <div className="absolute -inset-3 rounded-[68px] border border-hairline" />

                <div className="group absolute inset-0 overflow-hidden rounded-[48px] border border-hairline bg-bg-solid/60 shadow-2xl backdrop-blur-xl">
                  <img
                    src="/profile.webp"
                    alt={PERSONAL_INFO.name}
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                </div>

                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-3 top-20 hidden rounded-2xl border border-hairline bg-bg-solid/80 p-4 backdrop-blur-xl md:block lg:-right-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-elev-hover">
                      <Cpu className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-widest text-fg-subtle">
                        Expertise
                      </p>
                      <p className="text-sm font-medium text-fg-strong">AI &amp; Automation</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute -left-3 bottom-24 hidden rounded-2xl border border-hairline bg-bg-solid/80 p-4 backdrop-blur-xl md:block lg:-left-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-elev-hover">
                      <Terminal className="h-4 w-4 text-accent-2" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-widest text-fg-subtle">
                        Role
                      </p>
                      <p className="text-sm font-medium text-fg-strong">System Architect</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ParallaxPortrait>
          </div>
        </section>

        {/* ============ TECH MARQUEE ============ */}
        <section className="mb-28 border-y border-hairline py-6">
          <Reveal y={14} blur={3} className="mb-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-fg-faint">
              Working with
            </p>
          </Reveal>
          <Marquee speed={38}>
            {TECH_BADGES.map((badge) => (
              <span
                key={badge}
                className="shrink-0 rounded-full border border-hairline bg-elev px-4 py-2 text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg-strong"
              >
                {badge}
              </span>
            ))}
          </Marquee>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" className="mb-32 scroll-mt-32">
          <SectionHeading icon={User}>About Me</SectionHeading>

          <Reveal y={16} className="mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-fg-subtle">
                Working across
              </span>
              {LOCATIONS.map((loc) => (
                <span
                  key={loc.code}
                  className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-elev px-3.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg-strong"
                >
                  {loc.primary && (
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent text-accent">
                      <span className="halo absolute inset-0" />
                    </span>
                  )}
                  {loc.country}
                  {loc.primary && (
                    <span className="text-[10px] uppercase tracking-wider text-fg-faint">
                      Base
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Reveal y={40} scale={0.96} duration={0.9}>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-br from-accent-soft to-accent-2/[0.08] blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-hairline bg-bg-solid">
                  <img
                    src="/about.webp"
                    alt="Fabian Milton Fernandes"
                    width={900}
                    height={1125}
                    className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 12 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.35, type: 'spring', damping: 18 }}
                  className="absolute -bottom-5 -right-3 rounded-2xl border border-hairline bg-bg-solid/90 px-5 py-3 backdrop-blur-xl"
                >
                  <p className="text-[10px] uppercase tracking-widest text-fg-subtle">Based in</p>
                  <p className="text-sm font-medium text-fg-strong">
                    {PERSONAL_INFO.location}
                  </p>
                  <p className="mt-0.5 text-[10px] text-fg-faint">
                    Also serving {LOCATIONS.filter((l) => !l.primary).map((l) => l.country).join(' & ')}
                  </p>
                </motion.div>
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.1}>
                <p className="mb-8 text-lg font-light leading-relaxed text-fg-muted">
                  {PERSONAL_INFO.bio}
                </p>
              </Reveal>

              <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2" gap={0.05}>
                {SKILLS.map((skill) => (
                  <StaggerItem key={skill.name}>
                    <div className="group flex items-center gap-3 rounded-xl border border-hairline bg-elev p-3 transition-colors hover:border-accent">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60 transition-shadow group-hover:shadow-[0_0_10px_2px_rgba(52,211,153,0.45)]" />
                      <span className="text-sm font-medium text-fg-muted transition-colors group-hover:text-fg-strong">
                        {skill.name}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.15} className="mt-10">
                <a
                  href={PERSONAL_INFO.bioSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg-strong"
                >
                  Explore my full Bio Site
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Github}>Selected Work</SectionHeading>

          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" gap={0.07}>
            {GITHUB_REPOS.map((repo) => (
              <StaggerItem key={repo.name} className="h-full">
                <Card className="h-full rounded-2xl" tilt={6} lift={-5}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-elev p-5 transition-colors duration-300 hover:border-hairline-strong"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-hairline bg-bg-solid/60 transition-colors group-hover:border-accent">
                        <Github className="h-4 w-4 text-fg-subtle transition-colors group-hover:text-fg" />
                      </div>

                      {repo.liveUrl ? (
                        <span className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-accent">
                          <Radio className="h-2.5 w-2.5" />
                          Live
                        </span>
                      ) : (
                        <ExternalLink className="h-4 w-4 text-fg-faint transition-colors group-hover:text-fg-muted" />
                      )}
                    </div>

                    <h3 className="mb-2 font-mono text-base font-medium text-fg-strong transition-colors group-hover:text-fg-strong">
                      {repo.name}
                    </h3>

                    <p className="mb-5 flex-grow text-xs leading-relaxed text-fg-subtle">
                      {repo.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-fg-subtle">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            LANGUAGE_COLOR[repo.language] ?? 'bg-fg-faint/60'
                          }`}
                        />
                        {repo.language}
                      </span>
                      {repo.liveUrl ? (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(repo.liveUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="flex items-center gap-1 text-[11px] font-medium text-accent/80 transition-colors hover:text-accent"
                        >
                          Visit
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      ) : null}
                    </div>
                  </a>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============ PORTFOLIO ============ */}
        <section id="portfolio" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Globe}>What I Build</SectionHeading>

          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {PORTFOLIO.map((project, i) => (
              <StaggerItem key={project.title} className="h-full">
                <Card className="h-full rounded-2xl" tilt={5} glow="rgba(56,189,248,0.12)">
                  <div className="flex h-full flex-col rounded-2xl border border-hairline bg-elev p-6 transition-colors duration-300 hover:border-hairline-strong">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-hairline bg-bg-solid/60">
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt=""
                          className="h-5 w-5 object-contain opacity-70"
                          referrerPolicy="no-referrer"
                        />
                      ) : i === 0 ? (
                        <Zap className="h-5 w-5 text-accent/70" />
                      ) : i === 1 ? (
                        <Radio className="h-5 w-5 text-accent/70" />
                      ) : (
                        <Database className="h-5 w-5 text-accent/70" />
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-medium text-fg-strong transition-colors group-hover:text-fg-strong">
                      {project.title}
                    </h3>

                    <p className="mb-5 flex-grow text-sm leading-relaxed text-fg-subtle">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-hairline bg-elev px-2.5 py-1 text-[11px] font-medium text-fg-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============ APPS ============ */}
        <section id="apps" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Rocket}>Apps &amp; Live Systems</SectionHeading>

          <Reveal y={12} className="mb-9 max-w-2xl">
            <p className="text-sm font-light leading-relaxed text-fg-subtle">
              Systems I designed, built and deployed. Each one is running on my
              own infrastructure and reachable at the address shown.
            </p>
          </Reveal>

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.05}>
            {APPS.map((app) => {
              const Icon = APP_ICON_COMPONENTS[app.icon] ?? Boxes;
              return (
                <StaggerItem key={app.name} className="h-full">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-elev transition-colors duration-300 hover:border-accent"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-bg-solid">
                      <img
                        src={app.art}
                        alt=""
                        width={900}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/75 via-transparent to-transparent" />

                      <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-bg-solid/75 backdrop-blur-md">
                        <Icon className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      </span>

                      <span className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full border border-hairline bg-bg-solid/75 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-3.5 w-3.5 text-fg-strong" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="flex flex-grow flex-col p-5">
                      <h3 className="mb-1.5 text-sm font-semibold text-fg-strong">
                        {app.name}
                      </h3>
                      <p className="mb-4 flex-grow text-xs font-light leading-relaxed text-fg-subtle">
                        {app.blurb}
                      </p>
                      <span className="truncate font-mono text-[10px] text-fg-faint">
                        {app.detail}
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* ============ VIDEOS ============ */}
        <section id="videos" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Play}>Latest Videos</SectionHeading>

          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {VIDEOS.map((video) => (
              <StaggerItem key={video.title}>
                <Card className="rounded-2xl" tilt={7} glow="rgba(245,158,11,0.10)">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-2xl border border-hairline bg-elev transition-colors duration-300 hover:border-hairline-strong"
                  >
                    <div className="relative aspect-video overflow-hidden bg-bg-solid">
                      <img
                        src={video.thumbnail}
                        alt=""
                        width={1200}
                        height={675}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full border border-hairline bg-bg-solid/70 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-5 w-5 text-fg-strong" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1.5 text-sm font-medium text-fg transition-colors group-hover:text-fg-strong">
                        {video.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-fg-faint">
                        {video.platform}
                      </span>
                    </div>
                  </a>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============ EXPERIENCE ============ */}
        <section id="experience" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Briefcase}>Work Experience</SectionHeading>

          <div className="grid gap-8 md:grid-cols-[2px_minmax(0,1fr)]">
            <DrawLine className="hidden md:block" />

            <Stagger className="space-y-10" gap={0.12}>
              {EXPERIENCE.map((exp) => (
                <StaggerItem key={exp.role} className="relative md:pl-4">
                  <span className="absolute -left-[1px] top-2 hidden h-[7px] w-[7px] rounded-full bg-accent md:block" />
                  <div className="mb-2 flex flex-col justify-between md:flex-row md:items-center">
                    <h3 className="text-lg font-medium text-fg-strong">{exp.role}</h3>
                    <span className="font-mono text-xs text-fg-subtle">{exp.period}</span>
                  </div>
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-accent/70">
                    {exp.company}
                  </div>
                  <p className="max-w-3xl text-sm font-light leading-relaxed text-fg-muted">
                    {exp.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ============ BLOG ============ */}
        <section id="blog" className="mb-32 scroll-mt-32">
          <SectionHeading icon={BookOpen}>Latest Insights</SectionHeading>

          <Reveal y={12} className="mb-8 max-w-2xl">
            <p className="text-sm font-light leading-relaxed text-fg-subtle">
              Notes I&apos;m still writing up. Published when they&apos;re finished and
              fact-checked, rather than padded out now.
            </p>
          </Reveal>

          <Stagger className="grid gap-6 md:grid-cols-3" gap={0.08}>
            {BLOG_POSTS.map((post) => (
              <StaggerItem key={post.title} className="h-full">
                <div className="group h-full overflow-hidden rounded-2xl border border-hairline bg-elev transition-colors duration-300 hover:border-hairline-strong">
                  <div className="relative aspect-[3/2] overflow-hidden bg-bg-solid">
                    <img
                      src={post.cover}
                      alt=""
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-bg-solid/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-fg-muted backdrop-blur-md">
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Draft
                    </span>
                  </div>
                  <div className="flex flex-grow flex-col p-5">
                    <h3 className="mb-2 text-base font-medium text-fg-strong">
                      {post.title}
                    </h3>
                    <p className="flex-grow text-xs font-light leading-relaxed text-fg-subtle">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="scroll-mt-32">
          <Reveal y={40} scale={0.97} duration={0.9}>
            <div className="relative overflow-hidden rounded-3xl border border-hairline bg-elev px-8 py-16 text-center md:px-14">
              <div className="absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-accent-soft/10 blur-[100px]" />
              <div className="relative">
                <SplitText
                  text="Let's build something great"
                  className="mb-5 block text-3xl font-medium text-fg-strong md:text-5xl"
                />
                <Reveal delay={0.3} className="mx-auto mb-10 max-w-lg">
                  <p className="text-sm font-light text-fg-muted">
                    Remote IT support, AI automation, or a full build from scratch.
                    Tell me what you are working on.
                  </p>
                </Reveal>

                <Reveal delay={0.4}>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Magnetic strength={0.25}>
                      <button
                        onClick={() => setIsHireModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-inverse-bg px-7 py-3.5 font-medium text-inverse-fg transition-colors hover:bg-inverse-bg-hover"
                      >
                        <Mail className="h-4 w-4" />
                        Get in Touch
                      </button>
                    </Magnetic>

                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="rounded-xl border border-hairline bg-elev px-7 py-3.5 font-medium text-fg-strong transition-colors hover:border-hairline-strong hover:bg-elev-hover"
                    >
                      Email me
                    </a>
                  </div>
                </Reveal>

                <Reveal delay={0.5}>
                  <p className="mt-6 text-center font-mono text-[11px] text-fg-faint">
                    {PERSONAL_INFO.email}
                  </p>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <p className="text-sm text-fg-subtle">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-fg-subtle transition-colors hover:text-fg-strong"
            >
              GitHub
            </a>
            <a
              href={PERSONAL_INFO.bioSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-fg-subtle transition-colors hover:text-fg-strong"
            >
              Bio Site
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-sm text-fg-subtle transition-colors hover:text-fg-strong"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
