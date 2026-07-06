"use client";

import { useEffect, useState } from "react";
import { getComplaintStats } from "@/services/analyticsService";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getComplaintStats();
      setStats(data);
    };

    load();
  }, []);

  if (!stats) {
    return (
      <div className="p-8">
        <h1>Loading analytics...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total" value={stats.total} />
        <Card title="Pending" value={stats.pending} />
        <Card title="In Progress" value={stats.inProgress} />
        <Card title="Resolved" value={stats.resolved} />
      </div>

      {/* Severity */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Severity Distribution</h2>
        <div className="flex gap-4 mt-2">
          <Badge label="Low" value={stats.severityCount.Low} />
          <Badge label="Medium" value={stats.severityCount.Medium} />
          <Badge label="High" value={stats.severityCount.High} />
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Category Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {Object.entries(stats.categoryCount).map(([key, value]) => (
            <div
              key={key}
              className="p-3 border rounded bg-white shadow"
            >
              <p className="font-medium">{key}</p>
              <p className="text-gray-600">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* UI Components */
function Card({ title, value }: any) {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Badge({ label, value }: any) {
  return (
    <div className="p-3 border rounded bg-gray-50">
      <p className="font-medium">{label}</p>
      <p>{value}</p>
    </div>
  );
}