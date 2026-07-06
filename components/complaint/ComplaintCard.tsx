import Link from "next/link";
import { Complaint } from "@/types/complaint";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

interface ComplaintCardProps {
  complaint: Complaint & {
    id: string;
  };
}

export default function ComplaintCard({
  complaint,
}: ComplaintCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        {complaint.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {complaint.description}
      </p>
        <div className="mt-2 text-sm text-gray-500">
        🤖 AI Category: {complaint.aiCategory}
        </div>

        <div className="text-sm text-gray-500">
        ⚡ AI Severity: {complaint.aiSeverity}
        </div>

<div className="mt-4 grid grid-cols-2 gap-4 text-sm"></div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Category:</strong> {complaint.category}
        </div>

        <div>
          <strong>Severity:</strong> {complaint.severity}
        </div>

        <div>
          <ComplaintStatusBadge status={complaint.status} />
        </div>

        <div>
          <strong>Location:</strong>{" "}
          {complaint.location.latitude}, {complaint.location.longitude}
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/complaints/${complaint.id}`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}