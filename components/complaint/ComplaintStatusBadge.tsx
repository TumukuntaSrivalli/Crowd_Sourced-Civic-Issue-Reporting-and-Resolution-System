interface Props {
  status: "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
}

export default function ComplaintStatusBadge({ status }: Props) {
  const getColor = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getColor()}`}>
      {status}
    </span>
  );
}