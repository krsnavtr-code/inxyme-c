"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaArrowRight,
  FaGithub,
  FaFileAlt,
  FaMoneyBillWave,
  FaLaptopCode,
  FaGlobe,
  FaUserTie,
  FaMicrophoneAlt,
  FaComments,
  FaBuilding,
  FaServer,
  FaCertificate,
  FaChartLine,
  FaStar,
  FaShieldAlt,
  FaLock,
  FaPhoneAlt,
  FaWhatsapp,
  FaGraduationCap,
  FaCodeBranch,
  FaCheck,
  FaTimes,
  FaLightbulb,
  FaAward,
  FaHandshake,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import SEO from "../components/SEO";

// Core 12 Value Pillars that guarantee student transformation and admission conversion
interface BenefitPillar {
  id: string;
  category: "portfolio" | "experience" | "interview" | "placement";
  number: string;
  title: string;
  tagline: string;
  highlightBadge: string;
  description: string;
  deliverables: string[];
  studentImpact: string;
  icon: React.ElementType;
  accentColor: {
    gradient: string;
    bgLight: string;
    text: string;
    border: string;
    badgeBg: string;
    glow: string;
  };
}

const BENEFIT_PILLARS: BenefitPillar[] = [
  {
    id: "resume-building",
    category: "portfolio",
    number: "01",
    title: "ATS-Compliant Resume Engineering",
    tagline: "Crafted by Tech Hiring Managers to Pass 98%+ Recruiter Filters",
    highlightBadge: "98% ATS Pass Score",
    description:
      "Most generic resumes get rejected within 6 seconds by automated Applicant Tracking Systems (ATS). Our expert career coaches rebuild your resume from scratch, optimizing technical keyword density, quantifying production impact metrics, and highlighting enterprise tech stacks so recruiters actively invite you to interview.",
    deliverables: [
      "1-on-1 resume revamp sessions with senior tech hiring managers",
      "Strict compliance with Workday, Greenhouse, and Taleo ATS algorithms",
      "Impact-driven bullet points with quantified business metrics (X% latency reduction, Y scale)",
      "Role-tailored versions for SAP, Full Stack, Cloud DevOps, and Data/AI tracks",
    ],
    studentImpact: "4x increase in initial recruiter interview callbacks within 14 days of launch.",
    icon: FaFileAlt,
    accentColor: {
      gradient: "from-blue-600 via-indigo-600 to-sky-600",
      bgLight: "bg-blue-50/80 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
      glow: "shadow-blue-500/10",
    },
  },
  {
    id: "github-profile",
    category: "portfolio",
    number: "02",
    title: "Professional GitHub Profile & Code Architecture",
    tagline: "Turn Your Repository Heatmap into an Irrefutable Proof of Mastery",
    highlightBadge: "Active Green Commit Heatmap",
    description:
      "Recruiters and engineering leads look at your GitHub before they ever schedule a technical round. We guide you in engineering an impressive open-source profile with an unbroken green contribution graph, modular production-grade repositories, verified pull requests, and automated README dashboards.",
    deliverables: [
      "Consistent 90-day structured commit strategy to display genuine problem-solving stamina",
      "Production-grade repo structuring (Dockerfiles, unit tests, GitHub Actions CI/CD workflows)",
      "Dynamic Markdown profile README with live metrics, skill badges, and architecture diagrams",
      "Real open-source PR contributions merged into recognized community repositories",
    ],
    studentImpact: "Engineering leads verify your code quality and branch discipline before asking a single question.",
    icon: FaGithub,
    accentColor: {
      gradient: "from-slate-900 via-emerald-800 to-slate-900",
      bgLight: "bg-emerald-50/80 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
      glow: "shadow-emerald-500/10",
    },
  },
  {
    id: "paid-freelance",
    category: "experience",
    number: "03",
    title: "Guaranteed Paid Freelance Client Projects",
    tagline: "Earn Real Compensation & Gain Commercial Work Proof While Learning",
    highlightBadge: "Earn While You Learn • Direct Payout",
    description:
      "Why wait until after graduation to get paid? Inxyme's internal software agency and enterprise partner network assign real commercial freelance briefs directly to eligible students. You write client code, meet real milestone deadlines, receive authentic client reviews, and get paid real financial compensation.",
    deliverables: [
      "Real commercial client briefs assigned directly by Inxyme's internal digital agency",
      "Direct milestone-based stipends & financial payouts credited to your account",
      "Authentic client communication, sprint agreements, deliverables, and sign-offs",
      "Legitimate freelance experience you can proudly list as paid work on LinkedIn & resumes",
    ],
    studentImpact: "Students recover their course fees through paid client projects before finishing their training.",
    icon: FaMoneyBillWave,
    accentColor: {
      gradient: "from-amber-600 via-emerald-600 to-teal-700",
      bgLight: "bg-amber-50/80 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
      glow: "shadow-amber-500/10",
    },
  },
  {
    id: "industrial-projects",
    category: "experience",
    number: "04",
    title: "Production-Grade Industrial Projects (Agile Team Environment)",
    tagline: "Work Exact Corporate Workflows with Multi-Developer Git Collaboration",
    highlightBadge: "Enterprise S/4HANA & Cloud Microservices",
    description:
      "Say goodbye to toy todo-lists and calculator apps. At Inxyme, you work on complex industrial-scale solutions following authentic agile sprint cycles: daily standups, Jira task boards, multi-developer Git branches, rigorous code reviews, automated tests, and live production deployments.",
    deliverables: [
      "Enterprise-scale architecture: SAP ERP integration, AI workflows, distributed microservices",
      "Agile team simulation: 2-week sprints, sprint planning, Jira boards, and retro demos",
      "Multi-contributor Git workflow: feature branches, PR reviews, merge conflict resolutions",
      "Automated testing & containerized CI/CD pipeline deployments on live cloud infrastructure",
    ],
    studentImpact: "Zero 'fresher anxiety'—walk into day one of your job already knowing corporate enterprise workflows.",
    icon: FaLaptopCode,
    accentColor: {
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      bgLight: "bg-indigo-50/80 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
      badgeBg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
      glow: "shadow-indigo-500/10",
    },
  },
  {
    id: "portfolio-website",
    category: "portfolio",
    number: "05",
    title: "Personal Portfolio Website with Live GitHub Matrix",
    tagline: "A Fast, Modern Custom Showcase Domain that Makes Recruiters Say WOW",
    highlightBadge: "Live Deployed Custom Showcase",
    description:
      "Having a hosted, interactive web portfolio sets you in the top 1% of applicants. We guide you to design and deploy a personal portfolio website featuring your bio, interactive project demos, architectural case studies, and a real-time synchronized GitHub commit matrix.",
    deliverables: [
      "Custom responsive design with sleek dark mode, glassmorphism, and micro-interactions",
      "Live embedded project previews with working URLs, architecture diagrams, and tech tags",
      "Synchronized real-time GitHub activity graph embedded directly into your profile",
      "One-click recruiter contact, verified digital credential download, and schedule link",
    ],
    studentImpact: "A single portfolio link replaces long email explanations and instantly commands respect.",
    icon: FaGlobe,
    accentColor: {
      gradient: "from-cyan-600 via-sky-600 to-blue-700",
      bgLight: "bg-cyan-50/80 dark:bg-cyan-950/40",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-800",
      badgeBg: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
      glow: "shadow-cyan-500/10",
    },
  },
  {
    id: "personality-dev",
    category: "experience",
    number: "06",
    title: "Executive Personality Development & Corporate Soft Skills",
    tagline: "Master Executive Communication, Corporate Poise, and Leadership Presence",
    highlightBadge: "Executive Poise & Leadership",
    description:
      "Technical knowledge gets you the interview; corporate communication and emotional intelligence win you the high-paying offer. Our executive coaches train you in business communication, cross-functional collaboration, overcoming interview nervousness, executive storytelling, and meeting etiquette.",
    deliverables: [
      "Mastery of the STAR methodology (Situation, Task, Action, Result) for behavioral rounds",
      "Overcoming stage fright, voice modulation, confident body language, and video call poise",
      "Executive email writing, Slack communication, and technical sprint presentation drills",
      "Cross-functional collaboration techniques to converse smoothly with managers and clients",
    ],
    studentImpact: "Speak with the confidence, clarity, and authority of a seasoned 3-year enterprise professional.",
    icon: FaUserTie,
    accentColor: {
      gradient: "from-purple-600 via-violet-600 to-indigo-700",
      bgLight: "bg-purple-50/80 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
      glow: "shadow-purple-500/10",
    },
  },
  {
    id: "interview-practice",
    category: "interview",
    number: "07",
    title: "Unlimited Interview Practice (Jab Tak Aap Perfect Na Ho Jao)",
    tagline: "Zero Limits on Technical Drill Sessions Until You Are 100% Bulletproof",
    highlightBadge: "Unlimited Sessions • No Extra Fee",
    description:
      "Unlike other academies that limit you to 2 or 3 mock sessions, Inxyme provides UNLIMITED interview practice. We drill you repeatedly on coding sandboxes, database optimization, live debugging, and system architecture until solving tough interview challenges feels second nature.",
    deliverables: [
      "Zero cap on practice frequency: attend sessions every week until your offer letter arrives",
      "Live live-coding drills on shared IDE sandboxes with real-time mentor code review",
      "Targeted technical drilling on high-frequency questions for SAP, Full Stack, Cloud, and AI",
      "Deep algorithmic and system design whiteboarding to master scalable problem solving",
    ],
    studentImpact: "Total elimination of interview panic. Walk into high-stakes interviews completely relaxed.",
    icon: FaMicrophoneAlt,
    accentColor: {
      gradient: "from-rose-600 via-red-600 to-orange-600",
      bgLight: "bg-rose-50/80 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
      glow: "shadow-rose-500/10",
    },
  },
  {
    id: "mock-interviews",
    category: "interview",
    number: "08",
    title: "Repetitive 1-on-1 Mock Interviews with Industry Leads",
    tagline: "Exhaustive Diagnostic Feedback from Real Tech Leads & Hiring Directors",
    highlightBadge: "1-on-1 Detailed Diagnostic Scorecard",
    description:
      "Our mock interviews are conducted by seasoned technical leads and managers currently working at top MNCs and high-growth product companies. After every session, you receive a granular diagnostic rubric scoring your problem solving, code efficiency, communication, and system design, accompanied by targeted fixes.",
    deliverables: [
      "Rigorous 45-to-60 minute 1-on-1 technical and managerial simulated rounds",
      "Granular scorecard grading 8 distinct performance vectors with video playback analysis",
      "Actionable 48-hour improvement assignments targeting your identified weak spots",
      "Direct insider tips on what hiring committees look for during offer decision meetings",
    ],
    studentImpact: "Learn from your mistakes in safe mock sessions so your real company interviews are flawless.",
    icon: FaComments,
    accentColor: {
      gradient: "from-teal-600 via-emerald-600 to-green-700",
      bgLight: "bg-teal-50/80 dark:bg-teal-950/40",
      text: "text-teal-600 dark:text-teal-400",
      border: "border-teal-200 dark:border-teal-800",
      badgeBg: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
      glow: "shadow-teal-500/10",
    },
  },
  {
    id: "company-referrals",
    category: "placement",
    number: "09",
    title: "Direct Placement Referrals to 500+ Top Companies",
    tagline: "Skip the Automated Resume Black Hole via Direct HR & Alumni Employee Referrals",
    highlightBadge: "500+ Corporate Hiring Ties",
    description:
      "Applying blindly on job portals leads to weeks of silence. Inxyme bridges you directly into top product firms, consulting powerhouses, and global IT leaders through our dedicated corporate placement cell and thriving alumni referral network.",
    deliverables: [
      "Direct profile forwarding to hiring HR managers and verified internal recruiters",
      "Exclusive internal placement drives hosted regularly for Inxyme certified graduates",
      "Employee referrals from alumni working at Google, Microsoft, Amazon, Infosys, and TCS",
      "Dedicated placement coordinator matching your exact skillset to high-probability openings",
    ],
    studentImpact: "Your resume lands directly on the hiring manager's desk, bypassing public job board queues.",
    icon: FaBuilding,
    accentColor: {
      gradient: "from-blue-700 via-indigo-700 to-slate-900",
      bgLight: "bg-blue-50/80 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
      glow: "shadow-blue-500/10",
    },
  },
  {
    id: "cloud-sandboxes",
    category: "experience",
    number: "10",
    title: "24/7 Dedicated Cloud & ERP Sandboxes",
    tagline: "Browser-Based Enterprise Virtual Labs with Zero Local Setup Friction",
    highlightBadge: "24/7 High-Availability Lab",
    description:
      "Never worry if your personal laptop has enough RAM or storage. Inxyme grants you instant 24/7 access to high-performance cloud environments pre-configured with SAP S/4HANA GUI, AWS Cloud Sandbox, Linux dev servers, Docker containers, and live data pipelines.",
    deliverables: [
      "Instant browser-based terminal & enterprise GUI access with zero local setup headaches",
      "Pre-loaded with live enterprise data sets, real ERP schemas, and industrial API keys",
      "Dedicated compute resources ensuring fast compilation and uninterrupted learning",
      "Safe experimentation environment where you can break, debug, and rebuild systems freely",
    ],
    studentImpact: "Students learn on the exact high-spec cloud infrastructure used by Fortune 500 engineering teams.",
    icon: FaServer,
    accentColor: {
      gradient: "from-sky-600 via-blue-600 to-indigo-700",
      bgLight: "bg-sky-50/80 dark:bg-sky-950/40",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-200 dark:border-sky-800",
      badgeBg: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
      glow: "shadow-sky-500/10",
    },
  },
  {
    id: "verifiable-cert",
    category: "portfolio",
    number: "11",
    title: "Globally Verifiable ISO Certification & QR Credentials",
    tagline: "Industry-Recognized Credentials with Instant Recruiter Verification",
    highlightBadge: "ISO 9001:2015 Accredited",
    description:
      "Receive an authentic, tamper-proof certification backed by Inxyme's Bharat Business Award-recognized institution. Each certificate includes a unique cryptographic verification QR code that recruiters, background check agencies, and LinkedIn visitors can validate in a single click.",
    deliverables: [
      "Cryptographically signed digital certificate with unique credential ID and verification QR",
      "One-click LinkedIn certification badge integration to enhance your profile visibility",
      "Formal academic transcript detailing completed industrial modules, capstones, and ratings",
      "Backed by recognized educational accreditations and corporate advisory boards",
    ],
    studentImpact: "Instantly satisfy corporate verification requirements and showcase authenticated expertise.",
    icon: FaCertificate,
    accentColor: {
      gradient: "from-amber-500 via-orange-500 to-yellow-600",
      bgLight: "bg-amber-50/80 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
      glow: "shadow-amber-500/10",
    },
  },
  {
    id: "salary-negotiation",
    category: "placement",
    number: "12",
    title: "High-Stakes Salary Negotiation Coaching",
    tagline: "Maximize Your Compensation: Secure 50% to 150%+ Salary Hikes",
    highlightBadge: "Average 120% Salary Hike",
    description:
      "Never accept the first offer on the table. Our compensation advisors equip you with strategic counter-offer scripts, market benchmarking data, and negotiation techniques to command top-tier base pay, signing bonuses, and accelerated appraisal cycles.",
    deliverables: [
      "Access to internal salary databases and accurate market comp bands for your target role",
      "Step-by-step counter-offer email templates and telephone scripts for HR discussions",
      "Guidance on negotiating joining bonuses, ESOPs, remote flexibility, and relocation benefits",
      "Multi-offer leverage tactics to spark competitive bidding between competing recruiters",
    ],
    studentImpact: "Our students routinely secure ₹3 Lakhs to ₹10 Lakhs higher annual CTC compared to their initial offers.",
    icon: FaChartLine,
    accentColor: {
      gradient: "from-emerald-600 via-teal-600 to-blue-700",
      bgLight: "bg-emerald-50/80 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
      glow: "shadow-emerald-500/10",
    },
  },
];

