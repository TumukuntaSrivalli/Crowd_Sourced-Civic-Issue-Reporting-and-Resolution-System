import Link from "next/link";
import ComplaintForm from "@/components/complaint/ComplaintForm";

export default function NewComplaintPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Report Civic Issue
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Provide details, photo evidence, and location. Our automated AI engine will evaluate priority and alert municipal officers.
          </p>
        </div>

        <ComplaintForm />
      </div>
    </main>
  );
}