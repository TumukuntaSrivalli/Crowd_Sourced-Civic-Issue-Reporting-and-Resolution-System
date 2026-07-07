interface Props {
  status: "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
}

export default function ComplaintStatusBadge({ status }: Props) {

  const getColor = () => {

    switch (status) {

      case "Pending":
        return `
        bg-yellow-500/10
        text-yellow-400
        border-yellow-500/30
        `;

      case "Assigned":
        return `
        bg-blue-500/10
        text-blue-400
        border-blue-500/30
        `;

      case "In Progress":
        return `
        bg-purple-500/10
        text-purple-400
        border-purple-500/30
        `;

      case "Resolved":
        return `
        bg-green-500/10
        text-green-400
        border-green-500/30
        `;

      case "Rejected":
        return `
        bg-red-500/10
        text-red-400
        border-red-500/30
        `;

      default:
        return `
        bg-zinc-500/10
        text-zinc-400
        border-zinc-500/30
        `;

    }

  };


  return (

    <span
      className={`
      inline-flex
      items-center
      rounded-full
      border
      px-4
      py-1.5
      text-sm
      font-semibold
      backdrop-blur-md
      ${getColor()}
      `}
    >

      {status}

    </span>

  );

}