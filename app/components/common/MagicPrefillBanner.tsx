"use client";

import React from "react";
import { FaWandMagicSparkles, FaUserCheck, FaXmark } from "react-icons/fa6";

interface MagicPrefillBannerProps {
  name?: string;
  phone?: string;
  email?: string;
  isMagicLink?: boolean;
  onClear?: () => void;
  compact?: boolean;
}

export default function MagicPrefillBanner({
  name,
  phone,
  email,
  isMagicLink = false,
  onClear,
  compact = false,
}: MagicPrefillBannerProps) {
  if (!name && !phone && !email) return null;

  const displayName = name || (phone ? `Phone ending in ${phone.slice(-4)}` : "Returning Student");

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 mb-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs">
        <div className="flex items-center gap-1.5 truncate">
          <FaWandMagicSparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
          <span className="font-semibold truncate">
            {isMagicLink ? "Magic Link Active:" : "Welcome Back:"}
          </span>
          <span className="truncate">{displayName}</span>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] underline text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 shrink-0 ml-1"
            title="Clear and enter different details"
          >
            Not you?
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/40 border border-emerald-200/80 dark:border-emerald-700/50 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-xs shrink-0 mt-0.5">
            {isMagicLink ? (
              <FaWandMagicSparkles className="w-4 h-4 animate-bounce" />
            ) : (
              <FaUserCheck className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                {isMagicLink
                  ? "⚡ 1-Click Fast Enrollment"
                  : "👋 Welcome Back"}
              </h5>
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                Pre-Filled
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
              We've pre-filled your details for <strong className="text-slate-900 dark:text-white">{displayName}</strong>.
              Review and click <span className="font-semibold text-emerald-700 dark:text-emerald-400">'Submit'</span> to confirm!
            </p>
          </div>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors shrink-0"
            title="Clear pre-filled info"
            aria-label="Clear pre-filled info"
          >
            <FaXmark className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
