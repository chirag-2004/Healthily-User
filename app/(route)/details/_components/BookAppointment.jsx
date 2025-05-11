import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar1, CalendarDays, Clock } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

import { toast } from "sonner";
import axios from "axios";

const BookAppointment = ({ doctor }) => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const user = {
    given_name: "dhruv",
    family_name: "Gangal",
    email: "dhruvgangal123@gmail.com"
  };

  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const timeList = [];

    // Generate AM time slots from 10:00 AM to 12:30 PM
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" });
      timeList.push({ time: i + ":30 AM" });
    }

    // Generate PM time slots from 1:00 PM to 6:30 PM
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: i + ":00 PM" });
      timeList.push({ time: i + ":30 PM" });
    }

    setTimeSlot(timeList);
  };

  const isPastDay = (date) => {
    const today = new Date();
    return date < today;
  };
  const handleBookAppointment = () => {
    const data = {
      data: {
        patientName: user.given_name + " " + user.family_name,
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        patientEmail: user.email,
        doctorEmail: doctor.email,
        appointmentDate: date,
        appointmentTime: selectedTimeSlot,
      },
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment`, data)
      .then((res) => {
        console.log(res);
        if (res) {
          axios
            
            .post("https://healthily-user.vercel.app/api/sendEmail", data)
            .then((res) => {
              console.log(res);
            });
          toast("Appointment Booked Successfully");
          setSelectedTimeSlot(null);
        }
      });
  };
 
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-primary mt-10 flex">Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="md:m-0 m-5">
        <DialogHeader>
          <DialogTitle className="text-center text-slate-600">
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
                {/* Calender */}
                <div className="flex flex-col items-baseline gap-3">
                  <h2 className="flex gap-2 items-center">
                    <CalendarDays className="text-primary h-5 w-5" />
                    Select Day
                  </h2>
                  <div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={isPastDay}
                      className="rounded-md border-2 shadow-lg"
                    />
                  </div>
                </div>
                {/* Time Slot */}
                <div className="mt-3 md:mt-0">
                  <h2 className="flex gap-2 items-center mb-3">
                    <Clock className="text-primary h-5 w-5" />
                    Select Time Slot
                  </h2>
                  <div
                    className="grid grid-cols-3 gap-2 border-2 rounded-lg p-4
                   shadow-lg"
                  >
                    {timeSlot?.map((item, index) => (
                      <h2
                        className={`p-2 border-2 rounded-full hover:text-white hover:bg-primary text-center cursor-pointer ${
                          item.time == selectedTimeSlot
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedTimeSlot(item.time)}
                      >
                        {item.time}
                      </h2>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border-red-500"
            >
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!(date && selectedTimeSlot)}
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;
