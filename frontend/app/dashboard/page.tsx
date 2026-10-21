"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { getUserComplaints } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import ComplaintCard from "@/components/complaint/ComplaintCard";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<(Complaint & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserComplaints(user.uid);
        setComplaints(data as (Complaint & { id: string })[]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress" || c.status === "Assigned").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-sky-100 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-800/80 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:text-sky-300 mb-2">
              Citizen Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName || user?.email?.split("@")[0] || "Citizen"} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage your submitted civic grievances and monitor municipal progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/complaints/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-md hover:shadow-sky-500/20 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Report Issue
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Reported
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {total}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Triage
            </span>
            <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {pending}
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Active / In Progress
            </span>
            <div className="mt-2 text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {inProgress}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Resolved Issues
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {resolved}
            </div>
          </div>
        </div>

        {/* Profile Card & Recent Activity Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs h-fit">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Citizen Profile
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Full Name</span>
                <span className="font-semibold">{user?.displayName || "Citizen User"}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Email Address</span>
                <span className="font-medium font-mono text-xs text-slate-700 dark:text-slate-300">{user?.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Registered Role</span>
                <span className="inline-block mt-1 rounded-md bg-sky-100 dark:bg-sky-950/80 px-2 py-0.5 text-xs font-bold uppercase text-sky-700 dark:text-sky-300">
                  {user?.role || "Citizen"}
                </span>
              </div>
            </div>

            <hr className="my-6 border-slate-200 dark:border-slate-800" />

            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Quick Shortcuts
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/complaints"
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 transition flex items-center justify-between"
              >
                <span>Browse All My Reports</span>
                <span>→</span>
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 p-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:border-indigo-500 transition flex items-center justify-between"
                >
                  <span>Open Admin Control</span>
                  <span>→</span>
                </Link>
              )}
              {user?.role === "officer" && (
                <Link
                  href="/officer/dashboard"
                  className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:border-emerald-500 transition flex items-center justify-between"
                >
                  <span>Open Officer Field Center</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Submissions
              </h2>
              {complaints.length > 3 && (
                <Link
                  href="/complaints"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  View All ({complaints.length})
                </Link>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500">Loading your complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You haven't filed any complaints yet. Report an issue to help improve your neighborhood!
                </p>
                <Link
                  href="/complaints/new"
                  className="mt-4 inline-block rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition"
                >
                  Report First Issue
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 3).map((c) => (
                  <ComplaintCard key={c.id} complaint={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}