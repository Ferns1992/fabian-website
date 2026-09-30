export const PERSONAL_INFO = {
  name: "Fabian Milton Fernandes",
  title: "AI Engineer & IT Infrastructure Consultant",
  email: "admin@sysitadmin.com",
  /** Secondary address shown in the contact section if the domain bounces. */
  backupEmail: "fabianfernandes25@gmail.com",
  linkedin: "https://linkedin.com/in/fabianfernandes1992",
  github: "https://github.com/Ferns1992",
  bioSite: "https://bio.site/fabianmiltonfernandes",
  bio: "I specialize in self-hosted AI systems, IT infrastructure, and automation, with over a decade of hands-on experience. I build AI agents and retrieval systems, run Proxmox and Docker/Kubernetes clusters for production workloads, and automate operations with n8n and local LLMs. I have shipped 100+ web applications for a diverse global clientele.",
  location: "Philippines",
};

/** Where I currently take on work. `primary` renders as the main badge. */
export const LOCATIONS = [
  { country: "Philippines", code: "PH", primary: true },
  { country: "India", code: "IN", primary: false },
  { country: "Bahrain", code: "BH", primary: false },
];

export const SKILLS = [
  { name: "Proxmox VE & Virtualization", category: "Infrastructure" },
  { name: "Docker & Portainer", category: "DevOps" },
  { name: "Kubernetes Orchestration", category: "DevOps" },
  { name: "AI Automation (n8n, LLM, Ollama)", category: "AI" },
  { name: "Google AI Studio & Base64", category: "AI" },
  { name: "Meshtastic & LoRa Mesh Networks", category: "IoT" },
  { name: "IoT for Farming & Agriculture", category: "IoT" },
  { name: "Technical Project Management", category: "Management" },
  { name: "Networking (CCNA)", category: "Infrastructure" },
  { name: "SQL Server & Databases", category: "Data" },
];

export const EXPERIENCE = [
  {
    role: "Freelance AI Engineer & IT Infrastructure Consultant",
    company: "Independent",
    period: "2025 - Present",
    description: "Designing and deploying self-hosted AI platforms and production infrastructure for clients across multiple countries. Building AI agents and RAG systems, running Proxmox and Docker/Kubernetes clusters for high-availability workloads, and automating operations with n8n and local LLMs. Delivered 100+ web applications end to end, from architecture through deployment.",
  },
  {
    role: "IT Infrastructure Manager",
    company: "JASGROUP OF COMPANIES",
    period: "Jun 2015 - 2025",
    description: "Led digital transformation across restaurant and retail operations: Oracle MICROS POS deployments, Active Directory domain services, and network infrastructure supporting multi-site chains. Managed the full infrastructure lifecycle for hospitality environments.",
  },
];

export const PORTFOLIO = [
  {
    title: "AI Web App Factory (100+ Apps)",
    description: "Rapidly developed and deployed over 100 custom web applications for global clients using Google AI Studio and Base64. Managed the entire lifecycle from 'vibe coding' to containerized deployment via Docker and Portainer.",
    tags: ["Google AI Studio", "Base64", "Docker", "Portainer", "Vibe Coding"],
  },
  {
    title: "Meshtastic LoRa Mesh Networks",
    description: "Architecting long-range, off-grid mesh networks using Meshtastic and LoRa technology. Implemented robust solutions for outdoor applications, precision farming, and agriculture monitoring.",
    tags: ["Meshtastic", "LoRa", "IoT", "Farming", "Agriculture"],
    logo: "https://meshtastic.org/img/logo.svg"
  },
  {
    title: "Enterprise Proxmox & K8s Cluster",
    description: "Designed and deployed a high-availability Proxmox VE cluster hosting multiple Kubernetes nodes. Optimized for running containerized AI workloads and automated backup systems.",
    tags: ["Proxmox", "Kubernetes", "Docker", "Ceph", "Terraform"],
  },
];

export type Repo = {
  name: string;
  description: string;
  url: string;
  /** Present only for projects that are actually deployed and reachable. */
  liveUrl?: string;
  language: string;
};

