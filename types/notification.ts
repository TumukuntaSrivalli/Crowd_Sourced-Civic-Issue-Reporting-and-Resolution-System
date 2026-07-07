export interface Notification {
  id?: string;

  userId: string;

  complaintId: string;

  title: string;

  message: string;

  type:
    | "assignment"
    | "status"
    | "system";

  read: boolean;

  createdAt: any;
}