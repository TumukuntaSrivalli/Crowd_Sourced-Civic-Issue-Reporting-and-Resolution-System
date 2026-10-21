"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Dark mode active (click to switch to Light)" : "Light mode active (click to switch to Dark)"}
      aria-label="Toggle theme"
      className="
        relative
        flex
        items-center
        gap-1.5
        px-3
        h-9
        rounded-xl
        border
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-800
        text-slate-700
        dark:text-slate-200
        hover:bg-slate-100
        dark:hover:bg-slate-700
        hover:scale-105
        active:scale-95
        transition-all
        duration-200
        shadow-sm
        cursor-pointer
      "
    >
      {isDark ? (
        <>
          <svg
            className="w-4 h-4 text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="text-xs font-semibold tracking-wide text-slate-200">Dark</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span className="text-xs font-semibold tracking-wide text-slate-700">Light</span>
        </>
      )}
    </button>
  );
}
