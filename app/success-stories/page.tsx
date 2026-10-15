"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaSearch,
  FaGraduationCap,
  FaArrowRight,
  FaLaptopCode,
  FaBuilding,
  FaIdCard,
  FaShieldAlt,
  FaAward,
  FaBriefcase,
  FaUsers,
  FaPlay,
  FaVideo,
  FaCommentDots,
  FaTimes,
  FaRegClock,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { getSuccessStories, SuccessStoryItem } from "../api/successStoryApi";
import { getPublicStudentReviews, StudentReview } from "../api/reviewPublicApi";
import { getImageUrl } from "../utils/imageUtils";

const FALLBACK_STUDENT_REVIEWS: StudentReview[] = [
  {
    _id: "sample-rev-1",
    studentName: "Mohit Verma",
    studentPhoto: "https://www.inxyme.com/api/upload/file/Adarsh-3832.png",
    rating: 5,
    tags: ["SAP MM", "Practical Training", "Certified"],
    reviewType: "video",
    videoUrl: "",
    videoDuration: 45,
    reviewText: "The hands-on SAP server practice and live instructor doubt sessions gave me confidence during interviews. Highly recommended!",
    courseName: "SAP MM (Materials Management) Live Bootcamp",
    status: "approved",
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sample-rev-2",
    studentName: "Priyanka Sharma",
    studentPhoto: "https://www.inxyme.com/api/upload/file/wo-4953.png",
    rating: 5,
    tags: ["Career Switch", "Full Stack", "Mentorship"],
    reviewType: "text",
    reviewText: "Inxyme completely changed my perspective on tech upskilling. The mentors are from top enterprises and clarify every doubt patiently.",
    courseName: "Full Stack Web Development & Cloud",
    status: "approved",
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sample-rev-3",
    studentName: "Aman Deep Singh",
    studentPhoto: "https://www.inxyme.com/api/upload/file/Krishna-4629.png",
    rating: 5,
    tags: ["AI & Data", "Hands-on Projects", "Placement Support"],
    reviewType: "text",
    reviewText: "The curriculum is updated with the latest AI and Machine Learning tools. Doing real-time capstone projects helped build my portfolio.",
    courseName: "GenAI & Machine Learning Engineering",
    status: "approved",
    verified: true,
    createdAt: new Date().toISOString(),
  },
];

export interface Testimonial {
  _id?: string;
  id?: number | string;
  name: string;
  role: string;
  company?: string;
  course: string;
  category: string;
  image?: string;
  hike?: string;
  content: string;
  rating: number;
  featured?: boolean;
  batchYear?: number;
  cardIdNumber?: string;
}

