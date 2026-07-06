"use client";

import { useEffect, useState } from "react";

import {
  getAllComplaints,
  assignComplaintToOfficer,
} from "@/services/complaintService";
import { Complaint } from "@/types/complaint";

import { officers } from "@/constants/officers";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleGuard";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<
    (Complaint & { id: string })[]
  >([]);

  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data as (Complaint & { id: string })[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">
          Checking access...
        </h1>
      </main>
    );
  }

  const handleAssign = async (
    complaintId: string,
    officerId: string
  ) => {
    try {
      await assignComplaintToOfficer(complaintId, officerId);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? {
                ...c,
                assignedTo: officerId,
                status: "Assigned",
              }
            : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">
          Loading Admin Dashboard...
        </h1>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
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

            <p className="mt-2">
              <strong>Assigned To:</strong>{" "}
              {complaint.assignedTo || "Not Assigned"}
            </p>

            <div className="mt-4 flex gap-2 items-center">
              <select
                className="border p-2 rounded"
                onChange={(e) =>
                  handleAssign(
                    complaint.id!,
                    e.target.value
                  )
                }
              >
                <option value="">Assign Officer</option>

                {officers.map((officer) => (
                  <option
                    key={officer.id}
                    value={officer.id}
                  >
                    {officer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}