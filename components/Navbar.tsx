"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/complaints">Complaints</Link>

      {user?.role === "admin" && (
        <Link href="/admin/dashboard">Admin</Link>
      )}

      {user?.role === "officer" && (
        <Link href="/officer/dashboard">Officer</Link>
      )}
    </nav>
  );
}