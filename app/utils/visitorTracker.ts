"use client";

import api from "./api";

const VISITOR_STORAGE_KEY = "visitor_id";
const COOKIE_NAME = "visitor_id";

/**
 * Read cookie by name in browser
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Set persistent cookie (valid for 1 year)
 */
function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Generate a unique UUID for this visitor
 */
function generateVisitorUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `v_${crypto.randomUUID()}`;
  }
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now().toString(36);
  return `v_${ts}_${rand}`;
}

/**
 * Get or create the unique visitor UUID.
 * Saved in both localStorage AND Cookies for maximum durability.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  try {
    // 1. Check localStorage first
    let id = localStorage.getItem(VISITOR_STORAGE_KEY);

    // 2. Fallback to cookie
    if (!id) {
      id = getCookie(COOKIE_NAME);
    }

    // 3. If still not found, generate new UUID
    if (!id || id.trim().length === 0) {
      id = generateVisitorUUID();
    }

    // 4. Always ensure both localStorage and Cookies are synchronized
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    setCookie(COOKIE_NAME, id, 365);

    return id;
  } catch {
    return generateVisitorUUID();
  }
}

/**
 * Silently sync visitor page view with backend API
 */
export async function trackVisitorPageView(pageUrl: string, pageTitle?: string): Promise<any> {
  if (typeof window === "undefined") return null;

  try {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return null;

    const response = await api.post("/visitors/track", {
      visitorId,
      pageUrl,
      pageTitle: pageTitle || (typeof document !== "undefined" ? document.title : ""),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    return response.data;
  } catch {
    // Silent fail - visitor tracking should never throw or block UI
    return null;
  }
}

/**
 * Link this visitor UUID with user details (called on form submit or onBlur)
 */
export async function identifyVisitor(data: { name?: string; email?: string; phone?: string }): Promise<any> {
  if (typeof window === "undefined") return null;

  try {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return null;

    const response = await api.post("/visitors/identify", {
      visitorId,
      ...data,
    });

    return response.data;
  } catch {
    return null;
  }
}
