import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import auth from "@/firebase/auth";
import { createUserProfile } from "@/services/userService";

/**
 * Register a new user
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Login existing user.
 * If a pre-configured demo account doesn't exist yet in the Firebase project,
 * automatically registers and provisions it so demo buttons work out of the box.
 */
export const loginUser = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error: any) {
    // If it's a demo account and credentials don't exist yet in Firebase Auth
    const isDemo =
      email === "citizen@civic.gov" ||
      email === "officer@civic.gov" ||
      email === "admin@civic.gov";

    if (
      isDemo &&
      (error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password")
    ) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        let role: "citizen" | "officer" | "admin" = "citizen";
        let fullName = "Civic Citizen";

        if (email.startsWith("officer@")) {
          role = "officer";
          fullName = "Municipal Field Officer";
        } else if (email.startsWith("admin@")) {
          role = "admin";
          fullName = "System Administrator";
        }

        await updateProfile(userCredential.user, { displayName: fullName });

        await createUserProfile({
          uid: userCredential.user.uid,
          fullName,
          email,
          role,
        }).catch(() => {});

        return userCredential.user;
      } catch (createErr) {
        throw error;
      }
    }

    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password via email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};