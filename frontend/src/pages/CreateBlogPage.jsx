import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import QuillEditor from "../components/QuillEditor";
import { PenTool, Image, Tag, ArrowLeft, Loader2 } from "lucide-react";

export default function CreateBlogPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // If editing, load the blog post
  useEffect(() => {
    if (!isEditing) return;

    async function loadPost() {
      try {
        const data = await apiRequest(`/api/blogs/${id}`);
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setCategory(data.category || "");
        setCoverImage(data.coverImage || "");
        setContent(data.content || "");
      } catch (err) {
        setError("Failed to load blog for editing");
      } finally {
        setFetchLoading(false);
      }
    }

    loadPost();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please provide a title and article content.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isEditing ? `/api/blogs/${id}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category: category || "General",
          coverImage,
        }),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-[#94a3b8]">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa] py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-[#f5f7fa]">
              {isEditing ? "Edit Your Story" : "Write a New Story"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-1">
              Share your insights, thoughts, and knowledge with the community.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-500 dark:text-[#94a3b8] hover:text-blue-500 transition"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-[#f5f7fa]">
              Article Title
            </label>
            <input
              type="text"
              placeholder="e.g., The Future of Web Development in 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] text-gray-900 dark:text-[#f5f7fa] placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg font-semibold transition"
            />
          </div>

          {/* Short Excerpt */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-[#f5f7fa]">
              Short Description / Excerpt
            </label>
            <textarea
              placeholder="A brief one or two sentence summary of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] text-gray-900 dark:text-[#f5f7fa] placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
            />
          </div>

          {/* Category & Cover Image (Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-[#f5f7fa]">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Technology, Design, Lifestyle"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] text-gray-900 dark:text-[#f5f7fa] placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-[#f5f7fa]">
                Cover Photo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] text-gray-900 dark:text-[#f5f7fa] placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
              />
            </div>
          </div>

          {/* Quill Rich Text Editor */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-[#f5f7fa]">
              Full Story Content (Photos & Videos Supported)
            </label>
            <QuillEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your article... You can format headings, add bold text, quotes, insert photos, and embed YouTube videos directly from the toolbar above!"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Publish Story"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
