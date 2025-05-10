

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/prescription/get`
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen h-fit bg-gray-100 p-6">
      <h1 className="text-5xl font-display text-gray-800 mb-6">
        Prescriptions <span className="text-primary">.</span>
      </h1>
      {prescriptions.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white rounded-lg shadow-lg flex items-center p-4 w-full max-w-2xl"
            >
              {/* Image Placeholder */}
              <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Preview</span>
              </div>

              {/* Details */}
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {prescription.name}
                </h2>
                <a
                  href={prescription.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Prescription
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No prescriptions found.</p>
      )}
    </div>
  );
};

export default Prescription;
