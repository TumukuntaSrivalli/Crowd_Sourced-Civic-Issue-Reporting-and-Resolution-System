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

const aiResponse = await fetch("/api/ai/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title,
    description,
    imageUrl: uploadedUrl,
  }),
});

const aiData = await aiResponse.json();

await createComplaint({
  title,
  description,
  category: category as any,
  severity: severity as any,
  status: "Pending",
  imageUrl: uploadedUrl,
  userId: user.uid,

  location: {
    latitude,
    longitude,
  },

  // AI Analysis Data
  aiCategory: aiData.category,
  aiSeverity: aiData.severity,
  aiConfidence: aiData.confidence,
  aiSummary: aiData.summary,
  isDuplicate: aiData.isDuplicate,
  department: aiData.department,
  recommendedOfficer: aiData.recommendedOfficer,
  priorityScore: aiData.priorityScore,
});

alert("Complaint submitted successfully!");
router.push("/complaints");

  } catch (error) {
    console.error("Error submitting complaint:", error);
    alert("Failed to submit complaint. Please try again.");
  } 
};
return (
  <form
    onSubmit={handleSubmit}
    className="
    space-y-6
    rounded-2xl
    border
    border-zinc-800
    bg-zinc-900/60
    backdrop-blur-xl
    p-8
    shadow-2xl
    "
  >


    <h2
      className="
      text-3xl
      font-extrabold
      bg-linear-to-r
      from-blue-400
      via-cyan-400
      to-white
      bg-clip-text
      text-transparent
      "
    >
      {isEdit ? "Edit Complaint" : "Submit Complaint"}
    </h2>





    <input
      type="text"
      placeholder="Complaint Title"
      className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-black
      px-4
      py-3
      text-white
      placeholder:text-zinc-500
      outline-none
      focus:border-cyan-500
      transition
      "
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
      className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-black
      px-4
      py-3
      text-zinc-300
      file:mr-4
      file:rounded-lg
      file:border-0
      file:bg-cyan-500
      file:px-4
      file:py-2
      file:text-black
      file:font-semibold
      "
    />






    <textarea
      placeholder="Describe the issue..."
      className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-black
      px-4
      py-3
      text-white
      placeholder:text-zinc-500
      outline-none
      focus:border-cyan-500
      transition
      "
      rows={5}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />







    <select
      className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-black
      px-4
      py-3
      text-white
      outline-none
      focus:border-cyan-500
      "
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
      className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-black
      px-4
      py-3
      text-white
      outline-none
      focus:border-cyan-500
      "
      value={severity}
      onChange={(e) => setSeverity(e.target.value)}
    >
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>







    <div
      className="
      rounded-xl
      border
      border-zinc-800
      bg-black
      p-4
      "
    >

      <LocationPicker
        onLocationSelect={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />

    </div>







    <button
      type="submit"
      disabled={uploading}
      className="
      w-full
      rounded-xl
      bg-linear-to-r
      from-blue-600
      to-cyan-500
      py-3
      font-semibold
      text-white
      shadow-lg
      hover:scale-105
      transition
      disabled:opacity-50
      "
    >
      {uploading
        ? "Uploading..."
        : isEdit
        ? "Update Complaint"
        : "Submit Complaint"}
    </button>



  </form>
);
}