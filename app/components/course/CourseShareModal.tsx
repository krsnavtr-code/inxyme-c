"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaXmark,
  FaWhatsapp,
  FaLinkedin,
  FaXTwitter,
  FaTelegram,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaWandMagicSparkles,
  FaUserPlus,
  FaShareNodes,
} from "react-icons/fa6";
import {
  encodeClientToken,
  buildMagicCourseUrl,
  buildWhatsAppShareUrl,
} from "../../utils/magicLink";
import type { CourseData } from "../../lib/server-api";

interface CourseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | any;
  currentUser?: {
    name?: string;
    fullname?: string;
    email?: string;
    phone?: string;
  } | null;
}

export default function CourseShareModal({
  isOpen,
  onClose,
  course,
  currentUser,
}: CourseShareModalProps) {
  const [activeTab, setActiveTab] = useState<"quick" | "magic">("quick");
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [generatedMagicLink, setGeneratedMagicLink] = useState("");
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href.split("?")[0]
      : `https://www.inxyme.com/course/${course.slug || ""}`;

  const senderName = currentUser?.fullname || currentUser?.name || "";

  // Handle standard link copy
  const handleCopyLink = (urlToCopy?: string) => {
    const text = urlToCopy || currentUrl;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate a personalized Magic Link for a student / friend
  const handleGenerateMagicLink = (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendName.trim() && !friendPhone.trim() && !friendEmail.trim()) {
      toast.error("Please enter at least a name or phone number");
      return;
    }

    const token = encodeClientToken({
      name: friendName.trim(),
      phone: friendPhone.trim(),
      email: friendEmail.trim(),
      courseTitle: course.title,
      courseSlug: course.slug,
    });

    const magicUrl = buildMagicCourseUrl(course.slug || "", token);
    const waUrl = buildWhatsAppShareUrl({
      phone: friendPhone.trim(),
      courseTitle: course.title,
      shareUrl: magicUrl,
      recipientName: friendName.trim(),
      senderName,
    });

    setGeneratedMagicLink(magicUrl);
    setGeneratedWhatsAppUrl(waUrl);
    toast.success("Magic Link generated! Ready to send on WhatsApp ✨");
  };

  // Quick WhatsApp share for current course
  const quickWhatsAppUrl = buildWhatsAppShareUrl({
    courseTitle: course.title,
    shareUrl: currentUrl,
    senderName,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <FaShareNodes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Share Course</h3>
              <p className="text-xs text-blue-100 truncate max-w-[280px]">
                {course.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("quick")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "quick"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FaShareNodes className="w-3.5 h-3.5" />
            Quick Share
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("magic")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "magic"
                ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Pre-filled Magic Link (3x Conversion)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === "quick" ? (
            <>
              {/* WhatsApp Quick Share Button (Top Highlight) */}
              <a
                href={quickWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
              >
                <FaWhatsapp className="w-5 h-5" />
                Share on WhatsApp
              </a>

              {/* Direct Copy Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Course Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 select-all"
                  />
                  <button
                    onClick={() => handleCopyLink(currentUrl)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="w-3.5 h-3.5 text-emerald-300" /> Copied
                      </>
                    ) : (
                      <>
                        <FaCopy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Share via Social
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <FaLinkedin className="w-5 h-5 text-blue-700" />
                    <span className="text-[11px] font-medium">LinkedIn</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${course.title} on Inxyme:`)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <FaXTwitter className="w-5 h-5 text-slate-900 dark:text-white" />
                    <span className="text-[11px] font-medium">X (Twitter)</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Check out ${course.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <FaTelegram className="w-5 h-5 text-sky-500" />
                    <span className="text-[11px] font-medium">Telegram</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(`Check out this course on Inxyme: ${currentUrl}`)}`}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <FaEnvelope className="w-5 h-5 text-amber-600" />
                    <span className="text-[11px] font-medium">Email</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Magic Link Generator Section */}
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <FaWandMagicSparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Pre-filled Magic Link Generator
                </div>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                  Enter student or friend's details below. When they open the link, their name and number will already be filled in the form — they only have to tap Submit!
                </p>
              </div>

              <form onSubmit={handleGenerateMagicLink} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student / Friend Name
                  </label>
                  <input
                    type="text"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FaWandMagicSparkles className="w-3.5 h-3.5" />
                  Generate Magic Link
                </button>
              </form>

              {/* Generated Result */}
              {generatedMagicLink && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <FaCheck className="w-3.5 h-3.5" />
                      Magic Link Ready!
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(generatedMagicLink)}
                      className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <FaCopy className="w-3 h-3" /> Copy
                    </button>
                  </div>

                  <input
                    type="text"
                    readOnly
                    value={generatedMagicLink}
                    className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 select-all"
                  />

                  {/* Send on WhatsApp Button */}
                  <a
                    href={generatedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    Send via WhatsApp to {friendName || "Student"}
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Inxyme Learning Portal</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
