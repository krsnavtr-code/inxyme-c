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
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../../api/contactApi";

interface SapModule {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  category: "Functional" | "Technical";
  icon: React.ReactNode;
  salary: string;
  description: string;
  dayTopics: string[];
  careerRoles: string[];
}

const SAP_MODULES: SapModule[] = [
  {
    id: "SAP FICO",
    name: "SAP FICO (Financial Accounting & Controlling)",
    shortName: "SAP FICO",
    tag: "Finance & Accounts",
    category: "Functional",
    icon: <FaFileInvoiceDollar className="text-xl sm:text-2xl" />,
    salary: "₹6 - 15 LPA",
    description:
      "Master corporate financial reporting, general ledgers, AP/AR, asset accounting, cost center planning & management accounting.",
    dayTopics: [
      "SAP FI Enterprise Structure & G/L Master Setup",
      "Accounts Payable & Receivable (AP / AR) Workflows",
      "Asset Accounting & Financial Statement Versions",
      "Controlling (CO) Cost Centers & Profit Centers",
    ],
    careerRoles: ["SAP FICO Consultant", "Financial Systems Analyst", "ERP Finance Specialist"],
  },
  {
    id: "SAP MM",
    name: "SAP MM (Materials Management & Procurement)",
    shortName: "SAP MM",
    tag: "Supply Chain & Purchase",
    category: "Functional",
    icon: <FaBoxes className="text-xl sm:text-2xl" />,
    salary: "₹5.5 - 14 LPA",
    description:
      "Learn end-to-end Procure-to-Pay (P2P), inventory management, purchase orders, goods receipt, material master & vendor evaluation.",
    dayTopics: [
      "Procure-to-Pay (P2P) Full Cycle Architecture",
      "Material Master & Vendor Master Configuration",
      "Purchase Orders, Goods Receipt (MIGO) & Invoicing",
      "Physical Inventory & Valuation Controls",
    ],
    careerRoles: ["SAP MM Consultant", "Procurement ERP Analyst", "Supply Chain Consultant"],
  },
  {
    id: "SAP SD",
    name: "SAP SD (Sales & Distribution)",
    shortName: "SAP SD",
    tag: "Sales & Logistics",
    category: "Functional",
    icon: <FaChartLine className="text-xl sm:text-2xl" />,
    salary: "₹5.5 - 13 LPA",
    description:
      "Master the Order-to-Cash (O2C) lifecycle, customer hierarchies, sales inquiries, quotation, delivery orders, shipping & invoice generation.",
    dayTopics: [
      "Order-to-Cash (O2C) Business Architecture",
      "Customer Master & Pricing Procedures",
      "Sales Order Processing & Credit Management",
      "Delivery, Shipping, PGI & Billing (VF01) Workflows",
    ],
    careerRoles: ["SAP SD Consultant", "Order Management Analyst", "ERP Logistics Specialist"],
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
      "Understand enterprise production lifecycles, Bill of Materials (BOM), routings, work centers, MRP runs and shop floor execution.",
    dayTopics: [
      "Production Planning Lifecycle & Master Data (BOM & Routings)",
      "Work Centers, Capacities & Costing Basics",
      "Material Requirements Planning (MRP) Run Logic",
      "Production Order Creation, Release & Confirmation",
    ],
    careerRoles: ["SAP PP Consultant", "Production Planner", "Manufacturing ERP Consultant"],
  },
  {
    id: "SAP ABAP",
    name: "SAP ABAP (Advanced Business Application Programming)",
    shortName: "SAP ABAP",
    tag: "Core ERP Development",
    category: "Technical",
    icon: <FaCode className="text-xl sm:text-2xl" />,
    salary: "₹6 - 16 LPA",
    description:
      "The premier coding engine of SAP. Learn ABAP syntax, Data Dictionary (SE11), classical & interactive reports, ALV grids, BAPIs & S/4HANA intro.",
    dayTopics: [
      "ABAP Architecture, Workbench & Data Dictionary (SE11)",
      "Internal Tables, Open SQL & Data Fetching logic",
      "Interactive & Modern ALV Grid Reporting",
      "BAPIs, Function Modules & Debugging Essentials",
    ],
    careerRoles: ["SAP ABAP Developer", "Technical ERP Consultant", "S/4HANA ABAP Programmer"],
  },
];

