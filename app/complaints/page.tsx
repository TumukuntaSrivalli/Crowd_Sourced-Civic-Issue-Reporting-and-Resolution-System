"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getUserComplaints } from "@/services/complaintService";

import ComplaintList from "@/components/complaint/ComplaintList";
import { Complaint } from "@/types/complaint";

export default function ComplaintsPage() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<
    (Complaint & { id: string })[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserComplaints(user.uid);

        setComplaints(data as (Complaint & { id: string })[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Loading complaints...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        My Complaints
      </h1>

      <ComplaintList complaints={complaints} />
    </main>
  );
}