"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt,
  FaClock,
  FaGift,
  FaWhatsapp,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../../api/contactApi";

interface SapFreeTrainingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultModule?: string;
}

const SAP_MODULES = [
  { id: "SAP FICO", name: "SAP FICO (Finance & Controlling)", type: "Functional" },
  { id: "SAP MM", name: "SAP MM (Materials Management)", type: "Functional" },
  { id: "SAP SD", name: "SAP SD (Sales & Distribution)", type: "Functional" },
  { id: "SAP PP", name: "SAP PP (Production Planning)", type: "Functional" },
  { id: "SAP ABAP", name: "SAP ABAP (Advanced Programming)", type: "Technical" },
  { id: "All SAP Modules", name: "All Modules (Need Counselor Guidance)", type: "Full Access" },
];

export default function SapFreeTrainingModal({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  defaultModule = "All SAP Modules",
}: SapFreeTrainingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(defaultModule);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "Fresher / Looking for 1st Job",
  });

  const isControlled = typeof propsIsOpen === "boolean";
  const isOpen = isControlled ? propsIsOpen : internalOpen;

  // Custom Event Listener to allow opening from anywhere on the website
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ module?: string }>;
      if (customEvent.detail?.module) {
        setSelectedModule(customEvent.detail.module);
      }
      if (!isControlled) {
        setInternalOpen(true);
      }
    };

    window.addEventListener("open-sap-free-modal", handleOpenEvent);
    return () => {
      window.removeEventListener("open-sap-free-modal", handleOpenEvent);
    };
  }, [isControlled]);

  useEffect(() => {
    if (defaultModule) {
      setSelectedModule(defaultModule);
    }
  }, [defaultModule]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (propsOnClose) {
      propsOnClose();
    } else {
      setInternalOpen(false);
    }
    // Reset state after slight delay
    setTimeout(() => {
      setIsSubmitted(false);
    }, 300);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields");
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
        subject: `7-Day Free SAP Training Registration - ${selectedModule}`,
        courseTitle: selectedModule,
        message: `Registered for 7 Days Free SAP Live Training Bootcamp.\nModule Interest: ${selectedModule}\nProfile: ${formData.experienceLevel}`,
        agreedToTerms: true,
      };

      const result = await submitContactForm(submissionData);

      if (result.success || result._id || result.message) {
        setIsSubmitted(true);
        toast.success("Registration Successful! Your 7-Day Free Class Seat is Reserved.");
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
          "Registration failed. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Ribbon */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 shrink-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes className="text-sm" />
        </button>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Header */}
          <div className="text-left mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FaGift className="text-amber-500 animate-bounce" />
              100% Free • No Credit Card Required
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              7 Days Free SAP Masterclass
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Live interactive classes across <strong className="text-blue-600 dark:text-blue-400">SAP (PP, MM, ABAP, FICO, SD)</strong> by industry veterans.
            </p>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 justify-center">
              <FaCalendarAlt className="text-blue-500 shrink-0" />
              <span>7 Days Live</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-slate-200 dark:border-slate-700">
              <FaClock className="text-amber-500 shrink-0" />
              <span>1 Hr Daily</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <FaGraduationCap className="text-emerald-500 shrink-0" />
              <span>Free Cert</span>
            </div>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <FaCheckCircle className="text-3xl" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Seat Reserved Successfully! 🎉
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                  We have reserved your slot for the <strong className="text-blue-600 dark:text-blue-400">{selectedModule}</strong> 7-day free training batch.
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 text-left text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <FaShieldAlt /> Next Steps:
                </p>
                <p>• Our academic counselor will WhatsApp/call you with class timing & meeting link.</p>
                <p>• Class access details and SAP study materials will be shared 2 hours before the start.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/919990999561?text=Hi%20Inxyme%2C%20I%20just%20registered%20for%20the%207%20Days%20Free%20SAP%20Training%20batch.%20Please%20share%20the%20class%20schedule."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <FaWhatsapp className="text-sm" /> Join WhatsApp Group
                </a>
                <button
                  onClick={handleClose}
                  className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Module Selector Chips */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select SAP Track / Module <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SAP_MODULES.map((mod) => (
                    <button
                      type="button"
                      key={mod.id}
                      onClick={() => setSelectedModule(mod.id)}
                      className={`py-1.5 px-2 rounded-lg text-left text-xs transition-all border ${
                        selectedModule === mod.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                          : "bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 font-medium"
                      }`}
                    >
                      <span className="block truncate">{mod.id}</span>
                      <span
                        className={`text-[9px] block uppercase tracking-wider ${
                          selectedModule === mod.id
                            ? "text-blue-100"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {mod.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 text-xs" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      placeholder="name@email.com"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Mobile <span className="text-rose-500">*</span>
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
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Current Profile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Profile / Status
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="College Student (Final / Pre-final Year)">
                    College Student (Final / Pre-final Year)
                  </option>
                  <option value="Fresher / Looking for 1st Job">
                    Fresher / Looking for 1st Job
                  </option>
                  <option value="Working Professional (Looking to switch to SAP)">
                    Working Professional (Looking to switch to SAP)
                  </option>
                  <option value="Non-IT / Finance / Operations Background">
                    Non-IT / Finance / Operations Background
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Free Seat...</span>
                  </div>
                ) : (
                  <>
                    <span>Register For 7 Days Free Class</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="text-emerald-500" /> 100% Free • No Spam
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  ⚡ Limited to 50 Seats per Batch
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
