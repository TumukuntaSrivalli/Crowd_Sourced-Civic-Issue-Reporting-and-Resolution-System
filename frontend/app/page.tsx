"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 dark:bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 dark:border-sky-800/80 bg-sky-100/70 dark:bg-sky-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-sky-800 dark:text-sky-300 shadow-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-Driven Civic Issue Reporting & Resolution System
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]">
            Empowering Citizens.{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-500 dark:from-sky-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Transforming Cities.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Report civic hazards in seconds with instant AI classification, precision GPS geotagging, real-time officer dispatch, and enterprise Power BI municipal analytics.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {!user ? (
              <>
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Report an Issue
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-8 py-3.5 shadow-sm hover:-translate-y-0.5 transition duration-200"
                >
                  Citizen & Officer Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={user.role === "citizen" ? "/complaints/new" : "/dashboard"}
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {user.role === "citizen" ? "Report New Issue" : "Open Control Center"}
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-8 py-3.5 shadow-sm transition"
                >
                  Go to Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">98.4%</div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">AI Triage Accuracy</div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 24h</div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Avg Resolution SLA</div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">GPS Geo-Tagged</div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-500">Power BI</div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Real-Time Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-sky-600 dark:text-sky-400">Intelligent Architecture</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold">Next-Gen Civic Infrastructure</p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Designed for city councils, civic engineers, and active citizens working together.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 shadow-sm hover:border-sky-500/50 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Complaint Classification</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Advanced AI inspects titles, descriptions, and uploaded photos to automatically categorize issues, evaluate hazard severity, and flag duplicate submissions.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Precision Geo-Spatial Map</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Integrated OpenStreetMap & Leaflet geolocation pinpoints civic issues on interactive ward maps, enabling field officers to reach sites rapidly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 shadow-sm hover:border-amber-500/50 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Power BI Backend Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Real-time Power BI REST feeds, automated CSV exports, and pre-configured DAX measures deliver executive governance dashboards with zero manual work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Supported Civic Issue Categories</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">Fast-tracked reporting pipelines directly mapped to municipal departments.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Road Damage", icon: "🚧", desc: "Potholes & cracks" },
              { name: "Garbage", icon: "🗑️", desc: "Waste collection" },
              { name: "Water Leakage", icon: "💧", desc: "Pipelines & valves" },
              { name: "Streetlight", icon: "💡", desc: "Outages & wiring" },
              { name: "Drainage", icon: "🌊", desc: "Blockages & sewage" },
              { name: "Traffic Signals", icon: "🚦", desc: "Timing & faults" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 text-center shadow-xs hover:border-sky-500/40 hover:-translate-y-1 transition duration-200"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-sm">{cat.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white/70 dark:bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} CivicSense Platform. Engineered for smart cities & empowered communities.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition">Citizen Portal</Link>
            <Link href="/admin/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">Municipal Admin</Link>
            <Link href="/admin/analytics" className="hover:text-slate-900 dark:hover:text-white transition">Power BI Feed</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}