// Comparison Matrix Data
const COMPARISON_ROWS = [
  {
    feature: "Paid Freelance Client Work with Real Payout",
    inxyme: "Guaranteed Commercial Briefs & Direct Stipends",
    traditional: "Never (Only academic theory or uncompensated unpaid work)",
    isHighlight: true,
  },
  {
    feature: "Interview Practice Cap",
    inxyme: "UNLIMITED sessions until you land an offer",
    traditional: "Strictly limited to 2 or 3 basic mock sessions",
    isHighlight: true,
  },
  {
    feature: "Industrial Project Architecture",
    inxyme: "Real Multi-Developer Git, Agile Sprints, Live CI/CD",
    traditional: "Simple copy-pasted tutorial clones from YouTube",
    isHighlight: true,
  },
  {
    feature: "GitHub Profile & Activity Graph",
    inxyme: "Engineered 90-day green commit matrix & PR reviews",
    traditional: "Unmaintained repositories with zero documentation",
    isHighlight: false,
  },
  {
    feature: "Personal Live Hosted Portfolio",
    inxyme: "Custom responsive site with live GitHub graph",
    traditional: "Students left to figure it out alone",
    isHighlight: false,
  },
  {
    feature: "ATS-Compliant Resume Engineering",
    inxyme: "Tailored 1-on-1 by tech hiring managers (98% score)",
    traditional: "Generic downloadable templates with zero audit",
    isHighlight: false,
  },
  {
    feature: "Top Company Placement Referrals",
    inxyme: "Direct HR pipelines & 500+ corporate partner ties",
    traditional: "Blind job links forwarded from LinkedIn",
    isHighlight: true,
  },
  {
    feature: "Cloud & ERP Virtual Sandboxes",
    inxyme: "24/7 dedicated high-spec cloud & SAP S/4HANA access",
    traditional: "Heavy local installations that crash student laptops",
    isHighlight: false,
  },
  {
    feature: "Salary Negotiation Coaching",
    inxyme: "Dedicated advisors securing 50%-150% hikes",
    traditional: "Pressure students to take any lowball offer",
    isHighlight: true,
  },
];

