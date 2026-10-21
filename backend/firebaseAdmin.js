/**
 * Firebase Admin SDK Initialization
 * Provides secure server-side access to Cloud Firestore and Firebase Auth
 */

const admin = require("firebase-admin");
require("dotenv").config();

const projectId = process.env.FIREBASE_PROJECT_ID || "civic-ai-97ef1";

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Production credentials passed via environment variables (e.g., Render)
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      console.log("🔥 Firebase Admin initialized with service account credentials.");
    } else {
      // Default initialization (falls back to Google Application Default Credentials or dev mode)
      admin.initializeApp({
        projectId,
      });
      console.log(`🔥 Firebase Admin initialized for project: ${projectId}`);
    }
  } catch (err) {
    console.warn("⚠️ Firebase Admin initialization warning:", err.message);
  }
}

const db = admin.firestore ? admin.firestore() : null;
const auth = admin.auth ? admin.auth() : null;

module.exports = { admin, db, auth };
