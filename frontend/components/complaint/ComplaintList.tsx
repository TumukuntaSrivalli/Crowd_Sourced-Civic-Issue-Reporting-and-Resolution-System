import Link from "next/link";
import ComplaintCard from "./ComplaintCard";
import { Complaint } from "@/types/complaint";

interface ComplaintListProps {
  complaints: (Complaint & { id: string })[];
  isAdminView?: boolean;
}

export default function ComplaintList({
  complaints,
  isAdminView = false,
}: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-12 text-center backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 mb-4">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          No Complaints Found
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          No complaints match your current view. Report a public issue to notify municipal teams.
        </p>
        <div className="mt-6">
          <Link
            href="/complaints/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 transition"
          >
            + Report New Issue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
          isAdminView={isAdminView}
        />
      ))}
    </div>
  );
}