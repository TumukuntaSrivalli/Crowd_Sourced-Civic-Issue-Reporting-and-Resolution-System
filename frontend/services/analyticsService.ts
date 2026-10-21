import { collection, getDocs } from "firebase/firestore";
import db from "@/firebase/firestore";
import { Complaint } from "@/types/complaint";

type Severity = "Low" | "Medium" | "High";

export const getComplaintStats = async () => {
  const snapshot = await getDocs(collection(db, "complaints"));

  const complaints = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Complaint[];

  const stats = {
    total: complaints.length,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,

    categoryCount: {} as Record<string, number>,

    severityCount: {
      Low: 0,
      Medium: 0,
      High: 0,
    } as Record<Severity, number>,
  };

  complaints.forEach((c) => {
    if (c.status === "Pending") stats.pending++;
    if (c.status === "Assigned") stats.assigned++;
    if (c.status === "In Progress") stats.inProgress++;
    if (c.status === "Resolved") stats.resolved++;
    if (c.status === "Rejected") stats.rejected++;

    const cat = c.category || c.aiCategory || "Unknown";
    stats.categoryCount[cat] = (stats.categoryCount[cat] || 0) + 1;

    const sev = (c.severity || c.aiSeverity || "Low") as Severity;
    stats.severityCount[sev]++;
  });

  return stats;
};