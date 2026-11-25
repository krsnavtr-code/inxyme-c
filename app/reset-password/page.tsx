"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";
import { resetPassword } from "../api/userApi";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get("token")?.trim() || "";
  const queryEmail = searchParams?.get("email")?.trim() || "";

  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveEmail = queryEmail || emailInput;
  const isMissingToken = !token;

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const trimmedEmail = effectiveEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedEmail)) {
      nextErrors.email = "Invalid email address";
    }

    if (!password) {
      nextErrors.password = "New password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (isMissingToken) {
      const msg =
        "Invalid or incomplete password reset link. Please request a new reset link.";
      setServerError(msg);
      toast.error(msg);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await resetPassword(
        token,
        effectiveEmail.trim().toLowerCase(),
        password,
      );

      if (res?.success) {
        setIsSuccess(true);
        toast.success(res.message || "Password has been reset successfully!");
        setTimeout(() => {
          router.replace(
            `/login?message=${encodeURIComponent(
              "Password reset successful! Please log in with your new password.",
            )}`,
          );
        }, 1800);
      } else {
        const msg = res?.message || "Failed to reset password.";
        setServerError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const msg =
        errObj?.message ||
        "Reset link may have expired or is invalid. Please request a new one.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password | Inxyme"
        description="Reset your Inxyme account password securely to regain access to your courses and learning dashboard."
        keywords="Inxyme reset password, forgot password, student account recovery"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-orange-500 to-blue-500 text-white flex flex-col justify-center p-8 relative">
            <Link
              href="/"
              aria-label="Return to Inxyme home"
              className="text-white absolute top-4 left-8 hover:opacity-80 transition"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 1.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V17a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 border border-white/25">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Reset Your Password</h1>
            <p className="text-sm opacity-90 leading-relaxed">
              Create a new strong password for your Inxyme account so you can
              log back in and continue exploring your courses.
            </p>
          </div>

          <div className="p-8 flex flex-col justify-center">
            {isSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Password Reset Successful
                </h2>
                <p className="text-sm text-gray-600">
                  Your password has been updated. Redirecting you to the login
                  page...
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
                  Set New Password
                </h2>
                <p className="text-center text-xs text-gray-500 mb-6">
                  Reset link is valid for 10 minutes from when it was requested.
                </p>

                {isMissingToken && (
                  <div
                    role="alert"
                    className="mb-4 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Invalid reset link</p>
                      <p className="text-xs mt-0.5">
                        The reset token is missing. Please go back to{" "}
                        <Link href="/login" className="underline font-semibold">
                          Login
                        </Link>{" "}
                        and click &ldquo;Forgot Password?&rdquo; again.
                      </p>
                    </div>
                  </div>
                )}

                {serverError && !isMissingToken && (
                  <div
                    role="alert"
                    className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-black mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={effectiveEmail}
                      onChange={(e) => setEmailInput(e.target.value)}
                      readOnly={Boolean(queryEmail)}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        queryEmail ? "bg-gray-100 text-gray-700" : "bg-white text-black"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-black mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-black mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isMissingToken}
                    className="w-full bg-blue-500 text-white py-2.5 rounded-md font-medium hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Remembered your password?{" "}
                  <Link href="/login" className="text-blue-500 hover:underline">
                    Back to Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4 text-white">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
