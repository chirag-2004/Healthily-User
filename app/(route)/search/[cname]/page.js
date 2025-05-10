"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import Link from "next/link";

const Page = ({ params }) => {
  const [cname, setCname] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const doctorList = [
  //   {
  //     id: 1,
  //     name: "Dr. Umang Agrawal",
  //     speciality: "Dental",
  //     Exp: 5,
  //     clinic: "Noida, India",
  //   },
  //   {
  //     id: 2,
  //     name: "Dr. Gaurav Aggarwal",
  //     speciality: "Dental",
  //     Exp: 5,
  //     clinic: "Pune, India",
  //   },
  // ];

  useEffect(() => {
    // Unwrap `params` if it is a Promise
    const fetchParams = async () => {
      const unwrappedParams = await params;
      if (unwrappedParams?.cname) {
        const decodedCname = decodeURIComponent(unwrappedParams.cname);
        setCname(decodedCname);
      }
    };

    fetchParams();
  }, [params]);
  // useEffect(() => {
  //   // Unwrap the params promise
  //   params.then((unwrappedParams) => {
  //     setCname(unwrappedParams.cname); // Set cname once unwrapped
  //   });
  // }, [params]);

  useEffect(() => {
    if (cname) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/specialization/${cname}`
        )
        // .get(
        //   `https://backend-production-7277.up.railway.app/api/specialization/${cname}`
        // )
        .then((response) => {
          setDoctorList(
            response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
          console.log(doctorList);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [cname]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <SyncLoader />
      </div>
    );
  if (error) return <div>Error...</div>;

  return (
    <div>
      <div className="flex flex-row p-5">
        <h1
          className="text-black text-6xl font-semi\
       font-display"
        >
          {cname} <span className="text-primary">.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 lg:grid-cols-4 mx-4">
        {doctorList.map((doctor, index) => (
          <div key={doctor._id} className="mt-2 h-full">
            <Link
              href={`/details/${doctor._id}`}
              className="relative flex flex-col justify-between h-full overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
              <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary via-gray-500 to-black"></span>

              <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                    {doctor.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-gray-600">
                    {doctor.specialization}
                  </p>
                </div>

                <div className="hidden sm:block sm:shrink-0">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                    className="size-16 rounded-lg object-cover shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-pretty text-sm text-gray-500">
                  {doctor.message}
                </p>
              </div>

              <dl className="mt-6 flex gap-4 sm:gap-6">
                <div className="flex flex-col-reverse">
                  <dt className="text-sm font-medium text-gray-600">
                    Experience
                  </dt>
                  <dd className="text-xs text-gray-500">{doctor.exp} Years</dd>
                </div>

                <div className="flex flex-col-reverse">
                  <dt className="text-sm font-medium text-gray-600">Place</dt>
                  <dd className="text-xs text-gray-500">
                    {doctor.place}, India
                  </dd>
                </div>
              </dl>
              <div className=" flex items-center max-w-fit">
                <Button
                  variant="primary"
                  className="bg-primary mt-2 text-white hover:text-slate-300 cursor-pointer"
                >
                  Book Appointment
                </Button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
