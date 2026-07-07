"use client";

import { createNotification } 
from "@/services/notificationService";

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
import dynamic from "next/dynamic";

const ComplaintMap = dynamic(
  () => import("@/components/map/ComplaintMap"),
  {
    ssr: false,
  }
);

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<
    (Complaint & { id: string })[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  
  const totalComplaints = complaints.length;

    const filteredComplaints = complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      const matchesSeverity =
        severityFilter === "All" ||
        complaint.severity === severityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesSeverity
      );
    });

    const sortedComplaints = [...filteredComplaints].sort(
      (a, b) =>
        (b.priorityScore || 0) -
        (a.priorityScore || 0)
    );
  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const assignedComplaints = complaints.filter(
    (c) => c.status === "Assigned"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const highSeverityComplaints = complaints.filter(
    (c) => c.severity === "High"
  ).length;

  const duplicateComplaints = complaints.filter(
    (c) => c.isDuplicate
  ).length;

  const { user } = useAuth();
  const router = useRouter();

  console.log("Current User:", user);
  console.log("Current Role:", user?.role);
  console.log("Is Admin:", isAdmin(user?.role));

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

  const handleAssign = async (
    complaintId: string,
    officerId: string
  ) => {
    console.log("Complaint ID:", complaintId);
    console.log("Officer ID:", officerId);

    try {
      await assignComplaintToOfficer(complaintId, officerId);
      await createNotification(
        officerId,
        complaintId
        );
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
      console.error("Assignment Error:", error);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-linear-to-b from-zinc-950 via-black to-zinc-900 flex items-center justify-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-10 py-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white">
            Checking access...
          </h1>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-zinc-950 via-black to-zinc-900 flex items-center justify-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-10 py-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white">
            Loading Admin Dashboard...
          </h1>
        </div>
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-linear-to-b from-zinc-950 via-black to-zinc-900 px-8 py-12 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
<div className="mb-8">

<h2 className="
text-2xl
font-bold
mb-4
">

Complaint Map

</h2>


<ComplaintMap

complaints={complaints}

/>


</div>
  <h2 className="mb-6 text-xl font-semibold text-white">
    Search & Filters
  </h2>

  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <input
        type="text"
        placeholder="Search complaints..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-4
        py-3
        text-white
        placeholder:text-zinc-500
        outline-none
        focus:border-blue-500
        "
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-4
        py-3
        text-white
        outline-none
        focus:border-blue-500
        "
      >
        <option>All</option>
        <option>Pending</option>
        <option>Assigned</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-4
        py-3
        text-white
        outline-none
        focus:border-blue-500
        "
      >
        <option>All</option>
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
        value={severityFilter}
        onChange={(e) => setSeverityFilter(e.target.value)}
        className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-4
        py-3
        text-white
        outline-none
        focus:border-blue-500
        "
      >
        <option>All</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

    </div>

  </div>
   
  </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <p className="text-sm text-zinc-400">Total Complaints</p>
            <h2 className="mt-3 text-4xl font-bold text-white">
              {totalComplaints}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-700 bg-yellow-500/10 p-6 shadow-lg">
            <p className="text-sm text-yellow-300">Pending</p>
            <h2 className="mt-3 text-4xl font-bold text-yellow-400">
              {pendingComplaints}
            </h2>
          </div>

          <div className="rounded-2xl border border-blue-700 bg-blue-500/10 p-6 shadow-lg">
            <p className="text-sm text-blue-300">Assigned</p>
            <h2 className="mt-3 text-4xl font-bold text-blue-400">
              {assignedComplaints}
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-700 bg-purple-500/10 p-6 shadow-lg">
            <p className="text-sm text-purple-300">In Progress</p>
            <h2 className="mt-3 text-4xl font-bold text-purple-400">
              {inProgressComplaints}
            </h2>
          </div>

          <div className="rounded-2xl border border-green-700 bg-green-500/10 p-6 shadow-lg">
            <p className="text-sm text-green-300">Resolved</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">
              {resolvedComplaints}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-700 bg-red-500/10 p-6 shadow-lg">
            <p className="text-sm text-red-300">High Severity</p>
            <h2 className="mt-3 text-4xl font-bold text-red-400">
              {highSeverityComplaints}
            </h2>
          </div>

        </div>

          <p className="mt-2 text-zinc-400">
            Manage complaints and assign them to officers.
          </p>
        </div>
        <p className="mb-6 text-sm text-zinc-400">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </p>
        <div className="space-y-8">

          {sortedComplaints.map((complaint) => (

<div
  key={complaint.id}
  className="
  rounded-2xl
  border
  border-zinc-800
  bg-zinc-900
  p-6
  shadow-lg
  transition
  hover:border-blue-500
  "
>
    <h2
  className="
  text-3xl
  font-bold
  text-white
  "
  >
  {complaint.title}
  </h2>
  {complaint.aiSummary && (
  <div
    className="
    mt-4
    rounded-xl
    border
    border-blue-900
    bg-blue-950/40
    p-4
    "
  >

    <h3 className="font-semibold text-blue-400">
      🤖 AI Summary
    </h3>

    <p className="mt-2 text-zinc-300">
      {complaint.aiSummary}
    </p>

  </div>
)}
<div
className="
mt-6
grid
grid-cols-1
md:grid-cols-3
gap-4
"
>


<div
className="
rounded-xl
bg-zinc-800
p-4
"
>
<p className="text-zinc-400">
AI Category
</p>

<p className="text-blue-400 font-semibold">
{complaint.aiCategory || "N/A"}
</p>

</div>


<div
className="
rounded-xl
bg-zinc-800
p-4
"
>
<p className="text-zinc-400">
AI Severity
</p>

<p className="text-red-400 font-semibold">
{complaint.aiSeverity || "N/A"}
</p>

</div>



<div
className="
rounded-xl
bg-zinc-800
p-4
"
>

<p className="text-zinc-400">
Confidence
</p>


<p className="text-green-400 font-semibold">

{
complaint.aiConfidence
?
`${(complaint.aiConfidence * 100).toFixed(0)}%`
:
"N/A"
}

</p>

</div>


</div>
<select
  className="border rounded-lg p-2 mt-3"
  onChange={(e) =>
    handleAssign(complaint.id!, e.target.value)
  }
>
  <option value="" className="text-black">
    Assign Officer
  </option>

  {officers.map((officer) => (
    <option
      key={officer.id}
      value={officer.id}
      className="text-black"
    >
      {officer.name}
    </option>
  ))}
</select>
<div className="mt-5">

<p className="text-zinc-400">
Priority Score
</p>


<span
className="
inline-block
mt-2
rounded-full
bg-orange-600
px-4
py-2
font-bold
"
>

⭐
{complaint.priorityScore || 0}/100

</span>

</div>

{complaint.isDuplicate && (

<div
className="
mt-5
rounded-xl
bg-red-900/40
border
border-red-600
p-4
text-red-300
"
>

⚠️
AI detected this complaint as a possible duplicate.

</div>

)}
  {/* Image */}
  <h2 className="text-xl font-semibold text-white">Image</h2>
  {complaint.imageUrl && (
    <img
      src={complaint.imageUrl}
      alt="Complaint"
      className="mb-5 h-60 w-full rounded-xl object-cover"
    />
  )}

  {/* Title */}
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-white">
      {complaint.title}
    </h2>

    <span
      className="
      rounded-full
      bg-blue-600/20
      px-4
      py-1
      text-sm
      text-blue-300
      "
    >
      {complaint.status}
    </span>
  </div>

  {/* Description */}
  <p className="mt-4 text-zinc-400">
    {complaint.description}
  </p>

  {/* Details */}
  <div className="mt-6 grid gap-4 md:grid-cols-2">

    <div>
      <p className="text-zinc-500">Category</p>
      <p className="font-semibold text-white">
        {complaint.category}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">Severity</p>
      <p className="font-semibold text-red-400">
        {complaint.severity}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">AI Category</p>
      <p className="text-blue-400">
        {complaint.aiCategory || "Not Available"}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">AI Severity</p>
      <p className="text-yellow-400">
        {complaint.aiSeverity || "Not Available"}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">AI Confidence</p>
      <p className="text-green-400">
        {complaint.aiConfidence
          ? `${(complaint.aiConfidence * 100).toFixed(0)}%`
          : "N/A"}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">Duplicate</p>

      {complaint.isDuplicate ? (
        <span className="rounded-full bg-red-600 px-3 py-1 text-sm">
          Duplicate
        </span>
      ) : (
        <span className="rounded-full bg-green-600 px-3 py-1 text-sm">
          Unique
        </span>
      )}
    </div>

    <div>
      <p className="text-zinc-500">Location</p>
      <p>
        {complaint.location
          ? `${complaint.location.latitude}, ${complaint.location.longitude}`
          : "Location not available"}
      </p>
    </div>

    <div>
      <p className="text-zinc-500">Assigned Officer</p>
      <p>
        {complaint.assignedTo || "Not Assigned"}
      </p>
    </div>

  </div>

        </div>
  ))}
      </div>

    </main>
  );
}