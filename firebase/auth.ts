import { getAuth } from "firebase/auth";
import app from "./firebaseConfig";

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Authentication
export default auth;