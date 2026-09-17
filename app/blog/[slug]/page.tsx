import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchBlogPostBySlug,
  fetchRelatedPosts,
  fetchNextBlogs,
  getSiteBase,
  BlogPost,
} from "../../lib/server-api";
import { getImageUrl } from "../../utils/imageUtils";
import BlogDetailClient from "../_components/BlogDetailClient";

const FALLBACK_SITE_URL = "https://www.inxyme.com";

function getPostImageUrl(
  imagePath: string | undefined,
  siteBase: string,
): string {
  if (!imagePath) return `${siteBase}/images/inxyme-logo-fit-E.jpeg`;
  const resolved = getImageUrl(imagePath);
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  return `${siteBase}${resolved.startsWith("/") ? "" : "/"}${resolved}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Inxyme Blog",
      description: "The requested blog post could not be found.",
    };
  }

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const postImageUrl = getPostImageUrl(
    post.featuredImage || post.imageUrl,
    siteBase,
  );

  const title = post.seo?.metaTitle || post.title;
  const description =
    post.seo?.metaDescription ||
    post.excerpt ||
    "Explore career insights, learning resources, and expert tips with Inxyme.";
  const canonical = `${siteBase}/blog/${post.slug || slug}`;
  const keywords =
    post.seo?.metaKeywords?.join(", ") ||
    post.tags?.join(", ") ||
    "Inxyme blog, career tips, skill learning";

  return {
    title: `${title} | Inxyme Blog`,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | Inxyme Blog`,
      description,
      url: canonical,
      siteName: "Inxyme",
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [post.author?.fullname || post.author?.name || "Inxyme Team"],
      images: [
        {
          url: postImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Inxyme Blog`,
      description,
      images: [postImageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const postImageUrl = getPostImageUrl(
    post.featuredImage || post.imageUrl,
    siteBase,
  );
  const canonical = `${siteBase}/blog/${post.slug || slug}`;
  const authorName =
    post.author?.fullname || post.author?.name || "Inxyme Editorial Team";

  // Fetch related posts (by category first, or fallback to next blogs)
  let relatedPosts: BlogPost[] = [];
  const primaryCategoryId = post.categories?.[0]?._id;

  if (primaryCategoryId) {
    relatedPosts = await fetchRelatedPosts(primaryCategoryId, post._id, 3);
  }

  if (relatedPosts.length === 0) {
    relatedPosts = await fetchNextBlogs(post.slug, 3);
  }

  // Structured Data / Schema.org
  const schemas: Record<string, any>[] = [];

  // 1) BlogPosting / Article Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.seo?.metaDescription || post.title,
    image: [postImageUrl],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Inxyme",
      url: siteBase,
      logo: {
        "@type": "ImageObject",
        url: `${siteBase}/images/inxyme-logo-fit-E.jpeg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  });

  // 2) BreadcrumbList Schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteBase,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${siteBase}/blog`,
    },
  ];

  if (post.categories && post.categories.length > 0) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post.categories[0].name,
      item: `${siteBase}/blog?category=${post.categories[0].slug || post.categories[0].name}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: post.title,
      item: canonical,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: canonical,
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  });

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`blog-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BlogDetailClient
        post={post}
        slug={slug}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
