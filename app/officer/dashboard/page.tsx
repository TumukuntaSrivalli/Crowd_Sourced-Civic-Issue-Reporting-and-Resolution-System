"use client";

import { useEffect, useState } from "react";

import { getOfficerComplaints, updateComplaint } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";

import { useAuth } from "@/context/AuthContext";
import { canAccessOfficerDashboard } from "@/utils/roleGuard";
import { useRouter } from "next/navigation";

import { officers } from "@/constants/officers";
import { assignComplaintToOfficer } from "@/services/complaintService";

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState<
    (Complaint & { id: string })[]
  >([]);

  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const router = useRouter();

  console.log("Logged in user:", user);
  console.log("User role:", user?.role); 

  
  useEffect(() => {
    if (user && !canAccessOfficerDashboard(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router])

useEffect(() => {
  const fetchComplaints = async () => {
    try {
      if (!user) return; // ✅ important safety check

      const data = await getOfficerComplaints(user.uid);

      setComplaints(data as (Complaint & { id: string })[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchComplaints();
}, [user]);

  const handleStatusUpdate = async (
    id: string,
    status: "Assigned" | "In Progress" | "Resolved"
  ) => {
    try {
      await updateComplaint(id, { status });

      // refresh UI
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status } : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">Loading complaints...</h1>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Officer Dashboard
      </h1>

      <div className="space-y-6">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="border rounded-lg p-4 bg-white shadow"
          >
            <h2 className="text-xl font-semibold">
              {complaint.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {complaint.description}
            </p>

            <p className="mt-2">
              <strong>Status:</strong> {complaint.status}
            </p>

            <select
                onChange={(e) =>
                    assignComplaintToOfficer(complaint.id!, e.target.value)
                }
                className="border p-2 rounded mt-3"
                >
                <option>Select Officer</option>
                {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                    {o.name}
                    </option>
                ))}
                </select>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  handleStatusUpdate(complaint.id!, "Assigned")
                }
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Assign
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(complaint.id!, "In Progress")
                }
                className="bg-purple-500 text-white px-3 py-1 rounded"
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(complaint.id!, "Resolved")
                }
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}