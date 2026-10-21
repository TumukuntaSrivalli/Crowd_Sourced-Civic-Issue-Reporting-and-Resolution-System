"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOfficerComplaints, updateComplaint } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { useAuth } from "@/context/AuthContext";
import { canAccessOfficerDashboard } from "@/utils/roleGuard";
import { getOfficerNotifications } from "@/services/notificationService";
import ComplaintStatusBadge from "@/components/complaint/ComplaintStatusBadge";

export default function OfficerDashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<(Complaint & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !canAccessOfficerDashboard(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const [notifs, assigned] = await Promise.all([
          getOfficerNotifications(user.uid),
          getOfficerComplaints(user.uid),
        ]);
        setNotifications(notifs || []);
        setComplaints((assigned as (Complaint & { id: string })[]) || []);
      } catch (error) {
        console.error("Officer dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleStatusUpdate = async (
    id: string,
    status: "Assigned" | "In Progress" | "Resolved"
  ) => {
    try {
      await updateComplaint(id, { status });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      alert(`Status updated to "${status}"`);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="font-medium text-sm">Loading Officer Field Portal...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            Field Officer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Officer Tasks & Dispatch
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Assigned complaints, real-time action logs, and field resolution workflow.
          </p>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2 mb-3">
            <span>🔔</span> Active Field Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No new alerts or urgent assignments.
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div
                  key={n.id || i}
                  className="rounded-xl border border-sky-200 dark:border-sky-800 bg-white/70 dark:bg-slate-900/70 p-3 text-xs text-slate-700 dark:text-slate-200"
                >
                  {n.message || "New complaint assigned to your department."}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaints Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Assigned Tasks ({complaints.length})
            </h2>
          </div>

          {complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center text-slate-500">
              No active complaints currently assigned to you.
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {c.category}
                        </span>
                        <span className="rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                          {c.severity} Severity
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {c.title}
                      </h3>
                    </div>
                    <ComplaintStatusBadge status={c.status} />
                  </div>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.description}
                  </p>

                  {c.location && (
                    <div className="mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                      📍 Lat: {c.location.latitude}, Lng: {c.location.longitude}
                    </div>
                  )}

                  {/* Field Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
                      Update Resolution Stage:
                    </span>

                    <button
                      onClick={() => handleStatusUpdate(c.id, "In Progress")}
                      className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                    >
                      Mark In Progress
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(c.id, "Resolved")}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                    >
                      ✓ Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}