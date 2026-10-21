export type UserRole = "citizen" | "officer" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: "citizen";
}