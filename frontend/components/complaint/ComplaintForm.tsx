"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplaint, updateComplaint } from "@/services/complaintService";
import { useAuth } from "@/context/AuthContext";
import LocationPicker from "./LocationPicker";
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

  const [title, setTitle] = useState(complaint?.title ?? "");
  const [description, setDescription] = useState(complaint?.description ?? "");
  const [category, setCategory] = useState(complaint?.category ?? "Pothole");
  const [severity, setSeverity] = useState(complaint?.severity ?? "Low");

  const [latitude, setLatitude] = useState(complaint?.location?.latitude ?? 17.3850);
  const [longitude, setLongitude] = useState(complaint?.location?.longitude ?? 78.4867);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(complaint?.imageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to submit an issue.");
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      let uploadedUrl = complaint?.imageUrl || "";

      // 1. Upload photo to Cloudinary if selected
      if (image) {
        setSubmitStep("Uploading image evidence...");
        const res = await uploadImage(image);
        uploadedUrl = res.url;
      }

      // 2. AI Triage
      setSubmitStep("AI Analyzing issue & evaluating priority score...");
      let aiData: any = {};
      try {
        const aiResponse = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            imageUrl: uploadedUrl,
          }),
        });
        if (aiResponse.ok) {
          aiData = await aiResponse.json();
        }
      } catch (aiErr) {
        console.warn("AI Triage fallback:", aiErr);
      }

      setSubmitStep("Saving complaint to municipal registry...");

      if (isEdit && complaint?.id) {
        await updateComplaint(complaint.id, {
          title,
          description,
          category,
          severity,
          ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
        });
        alert("Complaint updated successfully!");
        router.push(`/complaints/${complaint.id}`);
      } else {
        const newDocId = await createComplaint({
          title,
          description,
          category: (aiData.category || category) as any,
          severity: (aiData.severity || severity) as any,
          status: "Pending",
          imageUrl: uploadedUrl,
          userId: user.uid,
          location: {
            latitude,
            longitude,
          },
          aiCategory: aiData.category || category,
          aiSeverity: aiData.severity || severity,
          aiConfidence: aiData.confidence || 0.9,
          aiSummary: aiData.summary || description.slice(0, 100),
          isDuplicate: Boolean(aiData.isDuplicate),
          department: aiData.department || "Public Works",
          recommendedOfficer: aiData.recommendedOfficer || "Field Officer",
          priorityScore: aiData.priorityScore || (severity === "High" ? 85 : severity === "Medium" ? 60 : 35),
        });

        // 3. Optional: Ping backend Power BI sync endpoint
        try {
          fetch("http://localhost:5000/api/v1/complaints/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: newDocId,
              title,
              description,
              category: aiData.category || category,
              severity: aiData.severity || severity,
              status: "Pending",
              department: aiData.department || "Public Works",
              location: { latitude, longitude, area: "Municipal Ward" },
              priorityScore: aiData.priorityScore || 70,
            }),
          }).catch(() => {});
        } catch (_) {}

        alert("Complaint submitted successfully! Municipal officers have been notified.");
        router.push("/complaints");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
      setSubmitStep("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm backdrop-blur-md"
    >
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Issue Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Hazardous deep pothole near Metro Station"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Detailed Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe the severity, when it occurred, landmarks, and potential risks..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition"
        />
      </div>

      {/* Category and Severity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Civic Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 transition"
          >
            <option value="Road Damage">🚧 Road Damage / Pothole</option>
            <option value="Garbage">🗑️ Garbage Accumulation</option>
            <option value="Water Leakage">💧 Water Leakage & Pipes</option>
            <option value="Streetlight">💡 Streetlight Malfunction</option>
            <option value="Drainage">🌊 Drainage & Sewage Overflow</option>
            <option value="Traffic Signal">🚦 Traffic Signal Fault</option>
            <option value="Other">📌 Other Civic Hazard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Citizen Severity Assessment
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 transition"
          >
            <option value="Low">🟢 Low - Minor inconvenience</option>
            <option value="Medium">🟡 Medium - Affects daily transit</option>
            <option value="High">🔴 High - Immediate safety hazard</option>
          </select>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Photo Evidence (Helps AI Triage & Verification)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 dark:file:bg-sky-950/60 file:text-sky-700 dark:file:text-sky-300 hover:file:bg-sky-100 transition cursor-pointer"
          />

          {imagePreview && (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Location Picker */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Select Exact GPS Location on Map
          </label>
          <span className="text-xs font-mono text-sky-600 dark:text-sky-400">
            {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
          <LocationPicker
            onLocationSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 py-3.5 px-6 font-semibold text-white shadow-md hover:shadow-sky-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{submitStep || "Processing..."}</span>
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "🚀 Submit Civic Issue"
          )}
        </button>
      </div>
    </form>
  );
}