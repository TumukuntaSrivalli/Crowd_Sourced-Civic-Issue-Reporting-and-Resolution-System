import { UserRole } from "@/types/user";

export const canAccessOfficerDashboard = (role: UserRole) => {
  return role === "officer" || role === "admin";
};

export const canAccessAdminDashboard = (role: UserRole) => {
  return role === "admin";
};

export const isAdmin = (role?: UserRole) => {
  return role === "admin";
};

export const isOfficer = (role?: UserRole) => {
  return role === "officer";
};

export const isCitizen = (role?: UserRole) => {
  return role === "citizen";
};