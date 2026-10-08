import { Metadata } from "next";
import FreeTrainingClientPage from "./FreeTrainingClientPage";

export const metadata: Metadata = {
  title: "7 Days Free SAP Live Training Masterclass | PP, MM, ABAP, FICO & SD | Inxyme",
  description:
    "Join Inxyme's 7-Day 100% Free Live SAP Training Masterclass. Learn SAP FICO, MM, SD, PP and ABAP with real enterprise consultants, live system demo, daily Q&A, and verified certificate. Zero fees.",
  keywords:
    "7 days free SAP training, free SAP class, free SAP live course, learn SAP free, free SAP FICO training, free SAP MM course, free SAP ABAP course, free SAP SD training, free SAP PP class, online SAP certification India, Inxyme free SAP",
  alternates: {
    canonical: "https://www.inxyme.com/7-days-free-sap-training",
  },
  openGraph: {
    title: "7 Days Free SAP Live Training Masterclass | Inxyme",
    description:
      "Master SAP PP, MM, ABAP, FICO & SD in 7 days for 100% free with live interactive classes, live SAP system demos, and verified certificate.",
    url: "https://www.inxyme.com/7-days-free-sap-training",
    type: "website",
    images: [
      {
        url: "https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png",
        width: 800,
        height: 600,
        alt: "7 Days Free SAP Live Masterclass Inxyme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7 Days Free SAP Live Training Masterclass | Inxyme",
    description:
      "Join the 7-Day 100% Free Live SAP Training. Master FICO, MM, SD, PP & ABAP with live system demo and free certificate.",
  },
};

export default function FreeSapTrainingPage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "7 Days Free SAP Live Training Masterclass",
    description:
      "Comprehensive 7-day instructor-led live bootcamp covering SAP FICO, SAP MM, SAP SD, SAP PP, and SAP ABAP with hands-on system demonstration and verified certificate.",
    provider: {
      "@type": "Organization",
      name: "Inxyme",
      sameAs: "https://www.inxyme.com",
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free",
      availability: "https://schema.org/InStock",
    },
    educationalCredentialAwarded: "Course Completion Certificate",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT7H",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.inxyme.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "7 Days Free SAP Live Training",
        item: "https://www.inxyme.com/7-days-free-sap-training",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this 7-day SAP Masterclass really 100% free? Are there any hidden charges?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, it is 100% Free of charge with zero registration fees, zero admission fees, and zero hidden costs. You get full access to all 7 live sessions, study materials, live system demos, and a verified course completion certificate without entering any payment information.",
        },
      },
      {
        "@type": "Question",
        name: "What if I miss a live class? Will I get recordings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Every single live session is recorded in high definition. If you ever miss a class due to work, college, or personal commitments, the full recording will be uploaded to your student portal within 2 hours of session completion.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need prior coding or technical knowledge to join?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not at all. For functional modules like SAP FICO, SAP MM, SAP SD, and SAP PP, no coding knowledge is required whatsoever. For SAP ABAP (the technical track), programming logic is taught from the ground up, making it completely beginner-friendly.",
        },
      },
      {
        "@type": "Question",
        name: "Will I receive a certificate after completing the 7 days?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All participants who attend the classes and complete the quick final quiz will be awarded an official, ISO 9001:2015 and NSDC-aligned Verifiable Course Completion Certificate by Inxyme with a unique verification ID.",
        },
      },
    ],
  };

  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FreeTrainingClientPage />
    </main>
  );
}
