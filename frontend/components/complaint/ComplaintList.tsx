import ComplaintCard from "./ComplaintCard";
import { Complaint } from "@/types/complaint";

interface ComplaintListProps {
  complaints: (Complaint & { id: string })[];
}

export default function ComplaintList({
  complaints,
}: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">
          No Complaints Found
        </h2>

        <p className="mt-2 text-gray-600">
          You haven't submitted any complaints yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
        />
      ))}
    </div>
  );
}