const CURRICULUM_DAYS = [
  {
    day: "Day 1",
    title: "SAP ERP Architecture & System Navigation",
    detail: "ERP ecosystem, GUI vs Fiori navigation, and industry landscape.",
  },
  {
    day: "Day 2",
    title: "Enterprise Structure & Organization Units",
    detail: "Company Code, Plant, Sales Org, Purchasing Org & Chart of Accounts.",
  },
  {
    day: "Day 3",
    title: "Master Data & Core T-Codes",
    detail: "Hands-on practice with critical everyday T-codes across PP, MM, ABAP, FICO & SD.",
  },
  {
    day: "Day 4",
    title: "Cross-Module Integration (The Real Power)",
    detail: "How FI connects with MM, SD with FI, and PP with MM during live operations.",
  },
  {
    day: "Day 5",
    title: "Real-Time Business Case Study & Live System Demo",
    detail: "Step-by-step corporate client scenario walkthrough on a live SAP server.",
  },
  {
    day: "Day 6",
    title: "Troubleshooting, Errors & Configuration Hacks",
    detail: "How consultants resolve production issues, dumps, and client change requests.",
  },
  {
    day: "Day 7",
    title: "Career Roadmap, Resume Tips & Free Certificate",
    detail: "Top interview questions, job search strategy, profile branding & certificate issuance.",
  },
];

