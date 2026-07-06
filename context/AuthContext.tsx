"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import auth from "@/firebase/auth";
import db from "@/firebase/firestore";

/**
 * 🔥 Extended User Type (with role)
 */
interface AppUser {
  uid: string;
  email: string | null;
  role: "citizen" | "admin" | "officer";
  displayName?: string | null;
}

/**
 * Context Type
 */
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // 🔥 Get user role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        let role: AppUser["role"] = "citizen";

        if (userSnap.exists()) {
          role = userSnap.data()?.role || "citizen";
        }

        // 🔥 Build final user object
        const appUser: AppUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role,
        };

        setUser(appUser);
      } catch (error) {
        console.error("Auth error:", error);

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          role: "citizen",
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}