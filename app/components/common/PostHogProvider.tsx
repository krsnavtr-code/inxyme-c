"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { initPostHog } from "../../utils/posthog";

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();

    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      // Track pageview in PostHog
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("$pageview", {
          $current_url: url,
          title: document.title,
        });
      } else if (process.env.NODE_ENV === "development") {
        console.log(`🦔 [PostHog PageView] ${url} (${document.title})`);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
