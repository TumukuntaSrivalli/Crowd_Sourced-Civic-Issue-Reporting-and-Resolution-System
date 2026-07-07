"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="max-w-4xl text-center">

        <h1 className="text-5xl font-bold mb-6">
          Civic Issue Reporting System
        </h1>

        <p className="text-lg text-gray-400 mb-8">
          Report public issues, track complaints, and
          contribute towards a better community.
        </p>


        {!user ? (
          <div className="flex justify-center gap-5">

            <button
              onClick={() => router.push("/login")}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Login
            </button>


            <button
              onClick={() => router.push("/register")}
              className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black"
            >
              Register
            </button>

          </div>
        ) : (

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Open Dashboard
          </button>

        )}


        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              Report Issues
            </h2>
            <p className="text-gray-400 mt-2">
              Submit complaints with images and location.
            </p>
          </div>


          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              Track Status
            </h2>
            <p className="text-gray-400 mt-2">
              Monitor complaint progress in real time.
            </p>
          </div>


          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              AI Assistance
            </h2>
            <p className="text-gray-400 mt-2">
              AI helps classify and prioritize issues.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}