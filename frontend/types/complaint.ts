export type ComplaintCategory =
  | "Pothole"
  | "Garbage"
  | "Streetlight"
  | "Water Leakage"
  | "Drainage"
  | "Road Damage"
  | "Traffic Signal"
  | "Other";

export type ComplaintSeverity =
  | "Low"
  | "Medium"
  | "High";

export type ComplaintStatus =
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Rejected";

export interface Complaint {
  id?: string;

  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  severity: string;

  userId: string;

  assignedTo?: string;

department?: string;

recommendedOfficer?: string;

priorityScore?: number;
  aiCategory?: string;
  aiSeverity?: "Low" | "Medium" | "High";
  aiConfidence?: number;
  isDuplicate?: boolean;
  aiSummary?: string;

  createdAt?: any;
  updatedAt?: any;
  imageUrl?: string;

  location: {
    latitude: number;
    longitude: number;
  };
}