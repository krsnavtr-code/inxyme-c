"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import { FaTimes, FaWhatsapp, FaGift, FaBookOpen, FaCheckCircle, FaCopy, FaGraduationCap } from "react-icons/fa";
import { useExitIntent } from "../../hooks/useExitIntent";
import { usePartialLead } from "../../hooks/usePartialLead";
import { getOrCreateVisitorId } from "../../utils/visitorTracker";
import { getFingerprint } from "../../utils/visitorTracker";
import api from "../../utils/api";
import { submitContactForm } from "../../api/contactApi";

interface Course {
  _id: string;
  title?: string;
  slug?: string;
}

export default function ExitIntentModal() {
  const pathname = usePathname();
  const { isOpen, closeModal } = useExitIntent({ minDelay: 4000 });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    courseId: "",
    courseTitle: "",
  });
  const [courses, setCourses] = useState<Course[]>([
    { _id: "mern-stack", title: "MERN Stack Web Development" },
    { _id: "python-fullstack", title: "Python Full Stack Developer" },
    { _id: "digital-marketing", title: "Advanced Digital Marketing & SEO" },
    { _id: "data-analytics", title: "Data Analytics & Business Intelligence" },
    { _id: "ui-ux-design", title: "UI/UX Design Masterclass" },
    { _id: "cloud-devops", title: "Cloud Computing & DevOps" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Partial lead capture onBlur: captures lead even if user still exits before clicking submit!
  const { handlePartialLeadBlur, markConverted } = usePartialLead({
    source: "exit_intent_popup",
    getFormData: () => ({
      name: formData.name,
      phone: formData.phone,
      courseId: formData.courseId,
      courseTitle: formData.courseTitle,
      pageUrl: pathname || "/",
    }),
  });

  // Pre-fetch courses list on mount so dropdown is never empty and loads instantly
  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses", {
          params: { isPublished: "true", limit: 200 },
        });

        // The API returns an array directly: res.data = [ {...}, {...} ] or res.data.data
        const rawList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        if (!isMounted) return;

        if (rawList.length > 0) {
          const formatted: Course[] = rawList
            .filter((c: any) => c && (c.title || c.name))
            .map((c: any) => ({
              _id: c._id || c.slug || c.title,
              title: c.title || c.name || "Course",
              slug: c.slug || "",
            }))
            .sort((a: Course, b: Course) => (a.title || "").localeCompare(b.title || ""));

          setCourses(formatted);

          // Auto-detect course if user is currently on a /course/[slug] page
          if (pathname?.startsWith("/course/")) {
            const currentSlug = pathname.replace("/course/", "").split("/")[0].toLowerCase();
            const matched = formatted.find(
              (c) =>
                (c.slug && c.slug.toLowerCase() === currentSlug) ||
                (c.title && c.title.toLowerCase().replace(/\s+/g, "-") === currentSlug) ||
                (c.title && currentSlug.includes(c.title.toLowerCase().substring(0, 10)))
            );
            if (matched) {
              setFormData((prev) => ({
                ...prev,
                courseId: matched._id,
                courseTitle: matched.title || "",
              }));
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch courses for exit popup:", err);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "courseSelect") {
      const selected = courses.find((c) => c._id === value);
      setFormData((prev) => ({
        ...prev,
        courseId: value,
        courseTitle: selected?.title || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const visitorId = getOrCreateVisitorId();
      const fingerprint = await getFingerprint();

      await submitContactForm({
        name: formData.name.trim() || "Student Lead",
        phone: cleanPhone,
        courseId: formData.courseId || undefined,
        courseTitle: formData.courseTitle || (pathname?.startsWith("/course/") ? "Course Visitor" : "General Training"),
        subject: `Exit Offer Claim: 10% Scholarship + Syllabus (${formData.courseTitle || "Website"})`,
        message: `Student claimed 10% Exit Intent Scholarship for ${formData.courseTitle || "Training"} via WhatsApp.`,
        source: "exit_intent",
        visitorId,
        fingerprint,
      });

      // Mark partial lead as converted
      markConverted();

      // Remember submission in this session
      try {
        sessionStorage.setItem("inxyme_lead_submitted", "true");
      } catch {}

      setIsSuccess(true);
    } catch (err) {
      console.error("Exit form submission error:", err);
      // Even if API has minor error, show success coupon to user so they get value
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText("INXYME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-lg bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden text-gray-800 animate-in zoom-in-95 duration-200">
        {/* Top Decorative Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 text-white text-center overflow-hidden">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:rotate-90 shadow-sm"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {/* Floating Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-400 text-amber-950 shadow-md mb-2 animate-bounce">
            <FaGift className="w-3.5 h-3.5" />
            <span>Wait! Before You Leave...</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            Get 10% Instant Scholarship & Free Course Syllabus
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-md mx-auto">
            Don't leave empty-handed! Get complete placement curriculum & scholarship coupon code directly on WhatsApp.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Highlight Perks */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700 bg-white p-3 rounded-xl border border-indigo-100/80 shadow-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Free Detailed Syllabus PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>₹5,000 Fee Scholarship</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>100% Placement Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Free 1-on-1 Mentorship Call</span>
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FaGraduationCap className="text-indigo-600" />
                  Course of Interest
                </label>
                <select
                  name="courseSelect"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">
                    {formData.courseTitle ? `Selected: ${formData.courseTitle}` : "-- Select Course (Optional) --"}
                  </option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name Input (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handlePartialLeadBlur}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* WhatsApp Number (Mandatory) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FaWhatsapp className="text-green-500 text-sm" />
                    WhatsApp Number <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Syllabus will be sent here</span>
                </label>
                <div className="relative flex rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden transition-all shadow-xs">
                  <span className="inline-flex items-center px-3.5 border-r border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handlePartialLeadBlur}
                    placeholder="Enter 10-digit WhatsApp number"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Generating Coupon...</span>
                ) : (
                  <>
                    <FaWhatsapp className="w-5 h-5 text-white" />
                    <span>Send Syllabus & 10% Off on WhatsApp</span>
                  </>
                )}
              </button>

              {/* Opt-out text */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors cursor-pointer"
                >
                  No thanks, I will pay full fees later
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <FaCheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-gray-900">
                  Congratulations! 🎉
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-sm mx-auto">
                  Your 10% Scholarship Voucher & Syllabus PDF have been reserved for <strong>{formData.phone}</strong>.
                </p>
              </div>

              {/* Voucher Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-dashed border-indigo-300 p-4 rounded-2xl flex items-center justify-between max-w-xs mx-auto shadow-xs">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block">
                    Scholarship Coupon Code
                  </span>
                  <span className="text-lg font-mono font-black text-indigo-900 tracking-wider">
                    INXYME10
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyCouponCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FaCopy className="w-3 h-3" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* WhatsApp direct launch */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${formData.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi Inxyme, I claimed the 10% Scholarship coupon INXYME10 for ${formData.courseTitle || "training"}. Please share my syllabus PDF and course details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>Open WhatsApp & Claim Now</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
