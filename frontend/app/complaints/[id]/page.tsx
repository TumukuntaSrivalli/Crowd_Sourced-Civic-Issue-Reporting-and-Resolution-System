"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getComplaintById } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";

export default function ComplaintDetailsPage() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState<
    (Complaint & { id: string }) | null
  >(null);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Complaint Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Complaint Details
      </h1>

      <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <p><strong>Title:</strong> {complaint.title}</p>

        <p><strong>Description:</strong> {complaint.description}</p>

        <p><strong>Category:</strong> {complaint.category}</p>

        <p><strong>Severity:</strong> {complaint.severity}</p>

        <p><strong>Status:</strong> {complaint.status}</p>

        <p><strong>Latitude:</strong> {complaint.latitude}</p>

        <p><strong>Longitude:</strong> {complaint.longitude}</p>

        <p><strong>Address:</strong> {complaint.address}</p>

        <p>
          <strong>Created At:</strong>{" "}
          {complaint.createdAt
            ? new Date(
                (complaint.createdAt as any).seconds * 1000
              ).toLocaleString()
            : "N/A"}
        </p>
      </div>
    </main>
  );
}