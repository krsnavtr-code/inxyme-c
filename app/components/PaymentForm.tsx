"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import api from "../utils/api";
import { loadRazorpay, initRazorpayPayment } from "../utils/razorpay";
import { useAuth } from "../context/AuthContext";

interface PaymentFormProps {
  onClose: () => void;
  initialData?: any;
  courseId?: string;
  courseName?: string;
  price?: number;
}

interface PaymentFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  course: string;
  coursePrice: string;
  paymentAmount: string;
  terms: boolean;
}

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+65", name: "Singapore" },
  { code: "+971", name: "UAE" },
  { code: "+86", name: "China" },
];

export default function PaymentForm({
  onClose,
  initialData = {},
  courseId,
  courseName,
  price,
}: PaymentFormProps) {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();

  const isCompanyRegistration = initialData?.isCompanyRegistration ?? false;
  const companyAmount = initialData?.amount ?? 0;

  const [paymentType, setPaymentType] = useState<"full" | "registration">(
    "full",
  );
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Courses state for searchable dropdown
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState(courseName || initialData?.course || "");
  const [selectedCoursePrice, setSelectedCoursePrice] = useState<number | null>(
    price !== undefined && price !== null ? Number(price) : null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PaymentFormData>(() => {
    const data = initialData || {};
    return {
      name: data.name || currentUser?.fullname || currentUser?.name || "",
      email: data.email || currentUser?.email || "",
      countryCode: data.countryCode || "+91",
      phone: data.phone
        ? String(data.phone).replace(/^\+91/, "")
        : currentUser?.phone
          ? currentUser.phone.replace(/^\+91/, "")
          : "",
      course: courseName || data.course || "",
      coursePrice: price
        ? String(Number(price) * 1.18)
        : data.amount
          ? String(Number(data.amount) * 1.18)
          : "",
      paymentAmount: price
        ? String(Number(price) * 1.18)
        : data.amount
          ? String(Number(data.amount) * 1.18)
          : "",
      terms: false,
    };
  });

  const effectivePrice =
    price !== undefined && price !== null
      ? Number(price)
      : selectedCoursePrice;

  // Fetch courses list if courseName wasn't pre-provided
  useEffect(() => {
    if (!courseName) {
      const fetchCourses = async () => {
        setIsLoadingCourses(true);
        try {
          const response = await api.get("/courses", {
            params: {
              limit: 300,
              isPublished: "true",
              status: "published",
              fields: "_id,title,price,originalPrice,isFree,category",
            },
          });
          const list = response?.data?.data || response?.data || [];
          if (Array.isArray(list)) {
            const sorted = [...list].sort((a: any, b: any) =>
              (a.title || "").localeCompare(b.title || ""),
            );
            setCoursesList(sorted);
          }
        } catch (err) {
          console.error("Failed to load courses list for payment form", err);
        } finally {
          setIsLoadingCourses(false);
        }
      };
      fetchCourses();
    }
  }, [courseName]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadRazorpay().then((success) => {
      if (!success) toast.error("Failed to load payment gateway.");
      setIsRazorpayLoaded(success);
    });

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        if (response.data?.user) {
          updateUser({ discount: response.data.user.discount || 0 });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUser();
  }, [updateUser]);

  useEffect(() => {
    if (paymentType === "registration") {
      const fee = 2000;
      const gst = Math.round(fee * 0.18);
      setFormData((prev) => ({ ...prev, paymentAmount: String(fee + gst) }));
    } else if (paymentType === "full" && effectivePrice !== null && effectivePrice > 0) {
      const base = Number(effectivePrice);
      const gst = Math.round(base * 0.18);
      const total = base + gst;
      if (discountApplied && currentUser?.discount) {
        const discount = Math.round(total * (currentUser.discount / 100));
        setFormData((prev) => ({
          ...prev,
          paymentAmount: String(total - discount),
        }));
      } else {
        setFormData((prev) => ({ ...prev, paymentAmount: String(total) }));
      }
    }
  }, [paymentType, effectivePrice, discountApplied, currentUser?.discount]);

  const handleSelectCourse = (courseItem: any) => {
    const cPrice = courseItem.price ?? courseItem.originalPrice ?? 0;
    const numericPrice = Number(cPrice);
    setSelectedCoursePrice(numericPrice);
    setCourseSearch(courseItem.title);
    setIsDropdownOpen(false);

    let newAmount = "";
    if (paymentType === "registration") {
      newAmount = "2360";
    } else if (numericPrice > 0) {
      const base = numericPrice;
      const gst = Math.round(base * 0.18);
      let total = base + gst;
      if (discountApplied && currentUser?.discount) {
        total -= Math.round(total * (currentUser.discount / 100));
      }
      newAmount = String(total);
    } else {
      newAmount = "0";
    }

    setFormData((prev) => ({
      ...prev,
      course: courseItem.title,
      coursePrice: String(Math.round(numericPrice * 1.18)),
      paymentAmount: newAmount,
    }));
  };

  const handleCourseInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCourseSearch(val);
    setFormData((prev) => ({ ...prev, course: val }));
    setIsDropdownOpen(true);
  };

  const handleClearCourse = () => {
    setCourseSearch("");
    setSelectedCoursePrice(null);
    setFormData((prev) => ({
      ...prev,
      course: "",
      coursePrice: "",
      paymentAmount: "",
    }));
  };

  const filteredCourses = coursesList.filter((c: any) =>
    (c.title || "").toLowerCase().includes(courseSearch.toLowerCase()),
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as any).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 15) {
      setFormData((prev) => ({ ...prev, phone: value }));
    }
  };

  const initiateRazorpayPayment = async (orderData: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Inxyme",
      description: isCompanyRegistration
        ? "JobFair Registration Fee"
        : `Payment for ${formData.course}`,
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const paymentData = {
            orderId: orderData.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            name: formData.name,
            email: formData.email,
            phone: formData.countryCode + formData.phone,
            course: isCompanyRegistration
              ? "JobFair Registration"
              : formData.course,
            paymentAmount: isCompanyRegistration
              ? companyAmount
              : parseFloat(formData.paymentAmount),
            address: "Not provided",
            userId: currentUser?._id || localStorage.getItem("userId") || null,
            isCompanyRegistration: isCompanyRegistration || false,
          };

          const verifyResponse = await api.post(
            "/payments/verify",
            paymentData,
          );

          if (verifyResponse.data.success) {
            toast.success("Payment successful!");

            if (isCompanyRegistration) {
              sessionStorage.removeItem("companyRegistration");
              router.push("/");
            } else {
              onClose();
            }

            setFormData({
              name: "",
              email: "",
              countryCode: "+91",
              phone: "",
              course: "",
              coursePrice: "",
              paymentAmount: "",
              terms: false,
            });
          } else {
            throw new Error(
              verifyResponse.data.message || "Payment verification failed",
            );
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          toast.error(
            error.response?.data?.message ||
              "Error verifying payment. Please contact support.",
          );
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.countryCode + formData.phone,
      },
      theme: { color: "#4F46E5" },
    };

    const paymentObject = initRazorpayPayment(options);
    if (!paymentObject) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    paymentObject.on("payment.failed", (response: any) => {
      toast.error(`Payment failed: ${response.error.description}`);
    });

    paymentObject.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = isCompanyRegistration
      ? ["name", "email", "countryCode", "phone", "terms"]
      : [
          "name",
          "email",
          "countryCode",
          "phone",
          "course",
          "paymentAmount",
          "terms",
        ];

    for (const field of requiredFields) {
      if (!(formData as any)[field]) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    if (
      !isCompanyRegistration &&
      (isNaN(Number(formData.paymentAmount)) ||
        Number(formData.paymentAmount) <= 0)
    ) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = isCompanyRegistration
        ? Math.round(companyAmount * 100)
        : Math.round(parseFloat(formData.paymentAmount) * 100);

      const response = await api.post("/payments/create-order", {
        amount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          course: isCompanyRegistration
            ? "JobFair Registration"
            : formData.course,
          name: formData.name,
          email: formData.email,
          isCompanyRegistration: isCompanyRegistration || false,
        },
      });

      if (response.data.success) {
        await initiateRazorpayPayment(response.data.order);
      } else {
        throw new Error(
          response.data.message || "Failed to create payment order",
        );
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="z-[99999] fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData?.isJobFair
                ? "Make Payment to book JobFair slot"
                : "Make a Payment"}
            </h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <div className="flex rounded-md shadow-sm">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-l-md border border-r-0 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-10 px-2"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  maxLength={15}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-l-0 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Full number: {formData.countryCode} {formData.phone}
              </p>
            </div>

            {courseName ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Program Name
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Payment Type
                  </label>
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="registration"
                        checked={paymentType === "registration"}
                        onChange={(e) =>
                          setPaymentType(
                            e.target.value as "full" | "registration",
                          )
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Registration Fee (₹2,000 + GST)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={(e) =>
                          setPaymentType(
                            e.target.value as "full" | "registration",
                          )
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Full Payment (₹
                        {price ? Number(price).toLocaleString() : 0} + GST)
                      </span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Program Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="course"
                    value={courseSearch}
                    onChange={handleCourseInputChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search or select a program..."
                    autoComplete="off"
                    className="w-full px-3 py-2 pl-9 pr-14 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaSearch size={13} />
                  </div>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {courseSearch && (
                      <button
                        type="button"
                        onClick={handleClearCourse}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                        title="Clear selection"
                      >
                        <FaTimes size={11} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                    >
                      <FaChevronDown
                        size={10}
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl max-h-56 overflow-y-auto z-[100000] py-1 text-sm divide-y divide-gray-100 dark:divide-gray-700/50">
                    {isLoadingCourses ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                        Loading programs...
                      </div>
                    ) : filteredCourses.length > 0 ? (
                      filteredCourses.map((c: any) => {
                        const itemPrice = c.price ?? c.originalPrice ?? 0;
                        const isSelected = formData.course === c.title;
                        return (
                          <div
                            key={c._id || c.title}
                            onClick={() => handleSelectCourse(c)}
                            className={`px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            <span className="truncate pr-2 font-medium text-xs sm:text-sm">
                              {c.title}
                            </span>
                            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-bold">
                              {itemPrice > 0
                                ? `₹${Number(itemPrice).toLocaleString()}`
                                : "Free"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                        No courses found matching &quot;{courseSearch}&quot;
                      </div>
                    )}
                  </div>
                )}

                {/* If course has been selected from dropdown, also show payment type selector */}
                {effectivePrice !== null && effectivePrice > 0 && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Payment Type
                    </label>
                    <div className="flex flex-col gap-2 mt-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="registration"
                          checked={paymentType === "registration"}
                          onChange={(e) =>
                            setPaymentType(
                              e.target.value as "full" | "registration",
                            )
                          }
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          Registration Fee (₹2,000 + GST)
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="full"
                          checked={paymentType === "full"}
                          onChange={(e) =>
                            setPaymentType(
                              e.target.value as "full" | "registration",
                            )
                          }
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          Full Payment (₹
                          {Number(effectivePrice).toLocaleString()} + GST)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Amount to Pay (₹)
              </label>
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              {(courseName || (effectivePrice !== null && effectivePrice > 0)) && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  {paymentType === "registration" ? (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <span>₹2,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹360</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>₹2,360</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>
                          ₹{effectivePrice ? Number(effectivePrice).toLocaleString() : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>
                          ₹
                          {effectivePrice
                            ? Math.round(Number(effectivePrice) * 0.18).toLocaleString()
                            : 0}
                        </span>
                      </div>
                      {discountApplied && currentUser?.discount ? (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({currentUser.discount}%):</span>
                          <span>
                            -₹
                            {Math.round(
                              Number(effectivePrice || 0) *
                                1.18 *
                                (currentUser.discount / 100),
                            ).toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>
                          ₹
                          {Number(formData.paymentAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600"
                required
              />
              <label className="text-sm text-gray-900 dark:text-white">
                I accept the payment{" "}
                <Link
                  href="/payment-terms-and-conditions"
                  className="text-blue-600 hover:underline"
                >
                  T&amp;C
                </Link>
              </label>
            </div>

            {paymentType === "full" &&
              currentUser?.discount &&
              currentUser.discount > 0 && (
                <div className="text-center">
                  {!discountApplied ? (
                    <button
                      type="button"
                      onClick={() => setDiscountApplied(true)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Apply Discount ({currentUser.discount}%)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDiscountApplied(false)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Remove Discount
                    </button>
                  )}
                </div>
              )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="py-1 px-3 border border-red-300 rounded-md text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isRazorpayLoaded}
                className="py-1 px-3 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body!,
  );
}
