"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

interface RegisterFormProps {
  onSuccess?: (data: any) => void;
  redirect?: string;
}

interface RegisterData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
}

export default function RegisterForm({ onSuccess, redirect }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictMsg, setConflictMsg] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setConflictMsg("");

    try {
      const userData = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department.trim(),
      };

      await api.post("/auth/register", userData);
      setRegisteredEmail(formData.email.trim().toLowerCase());
      setShowOTP(true);
      toast.success("Please check your email for OTP.");
    } catch (error: any) {
      console.error("Registration error:", error);
      const status = error?.status || error?.response?.status;
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      if (status === 409) {
        setConflictMsg(errorMessage || "Email already registered.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        email: registeredEmail,
        otp,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      toast.success("Email verified successfully!");

      if (onSuccess) {
        onSuccess(response.data);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await api.post("/auth/resend-otp", { email: registeredEmail });
      toast.success("OTP has been resent to your email");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  if (showOTP) {
    return (
      <div className="space-y-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <p className="text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            We&apos;ve sent a 6-digit OTP to <strong>{registeredEmail}</strong>.
            Please enter it below to verify your email.
          </p>
        </div>
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
          >
            Enter OTP
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            maxLength={6}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-bold tracking-widest"
            placeholder="------"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={isSubmitting || otp.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending}
            className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Didn't receive OTP? Resend"}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setShowOTP(false);
              setOtp("");
              setRegisteredEmail("");
            }}
            className="text-sm text-gray-600 hover:text-gray-500"
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-900 mb-2">
          Create your account
        </p>
      </div>

      {conflictMsg && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800 flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-0.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zm-8-4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">{conflictMsg}</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="fullname"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Full Name
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullname}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.fullname ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullname && (
          <p className="text-xs text-red-600 mt-1">{errors.fullname}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={formData.phone}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          I am a
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
        >
          <option value="student" className="text-gray-900 bg-white">
            Student
          </option>
          <option value="teacher" className="text-gray-900 bg-white">
            Teacher
          </option>
        </select>
        {errors.role && (
          <p className="text-xs text-red-600 mt-1">{errors.role}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1"
        >
          Department
        </label>
        <input
          id="department"
          name="department"
          type="text"
          placeholder="e.g. Computer Science, IT, Management"
          value={formData.department}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-xs bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.department ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.department && (
          <p className="text-xs text-red-600 mt-1">{errors.department}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </div>

      <div className="text-sm text-center pt-2">
        <span className="text-gray-600 dark:text-gray-700">
          Already have an account?{" "}
        </span>
        <button
          type="button"
          onClick={() => {
            const dest =
              redirect ||
              (typeof window !== "undefined"
                ? sessionStorage.getItem("payment_redirect")
                : null);
            if (dest && dest !== "/") {
              router.push(`/login?redirect=${encodeURIComponent(dest)}`);
            } else {
              router.push("/login");
            }
          }}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
