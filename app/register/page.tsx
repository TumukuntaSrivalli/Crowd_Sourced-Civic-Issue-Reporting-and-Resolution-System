"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUser } from "@/services/authService";
import { createUserProfile } from "@/services/userService";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

    const user = await registerUser(
        data.fullName,
        data.email,
        data.password
        );

        await createUserProfile({
        uid: user.uid,
        fullName: data.fullName,
        email: data.email,
        role: "Citizen",
        });

      alert("Registration Successful!");

      reset();

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", {
                required: "Full Name is required",
              })}
              className="w-full rounded border p-3"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full rounded border p-3"
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full rounded border p-3"
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
              })}
              className="w-full rounded border p-3"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}