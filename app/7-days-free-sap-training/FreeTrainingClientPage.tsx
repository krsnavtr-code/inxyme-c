"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaGift,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaShieldAlt,
  FaArrowRight,
  FaFileInvoiceDollar,
  FaBoxes,
  FaChartLine,
  FaCogs,
  FaCode,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaWhatsapp,
  FaFire,
  FaStar,
  FaAward,
  FaCheck,
  FaBook,
  FaPlayCircle,
  FaUsers,
  FaBriefcase,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaRocket,
  FaLightbulb,
  FaArrowDown,
  FaBolt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../api/contactApi";
import { usePartialLead } from "../hooks/usePartialLead";

interface SapModule {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  category: "Functional" | "Technical";
  icon: React.ReactNode;
  salary: string;
  description: string;
  whoShouldJoin: string;
  tCodes: string[];
  dayTopics: { day: string; title: string; desc: string }[];
  careerRoles: string[];
}

const SAP_MODULES: SapModule[] = [
  {
    id: "SAP FICO",
    name: "SAP FICO (Financial Accounting & Controlling)",
    shortName: "SAP FICO",
    tag: "Finance & Corporate Accounts",
    category: "Functional",
    icon: <FaFileInvoiceDollar className="text-xl sm:text-2xl" />,
    salary: "₹6 - 15 LPA",
    description:
      "SAP FICO is the financial nerve center of global corporations. Learn how Fortune 500 enterprises manage general ledgers, accounts payable, accounts receivable, asset accounting, cost center planning, and real-time P&L reporting.",
    whoShouldJoin:
      "Commerce Graduates (B.Com, M.Com), CA, CMA, MBA Finance, Accountants, Auditors & Financial Analysts looking for high-paying ERP roles.",
    tCodes: ["FS00", "FB50", "F-02", "FBL1N", "FBL5N", "AS01", "KS01", "S_ALR_87012284"],
    dayTopics: [
      {
        day: "Day 1-2",
        title: "Enterprise Structure & General Ledger (GL)",
        desc: "Company code setup, fiscal year variants, chart of accounts & posting master GL entries.",
      },
      {
        day: "Day 3-4",
        title: "Accounts Payable (AP) & Receivable (AR)",
        desc: "Vendor & customer master records, incoming/outgoing invoice workflows, payment terms & debit/credit memos.",
      },
      {
        day: "Day 5-6",
        title: "Asset Accounting & Controlling (CO)",
        desc: "Asset classes, depreciation runs, cost center hierarchy & profit center accounting for internal managerial control.",
      },
      {
        day: "Day 7",
        title: "Financial Statements & Live Consulting Project",
        desc: "Balance sheet generation, month-end closing walkthrough, interview questions & real implementation roadmap.",
      },
    ],
    careerRoles: [
      "SAP FICO Functional Consultant",
      "Financial Systems ERP Analyst",
      "Lead FICO Implementation Specialist",
      "S/4HANA Finance Associate",
    ],
  },
  {
    id: "SAP MM",
    name: "SAP MM (Materials Management & Procurement)",
    shortName: "SAP MM",
    tag: "Supply Chain & Procurement",
    category: "Functional",
    icon: <FaBoxes className="text-xl sm:text-2xl" />,
    salary: "₹5.5 - 14 LPA",
    description:
      "Powering supply chains worldwide, SAP MM handles the complete Procure-to-Pay (P2P) cycle. Master purchasing strategies, vendor evaluations, material master configurations, inventory tracking, and warehouse goods movements.",
    whoShouldJoin:
      "Supply Chain executives, Procurement officers, Logistics managers, Mechanical / Industrial Engineers, and Graduates seeking ERP operations roles.",
    tCodes: ["MM01", "ME21N", "ME51N", "MIGO", "MIRO", "MB52", "XK01", "ME2M"],
    dayTopics: [
      {
        day: "Day 1-2",
        title: "MM Enterprise Units & Material Master",
        desc: "Plant, storage locations, purchasing organizations, and configuring single & bulk Material Master records.",
      },
      {
        day: "Day 3-4",
        title: "Vendor Management & Purchase Orders",
        desc: "Vendor master creation, Purchase Requisition (PR) to Purchase Order (PO) conversion, and quotation evaluation.",
      },
      {
        day: "Day 5-6",
        title: "Goods Receipt (MIGO) & Invoice Verification (MIRO)",
        desc: "Executing physical stock receipt, inventory movement types (101, 201), and 3-way matching in vendor invoice verification.",
      },
      {
        day: "Day 7",
        title: "P2P Integration with FI & Real-World Case Study",
        desc: "Automatic account determination (OBYC), resolving live purchase variances, client case study, and consultant interview prep.",
      },
    ],
    careerRoles: [
      "SAP MM Consultant",
      "Procurement Systems Specialist",
      "Supply Chain ERP Analyst",
      "Inventory & Materials Controller",
    ],
  },
  {
    id: "SAP SD",
    name: "SAP SD (Sales & Distribution)",
    shortName: "SAP SD",
    tag: "Sales, Logistics & O2C",
    category: "Functional",
    icon: <FaChartLine className="text-xl sm:text-2xl" />,
    salary: "₹5.5 - 13 LPA",
    description:
      "SAP SD drives global revenue generation through the end-to-end Order-to-Cash (O2C) lifecycle. Learn customer hierarchies, pricing calculation schemas, sales quotation handling, shipping logistics, and customer invoicing.",
    whoShouldJoin:
      "Sales & Marketing specialists, Logistics & Dispatch executives, Customer Operations leads, BBA/MBA graduates, and domain switchers.",
    tCodes: ["XD01", "VA01", "VA02", "VL01N", "VF01", "VK11", "VA05", "VKOA"],
    dayTopics: [
      {
        day: "Day 1-2",
        title: "Sales Area Architecture & Customer Master",
        desc: "Sales Organization, Distribution Channel, Division matrix, and customer master configuration with credit limits.",
      },
      {
        day: "Day 3-4",
        title: "Pricing Procedures & Sales Orders (VA01)",
        desc: "Condition technique, pricing logic (base price, discounts, freight, GST taxes) and sales order processing.",
      },
      {
        day: "Day 5-6",
        title: "Shipping, Picking, PGI & Billing (VF01)",
        desc: "Outbound delivery creation (VL01N), Post Goods Issue (PGI) stock reduction, and generating legal customer invoices.",
      },
      {
        day: "Day 7",
        title: "O2C Integration with MM & FI + Interview Blueprint",
        desc: "Revenue account determination (VKOA), billing documents flow, troubleshooting shipping errors, and career guidance.",
      },
    ],
    careerRoles: [
      "SAP SD Functional Consultant",
      "Order-to-Cash (O2C) ERP Lead",
      "Sales Logistics Systems Analyst",
      "Customer Billing Solutions Architect",
    ],
  },
  {
    id: "SAP PP",
    name: "SAP PP (Production Planning)",
    shortName: "SAP PP",
    tag: "Manufacturing & MRP",
    category: "Functional",
    icon: <FaCogs className="text-xl sm:text-2xl" />,
    salary: "₹5 - 12 LPA",
    description:
      "The core production engine for manufacturing plants. Understand how factories plan raw material requirements, manage Bills of Material (BOM), schedule shop-floor work centers, and track production order confirmations.",
    whoShouldJoin:
      "Mechanical Engineers, Production Engineers, Plant Supervisors, Factory Managers, Operations Leads, and Industrial Engineering graduates.",
    tCodes: ["CS01", "CR01", "CA01", "MD01", "MD04", "CO01", "CO11N", "COOIS"],
    dayTopics: [
      {
        day: "Day 1-2",
        title: "Manufacturing Master Data (BOM & Routings)",
        desc: "Bill of Materials (CS01), Work Centers with machine/labor capacities (CR01), and production operation routings (CA01).",
      },
      {
        day: "Day 3-4",
        title: "Material Requirements Planning (MRP) Runs",
        desc: "Demand management, planned independent requirements (PIR), single-item & multi-level MRP execution (MD01/MD04).",
      },
      {
        day: "Day 5-6",
        title: "Production Orders & Shop Floor Execution",
        desc: "Planned order conversion, production order release (CO01), material staging, goods issue (261), and operation confirmation (CO11N).",
      },
      {
        day: "Day 7",
        title: "Manufacturing Case Study & Consultant Roadmap",
        desc: "Production order settlement to FI/CO, scrap management, live factory walkthrough scenario, and interview masterclass.",
      },
    ],
    careerRoles: [
      "SAP PP Consultant",
      "Manufacturing Operations ERP Specialist",
      "Production Planning Lead",
      "Industrial Supply Chain Consultant",
    ],
  },
  {
    id: "SAP ABAP",
    name: "SAP ABAP (Advanced Business Application Programming)",
    shortName: "SAP ABAP",
    tag: "Core ERP Development & S/4HANA",
    category: "Technical",
    icon: <FaCode className="text-xl sm:text-2xl" />,
    salary: "₹6 - 16 LPA",
    description:
      "The premier programming language of SAP. Develop custom enterprise reports, Data Dictionary objects, interactive ALV grids, user exits, BAPIs, and modern S/4HANA Core Data Services (CDS) views.",
    whoShouldJoin:
      "B.Tech / BE Computer Science/IT, BCA, MCA, Software Engineers, Java/Python/SQL developers, and IT beginners aiming for enterprise stability.",
    tCodes: ["SE11", "SE38", "SE80", "SE37", "SE24", "ST22", "SM50", "SE16N"],
    dayTopics: [
      {
        day: "Day 1-2",
        title: "ABAP Workbench & Data Dictionary (SE11)",
        desc: "Architecture, 3-tier model, creating transparent database tables, data elements, domains, structures, and search helps.",
      },
      {
        day: "Day 3-4",
        title: "ABAP Syntax, Internal Tables & Open SQL",
        desc: "Data declarations, control structures, internal table operations, SELECT queries, work areas, and debugging basics.",
      },
      {
        day: "Day 5-6",
        title: "Modern ALV Grid Reports & Modularization",
        desc: "Interactive ALV grid development using standard function modules & classes, subroutines, Function Modules, and BAPIs.",
      },
      {
        day: "Day 7",
        title: "S/4HANA Innovations, Dumps & Interview Prep",
        desc: "Runtime error analysis (ST22 dumps), performance tuning, introduction to CDS views & ABAP on HANA, top 50 interview questions.",
      },
    ],
    careerRoles: [
      "SAP ABAP Technical Consultant",
      "S/4HANA ABAP Developer",
      "ERP Integration Engineer",
      "SAP Application Programming Lead",
    ],
  },
];

