import Link from "next/link";
import { Complaint } from "@/types/complaint";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { officers } from "@/constants/officers";
import { assignComplaintToOfficer } from "@/services/complaintService";

interface ComplaintCardProps {
  complaint: Complaint & {
    id: string;
  };
}

export default function ComplaintCard({
  complaint,
}: ComplaintCardProps) {

  return (

    <div
      className="
      rounded-2xl
      border
      border-zinc-800
      bg-zinc-900/60
      backdrop-blur-xl
      p-6
      shadow-2xl
      hover:border-cyan-500/40
      transition
      "
    >
      <input
        type="text"
        placeholder="Search complaints..."
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-900
          px-5
          py-3
          text-white
          placeholder:text-zinc-500
          focus:border-blue-500
          outline-none
        "
      />



      {/* Title */}

      <h2
        className="
        text-2xl
        font-bold
        text-cyan-400
        "
      >
        {complaint.title}
      </h2>





      {/* Description */}

      <p
        className="
        mt-3
        text-zinc-400
        leading-relaxed
        "
      >
        {complaint.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">

      <div>
      <p className="text-zinc-400 text-sm">
      AI Category
      </p>

      <p className="font-semibold">
      {complaint.aiCategory || "Unknown"}
      </p>
      </div>

      <div>
      <p className="text-zinc-400 text-sm">
      AI Severity
      </p>

      <p className="font-semibold">
      {complaint.aiSeverity || "Low"}
      </p>
      </div>

      </div>

      {/* Duplicate Detection Badge */}
      {complaint.isDuplicate && (
          <div
            className="
              mt-3
              inline-block
              rounded-full
              bg-red-500/20
              px-3
              py-1
              text-red-400
              text-sm
            "
          >
            Duplicate Complaint
          </div>
        )}


      {/* Assign Officer */}
        <select
          onChange={(e) =>
            assignComplaintToOfficer(
              complaint.id,
              e.target.value
            )
          }
          className="
            mt-5
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
        >
          <option>Select Officer</option>

          {officers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

      {/* AI Analysis */}

      <div
        className="
        mt-5
        rounded-xl
        border
        border-blue-500/20
        bg-blue-500/10
        p-4
        space-y-2
        "
      >

        <div
          className="
          text-sm
          text-blue-300
          "
        >

          🤖 <strong>AI Category:</strong>{" "}
          {complaint.aiCategory || "Pending"}

        </div>



        <div
          className="
          text-sm
          text-purple-300
          "
        >

          ⚡ <strong>AI Severity:</strong>{" "}
          {complaint.aiSeverity || "Pending"}

        </div>


      </div>


      {/* Complaint Details */}

      <div
        className="
        mt-6
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        text-sm
        "
      >



        <div
          className="
          rounded-xl
          bg-black
          border
          border-zinc-800
          p-4
          "
        >

          <strong className="text-white">
            Category:
          </strong>

          <p className="mt-1 text-zinc-400">
            {complaint.category}
          </p>

        </div>






        <div
          className="
          rounded-xl
          bg-black
          border
          border-zinc-800
          p-4
          "
        >

          <strong className="text-white">
            Severity:
          </strong>

          <p className="mt-1 text-zinc-400">
            {complaint.severity}
          </p>

        </div>







        <div
          className="
          rounded-xl
          bg-black
          border
          border-zinc-800
          p-4
          "
        >

          <strong className="text-white">
            Status:
          </strong>

          <div className="mt-2">
            <ComplaintStatusBadge 
              status={complaint.status}
            />
          </div>

        </div>

        <div
          className="
          rounded-xl
          bg-black
          border
          border-zinc-800
          p-4
          "
        >

          <strong className="text-white">
            Location:
          </strong>


          <p className="mt-1 text-zinc-400">

            {complaint.location.latitude},{" "}
            {complaint.location.longitude}

          </p>


        </div>



      </div>








      {/* View Details Button */}

      <div className="mt-6">

        <Link

          href={`/complaints/${complaint.id}`}

          className="
          inline-flex
          items-center
          rounded-xl
          bg-linear-to-r
          from-blue-600
          to-cyan-500
          px-6
          py-3
          font-semibold
          text-white
          shadow-lg
          hover:scale-105
          transition
          "

        >

          View Details

        </Link>


      </div>




    </div>

  );
}