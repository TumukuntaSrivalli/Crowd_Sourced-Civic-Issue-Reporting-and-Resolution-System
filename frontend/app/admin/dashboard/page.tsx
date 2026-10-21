"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNotification } from "@/services/notificationService";
import { getAllComplaints, assignComplaintToOfficer } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { officers } from "@/constants/officers";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roleGuard";
import ComplaintCard from "@/components/complaint/ComplaintCard";

const ComplaintMap = dynamic(() => import("@/components/map/ComplaintMap"), {
  ssr: false,
});

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<(Complaint & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data as (Complaint & { id: string })[]);
      } catch (error) {
        console.error("Error loading admin complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesSeverity = severityFilter === "All" || c.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity;
  });

  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)
  );

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress" || c.status === "Assigned").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const highSeverity = complaints.filter((c) => c.severity === "High").length;
  const duplicates = complaints.filter((c) => c.isDuplicate).length;

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="font-medium text-sm">Loading Municipal Admin Control...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-800/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
              Municipal Admin Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Command & Dispatch Center
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Review incoming citizen grievances, manage officer dispatch, and observe live ward status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/analytics"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs px-4 py-2.5 shadow-sm transition flex items-center gap-1.5"
            >
              <span>📊</span> Power BI Analytics Hub
            </Link>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</span>
            <div className="text-2xl font-bold mt-1">{total}</div>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase">Pending</span>
            <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{pending}</div>
          </div>
          <div className="rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 uppercase">In Progress</span>
            <div className="text-2xl font-bold mt-1 text-sky-600 dark:text-sky-400">{inProgress}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Resolved</span>
            <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{resolved}</div>
          </div>
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase">High Severity</span>
            <div className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">{highSeverity}</div>
          </div>
          <div className="rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase">Duplicates</span>
            <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{duplicates}</div>
          </div>
        </div>

        {/* Live Complaint Map Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🗺️</span> Live Geotagged Complaint Map
            </h2>
            <span className="text-xs text-slate-500">Interactive OpenStreetMap Layer</span>
          </div>
          <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <ComplaintMap complaints={complaints} />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
            Filter & Search Registry
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="All">All Categories</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Garbage">Garbage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Drainage">Drainage</option>
              <option value="Traffic Signal">Traffic Signal</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
          </div>
        </div>

        {/* Complaints Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong>{sortedComplaints.length}</strong> of {complaints.length} complaints (Sorted by AI Priority Score)
            </span>
          </div>

          {sortedComplaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center text-slate-500">
              No complaints match the filter criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} isAdminView={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}