export const GITHUB_REPOS: Repo[] = [
  {
    name: "dococr-agent",
    description: "Multi-user RAG over your own documents, with cited answers and a self-hosted OCR pipeline.",
    url: "https://github.com/Ferns1992/dococr-agent",
    liveUrl: "https://dococr.sysitadmin.com",
    language: "Python",
  },
  {
    name: "driver-ledger-ph",
    description: "Fuel consumption and cost tracker built for Philippine delivery fleets. Offline-first, nightly backups.",
    url: "https://github.com/Ferns1992/driver-ledger-ph",
    liveUrl: "https://driverledger.sysitadmin.com",
    language: "HTML",
  },
  {
    name: "auth-app",
    description: "Dockerized authentication gateway for self-hosted services. Single sign-on across a private stack.",
    url: "https://github.com/Ferns1992/auth-app",
    language: "EJS",
  },
  {
    name: "modernerp",
    description: "Modern ERP and inventory management system covering stock, purchasing and supplier records.",
    url: "https://github.com/Ferns1992/modernerp",
    language: "TypeScript",
  },
  {
    name: "nexus-dashboard",
    description: "Self-hosted link dashboard for the services running across my home lab and VPS fleet.",
    url: "https://github.com/Ferns1992/nexus-dashboard",
    liveUrl: "https://nexus.sysitadmin.com",
    language: "TypeScript",
  },
  {
    name: "ledgerflow",
    description: "Financial ledger and accounting flow system with double-entry bookkeeping and reporting.",
    url: "https://github.com/Ferns1992/ledgerflow",
    language: "TypeScript",
  },
  {
    name: "markitdown-app",
    description: "Converts PDFs, documents and spreadsheets into clean, LLM-ready Markdown.",
    url: "https://github.com/Ferns1992/markitdown-app",
    language: "HTML",
  },
  {
    name: "8-BIT-Racer",
    description: "Retro arcade racer built with canvas rendering and a hand-rolled physics loop.",
    url: "https://github.com/Ferns1992/8-BIT-Racer",
    language: "TypeScript",
  },
  {
    name: "skymount-resort-tanay",
    description: "Booking website for a resort in Tanay, Rizal, with availability and reservation handling.",
    url: "https://github.com/Ferns1992/skymount-resort-tanay",
    language: "HTML",
  },
];

export const TECH_BADGES = [
  "React", "TypeScript", "Vite", "Tailwind", "Node.js", "Docker",
  "Kubernetes", "Proxmox", "AI/ML", "n8n", "PostgreSQL", "Redis",
  "Python", "FastAPI", "Cloudflare", "R2", "Meshtastic", "LoRa",
];

export const STATS = [
  { label: "Projects Built", value: "100+" },
  { label: "Years Experience", value: "11+" },
  { label: "Clients Worldwide", value: "50+" },
  { label: "AI Solutions", value: "40+" },
];

export type Insight = {
  title: string;
  excerpt: string;
  cover: string;
  /** Not published yet, so the card says so rather than implying it is live. */
  status: "draft";
};

export const BLOG_POSTS: Insight[] = [
  {
    title: "The Future of Self-Hosted AI",
    excerpt: "Why running your own LLMs locally is becoming the standard for privacy-conscious engineers.",
    cover: "/insights/self-hosted-ai.webp",
    status: "draft",
  },
  {
    title: "Mastering n8n for Enterprise Automation",
    excerpt: "How I used n8n to streamline IT infrastructure management across multiple restaurant chains.",
    cover: "/insights/n8n-automation.webp",
    status: "draft",
  },
  {
    title: "IoT in the Wild: ESP32 and LoRa",
    excerpt: "Exploring long-range communication for remote monitoring systems.",
    cover: "/insights/esp32-lora.webp",
    status: "draft",
  },
];

export type Video = {
  title: string;
  /** One line of context, shown under the title. */
  summary: string;
  thumbnail: string;
  url: string;
  platform: string;
  /** Present only where the project is actually deployed. */
  projectUrl?: string;
  repoUrl?: string;
};

