"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MagicPrefillData,
  resolveMagicLinkToken,
  getStoredPrefillData,
  savePrefillData,
  clearPrefillData,
} from "../utils/magicLink";
import { toast } from "react-hot-toast";

export function useMagicPrefill() {
  const [prefillData, setPrefillData] = useState<MagicPrefillData>({});
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    // 1. Initial check of URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const uid =
      urlParams.get("uid") ||
      urlParams.get("magic") ||
      urlParams.get("token") ||
      urlParams.get("leadId") ||
      "";

    const paramName = urlParams.get("name") || "";
    const paramPhone = urlParams.get("phone") || "";
    const paramEmail = urlParams.get("email") || "";

    // If query string directly provides details (e.g. from campaign tags)
    if (paramName || paramPhone || paramEmail) {
      const directData: MagicPrefillData = {
        name: paramName,
        phone: paramPhone,
        email: paramEmail,
        isMagicLink: true,
        isReturningUser: true,
      };
      savePrefillData(directData);
      if (mounted) {
        setPrefillData(directData);
        setIsMagicLink(true);
        setIsReturning(true);
      }
      return;
    }

    if (uid) {
      setIsLoading(true);
      resolveMagicLinkToken(uid)
        .then((resolved) => {
          if (!mounted) return;
          setIsLoading(false);
          if (resolved && (resolved.name || resolved.phone || resolved.email)) {
            setPrefillData(resolved);
            setIsMagicLink(true);
            setIsReturning(true);

            const displayName = resolved.name || "back";
            toast.success(
              `✨ Welcome back, ${displayName}! We've pre-filled your details.`,
              {
                id: "magic-link-welcome",
                duration: 4500,
                icon: "🪄",
                style: {
                  borderRadius: "10px",
                  background: "#1e293b",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                },
              }
            );
          }
        })
        .catch((err) => {
          if (!mounted) return;
          setIsLoading(false);
          console.warn("Error resolving magic link:", err);
        });
    } else {
      // 2. No uid in URL, check stored returning visitor data
      const stored = getStoredPrefillData();
      if (stored && (stored.name || stored.phone || stored.email)) {
        setPrefillData(stored);
        setIsReturning(true);
      }
    }

    // 3. Listen for changes from other components/forms
    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.isCleared) {
        setPrefillData({});
        setIsMagicLink(false);
        setIsReturning(false);
      } else if (detail) {
        setPrefillData(detail);
        setIsReturning(true);
      }
    };

    window.addEventListener("inxyme:magic-prefill", handleCustomEvent);

    return () => {
      mounted = false;
      window.removeEventListener("inxyme:magic-prefill", handleCustomEvent);
    };
  }, []);

  const handleClear = useCallback(() => {
    clearPrefillData();
    setPrefillData({});
    setIsMagicLink(false);
    setIsReturning(false);
    toast("Pre-filled details cleared", { icon: "🧹" });
  }, []);

  const handleSave = useCallback((data: Partial<MagicPrefillData>) => {
    savePrefillData(data);
    setPrefillData((prev) => ({ ...prev, ...data }));
    setIsReturning(true);
  }, []);

  return {
    prefillData,
    isMagicLink,
    isReturning,
    isLoading,
    clearPrefill: handleClear,
    savePrefill: handleSave,
  };
}
