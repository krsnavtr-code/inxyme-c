"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const EXIT_INTENT_STORAGE_KEY = "inxyme_exit_intent_dismissed";
const LEAD_SUBMITTED_KEY = "inxyme_lead_submitted";

interface UseExitIntentOptions {
  /** Minimum delay in milliseconds before exit intent can trigger (default: 5000ms) */
  minDelay?: number;
  /** Storage type to remember dismissal: 'session' | 'local' (default: 'session') */
  storage?: "session" | "local";
}

export function useExitIntent({
  minDelay = 5000,
  storage = "session",
}: UseExitIntentOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEnabledRef = useRef(false);
  const hasTriggeredRef = useRef(false);

  const getStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    return storage === "local" ? window.localStorage : window.sessionStorage;
  }, [storage]);

  const hasBeenDismissed = useCallback(() => {
    const s = getStorage();
    if (!s) return false;
    // Check if dismissed or if user already submitted a lead in this session
    if (s.getItem(EXIT_INTENT_STORAGE_KEY)) return true;
    if (sessionStorage.getItem(LEAD_SUBMITTED_KEY)) return true;
    return false;
  }, [getStorage]);

  const triggerModal = useCallback(() => {
    if (hasTriggeredRef.current || hasBeenDismissed()) return;
    hasTriggeredRef.current = true;
    setIsOpen(true);
  }, [hasBeenDismissed]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    const s = getStorage();
    if (s) {
      s.setItem(EXIT_INTENT_STORAGE_KEY, Date.now().toString());
    }
  }, [getStorage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if previously dismissed or already submitted
    if (hasBeenDismissed()) return;

    // Minimum delay before arming the trigger
    const delayTimer = setTimeout(() => {
      isEnabledRef.current = true;
    }, minDelay);

    // Desktop: Mouse leaving top of viewport towards tab bar / close button
    const handleMouseLeave = (e: MouseEvent) => {
      if (!isEnabledRef.current || hasTriggeredRef.current) return;
      // clientY <= 25 means cursor is crossing top edge of browser window
      if (e.clientY <= 25) {
        triggerModal();
      }
    };

    // Mobile: Rapid scroll up towards address bar after reading content
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      if (!isEnabledRef.current || hasTriggeredRef.current) return;
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime;
      const scrollDiff = lastScrollY - currentScrollY;

      // If user rapidly scrolled up by > 200px in under 250ms when past 400px down
      if (timeDiff > 0 && timeDiff < 250 && scrollDiff > 200 && currentScrollY > 400) {
        triggerModal();
      }

      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    // Mobile: Inactivity dwell timer (if user stays for 45s on page without interaction)
    const dwellTimer = setTimeout(() => {
      if (isEnabledRef.current && !hasTriggeredRef.current && window.innerWidth < 768) {
        triggerModal();
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Expose a debug trigger on window for easy manual testing
    (window as any).__showExitIntent = () => {
      hasTriggeredRef.current = false;
      const s = getStorage();
      if (s) s.removeItem(EXIT_INTENT_STORAGE_KEY);
      setIsOpen(true);
    };

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(dwellTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [minDelay, triggerModal, hasBeenDismissed, getStorage]);

  return { isOpen, closeModal, triggerModal };
}