const CURRICULUM_TIMELINE = [
  {
    day: "Day 1",
    tag: "Orientation & Navigation",
    title: "SAP ERP Architecture & System Navigation",
    bullets: [
      "Understanding Enterprise Resource Planning (ERP) & the global business landscape",
      "Difference between SAP ECC, S/4HANA, On-Premise vs Cloud solutions",
      "3-Tier Architecture (Database, Application, and Presentation layers)",
      "Hands-on SAP GUI navigation, standard menus, favorite transactions & Fiori Launchpad",
    ],
  },
  {
    day: "Day 2",
    tag: "Core Configuration",
    title: "Enterprise Structure & Organization Units",
    bullets: [
      "Defining the enterprise hierarchy: Client, Company Code, Plant, and Sales Org",
      "Assigning organizational units for real-time transaction processing",
      "Understanding Chart of Accounts, Credit Control Areas & Purchasing Orgs",
      "Live walkthrough on how multi-national corporations configure multiple plants",
    ],
  },
  {
    day: "Day 3",
    tag: "Practical T-Codes",
    title: "Master Data Management & Hands-On T-Codes",
    bullets: [
      "The role of Master Data vs Transactional Data in enterprise operations",
      "Creating and maintaining Vendor, Customer, Material, and G/L master records",
      "Mastering essential daily transaction codes across PP, MM, ABAP, FICO & SD",
      "Common validation rules, field status groups & mandatory field controls",
    ],
  },
  {
    day: "Day 4",
    tag: "Business Integration",
    title: "Cross-Module Integration in Real Business",
    bullets: [
      "Procure-to-Pay (P2P) integration: Linking MM purchasing to FI accounts payable",
      "Order-to-Cash (O2C) integration: Linking SD customer orders to FI accounts receivable",
      "Manufacturing integration: How PP production triggers MM raw material consumption",
      "Real-time accounting document flow and automatic GL postings",
    ],
  },
  {
    day: "Day 5",
    tag: "Live Case Study",
    title: "Real-Time Corporate Case Study & System Demo",
    bullets: [
      "Complete end-to-end case study: A global manufacturing enterprise order journey",
      "From raw material procurement to factory production and final client delivery",
      "Simulating live consultant tasks on an active SAP server",
      "Interactive Q&A: Asking real implementation questions to senior mentors",
    ],
  },
  {
    day: "Day 6",
    tag: "Production Troubleshooting",
    title: "Troubleshooting, Errors & Run-Time Dumps",
    bullets: [
      "How SAP functional and technical consultants resolve production support tickets",
      "Analyzing SAP runtime errors, dump logs (ST22), and missing authorizations (SU53)",
      "Configuration hacks, handling client change requests, and transport management (STMS)",
      "Best practices for live system data corrections and audit compliance",
    ],
  },
  {
    day: "Day 7",
    tag: "Career & Certificate",
    title: "Career Roadmap, Resume Strategy & Certification Claim",
    bullets: [
      "Top 50 high-frequency SAP interview questions and winning answers",
      "Crafting an ATS-compliant SAP consultant resume for freshers and experienced professionals",
      "LinkedIn optimization hacks to get recruiter inbound messages from MNCs",
      "Issuance of ISO 9001:2015 & NSDC aligned Verifiable Course Completion Certificate",
    ],
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Live Interactive Classes With Q&A",
    inxyme: "Yes (Daily 1-Hour Live with certified trainer)",
    youtube: "No (One-way recorded monologue)",
    traditional: "Yes (Often crowded batches of 60+)",
  },
  {
    feature: "Live SAP Server Demo & System Access",
    inxyme: "Yes (Live system demonstration on server)",
    youtube: "No (Usually outdated PPT slides)",
    traditional: "Yes (Extra charges for server access)",
  },
  {
    feature: "Covers 5 Core SAP Modules",
    inxyme: "Yes (PP, MM, ABAP, FICO, SD)",
    youtube: "Scattered, fragmented videos",
    traditional: "Usually 1 single module only",
  },
  {
    feature: "Verifiable ISO/NSDC Certificate",
    inxyme: "Included 100% Free with QR Code",
    youtube: "None",
    traditional: "Only after paying full high fee",
  },
  {
    feature: "Dedicated WhatsApp Doubt Support",
    inxyme: "Yes (Instant batch community & mentors)",
    youtube: "Ignored comments section",
    traditional: "Slow, email-only ticketing",
  },
  {
    feature: "Full Course Cost",
    inxyme: "₹0 / 100% Free (Zero hidden charges)",
    youtube: "Free (Zero structure / outdated)",
    traditional: "₹35,000 - ₹80,000 upfront fees",
  },
];

