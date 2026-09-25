import { Metadata } from "next";
import Banner from "./components/home/Banner";
import PopularCourses from "./components/home/PopularCourses";
import Categories from "./components/home/Categories";
import Assessment from "./components/home/Assessment";
import ScholarshipProgram from "./components/home/ScholarshipProgram";
import WhyLearnWithInxyme from "./components/home/WhyLearnWithInxyme";
import HowWillYourTrainingWork from "./components/home/HowWillYourTrainingWork";
import Stats from "./components/home/Stats";
import Content from "./components/home/Content";
import Testimonials from "./components/home/Testimonials";
import GoogleReviews from "./components/home/GoogleReviews";
import Newsletter from "./components/home/Newsletter";
import FAQ from "./components/home/FAQ";
import ContactSection from "./components/home/ContactSection";

export const metadata: Metadata = {
  title: "Inxyme | Job-Ready Online Certification Courses in India",
  description:
    "Learn job-ready skills with Inxyme's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
  keywords:
    "online certification courses, professional certification courses, job oriented courses, online courses in India, skill development courses, career oriented courses, technical courses online, Data Science course, Artificial Intelligence course, Machine Learning course, SAP courses, SAP ABAP course, SAP FICO course, Digital Marketing course, Web Development course, Power BI course, Python course, IT certification courses, online professional courses, Inxyme courses",
  alternates: {
    canonical: "https://www.inxyme.com",
  },
  openGraph: {
    title: "Inxyme | Job-Ready Online Certification Courses in India",
    description:
      "Learn job-ready skills with Inxyme's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
    url: "https://www.inxyme.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inxyme | Job-Ready Online Certification Courses in India",
    description:
      "Learn job-ready skills with Inxyme's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
  },
};

export default function Home() {
  // 1. WebSite Schema (Search Action ke sath)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Inxyme",
    url: "https://www.inxyme.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.inxyme.com/courses?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // 2. Organization Schema (Social links aur Logo ke sath)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.inxyme.com/#organization",
    name: "Inxyme",
    alternateName: "Inxyme Online Learning Platform",
    url: "https://www.inxyme.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.inxyme.com/api/upload/file/Inxyme-png-logo-2232.png",
    },
    description:
      "Inxyme is an online learning platform offering industry-focused courses, certifications, and career-oriented training programs across Data Science, Digital Marketing, SAP, IT, Business, and emerging technologies.",
    sameAs: [
      "https://www.instagram.com/inxyme",
      "https://www.facebook.com/inxyme",
      "https://in.pinterest.com/inxyme",
      "https://x.com/inxyme",
      "https://www.linkedin.com/company/inxyme-centre-of-excellence/",
      "https://www.youtube.com/@inxyme-official",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://www.inxyme.com/contact",
    },
  };

  return (
    <main className="relative text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Search Engine Bots ke liye direct HTML mein inject hoga */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="flex flex-col relative z-10">
        {/* Hero Banner */}
        <Banner />

        {/* Popular Courses */}
        <PopularCourses />

        {/* Categories Section */}
        <Categories />

        {/* Assessment / Scholarship Program */}
        <Assessment />

        {/* Scholarship Program */}
        <ScholarshipProgram />

        {/* Why Learn With Inxyme */}
        <WhyLearnWithInxyme />

        {/* How Will Your Training Work */}
        <HowWillYourTrainingWork />

        {/* Stats */}
        <Stats />

        {/* Student Placements */}
        {/* <StudentPlacements /> */}

        {/* Google review */}
        <GoogleReviews />

        {/* Content */}
        <Content />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />

        {/* FAQ */}
        <FAQ />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </main>
  );
}
