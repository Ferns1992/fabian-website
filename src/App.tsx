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
import { PERSONAL_INFO, SKILLS, EXPERIENCE, PORTFOLIO, BLOG_POSTS } from './constants';

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 bg-emerald-500/20 rounded-lg">
      <Icon className="w-6 h-6 text-emerald-400" />
    </div>
    <h2 className="text-3xl font-bold tracking-tight text-white">{children}</h2>
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-white tracking-tighter"
          >
            FABIAN<span className="text-emerald-500">.</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  activeSection === item.id ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </a>
            ))}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHireClick}
              className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-full text-sm hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
              <button 
                onClick={() => setIsHireModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Let's Work Together</h3>
                <p className="text-zinc-400">Ready to take your infrastructure or AI projects to the next level?</p>
              </div>

              <div className="space-y-4">
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium text-white">{PERSONAL_INFO.email}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">LinkedIn Profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Available for freelance & full-time</p>
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
            className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-500 text-black rounded-full shadow-lg hover:bg-emerald-400 transition-colors"
          >
            <ChevronRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between mb-32 relative gap-16 pt-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 flex-1"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Available for Innovation
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-8 leading-[0.85]">
              FABIAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">MILTON</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 leading-relaxed font-light tracking-wide">
              {PERSONAL_INFO.title}. Crafting the future of infrastructure through <span className="text-white font-medium">AI-driven automation</span> and robust engineering.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHireClick}
                className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-3 group shadow-[0_20px_40px_rgba(37,99,235,0.3)]"
              >
                Start a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <div className="flex items-center gap-2">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="p-4 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Github className="w-6 h-6" />
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Premium Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] group">
              {/* Background Aura */}
              <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
              
              {/* Decorative Elements */}
              <div className="absolute -inset-4 border border-white/5 rounded-full" />
              <div className="absolute -inset-12 border border-white/5 rounded-full opacity-50" />
              
              {/* Main Image Container - Glassmorphism Frame */}
              <div className="absolute inset-0 rounded-[40px] md:rounded-[80px] overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-3xl shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
                <img 
                  src="https://drive.google.com/uc?export=view&id=1qa0EH0UTlqrmCwuKgIQR6CrSZxlQlFSo" 
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/fabian-premium/1000/1000";
                  }}
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Status Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 p-6 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Expertise</p>
                    <p className="text-sm font-bold text-white">AI & Automation</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Experience Card */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-20 p-6 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Status</p>
                    <p className="text-sm font-bold text-white">System Architect</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-32 scroll-mt-32">
          <SectionHeading icon={User}>About Me</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                <img 
                  src="https://drive.google.com/uc?export=view&id=1qa0EH0UTlqrmCwuKgIQR6CrSZxlQlFSo" 
                  alt="Fabian Milton Fernandes" 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/fabian-milton/800/800";
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                {PERSONAL_INFO.bio}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm font-medium text-zinc-300">{skill.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a 
                  href={PERSONAL_INFO.bioSite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors group"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO.map((project, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    {project.logo ? (
                      <img src={project.logo} alt={project.title} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      i === 0 ? <Cpu className="w-8 h-8 text-emerald-400" /> : i === 1 ? <Terminal className="w-8 h-8 text-emerald-400" /> : <Database className="w-8 h-8 text-emerald-400" />
                    )}
                  </div>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-32 scroll-mt-32">
          <SectionHeading icon={Briefcase}>Work Experience</SectionHeading>
          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative pl-8 border-l border-white/10">
                <div className="absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <span className="text-sm font-mono text-emerald-400">{exp.period}</span>
                </div>
                <div className="text-zinc-500 font-medium mb-4 uppercase tracking-wider text-xs">{exp.company}</div>
                <p className="text-zinc-400 max-w-3xl leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="mb-32 scroll-mt-32">
          <SectionHeading icon={BookOpen}>Latest Insights</SectionHeading>
          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="aspect-video bg-zinc-900 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/blog${i}/600/400`} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-mono text-emerald-400 mb-3">{post.date}</div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-white text-sm font-bold group-hover:gap-3 transition-all">
                    Read More <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-32">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 p-12 text-center">
            <div className="absolute inset-0 bg-[#0a0a0a]/40 backdrop-blur-sm -z-10" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's build something amazing</h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg">
              Interested in discussing a project or a new opportunity? Feel free to reach out!
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHireClick}
                className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl"
              >
                <Mail className="w-5 h-5" />
                Hire Me
              </motion.button>
              <a 
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Linkedin className="w-5 h-5" />
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

