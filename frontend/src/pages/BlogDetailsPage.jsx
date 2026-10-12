import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../api";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await apiRequest(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-[#94a3b8]">Loading story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen py-32 text-center bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa]">
        <h2 className="text-2xl font-bold mb-4">Story not found</h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to stories
        </Link>
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently published";

  const authorName = blog.authorName || blog.author?.name || "Anonymous";

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa] py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-[#94a3b8] hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all stories
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-4">
          <span className="px-3 py-1 rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            {blog.category || "General"}
          </span>
          <span className="flex items-center gap-1 text-gray-400 dark:text-[#94a3b8] normal-case font-normal">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
        </div>

        {/* Story Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-[#f5f7fa] leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author Attribution Card */}
        <div className="flex items-center gap-3 py-4 border-y border-gray-200 dark:border-[#202938] mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-[#f5f7fa]">
              Written by {authorName}
            </p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">
              Author • The Daily Contributor
            </p>
          </div>
        </div>

        {/* Cover Image (if available) */}
        {blog.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-[#202938] max-h-96 w-full">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Excerpt Summary */}
        {blog.excerpt && (
          <p className="text-xl font-medium text-gray-600 dark:text-[#94a3b8] italic border-l-4 border-blue-600 pl-4 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Rich Article Body (Rendered from Quill) */}
        <div
          className="prose dark:prose-invert max-w-none text-gray-800 dark:text-[#e2e8f0] text-lg leading-relaxed space-y-4 ql-editor px-0"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </div>
    </article>
  );
}