export default function SapFreeTrainingSection() {
  const [activeModuleId, setActiveModuleId] = useState("SAP FICO");
  const [selectedModule, setSelectedModule] = useState("SAP FICO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "Fresher / Looking for 1st Job",
  });

  const activeModule =
    SAP_MODULES.find((m) => m.id === activeModuleId) || SAP_MODULES[0];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectModuleForForm = (moduleId: string) => {
    setSelectedModule(moduleId);
    setActiveModuleId(moduleId);
    // Smooth scroll down to form
    const formElement = document.getElementById("sap-free-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        courseTitle: selectedModule,
        subject: `7-Day Free SAP Training Registration - ${selectedModule}`,
        message: `Registered from Home Page 7 Days Free SAP Masterclass Section.\nModule Preference: ${selectedModule}\nCurrent Profile: ${formData.experienceLevel}`,
        agreedToTerms: true,
      };

      const result = await submitContactForm(submissionData);

      if (result.success || result._id || result.message) {
        setIsSubmitted(true);
        toast.success("Awesome! You are successfully registered for the 7 Days Free SAP Class.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          experienceLevel: "Fresher / Looking for 1st Job",
        });
      } else {
        toast.error(result.message || "Failed to register. Please try again.");
      }
    } catch (error: any) {
      console.error("SAP Free Registration Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to register. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="sap-free-training"
      className="relative w-full px-2.5 sm:px-4 lg:px-6 py-6 sm:py-12 overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* ==================================================================
            SECTION HEADER (Mobile-Optimized)
        ================================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-2.5 sm:space-y-3 mb-6 sm:mb-10 px-1">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-black tracking-wide uppercase shadow-xs max-w-full">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
            </span>
            <FaFire className="text-red-500 shrink-0" />
            <span className="truncate">100% Free • 7 Days Live SAP Bootcamp</span>
          </div>

          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
            Learn Top SAP Modules For Free{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              In 7 Days Live Training
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
            Hum de rahe hain sabhi students ko <strong>7 Days Ki 100% Free Live SAP Training</strong>. 
            Covering industry ke sabse demanded modules —{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              SAP PP, MM, ABAP, FICO & SD
            </span>. Zero admission fee, live corporate trainers, hands-on system demo & verified certificate!
          </p>

          {/* Quick Metrics Grid (2x2 on Mobile, Inline on Desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-3 pt-1 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs justify-center text-center">
              <FaGraduationCap className="text-blue-600 text-sm shrink-0" /> 
              <span className="truncate">Free Certificate</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs justify-center text-center">
              <FaChalkboardTeacher className="text-amber-500 text-sm shrink-0" /> 
              <span className="truncate">Certified Faculty</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs justify-center text-center">
              <FaLaptopCode className="text-emerald-500 text-sm shrink-0" /> 
              <span className="truncate">Live System Demo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs justify-center text-center">
              <FaShieldAlt className="text-purple-500 text-sm shrink-0" /> 
              <span className="truncate">₹0 Zero Cost</span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            MAIN WORKSPACE: MODULE SHOWCASE + REGISTRATION FORM
        ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* -------------------------------------------------------------
              LEFT COLUMN: 5 SAP MODULE TABS & CURRICULUM SNAPSHOT
          ------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 w-full">
            {/* Module Selection Grid (Responsive 2-col on Mobile, 5-col on Desktop) */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
                {SAP_MODULES.map((mod, index) => {
                  const isActive = activeModuleId === mod.id;
                  const isLastOnMobile = index === 4; // ABAP
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModuleId(mod.id);
                        setSelectedModule(mod.id);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                        isLastOnMobile ? "col-span-2 sm:col-span-1" : ""
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
                      }`}
                    >
                      <span className="truncate leading-tight">{mod.shortName}</span>
                      <span
                        className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-md uppercase font-extrabold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {mod.category === "Technical" ? "Tech" : "Func"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Module Detail Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden space-y-4 sm:space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900 shrink-0">
                    {activeModule.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {activeModule.tag}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Avg Salary: {activeModule.salary}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1 leading-tight break-words">
                      {activeModule.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectModuleForForm(activeModule.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-105 shrink-0 cursor-pointer"
                >
                  <FaGift className="text-sm" /> Enroll Free in {activeModule.shortName}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeModule.description}
              </p>

              {/* What will be covered during the 7 Days */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-500 shrink-0" />
                  Key Topics Covered in 7-Day Live Masterclass:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {activeModule.dayTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[9px] sm:text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-medium leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Target Roles:
                </span>
                {activeModule.careerRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* 7-Day Timeline Schedule Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 sm:space-y-4">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                <h4 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaCalendarAlt className="text-blue-600 shrink-0" /> 7-Day Masterclass Roadmap
                </h4>
                <span className="self-start xs:self-auto text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Daily 1-Hour Live Class
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {CURRICULUM_DAYS.map((cDay, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-600 text-white shrink-0">
                        {cDay.day}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {cDay.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {cDay.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: INSTANT REGISTRATION FORM (HIGH-CONVERTING)
          ------------------------------------------------------------- */}
          <div id="sap-free-form" className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-2xl shadow-blue-600/10 relative overflow-hidden space-y-4 sm:space-y-5">
              {/* Urgency Badge */}
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-amber-600 dark:text-amber-400 animate-pulse text-xs" />
                  <span className="text-[11px] sm:text-xs font-black text-amber-800 dark:text-amber-300">
                    Next Free Cohort Starts Monday
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0">
                  Limited Seats
                </span>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Free Student Registration
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
                  Reserve Your Free Seat Now
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Fill this quick form to receive class schedule, meeting link & SAP study guide.
                </p>
              </div>

              {isSubmitted ? (
                /* Success Card */
                <div className="py-4 sm:py-6 text-center space-y-3 sm:space-y-4 animate-fade-in">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
                    <FaCheckCircle className="text-2xl sm:text-3xl" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Registration Confirmed! 🎉
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                      Aapka seat <strong>{selectedModule}</strong> ke 7-day free training batch ke liye confirm ho gaya hai!
                    </p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 sm:p-4 text-left text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <FaShieldAlt /> Important Instructions:
                    </p>
                    <p>• Class timings and Google Meet/Zoom links will be sent on your WhatsApp.</p>
                    <p>• Live mentor guidance and doubt solving will be available every day.</p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <a
                      href="https://wa.me/919990999561?text=Hi%20Inxyme%2C%20I%20have%20registered%20for%20the%207%20Days%20Free%20SAP%20Training%20batch.%20Please%20send%20the%20batch%20schedule."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <FaWhatsapp className="text-base" /> Join Official Batch WhatsApp Group
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Register another student
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                  {/* Select Module Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Choose Your Preferred SAP Track <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedModule}
                      onChange={(e) => {
                        setSelectedModule(e.target.value);
                        setActiveModuleId(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="SAP FICO">SAP FICO (Financial Accounting & Controlling)</option>
                      <option value="SAP MM">SAP MM (Materials Management & Procurement)</option>
                      <option value="SAP SD">SAP SD (Sales & Distribution)</option>
                      <option value="SAP PP">SAP PP (Production Planning)</option>
                      <option value="SAP ABAP">SAP ABAP (Programming & Technical)</option>
                      <option value="All SAP Modules">All 5 Modules (I want to explore everything)</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 text-xs" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 text-xs" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* WhatsApp / Mobile */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 text-xs" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength={12}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Current Profile */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Status / Profile
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="College Student (Final / Pre-final Year)">
                        College Student (Final / Pre-final Year)
                      </option>
                      <option value="Fresher / Looking for 1st Job">
                        Fresher / Graduate Looking for 1st Job
                      </option>
                      <option value="Working Professional (Switching to SAP)">
                        Working Professional (Looking to switch to SAP)
                      </option>
                      <option value="Business / Operations / Finance Domain">
                        Business / Operations / Finance Domain
                      </option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Reserving Your Seat...</span>
                      </div>
                    ) : (
                      <>
                        <FaGift className="text-base text-amber-300" />
                        <span>Register For 7 Days Free SAP Class</span>
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center space-y-1">
                    <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 font-medium">
                      <FaShieldAlt className="text-emerald-500 shrink-0" /> 100% Free • No Credit Card Required
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      ⚡ Over 1,200+ students already trained at Inxyme!
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