const HIRING_PARTNERS = [
  { name: "Google", logo: "/images/Company logos/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "/images/Company logos/Microsoft_logo.svg" },
  { name: "Amazon", logo: "/images/Company logos/amazon-icon.svg" },
  { name: "Meta", logo: "/images/Company logos/Meta_Platforms_logo.svg" },
  { name: "Netflix", logo: "/images/Company logos/Netflix_icon.svg" },
  { name: "Infosys", logo: "/images/Company logos/Infosys_logo.svg" },
  { name: "TCS", logo: "/images/Company logos/Tata_Consultancy_Services_old_logo.svg" },
  { name: "Wipro", logo: "/images/Company logos/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "Zomato", logo: "/images/Company logos/Zomato_Logo.svg" },
  { name: "Flipkart", logo: "/images/Company logos/flipkart-icon.svg" },
  { name: "HCL Tech", logo: "/images/Company logos/hcltech-1.svg" },
  { name: "Mahindra", logo: "/images/Company logos/mahindra-mahindra-logo.svg" },
];

export default function WhyInxymePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePillarTab, setActivePillarTab] = useState<string>("resume-building");
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [counselingFormData, setCounselingFormData] = useState({
    name: "",
    phone: "",
    email: "",
    targetTrack: "SAP ERP Solutions",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredPillars =
    activeCategory === "all"
      ? BENEFIT_PILLARS
      : BENEFIT_PILLARS.filter((p) => p.category === activeCategory);

  const selectedPillar =
    BENEFIT_PILLARS.find((p) => p.id === activePillarTab) || BENEFIT_PILLARS[0];

  const handleCounselingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsCounselingModalOpen(false);
      setCounselingFormData({
        name: "",
        phone: "",
        email: "",
        targetTrack: "SAP ERP Solutions",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="Why Inxyme | Complete Career Advantage & Student Benefits"
        description="Discover why students choose Inxyme: Paid freelance client work, ATS resume engineering, GitHub profiling, industrial team projects, unlimited mock interviews, and 500+ direct company placement referrals."
        keywords="Why Inxyme, Inxyme benefits, career launchpad, paid freelance projects, resume building, mock interviews, placement referrals, SAP training advantage, tech career switch"
        robots="index, follow"
      />

      {/* --- HERO HEADER --- */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 text-slate-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 dark:border-slate-800">
        <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-100/70 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-100/70 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center space-y-5">
          {/* Top Authority Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-black tracking-wide shadow-2xs">
            <FaAward className="text-amber-500 text-sm" />
            <span>The Complete Inxyme Career Ecosystem • 100% Placement Assurance</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            We Don&apos;t Just Teach Courses. <br className="hidden sm:inline" />
            We Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
              Unstoppable Career.
            </span>
          </h1>

          {/* Core Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            From <span className="font-bold text-slate-900 dark:text-white">ATS-cleared Resumes</span> and{" "}
            <span className="font-bold text-slate-900 dark:text-white">GitHub green streak profiling</span>, to{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Paid Freelance Client Projects</span>,{" "}
            <span className="font-bold text-slate-900 dark:text-white">Unlimited Mock Interviews</span>, and{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">Direct Referrals to 500+ Top Firms</span>—here is everything Inxyme equips you with to guarantee your dream offer letter.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-3">
            <button
              onClick={() => setIsCounselingModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Book Free 1-on-1 Career Strategy Session</span>
              <FaArrowRight className="text-xs" />
            </button>
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm rounded-2xl border border-slate-300 dark:border-slate-700 transition-all shadow-xs"
            >
              <span>Explore Certified Programs</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-500">₹25,000+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                Paid Client Stipends
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                UNLIMITED
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                Mock Interview Sessions
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                500+
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                Hiring Partner Referrals
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                120%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                Avg. Salary Hike
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN BENEFIT PILLARS SECTION --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Category Filter Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              The 12 Inxyme Career Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Every single advantage included in your enrollment—zero hidden costs.
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
            {[
              { id: "all", label: "All 12 Pillars" },
              { id: "portfolio", label: "Portfolio & GitHub" },
              { id: "experience", label: "Paid Projects & Labs" },
              { id: "interview", label: "Mock & Practice" },
              { id: "placement", label: "Placement & Salary" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID OF ALL PILLARS WITH DEEP BREAKDOWNS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className={`relative bg-white dark:bg-slate-900 rounded-3xl border ${pillar.accentColor.border} p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl ${pillar.accentColor.glow} transition-all duration-300 group hover:-translate-y-1 overflow-hidden`}
              >
                {/* Decorative corner number */}
                <div className="absolute top-4 right-6 font-mono text-4xl sm:text-5xl font-black text-slate-100 dark:text-slate-800 select-none pointer-events-none group-hover:scale-105 transition-transform">
                  {pillar.number}
                </div>

                <div className="space-y-5 relative z-10">
                  {/* Top Badge & Icon Row */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${pillar.accentColor.bgLight} ${pillar.accentColor.text} flex items-center justify-center text-2xl shadow-inner border border-current/15 shrink-0`}
                    >
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${pillar.accentColor.badgeBg} mb-1`}
                      >
                        {pillar.highlightBadge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  {/* Catchy Tagline */}
                  <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{pillar.tagline}</span>
                  </div>

                  {/* Comprehensive Explanation */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.description}
                  </p>

                  {/* Actionable Deliverables List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      What Inxyme Delivers To You:
                    </span>
                    <ul className="space-y-2">
                      {pillar.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <FaCheck className="text-emerald-500 text-xs shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Impact Banner */}
                <div className="relative z-10 mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs bg-gradient-to-r from-slate-50 to-white dark:from-slate-850 dark:to-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">🚀</span>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Outcome: </span>
                      {pillar.studentImpact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- DEEP DIVE INTERACTIVE SPOTLIGHT (PAID PROJECTS & GITHUB MATRIX) --- */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative border border-blue-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black tracking-wider uppercase border border-blue-400/30">
                Exclusive Student Advantage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Two Game-Changers No Other Academy Offers
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                Most bootcamps leave you with dummy code and empty pockets. Here is how Inxyme guarantees you graduate with real commercial income and an active, verified developer footprint.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature A: Paid Client Projects Breakdown */}
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">Paid Client Projects</h4>
                      <p className="text-[11px] text-emerald-300 font-semibold">Earn ₹15,000 to ₹35,000+ while training</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    Verified Payout
                  </span>
                </div>

                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Inxyme operates an active enterprise technology consulting arm. We route real freelance deliverables to qualifying learners. You write client code, receive milestone payments directly, and list legitimate commercial experience on your resume.
                </p>

                {/* Simulated Payout Slip */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/30 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>DISBURSEMENT: INX-CLIENT-8492</span>
                    <span className="text-emerald-400 font-bold">STATUS: CREDITED ✓</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>Milestone 2: ERP S/4HANA Workflow</span>
                    <span className="text-emerald-400">₹24,500.00</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Recipient: Inxyme Enrolled Scholar • Direct Bank NEFT
                  </div>
                </div>
              </div>

              {/* Feature B: Real-Time GitHub Activity Matrix */}
              <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
                      <FaGithub />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">Engineered GitHub Profile</h4>
                      <p className="text-[11px] text-purple-300 font-semibold">Real Green Commit Matrix &amp; Open Source PRs</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                    Recruiter Approved
                  </span>
                </div>

                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Recruiters hate inactive profiles. We hold you accountable with daily micro-deliverables, building an unbroken 90-day green contribution graph, production Dockerfiles, clean commit messages, and automated CI/CD pipelines.
                </p>

                {/* Simulated GitHub Heatmap */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>542 contributions in the last year</span>
                    <span className="text-emerald-400 font-bold">Consistent Activity</span>
                  </div>
                  {/* Grid of green tiles */}
                  <div className="grid grid-cols-16 gap-1 pt-1">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const shades = [
                        "bg-emerald-950",
                        "bg-emerald-700",
                        "bg-emerald-500",
                        "bg-emerald-400",
                      ];
                      const shade = shades[(i * 7 + 3) % shades.length];
                      return <div key={i} className={`h-2.5 rounded-xs ${shade}`} />;
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-xs bg-emerald-950" />
                      <div className="w-2 h-2 rounded-xs bg-emerald-700" />
                      <div className="w-2 h-2 rounded-xs bg-emerald-500" />
                      <div className="w-2 h-2 rounded-xs bg-emerald-400" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPARISON TABLE: TRADITIONAL ACADEMY VS INXYME --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black tracking-wide border border-blue-200 dark:border-blue-800">
              Clear Value Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Why Inxyme vs. Traditional Academies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              See side-by-side why our outcome-driven model achieves higher placement rates and record-breaking salary hikes.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                  <th className="py-4 px-5">Career Feature</th>
                  <th className="py-4 px-5 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-x border-blue-200/60 dark:border-blue-800/60">
                    The Inxyme Advantage
                  </th>
                  <th className="py-4 px-5 text-slate-500 dark:text-slate-400">
                    Standard Colleges / Basic EdTech
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      row.isHighlight ? "font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-5 bg-blue-50/40 dark:bg-blue-950/20 text-emerald-700 dark:text-emerald-400 font-bold border-x border-blue-200/60 dark:border-blue-800/60 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                      <span>{row.inxyme}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <FaTimes className="text-rose-400 shrink-0 text-xs" />
                      <span>{row.traditional}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- HIRING PARTNERS & DIRECT REFERRAL NETWORK --- */}
        <section className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6">
          <div className="space-y-2 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-black tracking-wider uppercase border border-blue-200 dark:border-blue-800">
              Corporate Recruitment Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Where Inxyme Graduates Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Our placement cell forwards student dossiers directly to talent acquisition leads and hiring managers across Fortune 500 enterprises and hyper-growth unicorns.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
            {HIRING_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-blue-400 transition-all group"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto max-w-[100px] object-contain group-hover:scale-105 transition-transform filter dark:brightness-125"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" />
              <span>Direct Alumni Employee Referrals</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" />
              <span>Dedicated Weekly Corporate Hiring Drives</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" />
              <span>Dedicated Profile Matching by Placement Officers</span>
            </span>
          </div>
        </section>

        {/* --- STUDENT ROADMAP: 5 STEPS FROM DAY 1 TO OFFER LETTER --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-wide border border-indigo-200 dark:border-indigo-800">
              The Execution Blueprint
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Your Journey: From Enrollment to Joining Letter
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              A predictable, time-tested roadmap engineered to eliminate doubts and fast-track high-paying offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: "01",
                title: "Foundational Immersion",
                desc: "Live classes + 24/7 cloud sandbox access to master core enterprise technologies.",
              },
              {
                step: "02",
                title: "Industrial Sprints",
                desc: "Work on multi-dev Git teams building real cloud microservices and SAP workflows.",
              },
              {
                step: "03",
                title: "Paid Freelance Briefs",
                desc: "Execute client milestones assigned by our agency and earn direct stipends.",
              },
              {
                step: "04",
                title: "Relentless Mock Drills",
                desc: "Unlimited 1-on-1 interview practice and STAR behavioral coaching with hiring leads.",
              },
              {
                step: "05",
                title: "Placement & Offers",
                desc: "Direct corporate referrals, fast-tracked interviews, and aggressive salary negotiation.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3 relative group hover:border-blue-400 transition-colors"
              >
                <div>
                  <span className="font-mono text-2xl font-black text-blue-600 dark:text-blue-400">
                    {s.step}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FaCheckCircle className="text-xs" />
                  <span>Guaranteed Milestone</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- BOTTOM CALL TO ACTION: ADMISSIONS CONVERSION BANNER --- */}
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300">
              <FaStar className="text-xs" />
              <span>Limited Enrollment Slots Per Batch for 1-on-1 Focus</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to Secure Your Career with Inxyme?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Don&apos;t leave your career transition to chance. Speak directly with a Senior Tech Career Advisor today and receive a personalized 1-on-1 career transition roadmap.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button
                onClick={() => setIsCounselingModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Book Free 1-on-1 Career Counselling</span>
                <FaArrowRight className="text-xs" />
              </button>

              <a
                href="https://wa.me/919990999561?text=Hi%20Inxyme%2C%20I%20want%20to%20know%20more%20about%20your%20student%20benefits%20and%20career%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
              >
                <FaWhatsapp className="text-base" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-blue-200/90 font-medium">
              <span>✓ 100% Free Consultation</span>
              <span>✓ No Obligation</span>
              <span>✓ Instant Callback</span>
            </div>
          </div>
        </section>
      </main>

      {/* --- COUNSELING BOOKING MODAL --- */}
      {isCounselingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsCounselingModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Counseling Session Confirmed!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  A Senior Inxyme Career Advisor will contact you within 2 hours to evaluate your background and map your placement plan.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    VIP Career Advisory
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Book Free 1-on-1 Career Strategy
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speak directly with a hiring expert to design your custom roadmap.
                  </p>
                </div>

                <form onSubmit={handleCounselingSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={counselingFormData.name}
                      onChange={(e) =>
                        setCounselingFormData({ ...counselingFormData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={counselingFormData.phone}
                      onChange={(e) =>
                        setCounselingFormData({ ...counselingFormData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={counselingFormData.email}
                      onChange={(e) =>
                        setCounselingFormData({ ...counselingFormData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Career Track
                    </label>
                    <select
                      value={counselingFormData.targetTrack}
                      onChange={(e) =>
                        setCounselingFormData({
                          ...counselingFormData,
                          targetTrack: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SAP ERP Solutions">SAP S/4HANA &amp; Enterprise ERP</option>
                      <option value="Full Stack & Cloud">Full Stack Development &amp; Cloud</option>
                      <option value="Generative AI & Data">AI, Machine Learning &amp; Data</option>
                      <option value="Career Switch (Non-IT to IT)">Non-IT to IT Career Switch</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                  >
                    Confirm My Free Strategy Session
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
