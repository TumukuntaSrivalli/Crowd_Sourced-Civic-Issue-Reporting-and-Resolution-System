import { Complaint } from "@/types/complaint";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateComplaint(
  complaint: Partial<Complaint>
): ValidationResult {
  const errors: string[] = [];

  if (!complaint.title?.trim()) {
    errors.push("Complaint title is required.");
  }

  if (!complaint.description?.trim()) {
    errors.push("Complaint description is required.");
  } else if (complaint.description.trim().length < 15) {
    errors.push("Description should contain at least 15 characters.");
  }

  if (!complaint.category) {
    errors.push("Please select a category.");
  }

  if (!complaint.severity) {
    errors.push("Please select a severity.");
  }

  if (
    complaint.latitude === undefined ||
    complaint.longitude === undefined
  ) {
    errors.push("Please capture your current location.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}