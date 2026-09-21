"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SEO from "../components/SEO";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRedirect = searchParams?.get("redirect");
  const [targetRedirect, setTargetRedirect] = useState<string>("");

  useEffect(() => {
    if (queryRedirect) {
      setTargetRedirect(queryRedirect);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("payment_redirect", queryRedirect);
      }
    } else if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("payment_redirect");
      if (saved) {
        setTargetRedirect(saved);
      }
    }
  }, [queryRedirect]);

  const handleSuccess = () => {
    const dest = targetRedirect || queryRedirect || "";
    const loginUrl = `/login?message=${encodeURIComponent(
      "Registration successful! Log in now.",
    )}${dest ? `&redirect=${encodeURIComponent(dest)}` : ""}`;
    router.push(loginUrl);
  };

  return (
    <>
      <SEO
        title="Register for Industry-Ready Courses | Inxyme"
        description="Register for industry-ready courses at Inxyme. Gain practical skills, expert guidance and career support. Start your learning journey today."
        keywords="The Inxyme registration, industry-ready courses, skill development courses, career training, professional courses, job-ready skills, online learning"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-orange-500 to-blue-500 text-white flex flex-col justify-center relative p-8">
            <Link href="/" className="text-white absolute top-4 left-8">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 1.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V17a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold mb-4">Welcome to Inxyme</h1>
            <p className="text-sm opacity-90">
              To make high-quality education accessible online, helping learners
              gain practical, job-ready skills in trending domains.
            </p>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <RegisterForm
              onSuccess={handleSuccess}
              redirect={targetRedirect || queryRedirect || ""}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4 text-white">
          Loading...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
