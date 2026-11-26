"use client";

import SEO from "../components/SEO";

export default function PaymentTAndC() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEO
        title="Payment Terms and Conditions | Inxyme (Eklavya Centre of Excellence Pvt. Ltd.)"
        description="Read the Payment Terms and Conditions of Inxyme, operated by Eklavya Centre of Excellence Pvt. Ltd., for courses, fees, refunds, payment methods, and billing policies."
        keywords="Inxyme payment terms, Eklavya Centre of Excellence Pvt. Ltd., payment terms and conditions, course payment policy, course fees, refund policy, payment methods, Inxyme courses"
        og={{
          title: "Payment Terms and Conditions | Inxyme (Eklavya Centre of Excellence Pvt. Ltd.)",
          description:
            "Read the Payment Terms and Conditions of Inxyme, operated by Eklavya Centre of Excellence Pvt. Ltd., for courses, fees, refunds, and billing policies.",
          type: "article",
        }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10 text-slate-900 dark:text-white">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Payment Terms &amp; Conditions
          </h1>

          <div className="bg-blue-50 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4 sm:p-5 mb-6 text-sm text-slate-800 dark:text-slate-200">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              Merchant &amp; Billing Entity Disclosure
            </p>
            <p>
              All course fees, registration payments, GST tax invoices, and
              payment receipts on this platform are processed and issued under our
              registered corporate entity{" "}
              <strong>Eklavya Centre of Excellence Pvt. Ltd.</strong>, which
              operates publicly under its recognized brand name{" "}
              <strong>Inxyme</strong>.
            </p>
          </div>

          <p className="mb-4">
            By making this payment, I hereby confirm that the funds used for this
            transaction belong solely to me and have been lawfully earned by me
            through legitimate means. I am making this payment voluntarily and of
            my own free will, without any coercion, pressure, or compulsion from
            any party.
          </p>
          <p className="mb-4">
            I fully understand and accept that I am solely responsible for the
            source and usage of these funds. In the event of any legal, financial,
            or other issues arising from this payment, I acknowledge that the
            entire responsibility lies with me and I shall not hold Eklavya Centre
            of Excellence Pvt. Ltd. (operating under the brand name Inxyme) or
            its representatives accountable in any manner.
          </p>
          <p className="mb-4">
            I also understand that payments made are final and non-refundable
            unless explicitly stated otherwise in a written agreement or refund
            policy shared by Eklavya Centre of Excellence Pvt. Ltd. (Inxyme). It
            is my responsibility to review all relevant information and policies
            before proceeding with the payment.
          </p>
          <p className="mb-4">
            I agree to comply with all applicable laws, regulations, and policies
            related to digital payments and financial transactions. I certify
            that this payment does not violate any local, national, or
            international law.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-4">Refund Policy</h2>
          <p className="mb-4">Any scholarship admission is non-refundable.</p>
          <p className="mb-4">Registration amount is non-refundable.</p>
          <p className="mb-4">
            If the student gets access and is allocated a batch, the fee is
            non-refundable.
          </p>
          <h2 className="text-xl font-bold mt-6 mb-4">
            Governing Law &amp; Jurisdiction
          </h2>
          <p className="mb-4">
            Any kind of legal dispute will come under jurisdiction of Delhi High
            Court.
          </p>
          <p>
            By completing this transaction, I acknowledge that I have read,
            understood, and agreed to all the terms and conditions mentioned
            above.
          </p>
        </div>
      </div>
    </div>
  );
}