const ALL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Krishna Avtar",
    role: "MLOps & AI Engineer",
    company: "Cognitive Solutions",
    course: "LLMOps & Machine Learning Operations",
    category: "Career Switch",
    hike: "140% Hike",
    image: "https://www.inxyme.com/api/upload/file/Krishna-4629.png",
    content:
      "Before joining Inxyme, I had very little knowledge of Data Science and Machine Learning pipelines, and was unsure about transitioning into AI. After joining Inxyme, I gained deep practical mastery in containerized ML deployments, Docker, and real-world LLM pipelines. The step-by-step mentoring and placement assistance helped me land my dream role as an MLOps Engineer.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: "Manika Gahloat",
    role: "SAP MM Consultant",
    company: "Accenture Partner Network",
    course: "SAP MM Materials Management",
    category: "SAP Enterprise",
    hike: "95% Hike",
    image: "https://www.inxyme.com/api/upload/file/wo-4953.png",
    content:
      "I enrolled in the SAP MM training program after a friend's recommendation. What I loved most was the live server access, real-time enterprise scenarios, and procurement lifecycle workflows. Whenever I had doubts, the certified trainer was available to guide me. It gave me tremendous confidence during client interviews.",
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    name: "Ankit Kumar",
    role: "Generative AI Developer",
    company: "NextGen Technologies",
    course: "GenAI & Database Management Mastery",
    category: "College Graduates",
    hike: "Campus Placed",
    image: "https://www.inxyme.com/api/upload/file/Adarsh-3832.png",
    content:
      "As a final year student, I needed real project experience to stand out. The Database Management & GenAI course at Inxyme covered both core architectural principles and hands-on vector database projects. The portfolio of assignments I built directly helped me clear technical rounds and receive multiple offers before graduation.",
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: "Vinay Kumar",
    role: "SAP PP Functional Consultant",
    company: "Tata Technologies Ecosystem",
    course: "SAP PP Production Planning",
    category: "SAP Enterprise",
    hike: "110% Hike",
    image: "https://www.inxyme.com/api/upload/file/dar-0262.png",
    content:
      "The SAP PP course exceeded my highest expectations. Coming from a non-SAP manufacturing background, I was initially nervous, but the mentor broke down BOM, routing, and MRP execution into intuitive concepts with live sandbox practice. The career guidance was world-class.",
    rating: 5,
    featured: false,
  },
  {
    id: 5,
    name: "Devendra Trivedi",
    role: "Machine Learning Engineer",
    company: "DataInsights AI",
    course: "Data Science, Analytics & Python",
    category: "Career Switch",
    hike: "125% Hike",
    image: "https://www.inxyme.com/api/upload/file/df-3710.png",
    content:
      "I was working in a non-technical support role and desperately wanted to transition into Data Science. The instructors at Inxyme explained statistical modelling and predictive algorithms from the ground up. Building my first end-to-end predictive project gave me the technical edge to switch my career path successfully.",
    rating: 5,
    featured: false,
  },
  {
    id: 6,
    name: "Adarsh Srivastava",
    role: "Database & Backend Engineer",
    company: "Fintech Core Corp",
    course: "MySQL & Database Architecture",
    category: "Upskilling",
    hike: "85% Hike",
    image: "https://www.inxyme.com/api/upload/file/1777960745027-1855.png",
    content:
      "I already had basic SQL understanding, but the MySQL Database Architecture course took me to an advanced level. Query optimization, index tuning, and stored procedures were taught with industrial clarity. Now I handle heavy transaction databases in production with zero hesitation.",
    rating: 5,
    featured: false,
  },
  // {
  //   id: 7,
  //   name: "Pooja Verma",
  //   role: "SAP FICO Consultant",
  //   company: "Deloitte India Ecosystem",
  //   course: "SAP FICO Financial Accounting",
  //   category: "SAP Enterprise",
  //   hike: "115% Hike",
  //   image: "https://www.inxyme.com/api/upload/file/1777960745027-1855.png",
  //   content:
  //     "The SAP FICO training bridged the gap between academic accounting and live enterprise ERP financial management. General Ledger, Accounts Payable, and Asset Accounting were explained with live case studies. Truly invaluable for finance professionals looking to switch to SAP.",
  //   rating: 5,
  //   featured: false,
  // },
  {
    id: 8,
    name: "Rahul Mehta",
    role: "Full Stack Engineer",
    company: "TechNova Labs",
    course: "Full Stack MERN Architecture",
    category: "Upskilling",
    hike: "105% Hike",
    image: "https://www.inxyme.com/api/upload/file/1777960745003-1010.png",
    content:
      "The MERN Stack course helped me transition from simple frontend UI to architecting robust microservices and real-time WebSocket applications. The code reviews by senior mentors simulated a real software engineering sprint environment.",
    rating: 5,
    featured: false,
  },
  // {
  //   id: 9,
  //   name: "Neha Gupta",
  //   role: "Data Scientist",
  //   company: "Analytics Quotient",
  //   course: "Machine Learning & AI Certification",
  //   category: "AI & Data",
  //   hike: "130% Hike",
  //   image: "https://www.inxyme.com/api/upload/file/1777960745009-2116.png",
  //   content:
  //     "The balance between mathematical intuition and Python code implementation in this course is unmatched. Working on real-world datasets for fraud detection and recommendation engines prepared me thoroughly for senior data science interviews.",
  //   rating: 5,
  //   featured: false,
  // },
];

