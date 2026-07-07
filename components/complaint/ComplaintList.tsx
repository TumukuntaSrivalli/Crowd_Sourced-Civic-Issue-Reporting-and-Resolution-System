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

      <div
        className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/60
        backdrop-blur-xl
        p-8
        text-center
        shadow-2xl
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          text-cyan-400
          "
        >
          No Complaints Found
        </h2>


        <p
          className="
          mt-3
          text-zinc-400
          "
        >
          You haven't submitted any complaints yet.
        </p>


      </div>

    );
  }


  return (

    <div
      className="
      space-y-6
      "
    >

      {complaints.map((complaint) => (

        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
        />

      ))}

    </div>

  );
}