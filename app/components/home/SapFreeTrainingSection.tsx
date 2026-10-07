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
    icon: <FaFileInvoiceDollar className="text-lg sm:text-xl" />,
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
    icon: <FaBoxes className="text-lg sm:text-xl" />,
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
    icon: <FaChartLine className="text-lg sm:text-xl" />,
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
    icon: <FaCogs className="text-lg sm:text-xl" />,
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
    icon: <FaCode className="text-lg sm:text-xl" />,
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
    title: "Cross-Module Integration",
    detail: "How FI connects with MM, SD with FI, and PP with MM during live operations.",
  },
  {
    day: "Day 5",
    title: "Real-Time Case Study & Live Demo",
    detail: "Step-by-step corporate client scenario walkthrough on a live SAP server.",
  },
  {
    day: "Day 6",
    title: "Troubleshooting, Errors & Configuration Hacks",
    detail: "How consultants resolve production issues, dumps, and client change requests.",
  },
  {
    day: "Day 7",
    title: "Career Roadmap & Certification",
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
        toast.success("Successfully registered for the 7-Day Free SAP Masterclass!");
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
      className="relative w-full px-2.5 sm:px-4 lg:px-6 py-4 sm:py-8 overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* ==================================================================
            SECTION HEADER (Compact & Professional)
        ================================================================== */}
        <div className="text-center max-w-5xl mx-auto space-y-2 mb-4 sm:mb-6 px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-wide uppercase shadow-2xs">
            <span className="flex h-1.5 w-1.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <FaFire className="text-red-500 shrink-0 text-[10px]" />
            <span>100% Free • 7-Day Live SAP Bootcamp</span>
          </div>

          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Master In-Demand SAP Modules For Free{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              In 7 Days
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive <strong>7-Day 100% Free Live SAP Training Program</strong> covering industry-leading modules:{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              SAP PP, MM, ABAP, FICO & SD
            </span>. Zero admission fee, expert trainers, live system demo, and verified certification.
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 justify-center">
              <FaGraduationCap className="text-blue-600 text-xs shrink-0" />
              <span>Free Certificate</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 justify-center">
              <FaChalkboardTeacher className="text-amber-500 text-xs shrink-0" />
              <span>Certified Faculty</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 justify-center">
              <FaLaptopCode className="text-emerald-500 text-xs shrink-0" />
              <span>Live System Demo</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 justify-center">
              <FaShieldAlt className="text-purple-500 text-xs shrink-0" />
              <span>Zero Cost</span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            MAIN WORKSPACE: MODULE SHOWCASE + REGISTRATION FORM
        ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* -------------------------------------------------------------
              LEFT COLUMN: 5 SAP MODULE TABS & CURRICULUM SNAPSHOT
          ------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-3 w-full">
            {/* Module Selection Grid */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
                {SAP_MODULES.map((mod, index) => {
                  const isActive = activeModuleId === mod.id;
                  const isLastOnMobile = index === 4;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModuleId(mod.id);
                        setSelectedModule(mod.id);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${isLastOnMobile ? "col-span-2 sm:col-span-1" : ""
                        } ${isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs scale-[1.01]"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
                        }`}
                    >
                      <span className="truncate leading-tight text-[11px]">{mod.shortName}</span>
                      <span
                        className={`hidden sm:inline-block text-[8px] px-1 py-0.2 rounded uppercase font-extrabold ${isActive
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
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900 shrink-0">
                    {activeModule.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {activeModule.tag}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Avg Salary: {activeModule.salary}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5 leading-tight">
                      {activeModule.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectModuleForForm(activeModule.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-lg shadow-xs transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
                >
                  <FaGift className="text-xs" /> Enroll Free in {activeModule.shortName}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeModule.description}
              </p>

              {/* Topics Covered */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5 flex items-center gap-1">
                  <FaCheckCircle className="text-emerald-500 shrink-0 text-xs" />
                  Key Topics Covered in 7 Days:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeModule.dayTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-medium leading-tight">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Roles */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Target Roles:
                </span>
                {activeModule.careerRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* 7-Day Timeline Schedule Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-600 shrink-0 text-xs" /> 7-Day Masterclass Roadmap
                </h4>
                <span className="self-start xs:self-auto text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Daily 1-Hour Live Class
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CURRICULUM_DAYS.map((cDay, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[8px] font-bold uppercase px-1 py-0.2 rounded bg-blue-600 text-white shrink-0">
                        {cDay.day}
                      </span>
                      <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {cDay.title}
                      </h5>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      {cDay.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: INSTANT REGISTRATION FORM
          ------------------------------------------------------------- */}
          <div id="sap-free-form" className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-xl relative overflow-hidden space-y-3">
              {/* Urgency Badge */}
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-amber-600 dark:text-amber-400 animate-pulse text-[11px]" />
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    Next Free Cohort Starts Monday
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-amber-500 text-white shrink-0">
                  Limited Seats
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Free Student Registration
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                  Reserve Your Free Seat Now
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Fill in your details to receive class schedule, meeting link & study material.
                </p>
              </div>

              {isSubmitted ? (
                /* Success Card */
                <div className="py-4 text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Registration Confirmed!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xs mx-auto">
                      Your seat for the <strong>{selectedModule}</strong> 7-day free batch has been successfully reserved.
                    </p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5 text-left text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <FaShieldAlt /> Next Steps:
                    </p>
                    <p>• Schedule & meeting links will be shared via WhatsApp.</p>
                    <p>• Daily live mentor guidance & doubt clearing included.</p>
                  </div>

                  <div className="pt-1 space-y-1.5">
                    <a
                      href="https://wa.me/919990999561?text=Hi%2C%20I%20have%20registered%20for%20the%207%20Days%20Free%20SAP%20Training%20batch.%20Please%20send%20the%20batch%20schedule."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <FaWhatsapp className="text-sm" /> Join WhatsApp Batch Group
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Register another student
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Preferred SAP Track <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedModule}
                      onChange={(e) => {
                        setSelectedModule(e.target.value);
                        setActiveModuleId(e.target.value);
                      }}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="SAP FICO">SAP FICO (Financial Accounting & Controlling)</option>
                      <option value="SAP MM">SAP MM (Materials Management & Procurement)</option>
                      <option value="SAP SD">SAP SD (Sales & Distribution)</option>
                      <option value="SAP PP">SAP PP (Production Planning)</option>
                      <option value="SAP ABAP">SAP ABAP (Programming & Technical)</option>
                      <option value="All SAP Modules">All 5 Modules (Explore Everything)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-7 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        className="w-full pl-7 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength={12}
                        className="w-full pl-7 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Current Profile / Status
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="College Student (Final / Pre-final Year)">
                        College Student (Final / Pre-final Year)
                      </option>
                      <option value="Fresher / Looking for 1st Job">
                        Fresher / Graduate Looking for 1st Job
                      </option>
                      <option value="Working Professional (Switching to SAP)">
                        Working Professional (Switching to SAP)
                      </option>
                      <option value="Business / Operations / Finance Domain">
                        Business / Operations / Finance Domain
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Reserving Seat...</span>
                      </div>
                    ) : (
                      <>
                        <FaGift className="text-amber-300 text-xs" />
                        <span>Register For 7-Day Free SAP Class</span>
                        <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="pt-1 text-center space-y-0.5">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
                      <FaShieldAlt className="text-emerald-500 shrink-0 text-[10px]" /> 100% Free • No Credit Card Required
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      ⚡ Over 1,200+ students already trained!
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