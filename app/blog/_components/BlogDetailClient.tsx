"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaShareAlt,
  FaCheck,
  FaLink,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaFacebookF,
  FaTag,
  FaUser,
  FaBookOpen,
  FaGraduationCap,
  FaArrowRight,
  FaListUl,
  FaExpand,
  FaTimes,
  FaSearchPlus,
  FaDownload,
} from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";
import { getBlogPostBySlug } from "../../api/blogApi";
import type { BlogPost } from "../../lib/server-api";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogDetailClientProps {
  post: BlogPost | null;
  slug: string;
  relatedPosts?: BlogPost[];
}

export default function BlogDetailClient({
  post: initialPost,
  slug,
  relatedPosts = [],
}: BlogDetailClientProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [loading, setLoading] = useState<boolean>(!initialPost);
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Keyboard escape listener to close image lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsImageModalOpen(false);
        setIsImageZoomed(false);
      }
    };
    if (isImageModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageModalOpen]);

  // Client fallback fetching if initialPost was not provided by SSR
  useEffect(() => {
    if (!post && slug) {
      setLoading(true);
      getBlogPostBySlug(slug)
        .then((res) => {
          const found = res?.data?.post || res?.post || res?.data || null;
          setPost(found);
        })
        .catch((err) => {
          console.error("Error fetching post on client:", err);
          setPost(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug, post]);

  // Set window URL for social sharing
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Scroll progress listener & active TOC observer
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Track active heading
      const headingElements = document.querySelectorAll(
        "article h2[id], article h3[id]",
      );
      const scrollPos = window.scrollY + 120;
      let currentActive = "";
      headingElements.forEach((el) => {
        const top = (el as HTMLElement).offsetTop;
        if (scrollPos >= top) {
          currentActive = el.id;
        }
      });
      if (currentActive) {
        setActiveHeadingId(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Process HTML content to inject IDs for Table of Contents
  const { processedContent, tocList } = useMemo(() => {
    if (!post?.content) return { processedContent: "", tocList: [] };

    const toc: TocItem[] = [];
    let count = 0;

    // Match <h2> and <h3> tags
    const modified = post.content.replace(
      /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, text) => {
        const cleanText = text.replace(/<[^>]*>/g, "").trim();
        if (!cleanText) return match;

        count++;
        // Create anchor slug
        const id =
          cleanText
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") || `heading-${count}`;

        toc.push({
          id,
          text: cleanText,
          level: tag.toLowerCase() === "h2" ? 2 : 3,
        });

        // Retain existing attributes and inject id
        if (/id=["'][^"']*["']/i.test(attrs)) {
          return match;
        }
        return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
      },
    );

    return { processedContent: modified, tocList: toc };
  }, [post?.content]);

  const handleCopyLink = async () => {
    try {
      const urlToCopy = currentUrl || window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareTitle = post?.title ? encodeURIComponent(post.title) : "";
  const shareUrl = encodeURIComponent(currentUrl);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-5 w-4/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not found fallback state
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl">
            <FaBookOpen />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Article Not Found
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The blog article you are looking for may have been moved, updated, or
            is temporarily unavailable.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const readingTimeEstimate =
    post.readingTime ||
    (post.content
      ? Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200))
      : 5);

  const authorName =
    post.author?.fullname || post.author?.name || "Inxyme Editorial Team";

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 selection:bg-blue-500 selection:text-white pb-20">
      {/* Scroll Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ===== HERO / HEADER SECTION ===== */}
      <header className="pt-4 pb-8 sm:pt-6 sm:pb-10 border-b border-gray-200/70 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-2">

          {/* Categories badges */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {post.categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug || cat.name}
                  href={`/blog?category=${cat.slug || cat.name}`}
                  className="px-3 py-1 bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 rounded-full text-xs font-bold tracking-wide uppercase transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight md:leading-tight">
            {post.title}
          </h1>

          {/* Excerpt if present */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta bar: Author, Date, Reading time, and Share */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Author */}
              <div className="flex items-center gap-2.5">
                {/* <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  Inxyme
                </div> */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Inxyme
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Author &amp; Insights
                  </p>
                </div>
              </div>

              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

              {/* Date */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>

              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

              {/* Reading time */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <FaClock className="text-gray-400 dark:text-gray-500" />
                <span>{readingTimeEstimate} min read</span>
              </div>
            </div>

            {/* Quick social share icons */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">
                Share:
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy link"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors relative"
              >
                {copied ? (
                  <FaCheck className="text-emerald-500 text-xs" />
                ) : (
                  <FaLink className="text-xs" />
                )}
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-sky-500 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors"
              >
                <FaTwitter className="text-xs" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="text-xs" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-700 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors"
              >
                <FaFacebookF className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== ARTICLE BODY & SIDEBAR CONTAINER ===== */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <article className="lg:col-span-8 min-w-0 space-y-10">
            {/* Featured Image with Cool Interactive Features */}
            {post.featuredImage && (
              <figure className="mb-8 space-y-2">
                <div
                  onClick={() => setIsImageModalOpen(true)}
                  className="group relative max-h-[520px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/80 dark:border-gray-800 bg-gray-900 cursor-zoom-in"
                >
                  {/* Loading placeholder skeleton */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse min-h-[300px]" />
                  )}

                  {/* Main Image with Hover Zoom */}
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    onLoad={() => setIsImageLoaded(true)}
                    className={`w-full h-full object-cover max-h-[520px] transform group-hover:scale-105 transition-transform duration-700 ease-out ${isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                  />

                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

                  {/* Top-Left: Category Badge */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {post.categories[0].name}
                      </span>
                    </div>
                  )}

                  {/* Top-Right: Fullscreen Expand Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageModalOpen(true);
                    }}
                    title="View fullscreen"
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-md group-hover:scale-110"
                  >
                    <FaExpand className="text-xs" />
                  </button>

                  {/* Bottom Info Bar: Reading Time, Date & Hover Zoom Indicator */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white/95 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md border border-white/10">
                        <FaClock className="text-[10px] text-blue-400" />
                        {readingTimeEstimate} min read
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md border border-white/10">
                        <FaCalendarAlt className="text-[10px] text-indigo-300" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>

                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-medium text-white shadow-sm">
                      <FaSearchPlus className="text-[10px]" /> Click to enlarge
                    </span>
                  </div>
                </div>

                {/* Subtle Caption */}
                <figcaption className="text-center text-xs text-gray-500 dark:text-gray-400 italic pt-1">
                  Featured illustration: {post.title}
                </figcaption>
              </figure>
            )}

            {/* Fullscreen Lightbox Modal */}
            {isImageModalOpen && post.featuredImage && (
              <div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-fade-in"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setIsImageZoomed(false);
                }}
              >
                {/* Modal Top Controls Bar */}
                <div
                  className="w-full max-w-5xl flex items-center justify-between pb-4 text-white z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-semibold truncate max-w-md hidden sm:inline">
                    {post.title}
                  </span>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* Zoom Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsImageZoomed((prev) => !prev)}
                      title={isImageZoomed ? "Zoom out" : "Zoom in"}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                    >
                      <FaSearchPlus className="text-xs" />
                      <span>{isImageZoomed ? "Reset (100%)" : "Zoom In (150%)"}</span>
                    </button>

                    {/* Open Original */}
                    <a
                      href={getImageUrl(post.featuredImage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full resolution image in new tab"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                    >
                      <FaDownload className="text-xs" />
                      <span className="hidden sm:inline">Original</span>
                    </a>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsImageModalOpen(false);
                        setIsImageZoomed(false);
                      }}
                      title="Close (Esc)"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 ml-2"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Modal Image Display */}
                <div
                  className="relative max-w-5xl max-h-[80vh] overflow-auto rounded-2xl flex items-center justify-center p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className={`rounded-2xl transition-all duration-300 select-none ${isImageZoomed
                      ? "scale-150 cursor-zoom-out max-w-none"
                      : "max-h-[76vh] w-auto object-contain cursor-zoom-in"
                      }`}
                    onClick={() => setIsImageZoomed((prev) => !prev)}
                  />
                </div>

                {/* Modal Footer Caption */}
                <p className="pt-3 text-xs text-white/70 text-center max-w-2xl truncate">
                  {post.title} • Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">Esc</kbd> or click outside to close
                </p>
              </div>
            )}

            {/* Rich HTML Content */}
            <div
              className="blog-content text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed space-y-1.5 break-words
                [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-gray-100 [&_h2]:dark:border-gray-800 [&_h2]:scroll-mt-24
                [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24
                [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:dark:text-white [&_h4]:mt-6 [&_h4]:mb-2
                [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-gray-700 [&_p]:dark:text-gray-300
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2
                [&_li]:leading-relaxed [&_li]:text-gray-700 [&_li]:dark:text-gray-300
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-blue-50/50 [&_blockquote]:dark:bg-blue-950/20 [&_blockquote]:rounded-r-xl [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:font-medium [&_a]:hover:text-blue-800 [&_a]:dark:hover:text-blue-300
                [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
                [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:text-blue-600 [&_code]:dark:text-blue-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200 [&_table]:dark:border-gray-700
                [&_th]:bg-gray-100 [&_th]:dark:bg-gray-800 [&_th]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:dark:border-gray-700 [&_th]:font-semibold [&_th]:text-left
                [&_td]:p-3 [&_td]:border [&_td]:border-gray-200 [&_td]:dark:border-gray-700"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <FaTag /> Tags:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Callout Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Found this article helpful?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Share it with your colleagues and network to spread the knowledge.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <FaCheck className="text-emerald-500 text-xs" />
                  ) : (
                    <FaLink className="text-xs" />
                  )}
                  <span>{copied ? "Link Copied" : "Copy Link"}</span>
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 hover:bg-sky-500 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                  title="Share on X"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                  title="Share on LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Author Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-start gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Inxyme
                  </h2>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-semibold rounded-md uppercase">
                    Author
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.author?.bio ||
                    "Passionate educator and industry researcher at Inxyme, dedicated to bringing real-world insights, career trends, and skill advancement tips to modern professionals."}
                </p>
                <div className="pt-1">
                  <Link
                    href="/blog"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>More from Inxyme</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Inxyme Upskill Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl">
              <div className="relative z-10 max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
                  <FaGraduationCap className="text-yellow-300" />
                  <span>Accelerate Your Career</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  Ready to Turn Insights Into In-Demand Skills?
                </h2>
                <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
                  Explore Inxyme&apos;s industry-aligned certification courses in Data
                  Science, SAP, Cloud, and Management designed by veteran
                  instructors.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/courses"
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-700 text-sm font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    Explore Courses
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-semibold rounded-xl backdrop-blur-sm transition-all"
                  >
                    Talk to an Advisor
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Table of Contents (if articles have H2/H3 headers) */}
              {tocList.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <FaListUl className="text-blue-600 dark:text-blue-400" />
                    <span>Table of Contents</span>
                  </div>
                  <nav className="space-y-1.5 max-h-[340px] overflow-y-auto pr-2 text-xs">
                    {tocList.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(item.id);
                          if (target) {
                            target.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className={`block py-1 transition-colors leading-snug ${item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                          } ${activeHeadingId === item.id
                            ? "text-blue-600 dark:text-blue-400 font-bold"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Sidebar Course Recommendation Promo */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-300">
                  Featured Learning
                </span>
                <h2 className="text-lg font-bold leading-tight">
                  Master In-Demand Tech &amp; Management Skills
                </h2>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Join thousands of learners advancing their careers with
                  practical projects, recognized certificates, and 1-on-1 mentor
                  guidance.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors w-full justify-center shadow"
                >
                  <span>Browse All Courses</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              {/* Sidebar More Articles */}
              {relatedPosts.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Recommended Reads
                  </h2>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 4).map((rel) => (
                      <Link
                        key={rel._id}
                        href={`/blog/${rel.slug}`}
                        className="group flex items-start gap-3"
                      >
                        {rel.featuredImage && (
                          <div className="h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getImageUrl(rel.featuredImage)}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                            {rel.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {formatDate(rel.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ===== BOTTOM RELATED POSTS GRID ===== */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  Related Articles
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expand your knowledge with curated articles in this field
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View All Articles</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((rel) => (
                <article
                  key={rel._id}
                  className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {rel.featuredImage && (
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="relative block h-48 overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={getImageUrl(rel.featuredImage)}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[10px]" />
                          {formatDate(rel.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[10px]" />
                          {rel.readingTime || 5} min read
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      {rel.excerpt && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Article</span>
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
