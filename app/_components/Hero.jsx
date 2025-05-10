"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const initalOptions = 8;
  const specialityList = [
    {
      id: 1,
      name: "Dental",
      imgPath: "fas fa-tooth",
      path: "/search/Dental",
    },
    {
      id: 2,
      name: "Ortho",
      imgPath: "fas fa-bone",
      path: "/search/Ortho",
    },
    {
      id: 3,
      name: "Derma",
      imgPath: "fas fa-spray-can",
      path: "/search/Derma",
    },
    {
      id: 4,
      name: "Patho",
      imgPath: "fas fa-vial",
      path: "/search/Patho",
    },
    {
      id: 5,
      name: "Pedo",
      imgPath: "fas fa-baby",
      path: "/search/Pedo",
    },
    {
      id: 6,
      name: "Physiotherapy",
      imgPath: "fas fa-running",
      path: "/search/Physiotherapy",
    },
    {
      id: 7,
      name: "General Physician",
      imgPath: "fas fa-user-md",
      path: "/search/General Physician",
    },
    {
      id: 8,
      name: "Dietician",
      imgPath: "fas fa-apple-alt",
      path: "/search/Dietician",
    },
    {
      id: 9,
      name: "Gyane",
      imgPath: "fas fa-female",
      path: "/search/Gyane",
    },
    {
      id: 10,
      name: "Psychiatry",
      imgPath: "fas fa-brain",
      path: "/search/Psychiatry",
    },
    {
      id: 11,
      name: "Cardio",
      imgPath: "fas fa-heartbeat",
      path: "/search/Cardio",
    },
    {
      id: 12,
      name: "Neuro",
      imgPath: "fas fa-brain",
      path: "/search/Neuro",
    },
    {
      id: 13,
      name: "Urology",
      imgPath: "fas fa-procedures",
      path: "/search/Urology",
    },
    {
      id: 14,
      name: "Pulmonologist",
      imgPath: "fas fa-lungs",
      path: "/search/Pulmonologist",
    },
    {
      id: 15,
      name: "General Surgeon",
      imgPath: "fas fa-stethoscope",
      path: "/search/General Surgeon",
    },
    {
      id: 16,
      name: "Radiology",
      imgPath: "fas fa-x-ray",
      path: "/search/Radiology",
    },
    {
      id: 17,
      name: "Hair Transplant Clinics",
      imgPath: "fas fa-cut",
      path: "/search/Hair Transplant Clinics",
    },
    {
      id: 18,
      name: "Plastic Surgeon",
      imgPath: "fas fa-user-ninja",
      path: "/search/Plastic Surgeon",
    },
    {
      id: 19,
      name: "Ayurveda",
      imgPath: "fas fa-leaf",
      path: "/search/Ayurveda",
    },
    {
      id: 20,
      name: "Homeopathy",
      imgPath: "fas fa-flask",
      path: "/search/Homeopathy",
    },
    {
      id: 21,
      name: "Eye",
      imgPath: "fas fa-eye",
      path: "/search/Eye",
    },
    {
      id: 22,
      name: "ENT",
      imgPath: "fas fa-head-side-cough",
      path: "/search/ENT",
    },
    {
      id: 23,
      name: "Primary Healthcare Centres",
      imgPath: "fas fa-clinic-medical",
      path: "/search/Primary Healthcare Centres",
    },
    {
      id: 24,
      name: "Yoga Instructors",
      imgPath: "fas fa-child",
      path: "/search/Yoga Instructors",
    },
    {
      id: 25,
      name: "Pharmacy",
      imgPath: "fas fa-pills",
      path: "/search/Pharmacy",
    },
    {
      id: 26,
      name: "Diagnostic Centres",
      imgPath: "fas fa-vials",
      path: "/search/Diagnostic Centres",
    },
    {
      id: 27,
      name: "Associate",
      imgPath: "fas fa-user",
      path: "/search/Associate",
    },
    {
      id: 28,
      name: "RMP",
      imgPath: "fas fa-user",
      path: "/search/RMP",
    },
  ];

  // Filter specializations based on the search query
  const filteredSpecialityList = specialityList.filter((speciality) =>
    speciality.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-16 font-display font-bold flex flex-col items-center gap-4 px-5">
      <h1 className="md:text-6xl text-3xl">
        Search <span className="text-primary">Doctors</span>
      </h1>
      <h2 className="text-gray-500 md:text-xl text-sm text-center">
        Search your doctor and book an appointment
      </h2>
      <div className="flex w-full md:max-w-xl max-w-sm items-center space-x-4 p-2 relative">
        <Input
          type="text"
          placeholder="Search by speciality..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-normal"
        />
        <Button type="button">
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
        {/* Display filtered list */}
        {searchQuery && (
          <ul className="absolute top-14 left-0 w-fit bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredSpecialityList.length > 0 ? (
              filteredSpecialityList.map((speciality) => (
                <li
                  key={speciality.id}
                  className="p-2 flex items-center gap-3 hover:bg-gray-100"
                >
                  <i
                    className={`${speciality.imgPath} text-primary text-lg`}
                  ></i>
                  <Link href={speciality.path} className="block text-gray-700">
                    {speciality.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
      <div className="max-w-3xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {specialityList
          .slice(0, showAll ? specialityList.length : initalOptions)
          .map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className="flex flex-col justify-center text-center bg-green-100 p-8 gap-5 m-2 rounded-lg cursor-pointer hover:scale-110 ease-in-out transition-all"
            >
              <i className={`${item.imgPath} fa-2xl text-primary`}></i>
              <span className="text-sm font-normal">{item.name}</span>
            </Link>
          ))}
      </div>
      <button
        className="p-2 bg-slate-200 rounded-lg text-gray-500 flex items-center justify-center gap-2 hover:bg-slate-300"
        onClick={() => setShowAll(!showAll)}
      >
        {!showAll ? (
          <i className="fa-solid fa-arrow-down fa-sm"></i>
        ) : (
          <i className="fa-solid fa-arrow-up fa-sm"></i>
        )}
        <h3 className="text-sm font-medium">{showAll ? "Hide" : "Show All"}</h3>
      </button>
    </div>
  );
};

export default Hero;
