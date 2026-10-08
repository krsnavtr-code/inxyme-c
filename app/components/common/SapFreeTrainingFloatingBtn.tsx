"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaGift, FaTimes, FaFire, FaArrowRight } from "react-icons/fa";

export default function SapFreeTrainingFloatingBtn() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (pathname === "/7-days-free-sap-training") {
      const formEl = document.getElementById("free-registration-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    if (pathname === "/") {
      const section = document.getElementById("sap-free-training");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // If not on home page or section not found, dispatch open modal event
    window.dispatchEvent(
      new CustomEvent("open-sap-free-modal", {
        detail: { module: "All SAP Modules" },
      })
    );
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Free SAP Training Offer"
      className="fixed bottom-4 left-3 sm:bottom-6 sm:left-4 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-xs animate-fade-in transition-all duration-300"
    >
      {/* Mobile Compact Pill (Screen width < 640px) */}
      <div className="sm:hidden flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white pl-3 pr-1.5 py-1.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md">
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 text-left cursor-pointer"
        >
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
          </span>
          <span className="text-[11px] font-black tracking-tight whitespace-nowrap">
            🎁 7-Day Free SAP <span className="text-amber-300">(PP, MM, FICO...)</span>
          </span>
          <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shrink-0">
            Free
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center text-[10px] ml-0.5 shrink-0"
          aria-label="Dismiss banner"
        >
          <FaTimes />
        </button>
      </div>

      {/* Desktop Card (Screen width >= 640px) */}
      <div className="hidden sm:block relative group bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white p-3.5 rounded-2xl shadow-2xl shadow-blue-900/40 border border-white/20 backdrop-blur-md">
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900/90 text-white/80 hover:text-white flex items-center justify-center text-xs shadow-md transition-colors"
          title="Dismiss"
          aria-label="Dismiss banner"
        >
          <FaTimes className="text-[10px]" />
        </button>

        {/* Content */}
        <div onClick={handleClick} className="cursor-pointer space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <FaFire /> 100% Free Live Training
            </span>
          </div>

          <p className="text-[13px] font-black leading-tight text-white group-hover:text-amber-200 transition-colors">
            7 Days Free SAP Masterclass (PP, MM, ABAP, FICO, SD)
          </p>

          <div className="flex items-center justify-between text-[11px] font-bold text-blue-100 pt-0.5">
            <span className="underline decoration-amber-300 decoration-2 underline-offset-2 flex items-center gap-1">
              Register Free Now <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase">
              ₹0 Cost
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
