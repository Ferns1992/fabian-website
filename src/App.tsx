import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  Mail,
  Menu,
  Play,
  Radio,
  Terminal,
  User,
  X,
  Zap,
} from 'lucide-react';
import {
  BLOG_POSTS,
  EXPERIENCE,
  GITHUB_REPOS,
  PERSONAL_INFO,
  PORTFOLIO,
  SKILLS,
  STATS,
  TECH_BADGES,
  VIDEOS,
} from './constants';
import FlowField from './canvas/FlowField';
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
  { id: 'videos', label: 'Videos' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const LANGUAGE_COLOR: Record<string, string> = {
  TypeScript: 'bg-sky-400/70',
  JavaScript: 'bg-amber-400/70',
  Python: 'bg-emerald-400/70',
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
    <div className="relative min-h-screen bg-[#0a0a0a] font-sans text-zinc-300 antialiased selection:bg-emerald-400/30 selection:text-white">
      <Preloader />
      <ScrollProgress />

      {/* --- ambient background stack --- */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FlowField />
        <div className="grid-backdrop absolute inset-0" />
        <div className="aurora absolute -top-[20%] left-[15%] h-[45vh] w-[45vh] rounded-full bg-emerald-500/[0.07] blur-[130px]" />
        <div className="aurora absolute right-[10%] top-[35%] h-[38vh] w-[38vh] rounded-full bg-sky-500/[0.055] blur-[130px]" style={{ animationDelay: '-7s' }} />
        <div className="aurora absolute bottom-[5%] left-[45%] h-[32vh] w-[32vh] rounded-full bg-amber-500/[0.04] blur-[120px]" style={{ animationDelay: '-14s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      <CursorGlow />
      <NoiseOverlay />

      {/* --- nav --- */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-[#0a0a0a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <motion.a
            href="#home"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg font-semibold tracking-tight text-white"
          >
            FABIAN<span className="text-emerald-400">.</span>
          </motion.a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </a>
            ))}

            <Magnetic className="ml-3" strength={0.25}>
              <button
                onClick={() => setIsHireModalOpen(true)}
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.12]"
              >
                Hire Me
              </button>
            </Magnetic>
          </div>

          <button
            className="text-zinc-200 md:hidden"
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
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 pt-28 backdrop-blur-xl md:hidden"
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
                  className="border-b border-white/[0.05] py-4 text-2xl font-medium text-zinc-400"
                >
                  {item.label}
                </motion.a>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHireModalOpen(true);
                }}
                className="mt-6 rounded-xl bg-emerald-400 py-4 font-semibold text-black"
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0f0f] p-8 shadow-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <button
                onClick={closeAll}
                aria-label="Close"
                className="absolute right-4 top-4 text-zinc-600 transition-colors hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 14, delay: 0.1 }}
                  className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.03]"
                >
                  <Mail className="h-7 w-7 text-emerald-400" />
                </motion.div>
                <h3 className="mb-2 text-2xl font-medium text-white">Let's Work Together</h3>
                <p className="text-sm text-zinc-500">
                  Remote IT support, AI automation, or a full build.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-emerald-400/30 hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-300">
                      {PERSONAL_INFO.email}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-700 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div className="mt-8 border-t border-white/[0.06] pt-6 text-center">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
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
            className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-zinc-300 backdrop-blur-xl transition-colors hover:bg-white/[0.1]"
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
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-400"
            >
              <span className="halo relative inline-flex h-1.5 w-1.5 text-emerald-400">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available for Projects
            </motion.div>

            <h1 className="mb-6 text-5xl font-medium leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
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
              <p className="mb-4 max-w-lg text-base font-light leading-relaxed text-zinc-400 md:text-lg">
                {PERSONAL_INFO.title}.
              </p>
            </Reveal>

            <Reveal delay={0.85} y={18} blur={4}>
              <p className="mb-10 max-w-lg text-sm font-light leading-relaxed text-zinc-500">
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
                  className="group flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
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
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-4 text-sm font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Magnetic>
            </div>

            <Stagger
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/[0.06] pt-8 sm:grid-cols-4"
              gap={0.09}
              delay={0.2}
            >
              {STATS.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="text-2xl font-medium text-white md:text-3xl">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
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
                <div className="absolute inset-8 rounded-full bg-emerald-500/10 blur-[90px]" />
                <div className="absolute -inset-1 rounded-[56px] border border-white/[0.05]" />
                <div className="absolute -inset-3 rounded-[68px] border border-white/[0.02]" />

                <div className="group absolute inset-0 overflow-hidden rounded-[48px] border border-white/[0.07] bg-zinc-900/60 shadow-2xl backdrop-blur-xl">
                  <img
                    src="/profile.webp"
                    alt={PERSONAL_INFO.name}
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>

                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-3 top-20 hidden rounded-2xl border border-white/[0.07] bg-zinc-900/80 p-4 backdrop-blur-xl md:block lg:-right-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04]">
                      <Cpu className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                        Expertise
                      </p>
                      <p className="text-sm font-medium text-zinc-200">AI &amp; Automation</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute -left-3 bottom-24 hidden rounded-2xl border border-white/[0.07] bg-zinc-900/80 p-4 backdrop-blur-xl md:block lg:-left-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04]">
                      <Terminal className="h-4 w-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                        Role
                      </p>
                      <p className="text-sm font-medium text-zinc-200">System Architect</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ParallaxPortrait>
          </div>
        </section>

        {/* ============ TECH MARQUEE ============ */}
        <section className="mb-28 border-y border-white/[0.05] py-6">
          <Reveal y={14} blur={3} className="mb-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              Working with
            </p>
          </Reveal>
          <Marquee speed={38}>
            {TECH_BADGES.map((badge) => (
              <span
                key={badge}
                className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-zinc-400 transition-colors hover:border-emerald-400/25 hover:text-zinc-200"
              >
                {badge}
              </span>
            ))}
          </Marquee>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" className="mb-32 scroll-mt-32">
          <SectionHeading icon={User}>About Me</SectionHeading>

          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Reveal y={40} scale={0.96} duration={0.9}>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-br from-emerald-500/15 to-sky-500/10 blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/[0.07] bg-zinc-900">
                  <img
                    src="/about.webp"
                    alt="Fabian Milton Fernandes"
                    width={900}
                    height={1125}
                    className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 12 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.35, type: 'spring', damping: 18 }}
                  className="absolute -bottom-5 -right-3 rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-3 backdrop-blur-xl"
                >
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Based in</p>
                  <p className="text-sm font-medium text-zinc-100">Philippines</p>
                </motion.div>
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.1}>
                <p className="mb-8 text-lg font-light leading-relaxed text-zinc-400">
                  {PERSONAL_INFO.bio}
                </p>
              </Reveal>

              <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2" gap={0.05}>
                {SKILLS.map((skill) => (
                  <StaggerItem key={skill.name}>
                    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-emerald-400/25">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60 transition-shadow group-hover:shadow-[0_0_10px_2px_rgba(52,211,153,0.45)]" />
                      <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">
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
                  className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
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
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/[0.14]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.05] bg-zinc-900/60 transition-colors group-hover:border-emerald-400/20">
                        <Github className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-300" />
                      </div>

                      {repo.liveUrl ? (
                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                          <Radio className="h-2.5 w-2.5" />
                          Live
                        </span>
                      ) : (
                        <ExternalLink className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-zinc-400" />
                      )}
                    </div>

                    <h3 className="mb-2 font-mono text-base font-medium text-zinc-100 transition-colors group-hover:text-white">
                      {repo.name}
                    </h3>

                    <p className="mb-5 flex-grow text-xs leading-relaxed text-zinc-500">
                      {repo.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            LANGUAGE_COLOR[repo.language] ?? 'bg-zinc-500/60'
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
                          className="flex items-center gap-1 text-[11px] font-medium text-emerald-400/80 transition-colors hover:text-emerald-300"
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
                  <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.14]">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-white/[0.05] bg-zinc-900/60">
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt=""
                          className="h-5 w-5 object-contain opacity-70"
                          referrerPolicy="no-referrer"
                        />
                      ) : i === 0 ? (
                        <Zap className="h-5 w-5 text-emerald-400/70" />
                      ) : i === 1 ? (
                        <Radio className="h-5 w-5 text-emerald-400/70" />
                      ) : (
                        <Database className="h-5 w-5 text-emerald-400/70" />
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-medium text-zinc-100 transition-colors group-hover:text-white">
                      {project.title}
                    </h3>

                    <p className="mb-5 flex-grow text-sm leading-relaxed text-zinc-500">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-zinc-500"
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
                    className="block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-300 hover:border-white/[0.14]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-zinc-900/50">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-5 w-5 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1.5 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
                        {video.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                        Facebook
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
                  <span className="absolute -left-[1px] top-2 hidden h-[7px] w-[7px] rounded-full bg-emerald-400 md:block" />
                  <div className="mb-2 flex flex-col justify-between md:flex-row md:items-center">
                    <h3 className="text-lg font-medium text-zinc-200">{exp.role}</h3>
                    <span className="font-mono text-xs text-zinc-500">{exp.period}</span>
                  </div>
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400/70">
                    {exp.company}
                  </div>
                  <p className="max-w-3xl text-sm font-light leading-relaxed text-zinc-400">
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

          <Stagger className="grid gap-6 md:grid-cols-3" gap={0.08}>
            {BLOG_POSTS.map((post) => (
              <StaggerItem key={post.title} className="h-full">
                <Card className="h-full rounded-2xl" tilt={5} glow="rgba(168,85,247,0.10)">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-300 hover:border-white/[0.14]">
                    <div className="aspect-[3/2] overflow-hidden bg-zinc-900/50">
                      <div className="grid h-full w-full place-items-center text-zinc-700">
                        <BookOpen className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex flex-grow flex-col p-5">
                      <div className="mb-3 font-mono text-[11px] text-zinc-600">{post.date}</div>
                      <h3 className="mb-2 text-base font-medium text-zinc-200 transition-colors group-hover:text-white">
                        {post.title}
                      </h3>
                      <p className="mb-4 flex-grow text-xs font-light leading-relaxed text-zinc-500">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="scroll-mt-32">
          <Reveal y={40} scale={0.97} duration={0.9}>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] px-8 py-16 text-center md:px-14">
              <div className="absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
              <div className="relative">
                <SplitText
                  text="Let's build something great"
                  className="mb-5 block text-3xl font-medium text-white md:text-5xl"
                />
                <Reveal delay={0.3} className="mx-auto mb-10 max-w-lg">
                  <p className="text-sm font-light text-zinc-400">
                    Remote IT support, AI automation, or a full build from scratch.
                    Tell me what you are working on.
                  </p>
                </Reveal>

                <Magnetic strength={0.25}>
                  <button
                    onClick={() => setIsHireModalOpen(true)}
                    className="mx-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-7 py-3.5 font-medium text-zinc-100 transition-colors hover:bg-white/[0.14]"
                  >
                    <Mail className="h-4 w-4" />
                    Get in Touch
                  </button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href={PERSONAL_INFO.bioSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Bio Site
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
