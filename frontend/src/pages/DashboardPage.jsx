import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import { PenSquare, BookOpen, User, Mail, Loader2, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchMyBlogs() {
      try {
        const data = await apiRequest("/api/my-blogs");
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load user blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyBlogs();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await apiRequest(`/api/blogs/${id}`, { method: "DELETE" });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete blog: " + err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-[#94a3b8]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa] py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card Banner */}
        <div className="rounded-2xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] p-6 sm:p-8 mb-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-[#f5f7fa]">
                {user?.name || "Author Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Story</span>
            </Link>
          </div>
        </div>

        {/* Stories Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#f5f7fa]">
              Your Published Stories ({blogs.length})
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">
              Manage, edit, or delete your articles.
            </p>
          </div>
        </div>

        {/* Stories Grid */}
        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-[#202938] p-16 text-center bg-white/50 dark:bg-[#11161f]/50">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-[#f5f7fa] mb-1">
              You haven't written any stories yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#94a3b8] max-w-sm mx-auto mb-6">
              Publish your first story and share your perspectives with our readers!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create Your First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                isOwner={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
