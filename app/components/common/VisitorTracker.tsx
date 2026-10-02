"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitorPageView, getOrCreateVisitorId } from "../../utils/visitorTracker";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Avoid duplicate triggers on same URL
    if (lastTrackedUrl.current === pathname) return;
    lastTrackedUrl.current = pathname;

    // Ensure UUID is created in localStorage and Cookies
    getOrCreateVisitorId();

    // Small delay to let document.title update after client-side navigation
    const timer = setTimeout(() => {
      trackVisitorPageView(pathname, typeof document !== "undefined" ? document.title : "");
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
