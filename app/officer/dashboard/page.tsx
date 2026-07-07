"use client";

import { useEffect, useState } from "react";
import { getOfficerComplaints, updateComplaint, assignComplaintToOfficer } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { useAuth } from "@/context/AuthContext";
import { canAccessOfficerDashboard } from "@/utils/roleGuard";
import { useRouter } from "next/navigation";
import { officers } from "@/constants/officers";
import { getOfficerNotifications }
from "@/services/notificationService";

export default function OfficerDashboard() {
  const [notifications,setNotifications]=useState<any[]>([]);
  const [complaints, setComplaints] = useState<(Complaint & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
const loadNotifications=async()=>{

if(!user)return;
  const data=
  await getOfficerNotifications(user.uid);


  setNotifications(data);

  };


  loadNotifications();


  },[user]);

    if (user && !canAccessOfficerDashboard(user.role)) {
      router.push("/dashboard");
    }

   [user, router]



  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        if (!user) return;

        const data = await getOfficerComplaints(user.uid);

        setComplaints(data as (Complaint & { id: string })[]);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };


    fetchComplaints();

  }, [user]);



  const handleStatusUpdate = async (
    id: string,
    status: "Assigned" | "In Progress" | "Resolved"
  ) => {

    try {

      await updateComplaint(id, { status });


      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status } : c
        )
      );


    } catch (error) {

      console.error(error);

    }

  };



  if (loading) {

    return (

      <main className="min-h-screen bg-black text-white px-6 py-12">

        <h1 className="text-4xl font-extrabold">
          Loading Officer Dashboard...
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

    <div className="mx-auto max-w-6xl">


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
        Officer Dashboard
      </h1>



      {/* 🔔 Notifications Section - ADD HERE */}

      <div
        className="
        mb-6
        rounded-xl
        bg-blue-900/40
        border
        border-blue-700
        p-5
        "
      >

        <h2
          className="
          text-xl
          font-bold
          mb-3
          "
        >
          🔔 Notifications
        </h2>


        {
          notifications.length === 0 ? (

            <p className="text-zinc-400">
              No new notifications
            </p>

          ) : (

            notifications.map((n) => (

              <p
                key={n.id}
                className="text-zinc-200 mb-2"
              >
                {n.message}
              </p>

            ))

          )
        }

      </div>



      {/* Complaints Section */}

      <div className="space-y-6">


        {complaints.map((complaint) => (


          <div
            key={complaint.id}
            className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/60
            backdrop-blur-xl
            p-6
            shadow-2xl
            hover:border-cyan-500/50
            transition
            "
          >


            <h2 className="text-2xl font-bold text-cyan-400">
              {complaint.title}
            </h2>



            <p className="mt-3 text-zinc-400">
              {complaint.description}
            </p>



            <p className="mt-4 text-zinc-300">

              <strong className="text-white">
                Status:
              </strong>{" "}

              {complaint.status}

            </p>



            <select

              onChange={(e)=>
                assignComplaintToOfficer(
                  complaint.id,
                  e.target.value
                )
              }

              className="
              mt-5
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-black
              px-4
              py-3
              text-white
              "

            >

              <option>Select Officer</option>


              {officers.map((o)=>(

                <option key={o.id} value={o.id}>

                  {o.name}

                </option>

              ))}


            </select>




            <div className="mt-6 flex flex-wrap gap-4">


              <button
                onClick={() =>
                  handleStatusUpdate(
                    complaint.id,
                    "Assigned"
                  )
                }

                className="
                rounded-xl
                bg-linear-to-r
                from-blue-600
                to-cyan-500
                px-5
                py-2
                font-semibold
                "
              >

                Assign

              </button>



              <button
                onClick={() =>
                  handleStatusUpdate(
                    complaint.id,
                    "In Progress"
                  )
                }

                className="
                rounded-xl
                bg-linear-to-r
                from-purple-600
                to-pink-500
                px-5
                py-2
                font-semibold
                "
              >

                In Progress

              </button>




              <button
                onClick={() =>
                  handleStatusUpdate(
                    complaint.id,
                    "Resolved"
                  )
                }

                className="
                rounded-xl
                bg-linear-to-r
                from-green-600
                to-emerald-500
                px-5
                py-2
                font-semibold
                "
              >

                Resolve

              </button>


            </div>


          </div>


        ))}


      </div>


    </div>


  </main>

);
}