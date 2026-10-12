import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, PenSquare, LayoutDashboard, LogIn, UserPlus, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#080b10]/90 border-b border-gray-200 dark:border-[#202938] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-gray-900 dark:text-[#f5f7fa] hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          The Daily<span className="text-blue-600">.</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-600 dark:text-[#94a3b8] hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-[#94a3b8] hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/create"
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-[#94a3b8] hover:text-blue-600 dark:hover:text-blue-400 transition px-2 py-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-[#202938] bg-gray-100 dark:bg-[#171e29] text-gray-700 dark:text-[#f5f7fa] hover:border-blue-500 hover:scale-105 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Profile Dropdown (when authenticated) */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#202938] bg-gray-50 dark:bg-[#11161f] text-sm font-semibold text-gray-800 dark:text-[#f5f7fa] hover:border-blue-500 transition"
              >
                <User className="w-4 h-4 text-blue-500" />
                <span className="hidden md:inline max-w-[120px] truncate">
                  {user?.name || "Account"}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f] p-3 text-sm z-50">
                  <div className="border-b border-gray-100 dark:border-[#202938] pb-2 mb-2">
                    <p className="font-bold text-gray-900 dark:text-[#f5f7fa] truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#94a3b8] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-700 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#171e29] transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                  <Link
                    to="/create"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-700 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#171e29] transition"
                  >
                    <PenSquare className="w-4 h-4" />
                    Write a Story
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-2 mt-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
