"use client";

import api from "./api";

export interface MagicPrefillData {
  uid?: string;
  name?: string;
  phone?: string;
  email?: string;
  courseTitle?: string;
  courseId?: string;
  courseSlug?: string;
  isMagicLink?: boolean;
  isReturningUser?: boolean;
  source?: string;
}

const STORAGE_KEY = "inxyme_magic_user";

/**
 * Save user prefill data in localStorage for returning user experience
 */
export const savePrefillData = (data: Partial<MagicPrefillData>): void => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredPrefillData();
    const merged: MagicPrefillData = {
      ...existing,
      ...(data.name && { name: data.name.trim() }),
      ...(data.phone && { phone: data.phone.trim() }),
      ...(data.email && { email: data.email.trim().toLowerCase() }),
      ...(data.uid && { uid: data.uid }),
      ...(data.courseTitle && { courseTitle: data.courseTitle }),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Dispatch global event so all active forms on the page update immediately
    window.dispatchEvent(
      new CustomEvent("inxyme:magic-prefill", { detail: merged })
    );
  } catch (e) {
    console.warn("Could not save prefill data:", e);
  }
};

/**
 * Retrieve stored user prefill data from localStorage
 */
export const getStoredPrefillData = (): MagicPrefillData => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Fallback: check if logged-in user exists in localStorage
    const authUserRaw = localStorage.getItem("user");
    if (authUserRaw) {
      const u = JSON.parse(authUserRaw);
      return {
        uid: u._id,
        name: u.fullname || u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        isReturningUser: true,
      };
    }
  } catch (e) {
    console.warn("Could not read prefill data:", e);
  }
  return {};
};

/**
 * Clear prefill data if user clicks "Not you?"
 */
export const clearPrefillData = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("inxyme:magic-prefill", {
        detail: { name: "", phone: "", email: "", isCleared: true },
      })
    );
  } catch (e) {
    console.warn("Could not clear prefill data:", e);
  }
};

/**
 * Client-side lightweight encode for instant magic token generation
 */
export const encodeClientToken = (data: {
  name?: string;
  phone?: string;
  email?: string;
  courseTitle?: string;
  courseSlug?: string;
}): string => {
  try {
    const str = JSON.stringify({
      ...data,
      ts: Date.now(),
    });
    // Universal base64url encode
    const b64 = btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return `ml_${b64}`;
  } catch {
    return "";
  }
};

/**
 * Client-side lightweight decode for instant offline magic token decoding
 */
export const decodeClientToken = (token: string): Partial<MagicPrefillData> | null => {
  if (!token || !token.startsWith("ml_")) return null;
  try {
    let b64 = token.substring(3).replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) {
      b64 += "=";
    }
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(jsonStr);
    return {
      name: parsed.name || "",
      phone: parsed.phone || "",
      email: parsed.email || "",
      courseTitle: parsed.courseTitle || "",
      courseSlug: parsed.courseSlug || "",
      uid: token,
      isMagicLink: true,
    };
  } catch {
    return null;
  }
};

/**
 * Resolve magic link from server or fallback token
 */
export const resolveMagicLinkToken = async (
  rawToken: string
): Promise<MagicPrefillData | null> => {
  if (!rawToken || !rawToken.trim()) return null;
  const token = rawToken.trim();

  // 1. First try quick client decode if it is a client-encoded token
  const clientDecoded = decodeClientToken(token);
  if (clientDecoded && (clientDecoded.name || clientDecoded.phone || clientDecoded.email)) {
    savePrefillData(clientDecoded);
    return {
      ...clientDecoded,
      isMagicLink: true,
      isReturningUser: true,
    };
  }

  // 2. Fetch from backend API
  try {
    const res = await api.get(`/magic-link/${encodeURIComponent(token)}`);
    if (res?.data?.success && res.data.data) {
      const data = res.data.data;
      const result: MagicPrefillData = {
        uid: data.uid || token,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        courseTitle: data.courseTitle || "",
        courseId: data.courseId || "",
        isMagicLink: true,
        isReturningUser: true,
        source: res.data.source || "server",
      };
      savePrefillData(result);
      return result;
    }
  } catch (err) {
    console.warn("Backend resolve magic link failed, checking fallback:", err);
  }

  return null;
};

/**
 * Build shareable magic link for a course
 */
export const buildMagicCourseUrl = (
  courseSlug: string,
  uidOrToken: string,
  baseUrl?: string
): string => {
  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://www.inxyme.com");
  const path = courseSlug ? `/course/${courseSlug}` : "/courses";
  return `${base.replace(/\/$/, "")}${path}?uid=${encodeURIComponent(uidOrToken)}`;
};

/**
 * Build WhatsApp share URL with pre-filled message
 */
export const buildWhatsAppShareUrl = ({
  phone,
  courseTitle,
  shareUrl,
  recipientName,
  senderName,
}: {
  phone?: string;
  courseTitle: string;
  shareUrl: string;
  recipientName?: string;
  senderName?: string;
}): string => {
  const greeting = recipientName ? `Hi ${recipientName}!` : "Hello!";
  const recommender = senderName ? ` ${senderName} recommended this course for you.` : "";

  const text = `${greeting} Check out this training course on Inxyme: *${courseTitle}*${recommender}

👉 Open your personalized link:
${shareUrl}

⚡ Your details are already pre-filled so you can claim your seat in 1 click! 🚀`;

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};
