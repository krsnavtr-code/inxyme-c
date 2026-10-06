import React, { Suspense } from "react";
import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";

export const metadata: Metadata = {
  title: "Submit Course Review | Inxyme",
  description:
    "Share your honest learning experience and rating for Inxyme courses in just 2 clicks. Your feedback helps future learners make the right choice.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Loading review form...
            </p>
          </div>
        </div>
      }
    >
      <ReviewClient />
    </Suspense>
  );
}
