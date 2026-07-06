import { getFirestore } from "firebase/firestore";
import app from "./firebaseConfig";

// Initialize Firestore Database
const db = getFirestore(app);

// Export Firestore
export default db;