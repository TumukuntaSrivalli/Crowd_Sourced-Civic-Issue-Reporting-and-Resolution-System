"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplaint } from "@/services/complaintService";
import { useAuth } from "@/context/AuthContext";
import LocationPicker from "./LocationPicker";
import { validateComplaint } from "@/utils/complaintValidation";
import { uploadImage } from "@/services/cloudinaryService";

interface ComplaintFormProps {
  complaint?: any;
  isEdit?: boolean;
}

export default function ComplaintForm({
  complaint,
  isEdit = false,
}: ComplaintFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState(
    complaint?.title ?? ""
  );
  const [description, setDescription] = useState(
    complaint?.description ?? ""
  );
  const [category, setCategory] = useState(
    complaint?.category ?? "Pothole"
  );
  const [severity, setSeverity] = useState(
    complaint?.severity ?? "Low"
  );

  const [latitude, setLatitude] = useState(
    complaint?.location?.latitude ?? 0
  );
  const [longitude, setLongitude] = useState(
    complaint?.location?.longitude ?? 0
  );

const [image, setImage] = useState<File | null>(null);

const [uploading, setUploading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    let uploadedUrl = "";

    // ✅ upload image first
    if (image) {
      setUploading(true);
      const res = await uploadImage(image);
      uploadedUrl = res.url;
      setUploading(false);
    }

    if (!user) {
      alert("Please login first.");
      return;
    }

    await createComplaint({
      title,
      description,
      category: category as any,
      severity: severity as any,
      status: "Pending",
      imageUrl: uploadedUrl, // ✅ IMPORTANT FIX
      userId: user.uid,
      location: {
        latitude,
        longitude,
      },
    });

    alert("Complaint submitted successfully!");
    router.push("/complaints");
  } catch (err) {
    console.error(err);
    alert("Failed to submit complaint.");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-2xl font-bold">
        {isEdit ? "Edit Complaint" : "Submit Complaint"}
      </h2>

      <input
        type="text"
        placeholder="Complaint Title"
        className="w-full rounded border p-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
                if (e.target.files) {
                setImage(e.target.files[0]);
                }
            }}
            className="w-full"
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
        {isEdit ? "Update Complaint" : "Submit Complaint"}
      </button>
    </form>
  );
}