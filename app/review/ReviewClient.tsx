"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Sparkles,
  ArrowRight,
  Check,
  User,
  Phone,
  ShieldCheck,
  Video,
  FileText,
  Camera,
  Upload,
  RotateCcw,
  Square,
  Play,
  Film,
  X,
  Zap,
  ImageIcon,
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

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", maxDigits: 10 },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸", maxDigits: 10 },
  { code: "+44", country: "UK", flag: "🇬🇧", maxDigits: 10 },
  { code: "+971", country: "UAE", flag: "🇦🇪", maxDigits: 9 },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", maxDigits: 9 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", maxDigits: 8 },
  { code: "+61", country: "Australia", flag: "🇦🇺", maxDigits: 9 },
  { code: "+977", country: "Nepal", flag: "🇳🇵", maxDigits: 10 },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", maxDigits: 10 },
  { code: "+49", country: "Germany", flag: "🇩🇪", maxDigits: 11 },
  { code: "+33", country: "France", flag: "🇫🇷", maxDigits: 9 },
  { code: "+81", country: "Japan", flag: "🇯🇵", maxDigits: 10 },
];

export default function ReviewClient() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");

  // Mode: "video" (default) | "text"
  const [reviewMode, setReviewMode] = useState<"text" | "video">(
    initialType === "text" ? "text" : "video"
  );

  // Common form fields
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "👨‍🏫 Great Mentors",
    "💻 Practical Live Projects",
  ]);
  const [studentName, setStudentName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [studentPhone, setStudentPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [reviewText, setReviewText] = useState("");

  // Selfie / Photo state (ONLY FOR WRITTEN REVIEW - OPTIONAL)
  const [studentPhotoFile, setStudentPhotoFile] = useState<File | null>(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string | null>(null);
  const [preUploadedPhotoUrl, setPreUploadedPhotoUrl] = useState<string | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Video review specific states
  const [videoSource, setVideoSource] = useState<"record" | "upload">("record");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadedVideoPreview, setUploadedVideoPreview] = useState<string | null>(null);

  // Background Pre-Upload States (Fast / Optimistic Upload)
  const [backgroundUploadStatus, setBackgroundUploadStatus] = useState<
    "idle" | "uploading" | "ready" | "error"
  >("idle");
  const [backgroundUploadProgress, setBackgroundUploadProgress] = useState(0);
  const [preUploadedVideoUrl, setPreUploadedVideoUrl] = useState<string | null>(null);
  const [preUploadedVideoSize, setPreUploadedVideoSize] = useState<number>(0);

  // Refs
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Background Upload XHR & Promise resolver ref
  const backgroundXhrRef = useRef<XMLHttpRequest | null>(null);
  const pendingUploadPromiseRef = useRef<{
    resolve: (val: { url: string; size: number } | null) => void;
  } | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [fallbackProgress, setFallbackProgress] = useState(0);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const apiBaseUrl = useMemo(() => {
    const envUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4002/api";
    return envUrl.replace(/\/$/, "");
  }, []);

  // Stop camera stream cleanly
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
      if (backgroundXhrRef.current) {
        backgroundXhrRef.current.abort();
      }
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
      if (uploadedVideoPreview) URL.revokeObjectURL(uploadedVideoPreview);
      if (studentPhotoPreview) URL.revokeObjectURL(studentPhotoPreview);
    };
  }, []);

  // Handle Tag toggle
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Phone Validation Logic
  const handlePhoneChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, "");
    setStudentPhone(cleanDigits);

    if (cleanDigits.length === 0) {
      setPhoneError("Phone number is required");
    } else if (countryCode === "+91") {
      if (cleanDigits.length !== 10) {
        setPhoneError("Enter 10-digit number");
      } else if (!/^[6-9]/.test(cleanDigits)) {
        setPhoneError("Must start with 6, 7, 8 or 9");
      } else {
        setPhoneError("");
      }
    } else {
      if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        setPhoneError("Enter 7-15 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  const validatePhone = () => {
    const cleanDigits = studentPhone.replace(/\D/g, "");
    if (!cleanDigits) {
      toast.error("Please enter your mobile / WhatsApp number.");
      setPhoneError("Mobile number is required");
      return false;
    }

    if (countryCode === "+91") {
      if (cleanDigits.length !== 10) {
        toast.error("Please enter a valid 10-digit Indian mobile number.");
        setPhoneError("Must be 10 digits");
        return false;
      }
      if (!/^[6-9]/.test(cleanDigits)) {
        toast.error("Indian mobile numbers must start with 6, 7, 8, or 9.");
        setPhoneError("Must start with 6, 7, 8 or 9");
        return false;
      }
    } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      toast.error("Please enter a valid phone number (7-15 digits).");
      setPhoneError("Must be 7-15 digits");
      return false;
    }

    setPhoneError("");
    return true;
  };

  // Handle Selfie / Photo Upload for Written Review
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Photo size should be less than 10MB.");
      return;
    }

    if (studentPhotoPreview) {
      URL.revokeObjectURL(studentPhotoPreview);
    }

    setStudentPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setStudentPhotoPreview(preview);

    // Fast pre-upload photo to server
    setIsPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch(`${apiBaseUrl}/reviews/upload-photo`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.photoUrl) {
        setPreUploadedPhotoUrl(data.photoUrl);
      }
    } catch (err) {
      console.error("Selfie upload error:", err);
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (studentPhotoPreview) {
      URL.revokeObjectURL(studentPhotoPreview);
    }
    setStudentPhotoFile(null);
    setStudentPhotoPreview(null);
    setPreUploadedPhotoUrl(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // ==================== BACKGROUND PRE-UPLOAD FUNCTION (FOR VIDEO) ====================
  const startBackgroundPreUpload = (fileOrBlob: Blob | File) => {
    if (backgroundXhrRef.current) {
      backgroundXhrRef.current.abort();
      backgroundXhrRef.current = null;
    }

    setBackgroundUploadStatus("uploading");
    setBackgroundUploadProgress(0);
    setPreUploadedVideoUrl(null);
    setPreUploadedVideoSize(0);

    const formData = new FormData();
    const ext =
      fileOrBlob instanceof File
        ? fileOrBlob.name.split(".").pop() || "mp4"
        : fileOrBlob.type.includes("mp4")
        ? "mp4"
        : "webm";

    formData.append(
      "video",
      fileOrBlob,
      `review-${Date.now()}.${ext}`
    );

    const xhr = new XMLHttpRequest();
    backgroundXhrRef.current = xhr;
    xhr.open("POST", `${apiBaseUrl}/reviews/upload-video`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setBackgroundUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      backgroundXhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.videoUrl) {
            setPreUploadedVideoUrl(res.videoUrl);
            setPreUploadedVideoSize(res.videoSize || 0);
            setBackgroundUploadStatus("ready");
            setBackgroundUploadProgress(100);

            if (pendingUploadPromiseRef.current) {
              pendingUploadPromiseRef.current.resolve({
                url: res.videoUrl,
                size: res.videoSize || 0,
              });
              pendingUploadPromiseRef.current = null;
            }
            return;
          }
        } catch (e) {
          console.error("Error parsing pre-upload response:", e);
        }
      }

      setBackgroundUploadStatus("error");
      if (pendingUploadPromiseRef.current) {
        pendingUploadPromiseRef.current.resolve(null);
        pendingUploadPromiseRef.current = null;
      }
    };

    xhr.onerror = () => {
      backgroundXhrRef.current = null;
      setBackgroundUploadStatus("error");
      if (pendingUploadPromiseRef.current) {
        pendingUploadPromiseRef.current.resolve(null);
        pendingUploadPromiseRef.current = null;
      }
    };

    xhr.send(formData);
  };

  // Start Camera for live recording
  const handleStartCamera = async () => {
    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      toast.error(
        "Could not access camera or microphone. Please enable camera permissions or upload a video file instead."
      );
      setVideoSource("upload");
    }
  };

  // Start MediaRecorder
  const handleStartRecording = () => {
    if (!mediaStreamRef.current) {
      handleStartCamera();
      return;
    }

    recordedChunksRef.current = [];

    let mimeType = "video/webm";
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
      mimeType = "video/webm;codecs=vp9,opus";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
      mimeType = "video/webm;codecs=vp8,opus";
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4";
    }

    try {
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunksRef.current, {
          type: mimeType,
        });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setRecordedVideoUrl(url);

        stopCameraStream();

        // ⚡ Immediately start background upload so user doesn't wait later!
        startBackgroundPreUpload(finalBlob);
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 180) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to start MediaRecorder:", err);
      toast.error("Could not start recording. Please try uploading a video file.");
    }
  };

  // Stop MediaRecorder
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  // Retake video
  const handleRetakeVideo = () => {
    if (backgroundXhrRef.current) {
      backgroundXhrRef.current.abort();
      backgroundXhrRef.current = null;
    }
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);
    setPreUploadedVideoUrl(null);
    setPreUploadedVideoSize(0);
    setBackgroundUploadStatus("idle");
    setBackgroundUploadProgress(0);
    handleStartCamera();
  };

  // Handle Device Video File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv|avi|3gp)$/i.test(file.name)) {
      toast.error("Please select a valid video file (MP4, WebM, MOV, etc.).");
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      toast.error("Selected video is larger than 150MB. Please select a smaller video.");
      return;
    }

    if (uploadedVideoPreview) {
      URL.revokeObjectURL(uploadedVideoPreview);
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setUploadedVideoPreview(url);

    // ⚡ Immediately start background upload so user doesn't wait later!
    startBackgroundPreUpload(file);
  };

  // Remove uploaded file
  const handleRemoveUploadedFile = () => {
    if (backgroundXhrRef.current) {
      backgroundXhrRef.current.abort();
      backgroundXhrRef.current = null;
    }
    if (uploadedVideoPreview) {
      URL.revokeObjectURL(uploadedVideoPreview);
    }
    setVideoFile(null);
    setUploadedVideoPreview(null);
    setPreUploadedVideoUrl(null);
    setPreUploadedVideoSize(0);
    setBackgroundUploadStatus("idle");
    setBackgroundUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Text Review (with optional selfie photo)
  const handleSubmitTextReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write your review or experience.");
      return;
    }

    if (reviewText.trim().length < 5) {
      toast.error("Review must be at least 5 characters long.");
      return;
    }

    const fullPhone = `${countryCode} ${studentPhone.trim()}`;

    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentPhone: fullPhone,
          studentPhoto: preUploadedPhotoUrl || "",
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

  // Submit Video Review (Instant if pre-uploaded, or awaits background progress)
  const handleSubmitVideoReview = async () => {
    const videoToUpload =
      videoSource === "record" ? recordedBlob : videoFile;

    if (!videoToUpload && !preUploadedVideoUrl) {
      toast.error("Please record or select a video first.");
      return;
    }

    const fullPhone = `${countryCode} ${studentPhone.trim()}`;

    setSubmitting(true);

    let finalVideoUrl = preUploadedVideoUrl;
    let finalVideoSize = preUploadedVideoSize;

    // 1. If background upload is still in progress, smoothly wait for it to finish!
    if (backgroundUploadStatus === "uploading" && !finalVideoUrl) {
      const result = await new Promise<{ url: string; size: number } | null>(
        (resolve) => {
          pendingUploadPromiseRef.current = { resolve };
        }
      );
      if (result) {
        finalVideoUrl = result.url;
        finalVideoSize = result.size;
      }
    }

    // 2. FAST PATH: Video was pre-uploaded in background (95%+ of the time)
    // Instant submission in < 100 milliseconds!
    if (finalVideoUrl) {
      try {
        const response = await fetch(`${apiBaseUrl}/reviews/video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: finalVideoUrl,
            videoSize: finalVideoSize,
            studentName: studentName.trim(),
            studentPhone: fullPhone,
            rating,
            tags: selectedTags,
            reviewText:
              reviewText.trim() || `Video Review by ${studentName.trim()}`,
            videoDuration: recordingSeconds || 0,
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(resData.message || "Failed to submit video review");
        }

        setSubmittedSuccess(true);
        toast.success("Video review submitted successfully! 🎉");
      } catch (err: any) {
        console.error("Fast submit error:", err);
        toast.error(err.message || "Failed to submit. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 3. FALLBACK PATH: If background pre-upload failed, do standard FormData upload
    const formData = new FormData();
    if (videoSource === "record" && recordedBlob) {
      const ext = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append(
        "video",
        recordedBlob,
        `review-recording-${Date.now()}.${ext}`
      );
    } else if (videoFile) {
      formData.append("video", videoFile);
    }

    formData.append("studentName", studentName.trim());
    formData.append("studentPhone", fullPhone);
    formData.append("rating", rating.toString());
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append(
      "reviewText",
      reviewText.trim() || `Video Review by ${studentName.trim()}`
    );
    if (recordingSeconds > 0) {
      formData.append("videoDuration", recordingSeconds.toString());
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiBaseUrl}/reviews/video`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setFallbackProgress(percent);
      }
    };

    xhr.onload = () => {
      setSubmitting(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            setSubmittedSuccess(true);
            toast.success("Video review submitted successfully! 🎉");
          } else {
            toast.error(res.message || "Failed to upload video review.");
          }
        } catch {
          setSubmittedSuccess(true);
          toast.success("Video review submitted successfully! 🎉");
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          toast.error(err.message || "Failed to upload video review.");
        } catch {
          toast.error("Upload failed. Please check your connection and try again.");
        }
      }
    };

    xhr.onerror = () => {
      setSubmitting(false);
      toast.error("Network error while uploading video. Please try again.");
    };

    xhr.send(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!validatePhone()) {
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating.");
      return;
    }

    if (reviewMode === "text") {
      handleSubmitTextReview();
    } else {
      handleSubmitVideoReview();
    }
  };

  const activeEmotion = RATING_EMOTIONS.find(
    (e) => e.rating === (hoverRating || rating)
  );

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 px-3 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg mx-auto">
        {submittedSuccess ? (
          /* ================= SUCCESS STATE (100% ENGLISH) ================= */
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
                Verified Student Feedback
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Thank You, {studentName}! 🎉
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs max-w-xs mx-auto">
                Your review has been successfully submitted. Your honest feedback helps future students make the right career choice!
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
          /* ================= MAIN REVIEW FORM ================= */
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-100/80 dark:border-slate-800 space-y-4">

            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="flex justify-center">
                <img
                  src="https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png"
                  alt="Inxyme Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Student Review Portal
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                How was your learning experience?
              </h1>
            </div>

            {/* REVIEW MODE SWITCHER (Video Review first by default) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setReviewMode("video")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all relative ${
                  reviewMode === "video"
                    ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-500" />
                Video Review
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setReviewMode("text");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  reviewMode === "text"
                    ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Written Review
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* STAR RATING SECTION */}
              <div className="text-center bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
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
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                            isFilled
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
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold transition-all ${activeEmotion.bg}`}
                  >
                    <span>{activeEmotion.emoji}</span>
                    <span className={activeEmotion.color}>{activeEmotion.label}</span>
                  </div>
                )}
              </div>

              {/* ================= VIDEO SECTION (IF MODE === VIDEO) ================= */}
              {reviewMode === "video" && (
                <div className="space-y-2.5 bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-xl border border-indigo-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-indigo-600" />
                      Your Video Review <span className="text-rose-500">*</span>
                    </label>

                    {/* Switch between Live Record and Device Upload */}
                    <div className="inline-flex p-0.5 bg-slate-200/80 dark:bg-slate-700 rounded-lg text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSource("record");
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                          videoSource === "record"
                            ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        🎥 Record Live
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopCameraStream();
                          setVideoSource("upload");
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                          videoSource === "upload"
                            ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        📁 Upload File
                      </button>
                    </div>
                  </div>

                  {/* 1. LIVE CAMERA RECORDING */}
                  {videoSource === "record" && (
                    <div className="space-y-2">
                      {recordedVideoUrl ? (
                        /* Recorded Video Playback Preview */
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-700 shadow-inner flex items-center justify-center">
                            <video
                              src={recordedVideoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <Check className="w-3 h-3" /> Ready
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              Duration: {formatSeconds(recordingSeconds || 0)}
                            </span>
                            <button
                              type="button"
                              onClick={handleRetakeVideo}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                              Retake Video
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Live Camera View */
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-700 shadow-inner flex flex-col items-center justify-center text-white">
                            <video
                              ref={liveVideoRef}
                              autoPlay
                              playsInline
                              muted
                              className={`w-full h-full object-cover ${
                                isCameraActive ? "block" : "hidden"
                              }`}
                            />

                            {!isCameraActive && (
                              <div className="text-center p-4 space-y-2">
                                <div className="w-12 h-12 bg-indigo-600/30 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                                  <Camera className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-slate-300 max-w-xs">
                                  Record a 30-90 second video sharing your learning experience and mentors.
                                </p>
                                <button
                                  type="button"
                                  onClick={handleStartCamera}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  Turn On Camera
                                </button>
                              </div>
                            )}

                            {/* Recording Timer Badge */}
                            {isRecording && (
                              <div className="absolute top-2 left-2 bg-rose-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow-md">
                                <span className="w-2 h-2 rounded-full bg-white" />
                                REC {formatSeconds(recordingSeconds)} / 03:00
                              </div>
                            )}
                          </div>

                          {/* Controls */}
                          {isCameraActive && (
                            <div className="flex items-center justify-center gap-3 pt-1">
                              {!isRecording ? (
                                <button
                                  type="button"
                                  onClick={handleStartRecording}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                                  Start Recording
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleStopRecording}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all"
                                >
                                  <Square className="w-3 h-3 fill-white" />
                                  Stop Recording
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. DEVICE FILE UPLOAD */}
                  {videoSource === "upload" && (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*,.mp4,.webm,.mov,.m4v,.mkv,.avi"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {uploadedVideoPreview && videoFile ? (
                        /* Uploaded file preview */
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-700 shadow-inner flex items-center justify-center">
                            <video
                              src={uploadedVideoPreview}
                              controls
                              playsInline
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveUploadedFile}
                              className="absolute top-2 right-2 p-1 bg-rose-600/90 text-white rounded-full hover:bg-rose-700 shadow-md"
                              title="Remove video"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
                              {videoFile.name}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px]">
                              {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Upload Dropzone */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-900/60 rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-indigo-50/20"
                        >
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Click or tap to select a recorded video
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Supports MP4, WebM, MOV (Max 150MB)
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ⚡ BACKGROUND PRE-UPLOAD STATUS BADGE */}
                  {(recordedBlob || videoFile) && (
                    <div className="pt-1">
                      {backgroundUploadStatus === "uploading" && (
                        <div className="bg-indigo-50/90 dark:bg-slate-800 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl p-2.5 space-y-1.5 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                              Saving video in background... (Fill details below)
                            </span>
                            <span className="font-mono text-[11px] font-bold">
                              {backgroundUploadProgress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-indigo-200/60 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-200"
                              style={{ width: `${backgroundUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {backgroundUploadStatus === "ready" && (
                        <div className="flex items-center justify-between bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-150">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                            Video saved! Ready for instant 1-click submit
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-400" /> Fast Ready
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* QUICK HIGHLIGHT TAGS */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  What stood out most? <span className="text-[10px] text-slate-500 font-normal">(Select highlights)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 border border-slate-300 dark:border-slate-700 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                          isSelected
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

              {/* STUDENT INPUTS (2-Column Grid: Name & Required Mobile with Country Code) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
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

                {/* Mobile / WhatsApp Number (REQUIRED with Country Code Dropdown) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400">
                      Mobile / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    {phoneError && (
                      <span className="text-[10px] text-rose-500 font-medium">
                        {phoneError}
                      </span>
                    )}
                  </div>
                  <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    {/* Country Code Dropdown */}
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        setPhoneError("");
                      }}
                      className="bg-slate-100 dark:bg-slate-700/80 border-r border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-2 py-2 focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>

                    {/* Phone Input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={countryCode === "+91" ? 10 : 15}
                        value={studentPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder={countryCode === "+91" ? "98765 43210" : "Mobile number"}
                        className="w-full pl-2.5 pr-2.5 py-2 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= OPTIONAL SELFIE PHOTO UPLOAD (ONLY FOR WRITTEN REVIEW) ================= */}
              {reviewMode === "text" && (
                <div className="bg-slate-50/80 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Add Selfie / Photo <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    {studentPhotoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-medium"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {studentPhotoPreview ? (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm flex-shrink-0">
                        <img
                          src={studentPhotoPreview}
                          alt="Student Selfie"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {studentPhotoFile?.name || "Selfie attached"}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          {isPhotoUploading ? "Saving photo..." : "✓ Photo attached (Optional)"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 p-2 border border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-400 rounded-lg cursor-pointer bg-white dark:bg-slate-900/40 hover:bg-indigo-50/20 transition-all text-center"
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Upload Selfie / Face Photo <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEW TEXTAREA (Required for Text review, Optional caption for Video review) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-800 dark:text-slate-400">
                    {reviewMode === "text" ? (
                      <>
                        Your Review / Experience <span className="text-rose-500">*</span>
                      </>
                    ) : (
                      <>
                        Course Name or Message <span className="text-[10px] text-slate-400">(Optional)</span>
                      </>
                    )}
                  </label>
                  {reviewMode === "text" && (
                    <span className="text-[10px] text-slate-400">
                      {reviewText.trim().length > 0 ? `${reviewText.trim().length}/2000` : "Min 5 characters"}
                    </span>
                  )}
                </div>
                <textarea
                  required={reviewMode === "text"}
                  minLength={reviewMode === "text" ? 5 : 0}
                  maxLength={2000}
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={
                    reviewMode === "text"
                      ? "Share your experience (course, mentors, what you learned, etc.)..."
                      : "Mention your course or a short message with your video (optional)..."
                  }
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none transition-all"
                />
                {reviewMode === "text" && reviewText.length > 0 && reviewText.trim().length < 5 && (
                  <p className="text-[10px] text-rose-500 mt-0.5">
                    Please enter at least 5 characters (currently {reviewText.trim().length}).
                  </p>
                )}
              </div>

              {/* FALLBACK UPLOAD PROGRESS (Only shown if background upload was delayed) */}
              {submitting && reviewMode === "video" && !preUploadedVideoUrl && (
                <div className="space-y-1 bg-indigo-50 dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-100 dark:border-slate-700 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <span>Finalizing Video Upload...</span>
                    <span>{backgroundUploadProgress || fallbackProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200"
                      style={{
                        width: `${backgroundUploadProgress || fallbackProgress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  (reviewMode === "video" && !recordedBlob && !videoFile && !preUploadedVideoUrl)
                }
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    {reviewMode === "video" ? (
                      <Video className="w-4 h-4 fill-white text-white" />
                    ) : (
                      <Star className="w-4 h-4 fill-white text-white" />
                    )}
                    {reviewMode === "video" ? "Submit Video Review 🚀" : "Submit Written Review 🚀"}
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