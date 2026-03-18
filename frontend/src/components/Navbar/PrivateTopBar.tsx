"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const PrivateTopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const displayName = user?.username ?? "...";
  const displayEmail = user?.email ?? "";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Important to include cookies
        },
      );
      const data = await response.json();
      console.log("Logout response:", data);
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      toast.success("Logged out successfully!");
      router.push("/home");
    } catch (e) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", e);
    }
  };

  return (
    <header
      className="
            sticky top-0 z-30
            flex items-center justify-end px-6 h-16 gap-3
            bg-white/80 dark:bg-[#111318]/80 
            backdrop-blur-md
            border-b border-gray-100 dark:border-white/6
            transition-colors duration-300
        "
    >
      {/* Theme Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
                        p-2 rounded-full flex items-center justify-center
                        text-gray-500 dark:text-gray-400
                        hover:bg-gray-100 dark:hover:bg-white/5
                        transition-colors duration-200
                        outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]
                    "
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      )}

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
                        flex items-center gap-2 px-2 py-1.5 rounded-full
                        hover:bg-gray-100 dark:hover:bg-white/5
                        transition-colors duration-200
                        outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]
                        group
                    "
        >
          {/* Avatar */}
          <div
            className="
                        flex items-center justify-center
                        w-9 h-9 rounded-full
                        bg-linear-to-tr from-[#1E3A8A] to-blue-400 dark:from-blue-600 dark:to-blue-400
                        shadow-inner text-white font-bold text-sm select-none
                        transition-transform duration-300 group-hover:scale-105
                    "
          >
            {avatarInitial}
          </div>
          {/* User Info (Desktop only) */}
          <div className="hidden md:flex flex-col text-left mr-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
              Admin
            </span>
          </div>
          {/* Chevron */}
          <ChevronDown
            className={`
                        w-4 h-4 text-gray-400 transition-transform duration-300
                        ${isOpen ? "rotate-180" : ""}
                    `}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`
                    absolute right-0 mt-2 w-64
                    bg-white dark:bg-[#1A1D24]
                    border border-gray-100 dark:border-white/10
                    rounded-2xl shadow-xl dark:shadow-2xl
                    overflow-hidden
                    origin-top-right
                    transition-all duration-300 ease-out
                    ${
                      isOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }
                `}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/10">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {displayEmail}
            </p>
          </div>

          {/* Section 1 */}
          <div className="p-1.5 border-b border-gray-100 dark:border-white/10">
            <Link
              href="/profile"
              className="
                            flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white
                            transition-colors duration-200
                        "
            >
              <User className="w-4 h-4 text-gray-400" />
              My Profile
            </Link>
            <Link
              href="/settings"
              className="
                            flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white
                            transition-colors duration-200
                        "
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Account Settings
            </Link>
          </div>

          {/* Section 2 */}
          <div className="p-1.5 border-b border-gray-100 dark:border-white/10">
            <Link
              href="/support"
              className="
                            flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white
                            transition-colors duration-200
                        "
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              Help & Support
            </Link>
            <Link
              href="/docs"
              className="
                            flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white
                            transition-colors duration-200
                        "
            >
              <FileText className="w-4 h-4 text-gray-400" />
              Docs
            </Link>
          </div>

          {/* Section 3 */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="
                            w-full flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium text-red-600 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300
                            transition-colors duration-200
                        "
            >
              <LogOut className="w-4 h-4 opacity-80" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PrivateTopBar;
