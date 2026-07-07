import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import db from "@/firebase/firestore";


export async function getOfficerNotifications(
  officerId: string
) {

  const q = query(
    collection(db, "notifications"),
    where(
      "officerId",
      "==",
      officerId
    )
  );


  const snapshot = await getDocs(q);


  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// Create notification
export async function createNotification(
  userId: string,
  message: string,
  complaintId?: string
) {

  await addDoc(
    collection(db, "notifications"),
    {
      userId,
      message,
      complaintId: complaintId || null,
      read: false,
      createdAt: serverTimestamp(),
    }
  );

}