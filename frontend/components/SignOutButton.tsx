"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import auth from "@/firebase/auth";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}