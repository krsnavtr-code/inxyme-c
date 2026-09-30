"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaExternalLinkAlt,
  FaSearch,
  FaNewspaper,
  FaBullhorn,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaGraduationCap,
  FaBuilding,
  FaAward,
  FaBriefcase,
  FaLaptopCode,
  FaShieldAlt,
  FaRegCalendarCheck,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { submitContactForm } from "../api/contactApi";
import SEO from "../components/SEO";

export interface NewsOrEvent {
  id: string;
  type: "masterclass" | "placement" | "press" | "announcement" | "archive";
  category: "upcoming" | "news" | "placement" | "past";
  title: string;
  description: string;
  fullContent?: string;
  date: string;
  time?: string;
  location?: string;
  mode?: "Live Interactive Webinar" | "Virtual Drive" | "Official Notice" | "On-Demand Recording";
  organizedBy: {
    name: string;
    division: string;
  };
  publisher?: string;
  image?: string;
  tag: string;
  featured?: boolean;
  registrationOpen?: boolean;
  externalLink?: string;
}

const professionalCuratedEvents: NewsOrEvent[] = [
  {
    id: "event-1",
    type: "masterclass",
    category: "upcoming",
    title: "Enterprise SAP S/4HANA & Cloud ERP: Architecture, Implementation & Career Roadmap",
    description:
      "A structured 90-minute technical masterclass exploring SAP S/4HANA migration pathways, real-time universal ledger configurations, and core career tracks in SAP FICO, MM, and SD.",
    fullContent:
      "Modern enterprises are transitioning their core business operations to SAP S/4HANA. In this intensive live session led by Inxyme's SAP Enterprise Faculty, learners and working professionals will gain clear visibility into:\n\n• S/4HANA architectural advantages over ECC 6.0.\n• Integration points across Finance (FICO) and Supply Chain (MM/SD).\n• In-demand functional vs. technical consultant competencies.\n• Practical roadmap to clearing SAP global certifications and consulting interviews.",
    date: "2026-10-18",
    time: "06:30 PM - 08:00 PM IST",
    location: "Live Interactive Session via Inxyme Live Portal",
    mode: "Live Interactive Webinar",
    organizedBy: {
      name: "Inxyme Enterprise Advisory Panel",
      division: "SAP Center of Excellence",
    },
    tag: "SAP ERP",
    featured: true,
    registrationOpen: true,
  },
  {
    id: "event-2",
    type: "placement",
    category: "placement",
    title: "Inxyme Mega Virtual Placement & Career Drive 2026",
    description:
      "Dedicated recruitment initiative connecting certified learners in Full Stack Web, Python, Data Analytics, and SAP domains with 40+ leading corporate hiring partners.",
    fullContent:
      "The Inxyme Corporate Relations Cell organizes this quarterly recruitment conclave to fast-track hiring for certified alumni and current cohort candidates:\n\n• Live interview scheduling with corporate HRs & technical panels.\n• Domain-specific interview rounds for Junior Developers, Data Analysts, and SAP Associate Consultants.\n• Spot conditional offer rollouts and personalized feedback sessions.\n• Comprehensive resume and project portfolio screening.",
    date: "2026-11-05",
    time: "10:00 AM - 05:00 PM IST",
    location: "Virtual Recruitment Portal",
    mode: "Virtual Drive",
    organizedBy: {
      name: "Corporate Relations Cell",
      division: "Inxyme Career & Placement Office",
    },
    tag: "Placement Drive",
    featured: true,
    registrationOpen: true,
  },
  {
    id: "event-3",
    type: "press",
    category: "news",
    title: "Inxyme Conferred with Bharat Business Award for Best Certification & Training Academy",
    description:
      "Honored by the Federation of Indian Education & Industry Councils for delivering industry-aligned practical upskilling and career development across tech sectors.",
    fullContent:
      "Inxyme has been officially conferred with the prestigious 'Bharat Business Award for Best Certification and Training Academy'.\n\nThis landmark recognition acknowledges Inxyme's relentless focus on:\n• Hands-on practical curriculum mapped to current corporate requirements.\n• High-accountability placement support delivering over 98% placement track record.\n• Verified digital credentials recognized by leading enterprise hiring partners across India.\n• Industry-grade cloud sandbox infrastructure provided to every registered learner.",
    date: "2025-09-30",
    publisher: "Federation of Indian Education & Industry Councils",
    image: "https://www.inxyme.com/api/upload/file/award-correction-2991.png",
    mode: "Official Notice",
    organizedBy: {
      name: "Office of Communications",
      division: "Inxyme Executive Directorate",
    },
    tag: "National Award",
    featured: false,
    registrationOpen: false,
    externalLink: "/awards-recognition",
  },
  {
    id: "event-4",
    type: "masterclass",
    category: "upcoming",
    title: "Engineering Enterprise Generative AI & Retrieval-Augmented Generation (RAG) Systems",
    description:
      "Hands-on architectural masterclass on developing scalable GenAI systems with Vector Databases, LangChain, semantic search, and secure LLM fine-tuning pipelines.",
    fullContent:
      "Enterprises are moving beyond simple API calls to building domain-specific, production-grade GenAI pipelines. In this masterclass, our senior AI mentors will cover:\n\n• Anatomy of an enterprise RAG architecture: ingestion, chunking, and embedding.\n• Vector database benchmarking (Pinecone, Qdrant, Milvus).\n• Preventing hallucinations with guardrails and structured evaluation frameworks.\n• Deploying cost-optimized multi-modal LLM applications to cloud environments.",
    date: "2026-10-25",
    time: "11:00 AM - 12:30 PM IST",
    location: "Interactive Online Lab Room",
    mode: "Live Interactive Webinar",
    organizedBy: {
      name: "AI & Data Science Faculty",
      division: "Inxyme Advanced Computing Wing",
    },
    tag: "Generative AI",
    featured: false,
    registrationOpen: true,
  },
  {
    id: "event-5",
    type: "announcement",
    category: "news",
    title: "Inxyme Expands Dedicated 24/7 Cloud Sandbox Infrastructure for Live Capstones",
    description:
      "Every enrolled student now receives instant, browser-based access to enterprise-configured Linux, AWS, Docker, and ERP environments with zero local installation hurdles.",
    fullContent:
      "To ensure zero friction during hands-on coding and enterprise ERP configurations, Inxyme has enhanced its virtual lab infrastructure:\n\n• High-availability sandbox instances with pre-configured developer tooling.\n• One-click access to real-time industrial project repositories and datasets.\n• Automated code evaluation and mentorship check-ins integrated into the student dashboard.\n• Eliminates system requirement barriers for students working on basic laptops.",
    date: "2026-08-20",
    mode: "Official Notice",
    organizedBy: {
      name: "Academic Technology Committee",
      division: "Digital Learning Infrastructure",
    },
    tag: "Platform Update",
    featured: false,
    registrationOpen: false,
  },
  {
    id: "event-6",
    type: "archive",
    category: "past",
    title: "Transitioning into High-Growth Tech Roles: Strategic Roadmap for Non-IT Professionals",
    description:
      "A comprehensive recorded session covering practical domain selection, proof-of-work project structuring, and clearing technical interviews without a CS degree.",
    fullContent:
      "Recorded session from our quarterly Career Transition Symposium. Topics covered:\n\n• High-demand sectors welcoming non-tech graduates (Data Analytics, SAP FICO, QA Automation).\n• How to showcase transferable domain experience alongside newly acquired tech skills.\n• Building Github repositories and project portfolios that command recruiter attention.\n• Step-by-step guidance on answering technical case studies in interviews.",
    date: "2026-06-15",
    time: "Recorded Masterclass Available",
    location: "On-Demand Resource Library",
    mode: "On-Demand Recording",
    organizedBy: {
      name: "Career Mentorship Network",
      division: "Student Success & Counselling",
    },
    tag: "Career Strategy",
    featured: false,
    registrationOpen: true,
  },
];