const FAQS = [
  {
    q: "Is this 7-day SAP Masterclass really 100% free? Are there any hidden charges?",
    a: "Yes, it is 100% Free of charge with zero registration fees, zero admission fees, and zero hidden costs. You get full access to all 7 live sessions, study materials, live system demos, and a verified course completion certificate without entering any credit card or payment information.",
  },
  {
    q: "What if I miss a live class? Will I get recordings?",
    a: "Yes! Every single live session is recorded in high definition. If you ever miss a class due to work, college, or personal commitments, the full recording will be uploaded to your student portal within 2 hours of session completion so you can catch up at your convenience.",
  },
  {
    q: "Do I need prior coding or technical knowledge to join?",
    a: "Not at all. For functional modules like SAP FICO, SAP MM, SAP SD, and SAP PP, no coding knowledge is required whatsoever. These modules deal with business processes, finance, logistics, and supply chain. For SAP ABAP (the technical track), programming logic is taught from the ground up, making it completely beginner-friendly.",
  },
  {
    q: "Which SAP module should I pick if I am confused?",
    a: "If you come from Commerce, Accounts, or Finance (B.Com, CA, MBA), SAP FICO is the ideal choice. If your background is in Supply Chain, Procurement, Logistics, or Mechanical, go for SAP MM or SD. If you are from Mechanical/Production, SAP PP is great. For IT/CS graduates or software developers, SAP ABAP is the best fit. During Day 1, our mentors also help you analyze your background.",
  },
  {
    q: "How will I receive the live class links and schedule?",
    a: "Immediately upon submitting your free registration on this page, you will receive an invitation to join the official WhatsApp Batch Group. Daily meeting links (Google Meet / Zoom), batch timings, and study PDFs will be shared directly on WhatsApp and via your registered email.",
  },
  {
    q: "What are the live class timings?",
    a: "We conduct daily evening batches (typically 7:30 PM - 8:30 PM IST) designed specifically so college students and working professionals can attend seamlessly without disrupting their workday. Weekend flexible timings are also available.",
  },
  {
    q: "Will I receive a certificate after completing the 7 days?",
    a: "Yes. All participants who attend the classes and complete the quick final quiz will be awarded an official, ISO 9001:2015 and NSDC-aligned Verifiable Course Completion Certificate by Inxyme with a unique verification ID that you can add directly to your LinkedIn profile and resume.",
  },
  {
    q: "What can I do after completing the 7-day masterclass?",
    a: "After the 7 days, you will have deep clarity on real-world SAP workflows and your career roadmap. If you wish to advance to full consultant-level certification and guaranteed placement support with live server access, Inxyme offers full career mentorship tracks with exclusive scholarship benefits for masterclass participants.",
  },
];

