"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getComplaintById,
  updateComplaint,
} from "@/services/complaintService";

import { Complaint } from "@/types/complaint";

export default function EditComplaintPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await getComplaintById(id);

        if (data) {
          setComplaint(data);
          setTitle(data.title);
          setDescription(data.description);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    }

  }, [id]);


  const handleUpdate = async () => {
    try {
      await updateComplaint(id, {
        title,
        description,
      });

      router.push(`/complaints/${id}`);

    } catch (error) {
      console.error(error);
    }
  };


  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">
          Loading complaint...
        </h1>
      </main>
    );
  }


  if (!complaint) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">
          Complaint not found
        </h1>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-xl mx-auto bg-slate-900 rounded-xl p-6 border border-slate-800">

        <h1 className="text-3xl font-bold mb-6">
          Edit Complaint
        </h1>


        <div className="space-y-4">

          <div>
            <label className="block mb-2">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            />
          </div>


          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
              rows={5}
            />
          </div>


          <button
            onClick={handleUpdate}
            className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white"
          >
            Update Complaint
          </button>

        </div>

      </div>

    </main>
  );
}