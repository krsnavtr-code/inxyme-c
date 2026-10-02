"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export interface DeviceInfo {
  os: string;
  browser: string;
  screenResolution: string;
  deviceType: "mobile" | "tablet" | "desktop";
  language: string;
  timezone: string;
}

export interface FingerprintResult {
  fingerprint: string;
  deviceInfo: DeviceInfo;
}

let fpPromise: Promise<any> | null = null;
let cachedResult: FingerprintResult | null = null;

/**
 * Detect client OS, browser, and device characteristics
 */
export function getClientDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      os: "Unknown",
      browser: "Unknown",
      screenResolution: "Unknown",
      deviceType: "desktop",
      language: "en",
      timezone: "UTC",
    };
  }

  const ua = navigator.userAgent || "";
  let os = "Unknown";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua) && !/opr/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)/i.test(ua);
  const deviceType: "mobile" | "tablet" | "desktop" = isMobile
    ? "mobile"
    : isTablet
    ? "tablet"
    : "desktop";

  const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  const language = navigator.language || "en";
  let timezone = "UTC";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {}

  return {
    os,
    browser,
    screenResolution,
    deviceType,
    language,
    timezone,
  };
}

/**
 * Fallback browser hash using canvas and hardware parameters
 */
function getFallbackHash(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let canvasData = "";
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("inxyme_fp_2026", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("inxyme_fp_2026", 4, 17);
      canvasData = canvas.toDataURL();
    }

    const str = `${navigator.userAgent}|${screen.width}x${screen.height}x${screen.colorDepth}|${new Date().getTimezoneOffset()}|${canvasData.slice(-50)}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `fb_${Math.abs(hash).toString(16)}`;
  } catch {
    return `fb_${Math.random().toString(36).substring(2, 12)}`;
  }
}

/**
 * Get or compute persistent device fingerprint using FingerprintJS
 */
export async function getDeviceFingerprint(): Promise<FingerprintResult> {
  if (typeof window === "undefined") {
    return {
      fingerprint: "",
      deviceInfo: getClientDeviceInfo(),
    };
  }

  // Return cached result if already computed in this session
  if (cachedResult) {
    return cachedResult;
  }

  // Check sessionStorage for fast retrieval
  try {
    const storedFp = sessionStorage.getItem("inxyme_device_fp");
    if (storedFp) {
      cachedResult = {
        fingerprint: storedFp,
        deviceInfo: getClientDeviceInfo(),
      };
      return cachedResult;
    }
  } catch {}

  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }

    const fp = await fpPromise;
    const result = await fp.get();
    const fingerprint = result.visitorId ? `fp_${result.visitorId}` : getFallbackHash();
    const deviceInfo = getClientDeviceInfo();

    cachedResult = {
      fingerprint,
      deviceInfo,
    };

    try {
      sessionStorage.setItem("inxyme_device_fp", fingerprint);
    } catch {}

    return cachedResult;
  } catch (err) {
    console.warn("FingerprintJS init fallback:", err);
    const fallbackFp = getFallbackHash();
    cachedResult = {
      fingerprint: fallbackFp,
      deviceInfo: getClientDeviceInfo(),
    };
    return cachedResult;
  }
}
