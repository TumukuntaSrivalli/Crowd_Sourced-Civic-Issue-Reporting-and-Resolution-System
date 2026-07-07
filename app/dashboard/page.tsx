"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <main className="min-h-screen p-8">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <div className="mt-6 space-y-2">

        <p>
          <strong>Name:</strong> {user?.displayName}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

      </div>

      <button
        onClick={handleLogout}
        className="mt-8 rounded bg-red-600 px-6 py-3 text-white"
      >
        Logout
      </button>
        
    </main>
  );
}