import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Edit3, Trash2 } from "lucide-react";

export default function BlogCard({ blog, isOwner, onDelete }) {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const authorName = blog.authorName || blog.author?.name || "Anonymous";

  return (
    <article className="group flex flex-col justify-between rounded-xl overflow-hidden border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
      <div>
        {/* Cover Image or Category Top Banner */}
        {blog.coverImage ? (
          <div className="h-44 w-full overflow-hidden bg-gray-100 dark:bg-[#171e29]">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="h-2.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        )}

        <div className="p-6">
          {/* Category Tag & Date */}
          <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase mb-3">
            <span className="px-2.5 py-1 rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              {blog.category || "General"}
            </span>
            <span className="flex items-center gap-1 text-gray-400 dark:text-[#94a3b8] font-normal normal-case">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#f5f7fa] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 dark:text-[#94a3b8] line-clamp-3 leading-relaxed mb-4">
            {blog.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Author Attribution & Action Buttons */}
      <div className="px-6 pb-6 pt-3 border-t border-gray-100 dark:border-[#202938] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-[#94a3b8]">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate max-w-[120px]">{authorName}</span>
        </div>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <Link
                to={`/edit/${blog._id}`}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-[#202938] text-gray-600 dark:text-[#94a3b8] hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition"
                title="Edit post"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(blog._id)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-[#202938] text-gray-600 dark:text-[#94a3b8] hover:text-red-600 dark:hover:text-red-400 hover:border-red-500 transition"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to={`/blog/${blog._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
