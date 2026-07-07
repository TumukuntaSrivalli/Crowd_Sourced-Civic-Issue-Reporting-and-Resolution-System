"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await loginUser(email, password);

      alert("Login Successful!");

      router.push("/dashboard");

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div
        className="
        w-full
        max-w-md
        rounded-xl
        bg-zinc-900
        p-8
        border
        border-zinc-800
        shadow-lg
        "
      >

        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>


        <form 
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="
              w-full
              rounded-lg
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              "
            />
          </div>


          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="
              w-full
              rounded-lg
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              "
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            rounded-lg
            bg-blue-600
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
            transition
            "
          >

            {loading ? "Logging In..." : "Login"}

          </button>


        </form>

      </div>

    </main>
  );
}