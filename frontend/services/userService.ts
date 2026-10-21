import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import db from "@/firebase/firestore";

export interface UserData {
  uid: string;
  fullName: string;
  email: string;
  role: "citizen" | "officer" | "admin";
  phone?: string;
  profileImage?: string;
}

/**
 * Save a new user to Firestore
 */
export const createUserProfile = async (user: UserData) => {
  await setDoc(doc(db, "users", user.uid), {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    profileImage: user.profileImage || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserData>
) => {
  const docRef = doc(db, "users", uid);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};