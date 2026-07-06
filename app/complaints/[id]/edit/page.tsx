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

import db from "@/firebase/firestore";
import { Complaint } from "@/types/complaint";

const complaintsCollection = collection(db, "complaints");

/**
 * Create a new complaint
 */
export const createComplaint = async (complaint: Complaint) => {
  const docRef = await addDoc(complaintsCollection, {
    ...complaint,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

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