export const VIDEOS: Video[] = [
  {
    title: "Modern ERP",
    summary: "Full ERP and inventory management covering stock, purchasing and suppliers.",
    thumbnail: "/videos/video-1.webp",
    url: "https://www.facebook.com/share/v/1K2vR5pTa1/",
    platform: "facebook",
    projectUrl: "https://modernerp.sysitadmin.com/",
    repoUrl: "https://github.com/Ferns1992/modernerp",
  },
  {
    title: "Chhoto URL",
    summary: "Self-hosted URL shortener, deployed with Docker Compose.",
    thumbnail: "/videos/video-2.webp",
    url: "https://www.facebook.com/share/v/1EFRVk5cQc/",
    platform: "facebook",
    repoUrl: "https://github.com/Ferns1992/chhoto-url",

  },
  {
    title: "Vaultwarden",
    summary: "Self-hosted Bitwarden-compatible password manager on Docker Compose.",
    thumbnail: "/videos/video-3.webp",
    url: "https://www.facebook.com/share/v/1BgWUSWDTF/",
    platform: "facebook",
    repoUrl: "https://github.com/Ferns1992/vaultwarden",
  },
  {
    title: "Baserow",
    summary: "Self-hosted Baserow, an open-source no-code database platform.",
    thumbnail: "/videos/video-4.webp",
    url: "https://www.facebook.com/share/v/18QV5eCze1/",
    platform: "facebook",
    repoUrl: "https://github.com/Ferns1992/baserow",
  },
];


export type App = {
  name: string;
  /** One line, factual, no marketing adjectives. */
  blurb: string;
  url: string;
  icon: AppIconKey;
  /** Which subdomain / stack this runs on, shown as a small detail line. */
  detail: string;
  /** Generated schematic artwork, see scripts/gen-insight-covers.mjs. */
  art: string;
};

/**
 * Live deployments. Every URL here was checked reachable before being added.
 *
 * `detail` is factual infrastructure, not a feature claim: three of these are
 * auth-gated, which is why the cards link out rather than embedding anything.
 */
/** Icon keys resolved in App.tsx against this map. */
export const APP_ICONS = {
  Radar: "Radar",
  Boxes: "Boxes",
  Fuel: "Fuel",
  ScanText: "ScanText",
  Calculator: "Calculator",
  LayoutGrid: "LayoutGrid",
  TerminalSquare: "TerminalSquare",
  Youtube: "Youtube",
} as const;

export type AppIconKey = keyof typeof APP_ICONS;

export const APPS: App[] = [
  {
    name: "Fleet GPS",
    blurb: "Live vehicle tracking and fleet position monitoring.",
    url: "https://fleetgps.sysitadmin.com/",
    icon: "Radar",
    detail: "fleetgps.sysitadmin.com",
    art: "/apps/fleet-gps.webp",
  },
  {
    name: "Modern ERP",
    blurb: "Inventory, checkout, kitchen display and reporting for small business.",
    url: "https://modernerp.sysitadmin.com/",
    icon: "Boxes",
    detail: "modernerp.sysitadmin.com",
    art: "/apps/modern-erp.webp",
  },
  {
    name: "Driver Ledger",
    blurb: "Fuel consumption and cost tracking built for Philippine delivery fleets.",
    url: "https://driverledger.sysitadmin.com/",
    icon: "Fuel",
    detail: "driverledger.sysitadmin.com",
    art: "/apps/driver-ledger.webp",
  },
  {
    name: "DocChat",
    blurb: "Retrieval-augmented chat over your own documents, with a self-hosted OCR pipeline.",
    url: "https://dococr.sysitadmin.com/",
    icon: "ScanText",
    detail: "Auth-gated",
    art: "/apps/docchat.webp",
  },
  {
    name: "LedgerFlow",
    blurb: "Double-entry accounting, asset tracking and purchase records.",
    url: "https://ledgerflow.sysitadmin.com/",
    icon: "Calculator",
    detail: "ledgerflow.sysitadmin.com",
    art: "/apps/ledgerflow.webp",
  },
  {
    name: "Nexus Dashboard",
    blurb: "Self-hosted dashboard for the services you run.",
    url: "https://nexus.sysitadmin.com/",
    icon: "LayoutGrid",
    detail: "nexus.sysitadmin.com",
    art: "/apps/nexus.webp",
  },
  {
    name: "Terminal Hub",
    blurb: "Web-based access point for terminal and shell sessions.",
    url: "https://terminal.sysitadmin.com/",
    icon: "TerminalSquare",
    detail: "Auth-gated",
    art: "/apps/terminal-hub.webp",
  },
  {
    name: "Video Auto Poster",
    blurb: "Automated YouTube publishing pipeline with scheduling.",
    url: "https://ytposter.sysitadmin.com/",
    icon: "Youtube",
    detail: "Auth-gated",
    art: "/apps/ytposter.webp",
  },
];
