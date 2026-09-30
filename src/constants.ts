export const PERSONAL_INFO = {
  name: "Fabian Milton Fernandes",
  title: "IT & AI Engineer | Technical Project Manager",
  email: "admin@sysitadmin.com",
  linkedin: "https://linkedin.com/in/fabianfernandes1992",
  github: "https://github.com/Ferns1992",
  bioSite: "https://bio.site/fabianmiltonfernandes",
  bio: "I specialize in remote IT support, AI automation, and technical project management with over 14 years of experience. I am an expert in building self-hosted AI solutions, managing complex Proxmox VE environments, and orchestrating containerized workloads with Docker and Kubernetes. Over the past 4 years, I've 'vibe coded' and deployed over 100+ web applications using Google AI Studio and Base64 for a diverse global clientele.",
  location: "Based in Philippines",
};

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
    role: "IT Infrastructure Manager",
    company: "JASGROUP OF COMPANIES",
    period: "Jun 2015 - Present",
    description: "Leading digital transformation by setting up restaurant software (ORACLE MICROS RES), supporting chain restaurants, and managing Active Directory domain services. Specialized in deploying robust infrastructure for retail and hospitality.",
  },
  {
    role: "AI & DevOps Lead (Self-Initiated)",
    company: "Personal Lab / SysITAdmin",
    period: "2020 - Present",
    description: "Architecting self-hosted AI platforms. Implementing Proxmox clusters to host Docker and Kubernetes environments for high-availability AI services. Automated complex workflows using n8n and local LLMs.",
  },
  {
    role: "Full-Stack AI Developer (Freelance)",
    company: "Global Clients",
    period: "2020 - Present",
    description: "Developed and deployed 100+ web applications using Google AI Studio and Base64 encoding. Utilized 'vibe coding' for rapid development and containerized deployment via Docker and Portainer.",
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
  { label: "Years Experience", value: "14+" },
  { label: "Clients Worldwide", value: "50+" },
  { label: "AI Solutions", value: "40+" },
];

export const BLOG_POSTS = [
  {
    title: "The Future of Self-Hosted AI",
    date: "March 10, 2024",
    excerpt: "Why running your own LLMs locally is becoming the standard for privacy-conscious engineers.",
  },
  {
    title: "Mastering n8n for Enterprise Automation",
    date: "February 25, 2024",
    excerpt: "How I used n8n to streamline IT infrastructure management across multiple restaurant chains.",
  },
  {
    title: "IoT in the Wild: ESP32 and LoRa",
    date: "January 15, 2024",
    excerpt: "Exploring long-range communication for remote monitoring systems.",
  },
];

export const VIDEOS = [
  {
    title: "Video 1",
    thumbnail: "https://picsum.photos/seed/v1/600/400",
    url: "https://www.facebook.com/share/v/1K2vR5pTa1/",
    platform: "facebook",
  },
  {
    title: "Video 2",
    thumbnail: "https://picsum.photos/seed/v2/600/400",
    url: "https://www.facebook.com/share/v/1EFRVk5cQc/",
    platform: "facebook",
  },
  {
    title: "Video 3",
    thumbnail: "https://picsum.photos/seed/v3/600/400",
    url: "https://www.facebook.com/share/v/1BgWUSWDTF/",
    platform: "facebook",
  },
  {
    title: "Video 4",
    thumbnail: "https://picsum.photos/seed/v4/600/400",
    url: "https://www.facebook.com/share/v/18QV5eCze1/",
    platform: "facebook",
  },
];
