import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import BlogCard from "../components/BlogCard";
import { Search, Sparkles, Loader2 } from "lucide-react";

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await apiRequest("/api/blogs");
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080b10] text-gray-900 dark:text-[#f5f7fa] transition-colors duration-200">
      {/* Hero Header */}
      <section className="border-b border-gray-200 dark:border-[#202938] bg-white dark:bg-[#0d121b] py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Daily • Thoughts, Stories & Ideas</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-[#f5f7fa] leading-tight mb-6">
            Ideas worth reading. Stories worth sharing.
          </h1>
          <p className="text-lg text-gray-600 dark:text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Explore carefully crafted articles written by creators around the world.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#202938] bg-gray-50 dark:bg-[#11161f] text-gray-900 dark:text-[#f5f7fa] placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-[#11161f] text-gray-600 dark:text-[#94a3b8] border border-gray-200 dark:border-[#202938] hover:border-blue-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading State (Crucial for Render free-tier wakeups!) */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-800 dark:text-[#f5f7fa]">
              Loading stories...
            </p>
            <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-1 max-w-sm">
              Connecting to server. If this is the first visit, it may take 20–30 seconds for the free server to wake up!
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-bold text-gray-800 dark:text-[#f5f7fa] mb-2">
              No stories found
            </p>
            <p className="text-gray-500 dark:text-[#94a3b8]">
              {searchQuery
                ? `No articles matching "${searchQuery}"`
                : "Be the first to publish a story!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
