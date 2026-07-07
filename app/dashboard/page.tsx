"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {

  const router = useRouter();
  const { user } = useAuth();



  const handleLogout = async () => {

    await logoutUser();

    router.push("/login");

  };



  return (

    <main
      className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-12
      "
    >



      <div
        className="
        mx-auto
        max-w-4xl
        "
      >





        {/* Heading */}

        <h1
          className="
          text-4xl
          font-extrabold
          mb-8
          bg-linear-to-r
          from-blue-400
          via-cyan-400
          to-white
          bg-clip-text
          text-transparent
          "
        >

          Dashboard

        </h1>






        {/* User Card */}

        <div
          className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900/60
          backdrop-blur-xl
          p-8
          shadow-2xl
          "
        >



          <h2
            className="
            text-xl
            font-semibold
            mb-6
            text-cyan-400
            "
          >

            Citizen Profile

          </h2>





          <div
            className="
            space-y-5
            text-zinc-300
            "
          >



            <p
              className="
              flex
              gap-3
              "
            >

              <strong
                className="text-white"
              >
                Name:
              </strong>

              <span>
                {user?.displayName || ""}
              </span>

            </p>





            <p
              className="
              flex
              gap-3
              "
            >

              <strong
                className="text-white"
              >
                Email:
              </strong>


              <span>
                {user?.email}
              </span>


            </p>



          </div>




        </div>






        {/* Logout Button */}

        <button

          onClick={handleLogout}

          className="
          mt-8
          rounded-xl
          bg-linear-to-r
          from-red-600
          to-red-500
          px-8
          py-3
          font-semibold
          text-white
          shadow-lg
          hover:scale-105
          transition
          "

        >

          Logout

        </button>





      </div>




    </main>

  );
}