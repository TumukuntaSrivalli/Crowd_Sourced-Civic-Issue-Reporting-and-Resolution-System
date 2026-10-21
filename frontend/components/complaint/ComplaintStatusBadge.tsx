interface Props {
  status: "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
}

export default function ComplaintStatusBadge({ status }: Props) {
  const getStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80";
      case "Assigned":
        return "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/80";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/80";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getDot = () => {
    switch (status) {
      case "Pending":
        return "bg-amber-500";
      case "Assigned":
        return "bg-sky-500";
      case "In Progress":
        return "bg-indigo-500 animate-pulse";
      case "Resolved":
        return "bg-emerald-500";
      case "Rejected":
        return "bg-rose-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        transition-colors
        ${getStyle()}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDot()}`} />
      {status}
    </span>
  );
}