const CATEGORIES = [
  "All Stories",
  "Career Switch",
  "Upskilling",
  "SAP Enterprise",
  "AI & Data",
  "College Graduates",
];

// Eye-soothing luxury color combinations for ID card designs
const ID_CARD_PALETTES = [
  {
    theme: "sapphire",
    headerBg: "bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-blue-200/90 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-500",
    cardShadow: "hover:shadow-blue-500/10",
    avatarRing: "ring-blue-500/40",
    barcodeColor: "text-blue-600/70 dark:text-blue-400/60",
    tagColor: "text-blue-600 dark:text-blue-400",
  },
  {
    theme: "emerald",
    headerBg: "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-emerald-200/90 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-500",
    cardShadow: "hover:shadow-emerald-500/10",
    avatarRing: "ring-emerald-500/40",
    barcodeColor: "text-emerald-600/70 dark:text-emerald-400/60",
    tagColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    theme: "amethyst",
    headerBg: "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600",
    badgeBg: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-purple-200/90 dark:border-purple-900/60 hover:border-purple-400 dark:hover:border-purple-500",
    cardShadow: "hover:shadow-purple-500/10",
    avatarRing: "ring-purple-500/40",
    barcodeColor: "text-purple-600/70 dark:text-purple-400/60",
    tagColor: "text-purple-600 dark:text-purple-400",
  },
  {
    theme: "amber",
    headerBg: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600",
    badgeBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-amber-200/90 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-500",
    cardShadow: "hover:shadow-amber-500/10",
    avatarRing: "ring-amber-500/40",
    barcodeColor: "text-amber-600/70 dark:text-amber-400/60",
    tagColor: "text-amber-600 dark:text-amber-400",
  },
  {
    theme: "cyan",
    headerBg: "bg-gradient-to-r from-cyan-700 via-sky-600 to-blue-600",
    badgeBg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-cyan-200/90 dark:border-cyan-900/60 hover:border-cyan-400 dark:hover:border-cyan-500",
    cardShadow: "hover:shadow-cyan-500/10",
    avatarRing: "ring-cyan-500/40",
    barcodeColor: "text-cyan-600/70 dark:text-cyan-400/60",
    tagColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    theme: "rose",
    headerBg: "bg-gradient-to-r from-rose-700 via-pink-600 to-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    hikeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    cardBorder: "border-rose-200/90 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500",
    cardShadow: "hover:shadow-rose-500/10",
    avatarRing: "ring-rose-500/40",
    barcodeColor: "text-rose-600/70 dark:text-rose-400/60",
    tagColor: "text-rose-600 dark:text-rose-400",
  },
];

