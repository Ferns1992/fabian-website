import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Cpu, 
  Globe, 
  Database, 
  Terminal, 
  Briefcase, 
  User, 
  BookOpen,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import { PERSONAL_INFO, SKILLS, EXPERIENCE, PORTFOLIO, BLOG_POSTS, GITHUB_REPOS, TECH_BADGES, STATS } from './constants';

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <div className="flex items-center gap-3 mb-10">
    <div className="p-2 bg-white/[0.03] rounded-lg">
      <Icon className="w-5 h-5 text-zinc-500" />
    </div>
    <h2 className="text-2xl font-medium tracking-tight text-zinc-200">{children}</h2>
  </div>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = `${PERSONAL_INFO.name} | IT & AI Engineer`;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      const sections = navItems.map(item => item.id);
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'github', label: 'Projects' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Experience' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleHireClick = () => {
    setIsHireModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[30%] h-[30%] bg-gradient-to-br from-emerald-500/5 to-transparent blur-[150px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[20%] w-[25%] h-[25%] bg-gradient-to-tl from-blue-500/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] w-[20%] h-[20%] bg-gradient-to-r from-amber-500/3 to-transparent blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/70 backdrop-blur-lg border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold text-white tracking-tight"
          >
            FABIAN<span className="text-emerald-400">.</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  activeSection === item.id ? 'text-zinc-200' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </a>
            ))}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHireClick}
              className="px-5 py-2 bg-white/10 text-zinc-200 font-medium text-sm rounded-full hover:bg-white/15 transition-all border border-white/5"
            >
              Hire Me
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button 
                onClick={() => { setIsMenuOpen(false); handleHireClick(); }}
                className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hire Me Modal */}
      <AnimatePresence>
        {isHireModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHireModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0f0f0f] border border-white/[0.08] rounded-2xl p-8 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <button 
                onClick={() => setIsHireModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">Let's Work Together</h3>
                <p className="text-sm text-zinc-500">Ready to take your projects to the next level?</p>
              </div>

              <div className="space-y-3">
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-600" />
                    <span className="text-sm font-medium text-zinc-400">{PERSONAL_INFO.email}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a 
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-zinc-600" />
                    <span className="text-sm font-medium text-zinc-400">LinkedIn Profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                <p className="text-xs text-zinc-600 uppercase tracking-wider font-medium">Available for freelance & full-time</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white/[0.05] text-zinc-400 rounded-full border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section id="home" className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between mb-40 relative gap-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 flex-1 max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.08] text-zinc-500 text-[11px] font-medium uppercase tracking-[0.25em] mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/30"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400/50" />
              </span>
              Available for Projects
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-6xl md:text-8xl lg:text-9xl font-medium text-white tracking-tight mb-6 leading-[0.9]"
            >
              Hi, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Fabian Milton</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg text-zinc-500 max-w-lg mb-10 leading-relaxed font-light"
            >
              {PERSONAL_INFO.title}. Building elegant solutions at the intersection of <span className="text-zinc-400">AI & Infrastructure</span>.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-5"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHireClick}
                className="px-8 py-4 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all flex items-center gap-2.5 group"
              >
                <span>Let's Talk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <div className="flex items-center gap-1.5">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="p-3.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] rounded-xl transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="p-3.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] rounded-xl transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/[0.05]"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-2xl md:text-3xl font-medium text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image / Premium Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-[420px] md:h-[520px] lg:w-[480px] lg:h-[600px] group">
              {/* Background Aura */}
              <div className="absolute inset-10 bg-gradient-to-br from-zinc-800/30 via-zinc-900/50 to-black/80 blur-3xl rounded-full" />
              
              {/* Decorative ring */}
              <div className="absolute -inset-1 border border-white/[0.04] rounded-[60px] md:rounded-[80px]" />
              <div className="absolute -inset-3 border border-white/[0.02] rounded-[70px] md:rounded-[100px]" />
              
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-[50px] md:rounded-[70px] overflow-hidden border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.005]">
                <img 
                  src="/profile.png"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-[center_15%] transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[transparent_30%] to-transparent opacity-70" />
              </div>

              {/* Floating cards - refined */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 md:-right-8 top-24 p-4 bg-zinc-900/70 backdrop-blur-xl border border-white/[0.05] rounded-2xl hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/[0.04] rounded-xl flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-medium mb-0.5">Expertise</p>
                    <p className="text-sm font-medium text-zinc-300">AI & Automation</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -left-4 md:-left-8 bottom-32 p-4 bg-zinc-900/70 backdrop-blur-xl border border-white/[0.05] rounded-2xl hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/[0.04] rounded-xl flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-medium mb-0.5">Role</p>
                    <p className="text-sm font-medium text-zinc-300">System Architect</p>
                  </div>
                </div>
              </motion.div>

              {/* Corner accent */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border border-white/[0.08] rounded-2xl rotate-45 hidden md:block" />
            </div>
          </motion.div>

          {/* Tech Stack Badges - moved below */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="w-full flex flex-wrap gap-2 justify-center lg:justify-start mt-16"
          >
            {TECH_BADGES.slice(0, 6).map((badge, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.04] rounded-full text-[11px] text-zinc-500 hover:text-zinc-400 hover:border-white/[0.08] transition-all cursor-default"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-32 scroll-mt-32">
          <SectionHeading icon={User}>About Me</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/[0.08] to-white/[0.03] rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/[0.06]">
                <img 
                  src="/profile.png"
                  alt="Fabian Milton Fernandes" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-103"
                />
              </div>
            </div>
            <div>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8 font-light">
                {PERSONAL_INFO.bio}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKILLS.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    <span className="text-sm font-medium text-zinc-500">{skill.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a 
                  href={PERSONAL_INFO.bioSite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-500 font-medium hover:text-zinc-300 transition-colors group text-sm"
                >
                  Explore my full Bio Site
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="mb-32 scroll-mt-32">
            <SectionHeading icon={Globe}>Portfolio Highlights</SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PORTFOLIO.map((project, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300 h-full flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="p-2.5 bg-white/[0.03] rounded-xl">
                      {project.logo ? (
                        <img src={project.logo} alt={project.title} className="w-6 h-6 object-contain opacity-70" referrerPolicy="no-referrer" />
                      ) : (
                        i === 0 ? <Cpu className="w-6 h-6 text-emerald-400/60" /> : i === 1 ? <Terminal className="w-6 h-6 text-emerald-400/60" /> : <Database className="w-6 h-6 text-emerald-400/60" />
                      )}
                    </div>
                    <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-xl font-medium text-zinc-200 mb-3 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.tags.map((tag, j) => (
                      <span key={j} className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full text-[11px] font-medium text-zinc-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        {/* GitHub Repos Section */}
        <section id="github" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Github}>Open Source Projects</SectionHeading>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GITHUB_REPOS.map((repo, i) => (
              <motion.a
                key={i}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                className="group p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-zinc-900/50 rounded-lg">
                    <Github className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-medium text-zinc-300 mb-2 group-hover:text-white transition-colors">
                  {repo.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                  {repo.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    {repo.language}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Briefcase}>Work Experience</SectionHeading>
          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l border-white/[0.08]">
                <div className="absolute left-[-3px] top-2 w-[6px] h-[6px] rounded-full bg-emerald-500/40" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-zinc-300">{exp.role}</h3>
                  <span className="text-sm font-mono text-zinc-600">{exp.period}</span>
                </div>
                <div className="text-zinc-600 font-medium mb-3 uppercase tracking-wider text-xs">{exp.company}</div>
                <p className="text-sm text-zinc-500 max-w-3xl leading-relaxed font-light">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="mb-32 scroll-mt-32">
          <SectionHeading icon={BookOpen}>Latest Insights</SectionHeading>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[3/2] bg-zinc-900/50 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/blog${i}/600/400`} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs font-mono text-zinc-600 mb-3">{post.date}</div>
                  <h3 className="text-base font-medium text-zinc-300 mb-3 group-hover:text-white transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-5 line-clamp-2 font-light">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-zinc-500 text-sm group-hover:gap-2.5 transition-all">
                    Read More <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-32">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] p-10 md:p-14 text-center">
            <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm -z-10" />
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-5">Let's build something great</h2>
            <p className="text-zinc-500 max-w-lg mx-auto mb-8 text-sm font-light">
              Interested in discussing a project or opportunity? Feel free to reach out!
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleHireClick}
                className="px-7 py-3.5 bg-white/[0.08] text-zinc-200 font-medium rounded-xl hover:bg-white/[0.12] transition-all flex items-center gap-2 border border-white/[0.06]"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </motion.button>
              <a 
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-transparent text-zinc-400 font-medium rounded-xl border border-white/[0.06] hover:bg-white/[0.03] hover:text-zinc-300 transition-all flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href={PERSONAL_INFO.bioSite} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm">Bio Site</a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

