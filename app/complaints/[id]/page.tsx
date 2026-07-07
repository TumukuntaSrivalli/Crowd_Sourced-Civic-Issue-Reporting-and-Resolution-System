"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getComplaintById, deleteComplaint } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import ComplaintStatusBadge from "@/components/complaint/ComplaintStatusBadge";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

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

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id as string);
      alert("Complaint deleted successfully");
      router.push("/complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to delete complaint");
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Complaint Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Complaint Details</h1>

      <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <p><strong>Title:</strong> {complaint.title}</p>

        <p><strong>Description:</strong> {complaint.description}</p>

        <p><strong>Category:</strong> {complaint.category}</p>

        <p><strong>Severity:</strong> {complaint.severity}</p>

        <p>
        <strong>Status:</strong>{" "}
        <ComplaintStatusBadge status={complaint.status} />
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {complaint.location.latitude}, {complaint.location.longitude}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {complaint.createdAt
            ? new Date(
                (complaint.createdAt as any).seconds * 1000
              ).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/complaints/${id}/edit`}
          className="inline-block rounded bg-yellow-500 px-4 py-2 text-white"
        >
          Edit Complaint
        </Link>

        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete Complaint
        </button>
      </div>
    </main>
  );
}