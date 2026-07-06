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

  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;

  imageUrl?: string;

  latitude: number;
  longitude: number;
  address: string;

  userId: string;

  createdAt?: Date;
  updatedAt?: Date;
}