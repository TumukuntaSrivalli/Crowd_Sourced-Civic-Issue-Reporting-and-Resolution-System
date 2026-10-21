"use client";

import Link from "next/link";
import { Complaint } from "@/types/complaint";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { officers } from "@/constants/officers";
import { assignComplaintToOfficer } from "@/services/complaintService";

interface ComplaintCardProps {
  complaint: Complaint & {
    id: string;
  };
  isAdminView?: boolean;
}

export default function ComplaintCard({
  complaint,
  isAdminView = false,
}: ComplaintCardProps) {
  const getSeverityBadge = (sev?: string) => {
    switch (sev) {
      case "High":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/50";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50";
      default:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 p-6 shadow-xs hover:shadow-md hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-200 backdrop-blur-sm">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {complaint.category || "General"}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getSeverityBadge(
                complaint.severity
              )}`}
            >
              {complaint.severity || "Low"} Severity
            </span>

            {complaint.isDuplicate && (
              <span className="rounded-md border border-red-300 dark:border-red-900/60 bg-red-100 dark:bg-red-950/80 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                ⚠️ Duplicate Flagged
              </span>
            )}

            {complaint.priorityScore && (
              <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                ⭐ {complaint.priorityScore}/100 Priority
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {complaint.title}
          </h3>
        </div>

        <div>
          <ComplaintStatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {complaint.description}
      </p>

      {/* Optional Thumbnail */}
      {complaint.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 max-h-48 w-full bg-slate-100 dark:bg-slate-950">
          <img
            src={complaint.imageUrl}
            alt={complaint.title}
            className="h-48 w-full object-cover hover:scale-102 transition duration-300"
          />
        </div>
      )}

      {/* AI Intelligence Strip */}
      {(complaint.aiCategory || complaint.aiSummary) && (
        <div className="mt-4 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/30 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-sky-800 dark:text-sky-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Triage:
            <span className="font-normal text-slate-700 dark:text-slate-300">
              {complaint.aiCategory || complaint.category} (
              {complaint.aiConfidence ? `${(complaint.aiConfidence * 100).toFixed(0)}% confidence` : "Verified"}
              )
            </span>
          </div>
          {complaint.aiSummary && (
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {complaint.aiSummary}
            </p>
          )}
        </div>
      )}

      {/* Admin Assign Dropdown */}
      {isAdminView && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Assign Officer:
          </label>
          <select
            defaultValue={complaint.assignedTo || ""}
            onChange={(e) => assignComplaintToOfficer(complaint.id, e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-sky-500"
          >
            <option value="">Unassigned</option>
            {officers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Footer Info & Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          {complaint.location && (
            <span className="flex items-center gap-1">
              📍 {Number(complaint.location.latitude).toFixed(4)}, {Number(complaint.location.longitude).toFixed(4)}
            </span>
          )}
          {complaint.assignedTo && (
            <span>👤 Assigned: {complaint.assignedTo}</span>
          )}
        </div>

        <Link
          href={`/complaints/${complaint.id}`}
          className="rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 px-3.5 py-1.5 font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 transition flex items-center gap-1.5"
        >
          View Details
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}