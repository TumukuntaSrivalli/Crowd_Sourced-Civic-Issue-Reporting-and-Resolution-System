"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SignOutButton from "@/components/SignOutButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      className="
      sticky
      top-0
      z-50
      w-full
      border-b
      border-zinc-800
      bg-black/80
      backdrop-blur-xl
      px-8
      py-4
      flex
      items-center
      gap-8
      shadow-xl
      "
    >
      {/* Brand */}
      <Link
        href="/dashboard"
        className="
        text-2xl
        font-extrabold
        tracking-wide
        bg-linear-to-r
        from-blue-400
        via-cyan-400
        to-white
        bg-clip-text
        text-transparent
        hover:scale-105
        transition
        "
      >
        Civic Issue Reporting
      </Link>

      {/* Navigation Links */}
      <div
        className="
        flex
        items-center
        gap-7
        text-sm
        font-medium
        "
      >
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="
          rounded-lg
          px-3
          py-2
          text-zinc-300
          hover:bg-zinc-800
          hover:text-cyan-400
          transition
          "
        >
          Dashboard
        </Link>

        {/* Citizen Only */}
        {user?.role === "citizen" && (
          <>
            <Link
              href="/complaints/new"
              className="
              rounded-lg
              px-3
              py-2
              text-zinc-300
              hover:bg-zinc-800
              hover:text-cyan-400
              transition
              "
            >
              Report Complaint
            </Link>

            <Link
              href="/complaints"
              className="
              rounded-lg
              px-3
              py-2
              text-zinc-300
              hover:bg-zinc-800
              hover:text-cyan-400
              transition
              "
            >
              My Complaints
            </Link>
          </>
        )}

        {/* Admin */}
        {user?.role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="
            rounded-lg
            px-3
            py-2
            text-zinc-300
            hover:bg-zinc-800
            hover:text-cyan-400
            transition
            "
          >
            Admin Dashboard
          </Link>
        )}

        {/* Officer */}
        {user?.role === "officer" && (
          <Link
            href="/officer/dashboard"
            className="
            rounded-lg
            px-3
            py-2
            text-zinc-300
            hover:bg-zinc-800
            hover:text-cyan-400
            transition
            "
          >
            Officer Dashboard
          </Link>
        )}
      </div>

      {/* Sign Out */}
      <div className="ml-auto">
        <div
          className="
          rounded-xl
          border
          border-red-500/30
          bg-red-500/10
          px-4
          py-2
          hover:bg-red-500/20
          transition
          "
        >
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}