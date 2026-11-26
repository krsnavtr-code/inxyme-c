"use client";

import Link from "next/link";
import SEO from "../components/SEO";
import {
  FaBookOpen,
  FaGraduationCap,
  FaUsers,
  FaAward,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

export default function About() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Inxyme",
    legalName: "Eklavya Centre of Excellence Pvt. Ltd.",
    alternateName: "Inxyme (A Brand of Eklavya Centre of Excellence Pvt. Ltd.)",
    url: "https://www.inxyme.com",
    logo: "https://www.inxyme.com/images/inxyme-logo.png",
    description:
      "Inxyme is the flagship online learning and professional certification brand operated by Eklavya Centre of Excellence Pvt. Ltd.",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <SEO
        title="About Inxyme | A Brand of Eklavya Centre of Excellence Pvt. Ltd."
        description="Discover Inxyme, the flagship EdTech and professional learning brand operated by Eklavya Centre of Excellence Pvt. Ltd., offering career-focused courses, certifications, and job-ready skill training."
        keywords="Inxyme, Eklavya Centre of Excellence Pvt. Ltd., Eklavya Center of Excellence Pvt Ltd, about Inxyme, online learning platform, professional certifications, career growth, skill training"
        og={{
          title: "About Inxyme | A Brand of Eklavya Centre of Excellence Pvt. Ltd.",
          description:
            "Inxyme is the flagship professional learning brand of Eklavya Centre of Excellence Pvt. Ltd., delivering industry-aligned certifications and skill training.",
          type: "website",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white border-b border-indigo-800/60">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-blue-100 text-xs sm:text-sm font-semibold tracking-wide mb-6">
            <FaBuilding className="text-amber-300 shrink-0" aria-hidden="true" />
            <span>A Flagship Brand of Eklavya Centre of Excellence Pvt. Ltd.</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            About Us – Inxyme
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Empowering learners worldwide under our flagship brand{" "}
            <strong className="text-white font-bold">Inxyme</strong>, backed by{" "}
            <strong className="text-white font-bold">
              Eklavya Centre of Excellence Pvt. Ltd.
            </strong>
          </p>
        </div>
      </section>

      {/* Corporate Entity & Brand Identity Showcase */}
      <section
        aria-labelledby="corporate-brand-heading"
        className="pt-14 pb-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            <div className="bg-slate-900 dark:bg-slate-950 px-6 sm:px-10 py-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Corporate &amp; Brand Identity
                </p>
                <h2
                  id="corporate-brand-heading"
                  className="text-2xl sm:text-3xl font-bold text-white"
                >
                  Eklavya Centre of Excellence Pvt. Ltd. &rarr; Inxyme
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 self-start md:self-auto px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-white">
                <FaShieldAlt className="text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Registered Private Limited Company</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Parent Company Card */}
                <div className="lg:col-span-5 rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-slate-900/80 p-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider mb-4">
                      <FaBuilding aria-hidden="true" />
                      <span>Registered Company Name</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                      Eklavya Centre of Excellence Pvt. Ltd.
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      Our registered corporate organization responsible for
                      governance, academic partnerships, curriculum quality,
                      verified certifications, and official student &amp; enterprise
                      operations.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-blue-200/80 dark:border-slate-700 flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300">
                    <FaCheckCircle className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Official Legal Entity &amp; Parent Organization</span>
                  </div>
                </div>

                {/* Connector */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-amber-500 text-white flex items-center justify-center shadow-md mb-2">
                    <FaArrowRight className="rotate-90 lg:rotate-0 text-lg" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Known Worldwide As
                  </span>
                </div>

                {/* Public Brand Card */}
                <div className="lg:col-span-5 rounded-2xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/60 dark:bg-slate-900/80 p-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold uppercase tracking-wider mb-4">
                      <FaAward aria-hidden="true" />
                      <span>Public Brand Name</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="bg-white rounded-xl px-3.5 py-2 border border-slate-200 shadow-2xs inline-flex items-center">
                        <img
                          src="/images/inxyme-logo.png"
                          alt="Inxyme – Official Brand of Eklavya Centre of Excellence Pvt. Ltd."
                          width={654}
                          height={544}
                          className="h-11 w-auto object-contain"
                        />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        Inxyme
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      The recognized brand name by which students, trainers,
                      hiring partners, and corporate learners know our
                      e-learning platform, certification tracks, and live career
                      mentorship programs.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-amber-200/80 dark:border-slate-700 flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300">
                    <FaCheckCircle className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                    <span>Business &amp; Platform Identity (inxyme.com)</span>
                  </div>
                </div>
              </div>

              {/* Semantic Key-Value Corporate Facts */}
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Registered Company
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    Eklavya Centre of Excellence Pvt. Ltd.
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Operating Brand Name
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    Inxyme (Known Publicly &amp; Globally)
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Legal Jurisdiction
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    Delhi High Court (Any kind of legal dispute will come under
                    jurisdiction of Delhi High Court)
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Empowering Learners. Shaping Futures.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-slate-800 dark:text-slate-200 max-w-4xl mx-auto">
              Operated by{" "}
              <strong>Eklavya Centre of Excellence Pvt. Ltd.</strong> under the
              widely recognized brand name <strong>Inxyme</strong>, we believe
              that education should be accessible, practical, and aligned with
              real-world industry needs. As a leading e-learning platform, we
              offer high-quality certification programs, career tracks, and
              skill development tools designed for students, graduates, and
              working professionals.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Who We Are
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-slate-800 dark:text-slate-200 max-w-4xl mx-auto">
              <strong>Inxyme</strong> is the dedicated education and upskilling
              brand of{" "}
              <strong>Eklavya Centre of Excellence Pvt. Ltd.</strong> Our
              journey began with a clear purpose: to bridge the gap between
              theoretical education and industry requirements. Backed by a
              passionate team of academic experts, corporate trainers, and
              technology professionals, we are committed to delivering a
              future-ready learning experience.
            </p>
            <p className="text-lg text-slate-800 dark:text-slate-200 max-w-4xl mx-auto mt-5">
              We work in collaboration with recognized institutions, global
              educators, and experienced mentors to develop relevant,
              career-focused content that supports learners at every stage of
              their professional journey.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              What We Offer
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto">
              We provide a wide range of{" "}
              <strong>online programs and skill-based training,</strong>{" "}
              including:
            </p>
            <ul className="list-disc list-inside font-bold text-lg text-black dark:text-white max-w-4xl mx-auto">
              <li>Professional Certifications & Short-Term Courses</li>
              <li>Corporate Training & Skill Development Modules</li>
            </ul>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto mt-5">
              Every course is designed to be{" "}
              <strong>
                flexible, mobile-friendly, and globally recognized,
              </strong>{" "}
              allowing learners to study at their own pace and convenience.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Our Vision
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto">
              To become a trusted learning destination for individuals and
              professionals seeking to build skills, grow careers, and embrace
              lifelong learning through modern education.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Our Mission
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <ul className="list-disc list-none list-inside text-lg text-black dark:text-white max-w-4xl mx-auto">
              <li>
                Make{" "}
                <strong>quality education accessible and affordable</strong>
              </li>
              <li>
                Promote{" "}
                <strong>career-centric, industry-relevant skills</strong>
              </li>
              <li>
                Offer flexible programs that suit different learning needs
              </li>
              <li>
                Empower learners to{" "}
                <strong> achieve career success and personal growth</strong>
              </li>
            </ul>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Focused on Learner Success
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto">
              Each learner&apos;s journey is unique, and our platform is
              designed to support that:
            </p>
            <ul className="list-disc list-none list-inside text-lg text-black dark:text-white max-w-4xl mx-auto">
              <li>Interactive Learning Modules</li>
              <li>Live Webinars & Mentorship Sessions</li>
              <li>Placement Assistance & Interview Prep</li>
              <li>Progress Tracking & Certification</li>
            </ul>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto">
              With a growing base of satisfied learners across India and beyond,
              we have built a platform that is trusted by students, working
              professionals, and even corporate clients. Whether you&apos;re
              looking to upskill, change careers, or prepare for the future,
              we&apos;re here to guide you every step of the way.
            </p>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Let&apos;s Learn, Grow & Succeed Together
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-black dark:text-white max-w-4xl mx-auto">
              Education is more than just a certificate — it&apos;s a pathway to
              opportunity. Begin your learning journey with us today and take
              one step closer to achieving your professional and personal goals.
            </p>
          </div>
          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <FaBookOpen className="text-4xl text-blue-600 mb-4" />,
                title: "Wide Selection",
                description:
                  "Thousands of books across various subjects and disciplines.",
              },
              {
                icon: (
                  <FaGraduationCap className="text-4xl text-blue-600 mb-4" />
                ),
                title: "Expert Educators",
                description:
                  "Learn from industry professionals and experienced educators.",
              },
              {
                icon: <FaUsers className="text-4xl text-blue-600 mb-4" />,
                title: "Community",
                description: "Join a growing community of passionate learners.",
              },
              {
                icon: <FaAward className="text-4xl text-blue-600 mb-4" />,
                title: "Quality Content",
                description:
                  "Carefully curated content to ensure the best learning experience.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-black dark:text-white">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Our Team
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Amit Verma",
                  role: "Senior Programming Faculty",
                  bio: "Expert in Java, Python, and Data Structures with over 10 years of experience in technical education.",
                  image: "/images/faculty-1.jpg",
                },
                {
                  name: "Krishna Avtar",
                  role: "Full Stack Development Faculty",
                  bio: "Specializes in MERN stack, scalable web applications, and real-world project-based learning.",
                  image: "/images/faculty-2.jpg",
                },
                {
                  name: "Rohit Sharma",
                  role: "Web Development Trainer",
                  bio: "Trains students in HTML, CSS, JavaScript, and modern frontend frameworks with practical examples.",
                  image: "/images/faculty-3.jpg",
                },
                {
                  name: "Neha Gupta",
                  role: "UI/UX & Design Faculty",
                  bio: "Focused on teaching design thinking, UI/UX principles, and user-centered product design.",
                  image: "/images/faculty-4.jpg",
                },
                {
                  name: "Ankit Singh",
                  role: "Digital Marketing Faculty",
                  bio: "Mentor for SEO, SMO, Google Ads, and performance marketing in the education domain.",
                  image: "/images/faculty-5.jpg",
                },
                {
                  name: "Pooja Mishra",
                  role: "Content & Communication Skills Trainer",
                  bio: "Helps learners improve technical writing, presentation skills, and professional communication.",
                  image: "/images/faculty-6.jpg",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 mb-3">{member.role}</p>
                    <p className="text-black dark:text-white">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* CTA Section */}
          <div className="mt-20 bg-blue-900 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-white dark:text-white mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their careers
              with our courses.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Browse Courses
            </Link>
          </div>
          <p className="text-center text-lg text-slate-800 dark:text-slate-200 mt-12">
            Welcome to <strong>Inxyme</strong> (a brand of{" "}
            <strong>Eklavya Centre of Excellence Pvt. Ltd.</strong>) — your
            partner in skill-building and career success.
          </p>
        </div>
      </section>
    </div>
  );
}
