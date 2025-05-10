"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import DoctorDetails from "../_components/DoctorDetails";

const Details = ({ params }) => {
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Unwrap the params promise
    params.then((unwrappedParams) => {
      setRecordId(unwrappedParams.recordId); 
    });
  }, [params]);

  useEffect(() => {
    if (recordId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${recordId}`)
       
        .then((response) => {
          console.log(response.data);
          setDoctor(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [recordId]);
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <SyncLoader />
      </div>
    );
  if (error) return <div>Error...</div>;
  return (
    <div className="p-5 md:px-20">
      <h2 className="font-bold text-2xl font-display">Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2">
          {doctor ? <DoctorDetails doctor={doctor} /> : <div>Error...</div>}
        </div>
      </div>
    </div>
  );
};

export default Details;
