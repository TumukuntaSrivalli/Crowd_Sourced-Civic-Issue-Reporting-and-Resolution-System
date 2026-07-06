"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplaint } from "@/services/complaintService";
import { useAuth } from "@/context/AuthContext";
import LocationPicker from "./LocationPicker";
import { validateComplaint } from "@/utils/complaintValidation";

export default function ComplaintForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [severity, setSeverity] = useState("Low");

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateComplaint({
        title,
        description,
        category: category as any,
        severity: severity as any,
        latitude,
        longitude,
        });

        if (!validation.valid) {
        alert(validation.errors.join("\n"));
        return;
        }
        
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      await createComplaint({
        title,
        description,
        category: category as any,
        severity: severity as any,
        status: "Pending",
        imageUrl: "",
        latitude,
        longitude,
        address: "",
        userId: user.uid,
      });

      alert("Complaint submitted successfully!");

      router.push("/complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-2xl font-bold">
        Submit Complaint
      </h2>

      <input
        type="text"
        placeholder="Complaint Title"
        className="w-full rounded border p-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Describe the issue..."
        className="w-full rounded border p-3"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full rounded border p-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Pothole</option>
        <option>Garbage</option>
        <option>Streetlight</option>
        <option>Water Leakage</option>
        <option>Drainage</option>
        <option>Road Damage</option>
        <option>Traffic Signal</option>
        <option>Other</option>
      </select>

      <select
        className="w-full rounded border p-3"
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <LocationPicker
        onLocationSelect={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />

      <button
        type="submit"
        className="w-full rounded bg-blue-600 p-3 text-white"
      >
        Submit Complaint
      </button>
    </form>
  );
}