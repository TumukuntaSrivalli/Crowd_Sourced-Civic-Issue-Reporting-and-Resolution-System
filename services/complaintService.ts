import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";


import { analyzeComplaintAI } from "@/services/aiService";
import db from "@/firebase/firestore";
import { Complaint } from "@/types/complaint";

export const checkDuplicate = (
  newComplaint: string,
  existingComplaints: any[]
) => {
  return existingComplaints.some((c) =>
    c.description
      .toLowerCase()
      .includes(newComplaint.toLowerCase().slice(0, 20))
  );
};

const complaintsCollection = collection(db, "complaints");
export const assignComplaintToOfficer = async (
  complaintId: string,
  officerId: string
) => {
  const ref = doc(db, "complaints", complaintId);

  await updateDoc(ref, {
    assignedTo: officerId,
    status: "Assigned",
    updatedAt: serverTimestamp(),
  });
};
/**
 * Create a new complaint
 */

export const createComplaint = async (complaint: Complaint) => {
  const ai = await analyzeComplaintAI(
    complaint.title,
    complaint.description
  ).catch(() => null);

  const finalData = {
    ...complaint,
    aiCategory: ai?.category || "Unknown",
    aiSeverity: ai?.severity || "Low",
    aiConfidence: ai?.confidence || 0,
    aiSummary: ai?.summary || "",
    isDuplicate: ai?.isDuplicate || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(complaintsCollection, finalData);

  return docRef.id;
};

/**
 * Get complaint by ID
 */
export const getComplaintById = async (
  id: string
): Promise<Complaint | null> => {
  const docRef = doc(db, "complaints", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...(docSnap.data() as Complaint),
  };
};

/**
 * Get all complaints
 */
export const getAllComplaints = async () => {
  const snapshot = await getDocs(complaintsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Complaint),
  }));
};

/**
 * Get complaints submitted by a specific user
 */
export const getUserComplaints = async (userId: string) => {
  const q = query(
    complaintsCollection,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Complaint),
  }));
};

/**
 * Update complaint
 */
export const updateComplaint = async (
  complaintId: string,
  data: Partial<Complaint>
) => {
  const docRef = doc(db, "complaints", complaintId);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete complaint
 */
export const deleteComplaint = async (complaintId: string) => {
  const docRef = doc(db, "complaints", complaintId);

  await deleteDoc(docRef);
};
export const updateComplaintStatus = async (
  complaintId: string,
  status: "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected"
) => {
  const docRef = doc(db, "complaints", complaintId);

  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};
export const getOfficerComplaints = async (userId: string) => {
  const q = query(
    complaintsCollection,
    where("assignedTo", "==", userId),
    where("status", "in", ["Pending", "Assigned", "In Progress"])
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Complaint),
  }));
};