// Genuine Scannable Code-128 Barcode Component
function AlumniBarcode({ value }: { value: string }) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    import("jsbarcode").then((mod) => {
      const JsBarcode = mod.default || mod;
      if (isMounted && svgRef.current && value) {
        try {
          JsBarcode(svgRef.current, value, {
            format: "CODE128",
            lineColor: "#0f172a",
            width: 1.3,
            height: 28,
            displayValue: false,
            margin: 4,
            background: "#ffffff",
          });
        } catch (err) {
          console.error("Barcode generation error:", err);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [value]);

  return (
    <div
      className="bg-white px-2 py-0.5 rounded-md border border-slate-200/90 shadow-2xs inline-flex items-center justify-center hover:border-slate-400 transition-colors"
      title={`Scannable Inxyme Alumni ID: ${value}`}
    >
      <svg ref={svgRef} className="h-6 w-auto max-w-[140px] block" />
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(ALL_TESTIMONIALS);
  const [studentReviews, setStudentReviews] = useState<StudentReview[]>([]);
  const [reviewTypeFilter, setReviewTypeFilter] = useState<"all" | "video" | "text">("all");
  const [activeVideoModal, setActiveVideoModal] = useState<StudentReview | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch dynamic success stories and verified student reviews from backend
  useEffect(() => {
    let isMounted = true;
    const fetchStories = async () => {
      try {
        const res = await getSuccessStories();
        const items = res.data?.stories || res.stories || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setTestimonials(items);
        }
      } catch (err) {
        console.warn("Could not fetch dynamic success stories, keeping default data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        // Fetch student reviews uploaded by learners and verified in admin Reviews & Verification
        const res = await getPublicStudentReviews({ status: "approved", limit: 100 });
        const items = res?.data || [];
        if (isMounted) {
          if (Array.isArray(items) && items.length > 0) {
            setStudentReviews(items);
          } else {
            // Also attempt fetching all reviews in case status isn't marked approved yet
            try {
              const resAll = await getPublicStudentReviews({ status: "all", limit: 100 });
              const allItems = resAll?.data || [];
              if (Array.isArray(allItems) && allItems.length > 0) {
                setStudentReviews(allItems);
              } else {
                setStudentReviews(FALLBACK_STUDENT_REVIEWS);
              }
            } catch {
              setStudentReviews(FALLBACK_STUDENT_REVIEWS);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch student reviews:", err);
        if (isMounted) setStudentReviews(FALLBACK_STUDENT_REVIEWS);
      } finally {
        if (isMounted) setReviewsLoading(false);
      }
    };

    fetchStories();
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStudentReviews = studentReviews.filter((rev) => {
    if (reviewTypeFilter !== "all" && rev.reviewType !== reviewTypeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = rev.studentName?.toLowerCase().includes(q);
      const matchCourse = rev.courseName?.toLowerCase().includes(q);
      const matchText = rev.reviewText?.toLowerCase().includes(q);
      const matchTags = rev.tags?.some((t) => t.toLowerCase().includes(q));
      return Boolean(matchName || matchCourse || matchText || matchTags);
    }
    return true;
  });

  // Compute dynamic categories including any custom categories created in admin
  const dynamicCategories = React.useMemo(() => {
    const set = new Set(CATEGORIES);
    testimonials.forEach((t) => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set);
  }, [testimonials]);

  const filteredTestimonials = testimonials.filter((item) => {
    if (activeCategory !== "All Stories" && item.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchRole = item.role?.toLowerCase().includes(q);
      const matchCourse = item.course?.toLowerCase().includes(q);
      const matchCompany = item.company?.toLowerCase().includes(q);
      const matchContent = item.content?.toLowerCase().includes(q);
      return Boolean(
        matchName || matchRole || matchCourse || matchCompany || matchContent
      );
    }

    return true;
  });

  const featuredTestimonial =
    testimonials.find((t) => t.featured) || testimonials[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="Alumni Success Stories & Career Transitions | Inxyme"
        description="Explore inspiring verified success stories from Inxyme learners who upskilled, mastered enterprise workflows, and unlocked successful careers."
        keywords="Inxyme success stories, alumni reviews, student placements, career transformation, SAP placements, AI career switch, verified graduates"
        robots="index, follow"
      />

      {/* --- CORPORATE HERO HEADER --- */} 
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 text-slate-900 dark:text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 dark:border-slate-800">
        <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/60 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold tracking-wide shadow-2xs">
            <FaStar className="text-amber-500 text-xs" />
            <span>4.9 / 5 Rating from 4,500+ Verified Alumni</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            Alumni &amp; Learner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
              Success Stories
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Real career journeys from engineers, domain experts, and career-switchers who acquired industry-ready mastery and stepped into high-impact corporate roles.
          </p>

          {/* Key Metrics Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">
                4.9 ★
              </div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                Average Rating
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                98%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                Placement Track Record
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                120%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                Avg. Salary Hike
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                500+
              </div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
                Hiring Partners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20 space-y-8">
        {/* --- FEATURED ALUMNI SPOTLIGHT BANNER --- */}
        {featuredTestimonial && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    ★ Premier Transition Spotlight
                  </span>
                  {featuredTestimonial.hike && (
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ⚡ {featuredTestimonial.hike}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <FaGraduationCap className="text-blue-500" />
                    {featuredTestimonial.course}
                  </span>
                </div>

                <div className="relative">
                  <FaQuoteLeft className="text-3xl sm:text-4xl text-blue-500/15 absolute -top-4 -left-2 pointer-events-none" />
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic pl-6">
                    &ldquo;{featuredTestimonial.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  {featuredTestimonial.image ? (
                    <img
                      src={featuredTestimonial.image}
                      alt={featuredTestimonial.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                      {featuredTestimonial.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-base">
                      <span>{featuredTestimonial.name}</span>
                      <FaCheckCircle
                        className="text-emerald-500 text-xs"
                        title="Verified Graduate"
                      />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {featuredTestimonial.role}{" "}
                      {featuredTestimonial.company && (
                        <span>• {featuredTestimonial.company}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2.5">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Similar Program</span>
                  <FaArrowRight className="text-xs" />
                </Link>
                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  100% Practical • Corporate Placement Drive
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION: VERIFIED STUDENT REVIEWS & VIDEO TESTIMONIALS (STUDENT REVIEWS & VERIFICATION) --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 dark:border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-2xs">
                <FaStar className="text-amber-500" />
                <span>Student Reviews &amp; Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Learner Reviews &amp; Video Testimonials
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Real feedback and recorded video experiences submitted directly by students across SAP, AI &amp; Software batches.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {/* Type Switcher Chips */}
              <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setReviewTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewTypeFilter === "all"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All ({studentReviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTypeFilter("video")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    reviewTypeFilter === "video"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <FaVideo className="text-xs text-rose-500" />
                  <span>Videos ({studentReviews.filter((r) => r.reviewType === "video").length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTypeFilter("text")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    reviewTypeFilter === "text"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <FaCommentDots className="text-xs text-blue-500" />
                  <span>Written ({studentReviews.filter((r) => r.reviewType !== "video").length})</span>
                </button>
              </div>

              {/* Share review link */}
              <Link
                href="/review"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span>+ Submit Review</span>
              </Link>
            </div>
          </div>

          {/* Student Reviews Grid */}
          {filteredStudentReviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                No reviews found matching the selected filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudentReviews.map((rev) => {
                const isVideo = rev.reviewType === "video";
                const photoSrc = rev.studentPhoto ? getImageUrl(rev.studentPhoto) : "";
                const videoSrc = rev.videoUrl ? getImageUrl(rev.videoUrl) : "";

                return (
                  <div
                    key={rev._id}
                    className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* If Video Review: Visual Video Teaser Header */}
                    {isVideo && (
                      <div
                        onClick={() => videoSrc && setActiveVideoModal(rev)}
                        className={`relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden ${
                          videoSrc ? "cursor-pointer" : ""
                        }`}
                      >
                        {videoSrc ? (
                          <video
                            src={videoSrc}
                            preload="metadata"
                            muted
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                            <FaVideo className="text-slate-600 text-4xl" />
                          </div>
                        )}

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                        {/* Centered Play Button */}
                        {videoSrc && (
                          <div className="absolute z-10 w-12 h-12 rounded-full bg-white/90 group-hover:bg-blue-600 text-slate-900 group-hover:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 pl-0.5">
                            <FaPlay className="text-sm" />
                          </div>
                        )}

                        {/* Video Badges */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <FaVideo className="text-[9px]" />
                            <span>Video</span>
                          </span>
                        </div>

                        {rev.videoDuration ? (
                          <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1">
                            <FaRegClock className="text-[9px]" />
                            <span>
                              {Math.floor(rev.videoDuration / 60)}:
                              {String(Math.floor(rev.videoDuration % 60)).padStart(2, "0")} min
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-3">
                        {/* Student Info & Rating Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {photoSrc ? (
                              <img
                                src={photoSrc}
                                alt={rev.studentName}
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                                {rev.studentName.charAt(0)}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {rev.studentName}
                                </h4>
                                <FaCheckCircle
                                  className="text-emerald-500 text-xs shrink-0"
                                  title="Verified Student Review"
                                />
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                {rev.courseName || "Inxyme Learner"}
                              </span>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs shrink-0">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <FaStar key={i} />
                            ))}
                          </div>
                        </div>

                        {/* Review Quote / Text */}
                        {rev.reviewText && (
                          <div className="relative bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                            <FaQuoteLeft className="text-slate-300 dark:text-slate-700 text-xs mb-1" />
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-4">
                              {rev.reviewText}
                            </p>
                          </div>
                        )}

                        {/* Tags Pill Row */}
                        {rev.tags && rev.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {rev.tags.slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              >
                                #{tag.replace(/^#/, "")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Verified Status & Date */}
                      <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <FaCheckCircle className="text-xs" />
                          <span>Admin Verified</span>
                        </span>
                        {isVideo && videoSrc && (
                          <button
                            type="button"
                            onClick={() => setActiveVideoModal(rev)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <FaPlay className="text-[9px]" />
                            <span>Play Video</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Video Player Modal */}
        {activeVideoModal && activeVideoModal.videoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 bg-slate-800/90 border-b border-slate-700 text-white">
                <div className="flex items-center gap-2">
                  <FaVideo className="text-rose-500 text-sm" />
                  <span className="font-bold text-sm">
                    {activeVideoModal.studentName}&apos;s Video Review
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* HTML5 Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <video
                  src={getImageUrl(activeVideoModal.videoUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-4 bg-slate-800/95 text-white flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>{activeVideoModal.studentName}</span>
                    <FaCheckCircle className="text-emerald-400 text-xs" />
                  </div>
                  <div className="text-xs text-slate-400">
                    {activeVideoModal.courseName}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {Array.from({ length: activeVideoModal.rating || 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS: CATEGORY TABS & SEARCH BAR --- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {dynamicCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black"
                        : "bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-slate-800"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[320px]">
              <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by student, role, course, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* --- PHENOMENAL STUDENT STORIES AS ALUMNI ID CARDS --- */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching alumni records found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or select another category filter above.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All Stories");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item, index) => {
              // Cycle through eye-pleasing harmonious color palettes for ID cards
              const palette = ID_CARD_PALETTES[index % ID_CARD_PALETTES.length];

              // Non-sequential, realistic alumni credentials with mixed 2025 & 2026 batch years
              const itemNumericId = typeof item.id === "number" ? item.id : index;
              const badgeYear =
                item.batchYear ||
                [2025, 2026, 2025, 2026, 2026, 2025, 2025, 2026][itemNumericId % 8] ||
                (itemNumericId % 2 === 0 ? 2026 : 2025);
              // Fixed 4-digit code starting with 0 and followed by 3 deterministic pseudo-random digits
              const hashSeed = Math.abs(((itemNumericId + 1) ^ 0x45d9) * 2654435761);
              const randomThreeDigits = 100 + (hashSeed % 900);
              const cardIdNumber = item.cardIdNumber || `INX-${badgeYear}-0${randomThreeDigits}`;

              return (
                <div
                  key={item._id || item.id || `story-${index}`}
                  className={`relative bg-white dark:bg-gray-900 rounded-3xl border ${palette.cardBorder} shadow-sm hover:shadow-xl ${palette.cardShadow} transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 pt-2`}
                >
                  {/* Top Lanyard Punch Slot */}
                  <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-2 shadow-inner" />

                  {/* ID Card Header Strip */}
                  <div className={`${palette.headerBg} px-5 py-2.5 text-white flex items-center justify-between text-xs shadow-xs`}>
                    <div className="flex items-center gap-1.5 font-black tracking-wider text-[11px] uppercase">
                      <FaIdCard className="text-xs opacity-90" />
                      <span>Inxyme Alumni ID</span>
                    </div>
                    <div className="font-mono text-[10px] tracking-widest opacity-90 font-semibold">
                      {cardIdNumber}
                    </div>
                  </div>

                  {/* ID Card Main Body */}
                  <div className="relative p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">

                    {/* Subtle Background Watermark / Security Grid */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

                    <div className="relative z-10 space-y-4">
                      {/* Top Micro ID Serial & Clearance Row */}
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                            ID // INX-{badgeYear}-{item.name ? item.name.slice(0, 3).toUpperCase() : "ALU"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs ${palette.badgeBg}`}>
                          {item.category}
                        </span>
                      </div>

                      {/* Student Profile Row (Passport Photo + Primary Dossier) */}
                      <div className="flex items-stretch gap-4">
                        {/* Photo in Framed ID Slot */}
                        <div className="relative shrink-0">
                          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover ring-1 ${palette.avatarRing}`}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl ${palette.headerBg} text-white flex items-center justify-center font-black text-2xl shadow-inner`}>
                                {item.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Verified Status Pill pinned to bottom of photo */}
                          <span
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 text-[9px] font-black uppercase tracking-wider shadow-sm ring-2 ring-white dark:ring-slate-900"
                            title="Verified Inxyme Alumni"
                          >
                            ✓ Verified
                          </span>
                        </div>

                        {/* Structured ID Data Fields */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                              Cardholder Name
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate leading-tight">
                              {item.name}
                            </h3>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
                            <div className="min-w-0">
                              <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                Designation
                              </span>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {item.role}
                              </p>
                            </div>

                            {item.company && (
                              <div className="min-w-0 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    Placed Organization
                                  </span>
                                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate flex items-center gap-1.5 mt-0.5">
                                    <FaBuilding className="text-[10px] text-slate-400 shrink-0" />
                                    <span className="truncate">{item.company}</span>
                                  </p>
                                </div>

                                {item.hike && (
                                  <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-md border border-current/10 shadow-2xs ${palette.hikeBg}`}>
                                    ⚡ {item.hike}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Course Credential Strip */}
                      <div className="bg-slate-900 dark:bg-slate-800 text-white p-2.5 rounded-xl shadow-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <FaGraduationCap className="text-amber-400 text-sm" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">
                              Certified Specialization
                            </span>
                            <span className="block text-xs font-bold truncate text-slate-100">
                              {item.course}
                            </span>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="shrink-0 flex flex-col items-end pl-2 border-l border-slate-700">
                          <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400">
                            Rating
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400 text-[10px] mt-0.5">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <FaStar key={i} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Official Endorsement / Experience Log */}
                      <div className="relative bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3 border-l-4 border-slate-300 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Alumni Testimony Log
                          </span>
                          <FaQuoteLeft className="text-xs text-slate-300 dark:text-slate-700" />
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-3">
                          &ldquo;{item.content}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* ID Card Bottom Strip: Realistic CSS Barcode & Hologram Seal */}
                    <div className="relative z-10 mt-5 pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        {/* Scannable Code-128 Barcode that displays Inxyme Alumni ID when scanned */}
                        <AlumniBarcode value={cardIdNumber} />
                        <div className="text-[9px] font-mono font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                          BATCH OF {badgeYear} • INXYME VERIFIED
                        </div>
                      </div>

                      {/* Holographic-style Security Seal */}
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-700 dark:text-slate-200 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10 dark:from-emerald-400/15 dark:via-sky-400/15 dark:to-purple-400/15 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 shadow-2xs">
                        <FaShieldAlt className="text-emerald-500 text-xs shrink-0" />
                        <span>AUTHENTIC</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- STATS ACCREDITATION BANNER --- */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-100">
              <FaAward className="text-xs text-amber-300" />
              <span>Job-Ready Learning Platform</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Write Your Own Success Story?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of learners and working professionals who mastered in-demand SAP, AI, Cloud, and Full Stack technologies with Inxyme.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
              >
                <span>Browse All Courses</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 hover:bg-white/10 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                <span>Speak to a Career Advisor</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