const categoryTabs = [
  { id: "all", label: "All Updates" },
  { id: "upcoming", label: "Live Masterclasses" },
  { id: "placement", label: "Placement Drives" },
  { id: "news", label: "Press & Announcements" },
  { id: "past", label: "Archived Sessions" },
];

export default function NewsAndEventsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<NewsOrEvent[]>(professionalCuratedEvents);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<NewsOrEvent | null>(null);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<NewsOrEvent | null>(null);
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Sync real media mentions from backend if available
  useEffect(() => {
    const fetchMediaMentions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/media-mentions", {
          params: { limit: 20 },
        });

        const mentions =
          response?.data?.data?.mentions || response?.data?.mentions || [];

        if (Array.isArray(mentions) && mentions.length > 0) {
          const formattedNews: NewsOrEvent[] = mentions.map((m: any) => ({
            id: m._id || m.slug,
            type: "press",
            category: "news",
            title: m.title,
            description: m.shortDescription || m.description || "",
            fullContent: m.shortDescription || m.description || "",
            date: m.publishedDate ? m.publishedDate.split("T")[0] : new Date().toISOString().split("T")[0],
            publisher: m.publisherName || "Official Press Release",
            image: m.mediaUpload || undefined,
            externalLink: m.externalLink || undefined,
            mode: "Official Notice",
            organizedBy: {
              name: m.publisherName || "Corporate Communications",
              division: "Official Press Desk",
            },
            tag: m.newsType === "press_release" ? "Press Release" : "Media Coverage",
            featured: Boolean(m.isFeatured),
            registrationOpen: false,
          }));

          setItems((prev) => {
            const existingTitles = new Set(
              formattedNews.map((n) => n.title.toLowerCase()),
            );
            const nonDuplicateCurated = professionalCuratedEvents.filter(
              (d) => !existingTitles.has(d.title.toLowerCase()),
            );
            return [...formattedNews, ...nonDuplicateCurated];
          });
        }
      } catch (err) {
        console.warn("Using curated institutional events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaMentions();
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeTab === "upcoming" && item.category !== "upcoming") return false;
    if (activeTab === "placement" && item.category !== "placement") return false;
    if (activeTab === "news" && item.category !== "news") return false;
    if (activeTab === "past" && item.category !== "past") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tag.toLowerCase().includes(q);
      const matchOrg = item.organizedBy?.name.toLowerCase().includes(q);
      const matchDiv = item.organizedBy?.division.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchTag || matchOrg || matchDiv;
    }

    return true;
  });

  const featuredItem =
    items.find((item) => item.featured && item.category === "upcoming") ||
    items[0];

  const handleOpenRSVP = (event: NewsOrEvent) => {
    setSelectedEventForRsvp(event);
    setRsvpSuccess(false);
    setRsvpData({ name: "", email: "", phone: "", organization: "" });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.email || !rsvpData.phone) {
      toast.error("Please provide your name, email, and contact number.");
      return;
    }

    setIsSubmittingRsvp(true);
    try {
      const submissionData = {
        name: rsvpData.name,
        email: rsvpData.email,
        phone: rsvpData.phone,
        message: `Session Registration: ${selectedEventForRsvp?.title} | Mode: ${selectedEventForRsvp?.mode} | Org/College: ${rsvpData.organization || "N/A"}`,
        courseTitle: selectedEventForRsvp?.title || "Event Registration",
        subject: `Registration - ${selectedEventForRsvp?.title}`,
      };

      const res = await submitContactForm(submissionData);
      if (res.success) {
        setRsvpSuccess(true);
        toast.success("Registration submitted! Meeting details will be sent to your email & WhatsApp.");
      } else {
        toast.error(res.message || "Unable to complete registration. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Unable to complete registration. Please try again.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "masterclass":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case "placement":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "press":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
      case "announcement":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800";
      case "archive":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "masterclass":
        return <FaLaptopCode className="text-xs text-blue-500" />;
      case "placement":
        return <FaBriefcase className="text-xs text-emerald-500" />;
      case "press":
        return <FaAward className="text-xs text-amber-500" />;
      case "announcement":
        return <FaBullhorn className="text-xs text-indigo-500" />;
      default:
        return <FaRegCalendarCheck className="text-xs text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="News, Events & Masterclasses | Inxyme Learning Academy"
        description="Official updates, live industry masterclasses, placement drives, institutional announcements, and accreditations from Inxyme."
        keywords="Inxyme news, Inxyme events, SAP masterclass, tech workshops, placement drives, career conclave, educational announcements, certified academy"
      />

      {/* --- CORPORATE HERO HEADER --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-900/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Official Institutional Hub
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            News, Events &amp; Masterclasses
          </h1>

          <p className="max-w-4xl mx-auto text-xs sm:text-sm md:text-base text-blue-100/90 font-medium leading-relaxed">
            Direct updates on upcoming technical webinars, corporate hiring drives, institutional accreditations, and academic milestones from Inxyme.
          </p>

          {/* Institutional Pillars */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-black text-amber-300 flex items-center justify-center gap-1.5">
                <FaShieldAlt className="text-xs" />
                ISO 9001:2015
              </div>
              <div className="text-[11px] text-blue-100 mt-0.5 font-medium">
                Certified Quality
              </div>
            </div>
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-black text-emerald-300 flex items-center justify-center gap-1.5">
                <FaBriefcase className="text-xs" />
                Dedicated Cell
              </div>
              <div className="text-[11px] text-blue-100 mt-0.5 font-medium">
                Placement Drives
              </div>
            </div>
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-black text-blue-300 flex items-center justify-center gap-1.5">
                <FaGraduationCap className="text-xs" />
                Live Mentorship
              </div>
              <div className="text-[11px] text-blue-100 mt-0.5 font-medium">
                Industry Experts
              </div>
            </div>
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-black text-purple-300 flex items-center justify-center gap-1.5">
                <FaLaptopCode className="text-xs" />
                24/7 Access
              </div>
              <div className="text-[11px] text-blue-100 mt-0.5 font-medium">
                Cloud Sandbox Labs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 space-y-8">
        {/* --- SPOTLIGHT FEATURED NOTICE / MASTERCLASS --- */}
        {featuredItem && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    ★ Spotlight Event
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getBadgeClass(featuredItem.type)}`}
                  >
                    {featuredItem.tag}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500 text-xs" />
                    {formatDate(featuredItem.date)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {featuredItem.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {featuredItem.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <FaBuilding className="text-blue-500 text-xs" />
                    <span>{featuredItem.organizedBy.division}</span>
                  </div>
                  {featuredItem.time && (
                    <div className="flex items-center gap-1.5">
                      <FaClock className="text-slate-400 text-xs" />
                      <span>{featuredItem.time}</span>
                    </div>
                  )}
                  {featuredItem.mode && (
                    <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <FaVideo className="text-xs" />
                      <span>{featuredItem.mode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                {featuredItem.registrationOpen ? (
                  <button
                    onClick={() => handleOpenRSVP(featuredItem)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Register for Session</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                ) : featuredItem.externalLink ? (
                  <Link
                    href={featuredItem.externalLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
                  >
                    <span>View Official Record</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedEventForDetails(featuredItem)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs sm:text-sm font-bold rounded-xl transition-all"
                  >
                    <span>Read Details</span>
                    <FaInfoCircle className="text-xs" />
                  </button>
                )}

                <button
                  onClick={() => setSelectedEventForDetails(featuredItem)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaFileAlt className="text-[11px]" />
                  <span>View Full Statement</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS: TABS & LIVE SEARCH --- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categoryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black"
                        : "bg-white dark:bg-gray-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[320px]">
              <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, topics, press notes..."
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* --- EVENTS & NEWS GRID --- */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching records found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Please adjust your search keywords or select another filter tab above.
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Type & Date Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(item.type)}
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${getBadgeClass(item.type)}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500 text-xs" />
                        {formatDate(item.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedEventForDetails(item)}
                      className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata Section */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {item.time && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          <FaClock className="text-slate-400 shrink-0 text-xs" />
                          <span className="truncate">{item.time}</span>
                        </div>
                      )}

                      {item.mode && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                          <FaVideo className="text-blue-500 shrink-0 text-xs" />
                          <span className="truncate">{item.mode}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px] font-semibold pt-0.5">
                        <FaBuilding className="text-slate-400 shrink-0 text-xs" />
                        <span className="truncate">{item.organizedBy.division}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-gray-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEventForDetails(item)}
                      className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      View Details
                    </button>

                    {item.registrationOpen ? (
                      <button
                        onClick={() => handleOpenRSVP(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>Register Now</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    ) : item.externalLink ? (
                      <Link
                        href={item.externalLink}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>Official Notice</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelectedEventForDetails(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>Read Statement</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- PROFESSIONAL INQUIRY / NEWSLETTER STRIP --- */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-100">
              <FaBullhorn className="text-xs" />
              <span>Official Event Broadcast</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Receive Masterclass Schedules &amp; Placement Conclave Invites
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Get notified directly about upcoming corporate hiring dates, technical masterclass agendas, and accredited program schedules.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed successfully! You will receive upcoming session invitations.");
              }}
              className="flex flex-col sm:flex-row gap-2.5 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full sm:w-80 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Subscribe for Updates
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* --- EVENT DETAILS MODAL --- */}
      {selectedEventForDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedEventForDetails(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEventForDetails(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${getBadgeClass(selectedEventForDetails.type)}`}
                >
                  {selectedEventForDetails.tag}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-500 text-xs" />
                  {formatDate(selectedEventForDetails.date)}
                </span>
                {selectedEventForDetails.mode && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    • {selectedEventForDetails.mode}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {selectedEventForDetails.title}
              </h2>

              <div className="p-3 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
                <FaBuilding className="text-blue-500 shrink-0 text-sm" />
                <span>
                  Organized by: <strong>{selectedEventForDetails.organizedBy.division}</strong> ({selectedEventForDetails.organizedBy.name})
                </span>
              </div>

              {selectedEventForDetails.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-60 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                  <img
                    src={selectedEventForDetails.image}
                    alt={selectedEventForDetails.title}
                    className="max-h-60 w-auto object-contain"
                  />
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2 max-h-64 overflow-y-auto pr-2">
                {selectedEventForDetails.fullContent || selectedEventForDetails.description}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>

              {selectedEventForDetails.registrationOpen ? (
                <button
                  onClick={() => {
                    const evt = selectedEventForDetails;
                    setSelectedEventForDetails(null);
                    handleOpenRSVP(evt);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Register Free</span>
                  <FaArrowRight className="text-xs" />
                </button>
              ) : selectedEventForDetails.externalLink ? (
                <Link
                  href={selectedEventForDetails.externalLink}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>View Official Source</span>
                  <FaExternalLinkAlt className="text-xs" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* --- RSVP & REGISTRATION MODAL --- */}
      {selectedEventForRsvp && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedEventForRsvp(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEventForRsvp(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>

            {rsvpSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl border border-emerald-300 dark:border-emerald-800">
                  <FaCheckCircle />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Your seat for <strong>{selectedEventForRsvp.title}</strong> has been registered. Session access link &amp; agenda will arrive via email &amp; WhatsApp.
                </p>
                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${getBadgeClass(selectedEventForRsvp.type)}`}
                    >
                      {selectedEventForRsvp.tag}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {formatDate(selectedEventForRsvp.date)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {selectedEventForRsvp.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Submit your details below to receive direct webinar access and session calendar invite.
                  </p>
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpData.name}
                      onChange={(e) =>
                        setRsvpData({ ...rsvpData, name: e.target.value })
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={rsvpData.email}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        WhatsApp / Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={rsvpData.phone}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current College / Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={rsvpData.organization}
                      onChange={(e) =>
                        setRsvpData({
                          ...rsvpData,
                          organization: e.target.value,
                        })
                      }
                      placeholder="e.g. Engineering College / Tech Enterprise"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    By registering, you agree to receive session joining links and calendar updates via Email &amp; WhatsApp.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all"
                  >
                    {isSubmittingRsvp
                      ? "Processing Registration..."
                      : "Confirm Free Masterclass Access"}
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
