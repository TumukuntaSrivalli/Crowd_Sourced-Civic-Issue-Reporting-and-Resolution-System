"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getComplaintById } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import ComplaintForm from "@/components/complaint/ComplaintForm";

export default function EditComplaintPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [complaint, setComplaint] = useState<(Complaint & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
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

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="font-medium text-sm">Loading complaint...</p>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="max-w-md text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h2 className="text-xl font-bold">Complaint Not Found</h2>
          <Link
            href="/complaints"
            className="mt-4 inline-block rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Back to Complaints
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/complaints/${id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Details
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Edit Complaint
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Update details or attach updated photo evidence for this issue.
          </p>
        </div>

        <ComplaintForm complaint={complaint} isEdit={true} />
      </div>
    </main>
  );
}