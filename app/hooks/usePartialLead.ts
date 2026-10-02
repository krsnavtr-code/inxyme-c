"use client";

import { useCallback, useRef, FocusEvent } from "react";
import {
  savePartialLead,
  convertPartialLead,
} from "../api/partialLeadApi";

/**
 * Generate a unique session fingerprint for this form session.
 * Stays the same for the lifetime of the component so multiple blur
 * events update the same DB record.
 */
function generateFingerprint(source: string): string {
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now().toString(36);
  return `pl_${source}_${ts}_${rand}`;
}

interface UsePartialLeadOptions {
  /** A label identifying which form this is (e.g. "banner", "contact_modal") */
  source: string;
  /** The current form data — the hook reads from this on each blur */
  getFormData: () => {
    name?: string;
    email?: string;
    phone?: string;
    courseId?: string;
    courseTitle?: string;
    [key: string]: any;
  };
}

/**
 * Custom hook that captures partial leads via onBlur on form fields.
 *
 * Usage:
 * ```tsx
 * const { handlePartialLeadBlur, markConverted } = usePartialLead({
 *   source: "banner",
 *   getFormData: () => formData,
 * });
 *
 * <input onBlur={handlePartialLeadBlur} ... />
 *
 * // After final submit succeeds:
 * markConverted();
 * ```
 */
export function usePartialLead({ source, getFormData }: UsePartialLeadOptions) {
  // Stable fingerprint per component mount
  const fingerprintRef = useRef<string>(generateFingerprint(source));

  // Track what we last sent to avoid unnecessary API calls
  const lastSentRef = useRef<string>("");

  /**
   * Call this as `onBlur` on email / phone / name inputs.
   * It silently sends the current form state to the backend.
   */
  const handlePartialLeadBlur = useCallback(
    (_e?: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const data = getFormData();
      const { email, phone } = data;

      // Only send if we have at least one usable contact detail
      const hasContact =
        (email && email.trim().length > 0) ||
        (phone && phone.trim().length > 0);

      if (!hasContact) return;

      // Deduplicate: don't send if nothing changed since last blur
      const sig = JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
      });
      if (sig === lastSentRef.current) return;
      lastSentRef.current = sig;

      // Fire-and-forget — completely silent
      savePartialLead({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        courseId: data.courseId || "",
        courseTitle: data.courseTitle || "",
        source,
        pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
        sessionFingerprint: fingerprintRef.current,
      });
    },
    [source, getFormData],
  );

  /**
   * Call this after the user successfully submits the full form.
   * Marks the partial lead as "converted" so it's not flagged for follow-up.
   */
  const markConverted = useCallback(() => {
    const data = getFormData();
    convertPartialLead({
      sessionFingerprint: fingerprintRef.current,
      email: data.email || "",
    });
  }, [getFormData]);

  return { handlePartialLeadBlur, markConverted };
}
