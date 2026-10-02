"use client";

import posthog from "posthog-js";

let posthogInitialized = false;

/**
 * Initialize PostHog client-side analytics
 * Configured for Next.js App Router with Autocapture & Session Recording
 */
export function initPostHog() {
  if (typeof window === "undefined" || posthogInitialized) return posthog;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!posthogKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🦔 [PostHog] Initialized in Developer Simulation Mode (Add NEXT_PUBLIC_POSTHOG_KEY in .env to connect live cloud project)"
      );
    }
    posthogInitialized = true;
    return posthog;
  }

  try {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: false, // Handled manually by PostHogPageviewTracker on route change
      capture_pageleave: true,
      autocapture: true, // Captures all button clicks, link clicks, form interactions automatically!
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") {
          console.log("🦔 [PostHog] Live connection established!");
        }
      },
    });

    posthogInitialized = true;
  } catch (err) {
    console.warn("⚠️ [PostHog] Initialization error:", err);
  }

  return posthog;
}

/**
 * Capture custom user journey event in PostHog
 */
export function posthogCapture(eventName: string, properties: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  initPostHog();

  try {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture(eventName, {
        timestamp: new Date().toISOString(),
        ...properties,
      });
    } else if (process.env.NODE_ENV === "development") {
      console.log(`🦔 [PostHog Event] ${eventName}:`, properties);
    }
  } catch (err) {
    console.warn("PostHog capture warning:", err);
  }
}

/**
 * Link visitor UUID & browser fingerprint with student details in PostHog
 */
export function posthogIdentify(
  distinctId: string,
  userProperties: { name?: string; email?: string; phone?: string; [key: string]: any } = {}
) {
  if (typeof window === "undefined" || !distinctId) return;

  initPostHog();

  try {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.identify(distinctId, {
        $name: userProperties.name,
        $email: userProperties.email,
        $phone_number: userProperties.phone,
        ...userProperties,
      });
    } else if (process.env.NODE_ENV === "development") {
      console.log(`🦔 [PostHog Identify] distinctId: ${distinctId}`, userProperties);
    }
  } catch (err) {
    console.warn("PostHog identify warning:", err);
  }
}

/**
 * Track course view event in PostHog funnel
 */
export function posthogTrackCourseView(courseTitle: string, courseId?: string, extraProps: Record<string, any> = {}) {
  posthogCapture("course_viewed", {
    course_title: courseTitle,
    course_id: courseId || "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
    ...extraProps,
  });
}

/**
 * Track form interactions (focus, blur, partial fills) to detect drop-off stages
 */
export function posthogTrackFormInteraction(
  formName: string,
  fieldName: string,
  action: "focus" | "typing" | "blur",
  extraProps: Record<string, any> = {}
) {
  posthogCapture("form_interaction", {
    form_name: formName,
    field_name: fieldName,
    action,
    ...extraProps,
  });
}

/**
 * Track Lead Capture (Partial or Full)
 */
export function posthogTrackLead(leadData: {
  leadType: "partial" | "full" | "exit_intent";
  courseTitle?: string;
  source?: string;
  [key: string]: any;
}) {
  posthogCapture("lead_captured", {
    lead_type: leadData.leadType,
    course_title: leadData.courseTitle || "",
    source: leadData.source || "website",
    ...leadData,
  });
}

export default posthog;
