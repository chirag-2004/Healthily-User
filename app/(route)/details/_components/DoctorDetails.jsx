import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Hospital,
  IndianRupee,
  MapPin,
  Star,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import BookAppointment from "./BookAppointment";

const DoctorDetails = ({ doctor }) => {
  return (
    <div className="h-fit">
      <div className="grid grid-cols-1 md:grid-cols-8 p-4 mt-5 bg-white rounded-xl">
        {/* doctor img */}
        <div className="flex md:col-span-2 gap-2">
          <div className="flex flex-col justify-center items-center  max-h-[100px] md:max-h-[200px]">
            <Image
              width={200}
              height={100}
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
              alt={doctor.name}
              className="rounded-full object-cover md:w-[200px] w-[100px]"
            />
          </div>
          <div className="flex flex-col p-2 gap-1">
            <h2 className="font-bold text-2xl font-display">{doctor.name}</h2>
            <h3 className="flex gap-1 text-gray-500 text-sm items-center">
              ★<span className="text-center items-center">4.3</span>
            </h3>
            <h3 className="text-gray-400 max-w-fit text-sm rounded-sm p-1 border-2 border-gray-200">
              {doctor.specialization}
            </h3>
          </div>
        </div>
        {/* button */}
        <div className="md:col-span-6 flex justify-start md:justify-end md:px-5">
          <div className="flex items-center justify-center">
            <BookAppointment doctor={doctor} />
          </div>
        </div>
      </div>
      {/* Professional */}
      <h2 className="font-bold text-lg mt-10 font-display">About Me</h2>
      <div className="bg-white mt-2 p-6 rounded-xl font-body">
        <div className="flex flex-col gap-2">
          <h2 className="flex gap-2 text-gray-500 text-md">
            <GraduationCap />
            <span>{doctor.exp} Years of Experience</span>
          </h2>
          <h2 className="flex gap-2 text-gray-500 text-md">
            <MapPin />
            <span>{doctor.place}, India</span>
          </h2>
          <h2 className="flex gap-2 text-gray-500 text-md">
            <Hospital />
            <span>{doctor.clinicName}</span>
          </h2>
          <h2 className="flex gap-2 text-gray-500 text-md">
            <IndianRupee />
            <span>{doctor.fees}</span>
          </h2>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-lg mt-10 font-display">
          Doctor's Message
        </h2>
        <p className="text-gray-400 mt-2 bg-white p-6 rounded-xl">
          {doctor.message}
        </p>
      </div>
    </div>
  );
};

export default DoctorDetails;
