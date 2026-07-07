"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUser } from "@/services/authService";
import { createUserProfile } from "@/services/userService";
import Link from "next/link";

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
    formState:{ errors },
  } = useForm<RegisterFormData>();




  const onSubmit = async (data: RegisterFormData) => {


    if(data.password !== data.confirmPassword){

      alert("Passwords do not match");
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

        uid:user.uid,
        fullName:data.fullName,
        email:data.email,
        role:"citizen",

      });



      alert("Registration Successful!");

      reset();


      // redirect to login page after registration
      router.push("/login");



    } catch(error:any){

      alert(error.message);


    } finally {

      setLoading(false);

    }

  };




  return (

    <main
      className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      px-6
      py-12
      "
    >


      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-8
        shadow-2xl
        backdrop-blur
        "
      >



        <h1
          className="
          mb-8
          text-center
          text-3xl
          font-extrabold
          bg-linear-to-r
          from-blue-400
          via-cyan-400
          to-white
          bg-clip-text
          text-transparent
          "
        >
          Create Account
        </h1>





        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >



          {/* Full Name */}

          <div>

            <input
              type="text"
              placeholder="Full Name"

              {...register("fullName",{
                required:"Full Name is required"
              })}


              className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              transition
              "
            />


            {
              errors.fullName &&
              (
                <p className="text-sm text-red-400 mt-1">
                  {errors.fullName.message}
                </p>
              )
            }


          </div>





          {/* Email */}

          <div>

            <input
              type="email"
              placeholder="Email"


              {...register("email",{
                required:"Email is required"
              })}


              className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              transition
              "
            />


            {
              errors.email &&
              (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )
            }


          </div>






          {/* Password */}

          <div>


            <input
              type="password"
              placeholder="Password"


              {...register("password",{

                required:"Password is required",

                minLength:{
                  value:6,
                  message:"Minimum 6 characters required"
                }

              })}


              className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              transition
              "
            />


            {
              errors.password &&
              (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )
            }


          </div>







          {/* Confirm Password */}


          <div>


            <input
              type="password"
              placeholder="Confirm Password"


              {...register("confirmPassword",{

                required:"Confirm your password"

              })}



              className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-blue-500
              transition
              "
            />



            {
              errors.confirmPassword &&
              (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )
            }



          </div>







          {/* Register Button */}


          <button

            type="submit"

            disabled={loading}


            className="
            w-full
            rounded-xl
            bg-linear-to-r
            from-blue-600
            to-cyan-500
            py-3
            font-semibold
            text-white
            shadow-lg
            hover:scale-105
            transition
            "

          >

            {
              loading
              ?
              "Creating Account..."
              :
              "Register"
            }


          </button>








          {/* Login Link */}


          <div
            className="
            mt-6
            text-center
            text-zinc-400
            "
          >

            Already have an account?{" "}


            <Link

              href="/login"

              className="
              text-blue-400
              hover:text-cyan-400
              hover:underline
              "

            >

              Login

            </Link>


          </div>





        </form>



      </div>



    </main>

  );
}