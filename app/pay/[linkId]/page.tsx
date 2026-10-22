"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaArrowLeft,
  FaPrint,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaGraduationCap,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaRegCalendarAlt,
} from "react-icons/fa";
import api from "../../utils/api";
import { loadRazorpay } from "../../utils/razorpay";

interface PublicPaymentLink {
  linkId: string;
  title: string;
  amount: number;
  description?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  course?: string;
  status: "active" | "paid" | "expired" | "cancelled";
  expiresAt?: string;
  paidAt?: string;
  paymentDetails?: {
    paymentId?: string;
    paidAmount?: number;
    payerName?: string;
    payerEmail?: string;
  };
}

export default function StudentPaymentPage({
  params,
}: {
  params?: any;
}) {
  const routerParams = useParams();
  const linkId = (routerParams?.linkId as string) || (params?.linkId as string) || "";

  const [loading, setLoading] = useState(true);
  const [paymentLink, setPaymentLink] = useState<PublicPaymentLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Payment processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const logoImg =
    "https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png";

  // Load link details
  useEffect(() => {
    let isMounted = true;

    const fetchPaymentLink = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/payments/link/${linkId}`);
        if (isMounted && response.data?.success) {
          const data: PublicPaymentLink = response.data.paymentLink;
          setPaymentLink(data);
          if (data.studentName) setName(data.studentName);
          if (data.studentEmail) setEmail(data.studentEmail);
          if (data.studentPhone) {
            setPhone(data.studentPhone.replace(/^\+91/, ""));
          }
          if (data.status === "paid") {
            setPaymentSuccess(true);
            setReceiptData({
              paymentId: data.paymentDetails?.paymentId || "N/A",
              amount: data.paymentDetails?.paidAmount || data.amount,
              title: data.title,
              course: data.course,
              paidAt: data.paidAt,
              payerName: data.paymentDetails?.payerName || data.studentName,
              payerEmail: data.paymentDetails?.payerEmail || data.studentEmail,
            });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching payment link:", err);
          setError(
            err.response?.data?.message ||
            err.message ||
            "Invalid or expired payment link. Please contact Inxyme support."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (linkId) {
      fetchPaymentLink();
      loadRazorpay();
    }

    return () => {
      isMounted = false;
    };
  }, [linkId]);

  // Handle Razorpay Payment
  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please agree to the payment terms to proceed");
      return;
    }

    try {
      setIsProcessing(true);

      const razorpayReady = await loadRazorpay();
      if (!razorpayReady || !(window as any).Razorpay) {
        toast.error("Unable to load payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create Razorpay Order
      const orderRes = await api.post(`/payments/link/${linkId}/create-order`);
      if (!orderRes.data?.success || !orderRes.data?.order) {
        throw new Error(orderRes.data?.message || "Failed to initialize payment gateway order");
      }

      const { order, keyId } = orderRes.data;

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Inxyme",
        description: paymentLink?.title || "Course Payment",
        order_id: order.id,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.startsWith("+") ? phone : `+91${phone.trim()}`,
        },
        theme: {
          color: "#4f46e5", // Indigo theme
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast("Payment window closed", { icon: "ℹ️" });
          },
        },
        handler: async (response: any) => {
          try {
            // Step 3: Verify Payment Signature
            const verifyPayload = {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.startsWith("+") ? phone : `+91${phone.trim()}`,
              address: address.trim() || "Not provided",
            };

            const verifyRes = await api.post(
              `/payments/link/${linkId}/verify`,
              verifyPayload
            );

            if (verifyRes.data?.success) {
              toast.success("Payment completed successfully!");
              setPaymentSuccess(true);
              setReceiptData(
                verifyRes.data.receipt || {
                  paymentId: response.razorpay_payment_id,
                  orderId: order.id,
                  amount: paymentLink?.amount,
                  title: paymentLink?.title,
                  course: paymentLink?.course,
                  paidAt: new Date().toISOString(),
                  payerName: name,
                  payerEmail: email,
                }
              );
            } else {
              toast.error(verifyRes.data?.message || "Verification failed. Please contact support.");
            }
          } catch (verifyErr: any) {
            console.error("Payment verification error:", verifyErr);
            toast.error(
              verifyErr.response?.data?.message ||
              "Payment was received but verification failed. Please contact Inxyme support with your payment ID."
            );
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (failedRes: any) => {
        console.error("Razorpay Payment Failed:", failedRes);
        toast.error(failedRes?.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Could not initialize payment. Please try again later."
      );
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-base">Loading payment details...</p>
          <p className="text-xs text-gray-400 mt-1">Securing connection with Inxyme & Razorpay</p>
        </div>
      </div>
    );
  }

  // Error / Invalid Link
  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-orange-50/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Unavailable</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {error || "This payment link does not exist, has expired, or has been revoked."}
          </p>
          <div className="space-y-3">
            <Link
              href="https://www.inxyme.com"
              className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Return to Inxyme Home
            </Link>
            <a
              href="https://wa.me/919632156828?text=Hello%20Inxyme%20team,%20I%20need%20help%20with%20a%20payment%20link."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Contact Support on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Expired or Cancelled Link
  if (paymentLink.status === "expired" || paymentLink.status === "cancelled") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-amber-200/60 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Link {paymentLink.status === "expired" ? "Expired" : "Cancelled"}
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {paymentLink.status === "expired"
              ? "This link has passed its validity date. Please ask your Inxyme educational counselor to issue a new payment link."
              : "This payment link has been cancelled by the administration."}
          </p>
          <div className="p-4 bg-gray-50 rounded-xl mb-6 text-left border border-gray-200/60 text-xs text-gray-600 space-y-1">
            <div><span className="font-semibold text-gray-800">Purpose:</span> {paymentLink.title}</div>
            <div><span className="font-semibold text-gray-800">Amount:</span> ₹{paymentLink.amount?.toLocaleString("en-IN")}</div>
            {paymentLink.course && (
              <div><span className="font-semibold text-gray-800">Course:</span> {paymentLink.course}</div>
            )}
          </div>
          <Link
            href="https://www.inxyme.com"
            className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
          >
            Visit Inxyme Website
          </Link>
        </div>
      </div>
    );
  }

  // Success / Receipt Screen
  if (paymentSuccess) {
    const pDate = receiptData?.paidAt
      ? new Date(receiptData.paidAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      : new Date().toLocaleDateString("en-IN");

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-indigo-50/20 to-slate-50 py-10 px-4">
        <Toaster position="top-right" />
        <div className="max-w-xl mx-auto">
          {/* Printable Receipt Card */}
          <div
            id="payment-receipt-print"
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Success Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8 text-center text-white relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <FaCheckCircle className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
              <p className="text-emerald-100 text-xs mt-1">
                Your payment has been securely confirmed & recorded.
              </p>
              <div className="mt-4 inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium tracking-wide">
                Receipt ID: {receiptData?.paymentId || "PAY-SUCCESS"}
              </div>
            </div>

            {/* Receipt Details Body */}
            <div className="p-8">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div>
                  <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                    Total Amount Paid
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900 mt-1">
                    ₹{Number(receiptData?.amount || paymentLink.amount).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                    Payment Status
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
                    Settled
                  </span>
                </div>
              </div>

              <div className="py-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Payment For</span>
                  <div className="font-semibold text-gray-800 mt-0.5">
                    {receiptData?.title || paymentLink.title}
                  </div>
                </div>
                {paymentLink.course && (
                  <div>
                    <span className="text-xs text-gray-400 font-medium">Course</span>
                    <div className="font-semibold text-gray-800 mt-0.5">
                      {paymentLink.course}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-400 font-medium">Student Name</span>
                  <div className="font-semibold text-gray-800 mt-0.5">
                    {receiptData?.payerName || name || "Student"}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Email Address</span>
                  <div className="font-semibold text-gray-800 mt-0.5 truncate">
                    {receiptData?.payerEmail || email || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Transaction Date</span>
                  <div className="font-semibold text-gray-800 mt-0.5">{pDate}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium">Payment Gateway</span>
                  <div className="font-semibold text-gray-800 mt-0.5">Razorpay Verified</div>
                </div>
              </div>

              <div className="pt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <FaLock className="w-3 h-3 text-emerald-500" />
                This is an officially verified electronic payment receipt from Inxyme Technologies.
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <FaPrint className="w-4 h-4 text-gray-500" />
                Print / Save PDF
              </button>
              <Link
                href="https://www.inxyme.com"
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 text-center"
              >
                Continue to Inxyme
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Checkout Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 py-8 px-4 sm:px-6">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        {/* Top Navbar Brand */}
        <div className="flex items-center justify-between mb-8">
          <div
            className="text-lg font-bold text-blue-600 dark:text-blue-400"
          >
            <img
              src={logoImg}
              alt="inxyme – Your Online Learning Partner"
              className="h-[42px]"
            />
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs text-emerald-800 font-medium shadow-sm">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Main Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 p-3 md:p-6 text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="text-xs uppercase font-bold tracking-wider text-indigo-300 mb-1">
                  Payment Request
                </div>
                <h2 className="text-xl font-bold leading-tight">{paymentLink.title}</h2>
                {paymentLink.course && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-indigo-100">
                    <FaGraduationCap className="w-3.5 h-3.5" />
                    <span>{paymentLink.course}</span>
                  </div>
                )}
              </div>

              <div className="p-3 md:p-6">
                <div className="pb-6 border-b border-gray-100">
                  <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                    Amount to Pay
                  </div>
                  <div className="text-4xl font-black text-gray-900 tracking-tight mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-indigo-600">₹</span>
                    <span>{paymentLink.amount.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-gray-400 font-normal ml-1">INR (Inclusive of GST)</span>
                  </div>
                </div>

                {paymentLink.description && (
                  <div className="py-4 border-b border-gray-100 text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-800 block mb-1">Note:</span>
                    {paymentLink.description}
                  </div>
                )}

                {paymentLink.expiresAt && (
                  <div className="py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FaRegCalendarAlt className="w-3.5 h-3.5 text-gray-400" />
                      Valid Until
                    </span>
                    <span className="font-medium text-gray-700">
                      {new Date(paymentLink.expiresAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Features & Trust */}
                <div className="pt-5 space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Instant Payment Confirmation &amp; Receipt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Razorpay Verified Payment Gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Supports UPI, Cards, NetBanking, Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payer Information Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-gray-100 p-3 md:p-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Please confirm your details for your official payment invoice &amp; receipt
                  </p>
                </div>
              </div>

              <form onSubmit={handleProceedPayment} className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-0.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FaUser className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-0.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul.sharma@example.com"
                      className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Your official payment receipt will be sent to this email address.
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-0.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm font-semibold">
                      +91
                    </span>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaPhoneAlt className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-4 py-1.5 rounded-r-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Address (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-0.5">
                    City / Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-4 py-1.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-xs text-gray-600 leading-normal">
                      I agree to the{" "}
                      <Link
                        href="/terms-of-service"
                        target="_blank"
                        className="text-indigo-600 underline font-medium hover:text-indigo-800"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/payment-terms-and-conditions"
                        target="_blank"
                        className="text-indigo-600 underline font-medium hover:text-indigo-800"
                      >
                        Payment Terms
                      </Link>{" "}
                      of Inxyme.
                    </span>
                  </label>
                </div>

                {/* Submit / Pay CTA Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-3 transition-all shadow-xl ${isProcessing
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99]"
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting to Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="w-4 h-4 text-indigo-200" />
                        <span>Pay Securely ₹{paymentLink.amount.toLocaleString("en-IN")}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secure Payment Footer Badges */}
                <div className="pt-3 text-center">
                  <p className="text-[11px] text-gray-400 flex items-center justify-center gap-2">
                    <span>Secured by Razorpay</span>
                    <span>•</span>
                    <span>UPI, Cards, NetBanking Supported</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
