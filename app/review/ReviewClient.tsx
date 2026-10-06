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
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

const RATING_EMOTIONS = [
  {
    rating: 5,
    emoji: "🤩",
    label: "Outstanding! Best experience ever",
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
  },
  {
    rating: 4,
    emoji: "😊",
    label: "Very Good! Highly recommended",
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
  },
  {
    rating: 3,
    emoji: "🙂",
    label: "Good! Helpful learning",
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
  },
  {
    rating: 2,
    emoji: "😐",
    label: "Average! Can be improved",
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800",
  },
  {
    rating: 1,
    emoji: "🙁",
    label: "Not Satisfied",
    color: "text-rose-500",
    bg: "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800",
  },
];

const PREDEFINED_TAGS = [
  "👨‍🏫 Great Mentors",
  "💻 Practical Live Projects",
  "💡 Simple & Clear Teaching",
  "🤝 Instant Doubt Support",
  "🚀 Career / Placement Help",
  "📚 Quality Study Material",
  "🎯 Friendly Learning Environment",
  "💰 Value for Money",
];

export default function ReviewClient() {
  // Form State
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

  // API base URL
  const apiBaseUrl = useMemo(() => {
    const envUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4002/api";
    return envUrl.replace(/\/$/, "");
  }, []);

  // Toggle tag
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Submit Review Handler
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg mx-auto">
        {submittedSuccess ? (
          /* ================= SUCCESS STATE ================= */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-indigo-100 dark:border-slate-800 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Submitted Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Thank You, {studentName}! 🎉
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-sm mx-auto">
                Aapka review submit ho gaya hai. Inxyme par aapke honest feedback se hume aur baki students ko motivate karta hai!
              </p>
            </div>

            {/* Review Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 text-left border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rating:
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {reviewText && (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-2 border-t border-slate-200 dark:border-slate-700">
                  "{reviewText}"
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ================= MAIN REVIEW FORM ================= */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Inxyme Student Review
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Kaisa Laga Inxyme me Padhke?
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                Sirf <span className="font-semibold text-indigo-600 dark:text-indigo-400">2-3 clicks</span> me apna review share karein!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CLICK 1: Star Rating */}
              <div className="space-y-3 text-center bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Rate Your Experience
                  </span>
                </div>

                {/* Stars Grid */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="group p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                        aria-label={`${star} Stars`}
                      >
                        <Star
                          className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                            isFilled
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                              : "text-slate-300 dark:text-slate-700 fill-transparent hover:text-amber-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Emotion Badge */}
                {activeEmotion && (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${activeEmotion.bg}`}
                  >
                    <span className="text-base">{activeEmotion.emoji}</span>
                    <span className={activeEmotion.color}>{activeEmotion.label}</span>
                  </div>
                )}
              </div>

              {/* CLICK 2: Quick Highlights (Tap-to-select chips) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Sabse accha kya laga? (Tap 1-2 chips)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PREDEFINED_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CLICK 3: Student Details & Thoughts */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Aapki Jankari & Review
                  </span>
                </div>

                {/* Name & Phone in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Aapka Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Phone / WhatsApp (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Aapka Anubhav / Review (Optional - Chahein to course name bhi likh sakte hain)
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="e.g. Maine Inxyme se Data Science padha. Sir ne sab kuch practically sikhaya aur doubts time par clear kiye..."
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Big Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 fill-white text-white" />
                    Submit Review 🚀
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400">
                🔒 Aapki contact details safe hain aur kisi ke sath share nahi ki jayegi.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
