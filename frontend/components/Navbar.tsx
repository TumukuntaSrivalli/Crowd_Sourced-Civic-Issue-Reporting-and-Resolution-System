"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900 dark:from-white dark:via-sky-200 dark:to-indigo-300 bg-clip-text text-transparent font-extrabold text-lg sm:text-xl">
            CivicSense
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
            SmartGov
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive("/")
                ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive("/dashboard")
                  ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          )}

          {/* Citizen Routes */}
          {user?.role === "citizen" && (
            <>
              <Link
                href="/complaints/new"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/complaints/new")
                    ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Report Issue
              </Link>
              <Link
                href="/complaints"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/complaints")
                    ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                My Complaints
              </Link>
            </>
          )}

          {/* Admin Routes */}
          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/dashboard"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/admin/dashboard")
                    ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Admin Control
              </Link>
              <Link
                href="/admin/analytics"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/admin/analytics")
                    ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Analytics & Power BI
              </Link>
            </>
          )}

          {/* Officer Routes */}
          {user?.role === "officer" && (
            <Link
              href="/officer/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive("/officer/dashboard")
                  ? "bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Officer Portal
            </Link>
          )}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Switcher */}
          <ThemeToggle />

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-sky-600 hover:to-indigo-700 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {user.role}
                </span>
              </div>
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/30 px-3 py-1.5 hover:bg-red-100/80 dark:hover:bg-red-900/50 transition">
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}