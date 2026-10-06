"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  ArrowRight,
  Check,
  User,
  Phone,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const RATING_EMOTIONS = [
  {
    rating: 5,
    emoji: "🤩",
    label: "Outstanding! Loved it",
    color: "text-amber-500",
    bg: "bg-amber-50/80 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
  },
  {
    rating: 4,
    emoji: "😊",
    label: "Very Good! Highly recommended",
    color: "text-emerald-500",
    bg: "bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
  },
  {
    rating: 3,
    emoji: "🙂",
    label: "Good! Valuable learning",
    color: "text-blue-500",
    bg: "bg-blue-50/80 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
  },
  {
    rating: 2,
    emoji: "😐",
    label: "Average! Room for improvement",
    color: "text-orange-500",
    bg: "bg-orange-50/80 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800",
  },
  {
    rating: 1,
    emoji: "🙁",
    label: "Not Satisfied",
    color: "text-rose-500",
    bg: "bg-rose-50/80 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800",
  },
];

const PREDEFINED_TAGS = [
  "👨‍🏫 Great Mentors",
  "💻 Practical Live Projects",
  "💡 Simple Explanations",
  "🤝 Instant Doubt Support",
  "🚀 Career Guidance",
  "📚 Quality Material",
];

export default function ReviewClient() {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "👨‍🏫 Great Mentors",
    "💻 Practical Live Projects",
  ]);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [reviewText, setReviewText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const apiBaseUrl = useMemo(() => {
    const envUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4002/api";
    return envUrl.replace(/\/$/, "");
  }, []);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating!");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write your review or experience!");
      return;
    }

    if (reviewText.trim().length < 5) {
      toast.error("Review must be at least 5 characters long!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentPhone: studentPhone.trim(),
          rating,
          tags: selectedTags,
          reviewText: reviewText.trim(),
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to submit review");
      }

      setSubmittedSuccess(true);
      toast.success("Review submitted successfully! Thank you 🎉");
    } catch (err: any) {
      console.error("Submit review error:", err);
      toast.error(err.message || "Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeEmotion = RATING_EMOTIONS.find(
    (e) => e.rating === (hoverRating || rating)
  );

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 px-3 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md mx-auto">
        {submittedSuccess ? (
          /* ================= SUCCESS STATE ================= */
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-100 dark:border-slate-800 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <img
                src="https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png"
                alt="Inxyme Logo"
                className="h-7 w-auto object-contain"
              />
            </div>

            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-50/50">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                <Sparkles className="w-3 h-3" />
                Verified Feedback
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Thank You, {studentName}! 🎉
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs max-w-xs mx-auto">
                Aapka review successfully submit ho gaya hai. Isse dusre students ko bhi help milegi!
              </p>
            </div>

            <div className="pt-2 flex gap-2 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                Explore Courses
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
              >
                Home
              </Link>
            </div>
          </div>
        ) : (
          /* ================= COMPACT MAIN REVIEW FORM ================= */
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 sm:p-7 shadow-xl border border-indigo-100/80 dark:border-slate-800 space-y-4">

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <img
                  src="https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png"
                  alt="Inxyme Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Quick Student Review
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                How was your learning experience?
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* STAR RATING SECTION */}
              <div className="text-center bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                        aria-label={`${star} Stars`}
                      >
                        <Star
                          className={`w-8 h-8 sm:w-9 sm:h-9 transition-all ${isFilled
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                              : "text-slate-300 dark:text-slate-700 fill-transparent hover:text-amber-200"
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {activeEmotion && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all ${activeEmotion.bg}`}
                  >
                    <span>{activeEmotion.emoji}</span>
                    <span className={activeEmotion.color}>{activeEmotion.label}</span>
                  </div>
                )}
              </div>

              {/* QUICK HIGHLIGHT TAGS (Compact Grid) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  What stood out most? <span className="text-[10px] text-slate-700 font-normal">(Select tags)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 border border-slate-300 dark:border-slate-700 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${isSelected
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-[1.02]"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STUDENT INPUTS (2-Column Grid to save vertical space) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-700 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400 mb-1">
                    Phone / WhatsApp <span className="text-[10px] text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-700 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="e.g. +91 98765..."
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* REVIEW TEXTAREA (Required with proper validation) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400">
                    Your Review / Experience <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {reviewText.trim().length > 0 ? `${reviewText.trim().length}/2000` : "Min 5 characters"}
                  </span>
                </div>
                <textarea
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience (course, mentors, what you learned, etc.)..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none transition-all"
                />
                {reviewText.length > 0 && reviewText.trim().length < 5 && (
                  <p className="text-[10px] text-rose-500 mt-0.5">
                    Please enter at least 5 characters (currently {reviewText.trim().length}).
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-white text-white" />
                    Submit Review 🚀
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-slate-400">
                🔒 Your details are secure and confidential.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}