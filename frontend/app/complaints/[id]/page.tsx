"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getComplaintById, deleteComplaint } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import ComplaintStatusBadge from "@/components/complaint/ComplaintStatusBadge";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [complaint, setComplaint] = useState<(Complaint & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id || typeof id !== "string") {
        setLoading(false);
        return;
      }

      try {
        const data = await getComplaintById(id);
        if (data) {
          setComplaint(data as Complaint & { id: string });
        }
      } catch (error) {
        console.error("Error fetching complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this complaint?");
    if (!confirmDelete) return;

    try {
      await deleteComplaint(id as string);
      alert("Complaint deleted successfully");
      router.push("/complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to delete complaint");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="font-medium text-sm">Loading complaint details...</p>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="max-w-md text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Complaint Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The requested complaint ID could not be located or has been removed.
          </p>
          <Link
            href="/complaints"
            className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition"
          >
            Back to Complaints
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/complaints"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Complaints
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/complaints/${id}/edit`}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {complaint.category}
                </span>
                <span
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    complaint.severity === "High"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
                      : complaint.severity === "Medium"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                  }`}
                >
                  {complaint.severity} Severity
                </span>
                {complaint.priorityScore && (
                  <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    ⭐ Priority {complaint.priorityScore}/100
                  </span>
                )}
              </div>
              <ComplaintStatusBadge status={complaint.status} />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {complaint.title}
            </h1>

            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Photo attachment */}
          {complaint.imageUrl && (
            <div className="border-b border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/40">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Photo Evidence
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 max-h-96 w-full">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full object-cover max-h-96"
                />
              </div>
            </div>
          )}

          {/* AI Analysis Card */}
          {(complaint.aiCategory || complaint.aiSummary) && (
            <div className="border-b border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-sky-50/50 dark:bg-sky-950/20">
              <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold mb-3">
                <span className="text-xl">🤖</span>
                <span>AI Automated Triage Insights</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3">
                <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-white/70 dark:bg-slate-900/60 p-3">
                  <span className="text-slate-500 dark:text-slate-400">Classified Category</span>
                  <p className="font-bold text-sm text-sky-700 dark:text-sky-300 mt-1">
                    {complaint.aiCategory || complaint.category}
                  </p>
                </div>
                <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-white/70 dark:bg-slate-900/60 p-3">
                  <span className="text-slate-500 dark:text-slate-400">Predicted Severity</span>
                  <p className="font-bold text-sm text-rose-600 dark:text-rose-400 mt-1">
                    {complaint.aiSeverity || complaint.severity}
                  </p>
                </div>
                <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-white/70 dark:bg-slate-900/60 p-3">
                  <span className="text-slate-500 dark:text-slate-400">Confidence Score</span>
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    {complaint.aiConfidence ? `${(complaint.aiConfidence * 100).toFixed(0)}%` : "Verified"}
                  </p>
                </div>
              </div>

              {complaint.aiSummary && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Summary:</strong> {complaint.aiSummary}
                </p>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                Location Coordinates
              </span>
              <p className="mt-1 font-mono font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>📍</span>
                {complaint.location
                  ? `${complaint.location.latitude}, ${complaint.location.longitude}`
                  : "Not Specified"}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                Assigned Officer
              </span>
              <p className="mt-1 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>👮</span>
                {complaint.assignedTo || "Pending Officer Assignment"}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                Submission Time
              </span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                {complaint.createdAt
                  ? new Date(
                      (complaint.createdAt as any).seconds
                        ? (complaint.createdAt as any).seconds * 1000
                        : complaint.createdAt
                    ).toLocaleString()
                  : "Just now"}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                Complaint Reference ID
              </span>
              <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">
                {complaint.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}