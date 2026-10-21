"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getComplaintStats } from "@/services/analyticsService";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getComplaintStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    };

    load();
  }, []);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
  const powerBiFeedUrl = `${backendUrl}/api/v1/powerbi/complaints`;

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(powerBiFeedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!stats) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="font-medium text-sm">Aggregating civic analytics & Power BI feed...</p>
        </div>
      </main>
    );
  }

  const resolutionRate =
    stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : "0.0";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
              <span>📊</span> Power BI Municipal Analytics Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Executive Governance & SLA Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Real-time civic performance metrics, department response rates, and Power BI streaming data feeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              ← Admin Control
            </Link>

            <a
              href={`${backendUrl}/api/v1/powerbi/export/csv`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs px-4 py-2 shadow-sm transition flex items-center gap-1.5"
            >
              <span>📥</span> Export Power BI CSV
            </a>
          </div>
        </div>

        {/* Power BI Live Connector Banner */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/70 via-white to-sky-50/70 dark:from-amber-950/30 dark:via-slate-900/60 dark:to-sky-950/30 p-6 shadow-xs backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-300">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Power BI Backend Data Connector Active
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
                Connect your Microsoft Power BI Desktop or Power BI Service to this live endpoint for automated scheduled refresh or real-time streaming tiles.
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <code className="rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  {powerBiFeedUrl}
                </code>
                <button
                  onClick={copyFeedUrl}
                  className="rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy URL"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                Format: <strong>REST / OData / CSV</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Total Registered</span>
            <div className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">{stats.total}</div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">All wards combined</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 shadow-xs">
            <span className="text-xs uppercase font-semibold text-emerald-800 dark:text-emerald-400">Resolution Rate</span>
            <div className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{resolutionRate}%</div>
            <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{stats.resolved} of {stats.total} resolved</div>
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-6 shadow-xs">
            <span className="text-xs uppercase font-semibold text-amber-800 dark:text-amber-400">Pending Triage</span>
            <div className="mt-2 text-4xl font-extrabold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="mt-2 text-xs text-amber-700 dark:text-amber-400">Awaiting officer assignment</div>
          </div>

          <div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 p-6 shadow-xs">
            <span className="text-xs uppercase font-semibold text-sky-800 dark:text-sky-400">In Active Transit</span>
            <div className="mt-2 text-4xl font-extrabold text-sky-600 dark:text-sky-400">{stats.inProgress + (stats.assigned || 0)}</div>
            <div className="mt-2 text-xs text-sky-700 dark:text-sky-400">Field work dispatched</div>
          </div>
        </div>

        {/* Severity & Category Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Severity Distribution */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Severity Priority Distribution</h2>
              <span className="text-xs font-semibold text-slate-500">Hazard Weight</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">High Severity (Immediate Hazard)</span>
                  <span>{stats.severityCount?.High || 0} issues</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? ((stats.severityCount?.High || 0) / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-600 dark:text-amber-400">Medium Severity (Transit Obstruction)</span>
                  <span>{stats.severityCount?.Medium || 0} issues</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? ((stats.severityCount?.Medium || 0) / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Low Severity (Minor Notice)</span>
                  <span>{stats.severityCount?.Low || 0} issues</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? ((stats.severityCount?.Low || 0) / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Category Distribution
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(stats.categoryCount || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{key}</p>
                  <p className="mt-1 text-2xl font-extrabold text-sky-600 dark:text-sky-400">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}