"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getUserComplaints } from "@/services/complaintService";

import ComplaintList from "@/components/complaint/ComplaintList";
import { Complaint } from "@/types/complaint";

export default function ComplaintsPage() {

  const { user } = useAuth();


  const [complaints, setComplaints] = useState<
    (Complaint & { id: string })[]
  >([]);


  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchComplaints = async () => {


      if (!user) {

        setLoading(false);
        return;

      }



      try {


        const data = await getUserComplaints(user.uid);


        setComplaints(data as (Complaint & { id: string })[]);



      } catch (error) {


        console.error(error);


      } finally {


        setLoading(false);


      }


    };



    fetchComplaints();


  }, [user]);






  if (loading) {

    return (

      <main
        className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        p-8
        "
      >

        <h1
          className="
          text-2xl
          font-semibold
          text-cyan-400
          "
        >

          Loading complaints...

        </h1>


      </main>

    );

  }






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
        max-w-5xl
        "
      >




        <h1
          className="
          mb-8
          text-4xl
          font-extrabold
          bg-linear-to-r
          from-blue-400
          via-cyan-400
          to-white
          bg-clip-text
          text-transparent
          "
        >

          My Complaints

        </h1>





        <div
          className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900/60
          p-6
          shadow-xl
          backdrop-blur
          "
        >

          <ComplaintList complaints={complaints} />


        </div>




      </div>



    </main>

  );
}