"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SignOutButton from "@/components/SignOutButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="p-4 bg-gray-100 flex gap-4 items-center">
      <Link href="/dashboard">Dashboard</Link>

      {/* Citizen */}
      <Link href="/complaints/new">Report Complaint</Link>
      <Link href="/complaints">My Complaints</Link>

      {/* Admin */}
      {user?.role === "admin" && (
        <Link href="/admin/dashboard">Admin</Link>
      )}

      {/* Officer */}
      {user?.role === "officer" && (
        <Link href="/officer/dashboard">Officer</Link>
      )}

      <div className="ml-auto">
        <SignOutButton />
      </div>
    </nav>
  );
}