export default function FreeTrainingClientPage() {
  const [activeModuleId, setActiveModuleId] = useState("SAP FICO");
  const [selectedModule, setSelectedModule] = useState("SAP FICO");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "Fresher / Looking for 1st Job",
  });

  // Partial lead capture hook
  const { handlePartialLeadBlur, markConverted } = usePartialLead({
    source: "7_days_free_sap_dedicated_page",
    getFormData: () => ({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      courseTitle: selectedModule,
      experienceLevel: formData.experienceLevel,
    }),
  });

  const activeModule =
    SAP_MODULES.find((m) => m.id === activeModuleId) || SAP_MODULES[0];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = (modId?: string) => {
    if (modId) {
      setSelectedModule(modId);
      setActiveModuleId(modId);
    }
    const formElement = document.getElementById("free-registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        courseTitle: selectedModule,
        subject: `Dedicated Page Registration: 7-Day Free SAP Training - ${selectedModule}`,
        message: `Registered from Dedicated 7-Days Free SAP Page (/7-days-free-sap-training).\nModule Track: ${selectedModule}\nCandidate Profile: ${formData.experienceLevel}`,
        agreedToTerms: true,
      };

      const result = await submitContactForm(submissionData);

      if (result.success || result._id || result.message) {
        markConverted();
        setIsSubmitted(true);
        toast.success("Registration Confirmed! Your free seat is reserved.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          experienceLevel: "Fresher / Looking for 1st Job",
        });
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Free SAP Registration Error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* =====================================================================
          SECTION 1: HERO BANNER (Left: Content Banner, Right: Lead Form)
      ===================================================================== */}
      <section className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* -------------------------------------------------------------
                LEFT COLUMN: HERO BANNER CONTENT (7 Columns)
            ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
              {/* Badges / Eyebrow */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <FaFire className="text-red-400 shrink-0 text-xs" />
                  <span>100% Free Live Bootcamp</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                  <FaAward className="text-blue-400 shrink-0" />
                  <span>ISO 9001:2015 & NSDC Aligned</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                  <FaClock className="text-emerald-400 shrink-0" />
                  <span>Next Batch Starts Monday</span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.15]">
                Master In-Demand SAP Modules{" "}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
                  100% Free in 7 Days
                </span>
              </h1>

              {/* Deep Explanatory Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                Experience real corporate ERP consulting before spending a single rupee.
                Attend live instructor-led sessions, practice on real SAP GUI & S/4HANA systems,
                master <strong>SAP FICO, MM, SD, PP, & ABAP</strong>, solve corporate case studies,
                and claim your <strong>verified certificate of completion</strong>.
              </p>

              {/* 4 Feature Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-200 text-left">
                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                  <FaGraduationCap className="text-amber-400 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">Free Verifiable Certificate</strong>
                    <span className="text-slate-400 text-[11px]">Boost your CV & LinkedIn profile credibility</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                  <FaChalkboardTeacher className="text-blue-400 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">10+ Yrs Corporate Mentors</strong>
                    <span className="text-slate-400 text-[11px]">Learn real industry implementation techniques</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                  <FaLaptopCode className="text-emerald-400 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">Live SAP System Demos</strong>
                    <span className="text-slate-400 text-[11px]">Hands-on everyday business T-codes practice</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                  <FaBook className="text-purple-400 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">Free PDF Handbooks & Q&A</strong>
                    <span className="text-slate-400 text-[11px]">Daily session recordings & interview guides</span>
                  </div>
                </div>
              </div>

              {/* Quick Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToForm()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaGift className="text-base text-amber-200" />
                  <span>Reserve 100% Free Seat Now</span>
                  <FaArrowDown className="text-xs" />
                </button>

                <a
                  href="https://wa.me/919990999561?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%207%20Days%20Free%20SAP%20Live%20Training%20program."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-lg text-emerald-400" />
                  <span>Chat With Counsellor</span>
                </a>
              </div>

              {/* Ratings & Trust Metrics */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400 text-sm">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="font-bold text-white">4.9/5</span>
                  <span className="text-slate-400">(350+ Reviews)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FaUsers className="text-blue-400 text-sm" />
                  <span className="font-bold text-white">1,200+</span>
                  <span className="text-slate-400">Learners Enrolled</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FaShieldAlt className="text-emerald-400 text-sm" />
                  <span className="font-bold text-white">₹0 Cost</span>
                  <span className="text-slate-400">No Credit Card</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: HIGH-CONVERTING LEAD CAPTURE FORM (5 Columns)
            ------------------------------------------------------------- */}
            <div id="free-registration-form" className="lg:col-span-5 w-full">
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-2 sm:p-4 shadow-2xl border-2 border-blue-500/30 dark:border-blue-500/40 text-slate-900 dark:text-white transition-all overflow-hidden">
                {/* Top Glowing Urgency Header */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-amber-500 to-indigo-600" />

                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <FaClock className="text-amber-600 dark:text-amber-400 animate-pulse text-[10px]" />
                    <span>Free Seats Filling Fast • 50/Cohort</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Claim Your 100% Free Seat
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Fill the form to receive live class meeting links, daily recordings & syllabus PDF instantly.
                  </p>
                </div>

                {isSubmitted ? (
                  /* ================= SUCCESS STATE ================= */
                  <div className="py-6 text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/40">
                      <FaCheckCircle className="text-3xl" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">
                        Seat Reserved Successfully!
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                        You have been registered for the <strong>{selectedModule}</strong> 7-day live training batch.
                      </p>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5 text-left text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <FaShieldAlt className="text-emerald-600" /> Immediate Next Step:
                      </p>
                      <p>• Join the WhatsApp batch group below to get live class links, timings, and daily study PDFs.</p>
                      <p>• Class starts this Monday at 7:30 PM IST.</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <a
                        href="https://wa.me/919990999561?text=Hi%2C%20I%20have%20registered%20for%20the%207%20Days%20Free%20SAP%20Live%20Class.%20Please%20share%20the%20batch%20group%20link."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                      >
                        <FaWhatsapp className="text-lg" />
                        <span>Join WhatsApp Batch Group</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        Register another colleague or friend
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================= REGISTRATION FORM ================= */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Preferred SAP Track */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Select Preferred SAP Track <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedModule}
                        onChange={(e) => {
                          setSelectedModule(e.target.value);
                          setActiveModuleId(e.target.value);
                        }}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SAP FICO">SAP FICO (Financial Accounting & Controlling)</option>
                        <option value="SAP MM">SAP MM (Materials Management & Procurement)</option>
                        <option value="SAP SD">SAP SD (Sales & Distribution / Logistics)</option>
                        <option value="SAP PP">SAP PP (Production Planning & Manufacturing)</option>
                        <option value="SAP ABAP">SAP ABAP (Programming & Technical ERP)</option>
                        <option value="All SAP Modules">All 5 Modules (Explore Everything)</option>
                      </select>
                    </div>

                    {/* Candidate Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handlePartialLeadBlur}
                          placeholder="e.g. Amit Kumar"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handlePartialLeadBlur}
                          placeholder="e.g. amit@example.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Mobile / WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handlePartialLeadBlur}
                          placeholder="10-digit mobile number"
                          maxLength={12}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Current Profile / Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Current Background / Education
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="College Student (Final / Pre-final Year)">
                          College Student (Final / Pre-final Year)
                        </option>
                        <option value="Fresher / Graduate Seeking 1st Job">
                          Fresher / Graduate Seeking 1st Job
                        </option>
                        <option value="Working Professional (Switching to SAP)">
                          Working Professional (Switching to SAP)
                        </option>
                        <option value="Finance / Accounts / Commerce Professional">
                          Finance / Accounts / Commerce Professional
                        </option>
                        <option value="Supply Chain / Operations / Logistics">
                          Supply Chain / Operations / Logistics
                        </option>
                        <option value="IT / Software / Developer Background">
                          IT / Software / Developer Background
                        </option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Reserving Your Seat...</span>
                        </div>
                      ) : (
                        <>
                          <FaGift className="text-amber-300 text-base" />
                          <span>Enroll Free in 7-Day Live Class</span>
                          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Form Trust Strip */}
                    <div className="pt-1 text-center space-y-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
                        <FaShieldAlt className="text-emerald-500 shrink-0 text-xs" />
                        <span>100% Free • No Payment Details Required</span>
                      </p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                        ⚡ Meeting link & schedule will be sent to WhatsApp immediately
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: CORPORATE TRUST & ACCREDITATION STRIP
      ===================================================================== */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Government Recognized & Industry Aligned
            </p>
            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              Certified Learning Architecture
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FaAward className="text-blue-600" /> ISO 9001:2015 Certified
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FaGraduationCap className="text-amber-500" /> NSDC Partner Aligned
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FaShieldAlt className="text-emerald-500" /> MCA Govt. Registered
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FaBolt className="text-purple-500" /> Skill India Aligned
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: 5 IN-DEMAND SAP MODULES DEEP-DIVE (Interactive Navigator)
      ===================================================================== */}
      <section id="modules-deep-dive" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
            <FaBook className="text-blue-600 dark:text-blue-400" />
            <span>Comprehensive Syllabus Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            5 Core SAP Tracks Explored in Deep Detail
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Click on any module below to inspect the functional domain, target salary ranges,
            day-by-day practical topics, and everyday SAP transaction codes (T-Codes) you will practice.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {SAP_MODULES.map((mod, idx) => {
              const isActive = activeModuleId === mod.id;
              const isLastOnMobile = idx === 4;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    setActiveModuleId(mod.id);
                    setSelectedModule(mod.id);
                  }}
                  className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${isLastOnMobile ? "col-span-2 sm:col-span-1" : ""
                    } ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.01]"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{mod.icon}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                    >
                      {mod.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm leading-tight">{mod.shortName}</h4>
                  <span
                    className={`text-[10px] mt-1 ${isActive ? "text-blue-100" : "text-emerald-600 dark:text-emerald-400 font-bold"
                      }`}
                  >
                    Avg: {mod.salary}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Detailed Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
                  {activeModule.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                  Industry Salary Range: {activeModule.salary}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeModule.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => scrollToForm(activeModule.id)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <FaGift /> Enroll Free in {activeModule.shortName}
            </button>
          </div>

          {/* Description & Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Module Scope & Industry Function
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeModule.description}
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-1">
                  🎓 Recommended Background:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">{activeModule.whoShouldJoin}</p>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Core Everyday Transaction Codes (T-Codes)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeModule.tCodes.map((tc) => (
                  <span
                    key={tc}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    /{tc}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Target Consultant Job Roles
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModule.careerRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Day-by-Day Topics Covered in This Module */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" />
              What You Will Build & Practice in 7 Days:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeModule.dayTopics.map((dt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                >
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white inline-block">
                    {dt.day}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                    {dt.title}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {dt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 7-DAY DAY-BY-DAY MASTERCLASS TIMELINE
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wide">
              <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" />
              <span>Step-by-Step Learning Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Day-by-Day 7-Day Live Masterclass Roadmap
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every day includes a 1-hour live interactive instructor-led class followed by a live
              system demonstration and 15-minute doubt resolution session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_TIMELINE.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                      {item.day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <ul className="space-y-1.5 pt-1">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <FaCheck className="text-emerald-500 text-[10px] shrink-0 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-blue-500" /> 60 Mins Live + Q&A
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <FaPlayCircle /> Recording Included
                  </span>
                </div>
              </div>
            ))}

            {/* Final Bonus Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-900 font-black text-xs inline-block">
                  Perk & Bonus
                </span>
                <h4 className="text-lg font-black leading-tight">
                  Free Verified Certificate & Career Handbook
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Upon completing the 7 days, get your ISO 9001:2015 & NSDC aligned certificate with a unique QR code, plus our exclusive 150-page SAP T-Code Bible and interview cheat sheet.
                </p>
              </div>

              <button
                type="button"
                onClick={() => scrollToForm()}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaGift className="text-amber-500" />
                <span>Reserve Free Seat Now →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: COMPARISON MATRIX (Why Inxyme vs YouTube vs Paid Courses)
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">
            <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
            <span>Honest Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Inxyme 7-Day Live Masterclass Stands Apart
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            See how our structured live masterclass compares against random free videos and expensive coaching centers.
          </p>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                <th className="py-4 px-4 sm:px-6 font-black text-slate-900 dark:text-white">Feature / Deliverable</th>
                <th className="py-4 px-4 sm:px-6 font-black text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40">
                  ⭐ Inxyme 7-Day Free Class
                </th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-slate-500 dark:text-slate-400">Free YouTube Videos</th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-slate-500 dark:text-slate-400">Paid Offline Institutes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON_ROWS.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-800 dark:text-slate-200">{row.feature}</td>
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20 flex items-center gap-1.5">
                    <FaCheckCircle className="shrink-0" /> {row.inxyme}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500 dark:text-slate-400">{row.youtube}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300 font-medium">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: WHO SHOULD ATTEND? (Career Personas)
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
              <FaUsers className="text-blue-600" />
              <span>Career Fit Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Is This Free 7-Day Masterclass Right for You?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              SAP powers over 87% of the Global 2000 companies. Discover how this masterclass fits your background.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-lg">
                <FaGraduationCap />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Fresh Graduates & Students</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                B.Com, BBA, B.Tech, BCA, MCA or MBA students seeking a recession-proof career in enterprise IT consulting.
              </p>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block pt-1">
                Best Tracks: SAP FICO, MM, ABAP
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-lg">
                <FaBriefcase />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Finance & Accounts Pros</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Accountants, CA interns, bookkeepers, and tax auditors wanting to transition into high-paying SAP FICO consulting roles.
              </p>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block pt-1">
                Best Track: SAP FICO
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-lg">
                <FaBoxes />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Supply Chain & Operations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Purchase executives, warehouse supervisors, plant engineers, and dispatch leads seeking ERP logistics mastery.
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block pt-1">
                Best Tracks: SAP MM, SD, PP
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-lg">
                <FaCode />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Developers & IT Aspirants</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Software developers, database coders, or manual testers looking for stability and higher compensation in SAP ABAP & S/4HANA.
              </p>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block pt-1">
                Best Track: SAP ABAP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: BATCH SCHEDULE & LOGISTICS
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-blue-900">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider inline-block">
                Batch Timings & Class Logistics
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Designed for College Students & Working Professionals
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Attend live from your laptop or smartphone without taking leaves. All live sessions take place in the evening, and full recordings are provided within 2 hours.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                    <FaClock /> Weekday Evening Cohort
                  </span>
                  <p className="text-slate-200 font-semibold">7:30 PM - 8:30 PM IST (Mon - Sun)</p>
                  <p className="text-slate-400 text-[11px]">1 hour live presentation + 15 mins doubt clearing</p>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-blue-400 font-bold block flex items-center gap-1.5">
                    <FaLaptopCode /> Delivery Mode & Medium
                  </span>
                  <p className="text-slate-200 font-semibold">Live Google Meet / Zoom</p>
                  <p className="text-slate-400 text-[11px]">Bilingual explanations (Simple English + Hindi)</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto text-xl font-black">
                🎁
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Seats Reserved on First-Come Basis</h4>
                <p className="text-xs text-slate-300">
                  Batches are capped at 50 students to ensure every participant gets individual mentor attention and doubt resolution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => scrollToForm()}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaGift />
                <span>Enroll in Next Monday Batch (Free)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: VERIFIABLE CERTIFICATE SHOWCASE
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wide">
              <FaGraduationCap className="text-amber-500" />
              <span>Official Credential</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Earn an ISO 9001:2015 & NSDC Aligned Certificate
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Prove your foundation in enterprise SAP ERP consulting. Upon attending the 7 days and completing the interactive quiz, receive an authenticated certificate with a unique verification QR code.
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Shareable directly to your LinkedIn Licenses & Certifications section</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Unique Verification URL and tamper-proof QR code</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>Recognized by top IT staffing firms and enterprise recruiters across India</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span>100% Free issuance upon completion — no extra certificate fees</span>
              </div>
            </div>
          </div>

          {/* Certificate Mockup Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-amber-300 dark:border-amber-600/50 shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-amber-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-black tracking-widest text-blue-900 dark:text-blue-400 uppercase">
                  INXYME LEARNING ACADEMY
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-950/80">
                  ISO 9001:2015 CERTIFIED
                </span>
              </div>

              <div className="py-2 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                  Certificate of Completion
                </span>
                <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 dark:text-white">
                  7-Day Live SAP ERP Masterclass
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto pt-1 italic">
                  Presented to the participant for demonstrated foundational knowledge in SAP FICO, MM, SD, PP & ABAP architecture.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-amber-200 dark:border-slate-700 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="text-left">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">ID: INX-SAP-FREE-2026</span>
                  <span>Verifiable Online</span>
                </div>
                <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">
                  QR CODE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQ Accordion)
      ===================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
              <FaQuestionCircle className="text-blue-600" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Everything you need to know about Inxyme&apos;s 7-Day Free SAP Live Masterclass.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-blue-600 dark:text-blue-400 shrink-0">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: BOTTOM CTA STRIP (Scroll-to-Form Trigger)
      ===================================================================== */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-black uppercase tracking-wider">
            ⚡ Don&apos;t Miss This Cohort
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Reserve Your 100% Free SAP Live Masterclass Seat Today
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Zero admission fee, live system demos, ISO certified faculty, and verified certification.
            Seats are strictly capped at 50 students per cohort.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToForm()}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-xl shadow-xl transition-all hover:scale-[1.03] flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaGift className="text-base text-slate-950" />
              <span>Scroll to Registration Form ↑</span>
            </button>

            <a
              href="https://wa.me/919990999561?text=Hi%2C%20I%20have%20questions%20regarding%20the%207%20Days%20Free%20SAP%20Live%20Class."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-lg text-emerald-400" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
