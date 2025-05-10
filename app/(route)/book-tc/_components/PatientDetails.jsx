"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"; // Adjust path to your ShadCN Dialog
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button"; // Adjust path to your ShadCN Button
import io from "socket.io-client";
import { toast } from "sonner"; // Assuming you've installed and set up sonner

const specialtyList = [
  "Dental", "Ortho", "Derma", "Patho", "Pedo", "Physiotherapy", "General Physician",
  "Dietician", "Gyane", "Psychiatry", "Cardio", "Neuro", "Urology", "Pulmonologist",
  "General Surgeon", "Radiology", "Hair Transplant Clinics", "Plastic Surgeon",
  "Ayurveda", "Homeopathy", "Eye", "ENT", "Primary Healthcare Centres",
  "Yoga Instructors", "Pharmacy", "Diagnostic Centres", "Associate", "RMP",
];

const PatientDetails = () => {
  const [socket, setSocket] = useState(null);

  const initialFormData = {
    name: "", age: "", gender: "", phone: "", specialization: "", place: "", mgoodId: "",
  };
  const initialQrFormData = { phoneNumber: "", mgoodId: "", transactionId: "" };

  const [qrFormData, setQrFormData] = useState(initialQrFormData);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [timer, setTimer] = useState(30);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [paymentOptions, setPaymentOptions] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    setSocket(newSocket);

    newSocket.on("update", (data) => {
      console.log("Patient: Webhook Update received:", data);
      setUpdates((prev) => [...prev, data]);
    });

    newSocket.on("appointment-status-updated", ({ appointmentId, status, userId }) => {
        console.log(`Patient: Appointment ${appointmentId} status: ${status} by ${userId}`);
        if (roomId === appointmentId) {
            if (status === "declined") {
                toast.error("Your appointment request was declined.");
                setShowDialog(false);
            } else if (status === "accepted") {
                toast.success("Your appointment has been accepted!");
                // Patient is already in the dialog, waiting for the join button
            }
        }
    });

    newSocket.on("booking-error", ({ message }) => {
        toast.error(`Booking Error: ${message}`);
        setLoading(false); // Unlock form if booking failed on server
    });


    return () => {
      newSocket.disconnect();
    };
  }, [roomId]); // Add roomId to deps because the listener for status updates depends on it.

  useEffect(() => {
    let interval;
    if (showDialog) {
      setTimer(30);
      setButtonEnabled(false);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(interval);
          setButtonEnabled(true);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showDialog]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleQrChange = (e) => {
    const { id, value } = e.target;
    setQrFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleQrSubmit = async (e) => {
    e.preventDefault();
    if (!socket) {
        toast.error("Connection error. Please refresh and try again.");
        setLoading(false);
        return;
    }
    setLoading(true);

    if (!qrFormData.phoneNumber || !qrFormData.mgoodId || !qrFormData.transactionId) {
      toast.error("All QR payment fields are required!");
      setLoading(false);
      return;
    }

    const patientDataForSubmission = {
      ...formData, // name, age, gender, phone, specialization, place, mgoodId
      age: parseInt(formData.age, 10),
      // phone is already a string from input, which is fine for roomId
    };

    if (isNaN(patientDataForSubmission.age) || !/^\d{10}$/.test(patientDataForSubmission.phone)) {
      toast.error("Invalid age or phone number (must be 10 digits).");
      setLoading(false);
      return;
    }

    const currentRoomId = patientDataForSubmission.phone.toString();
    setRoomId(currentRoomId); // Set for this patient's context

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/qr`, qrFormData);
      toast.success("QR Payment Details Submitted Successfully");

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient`, { data: patientDataForSubmission });
      toast.success("Patient Form Submitted Successfully");

      setMeetingUrl(`/Room/${currentRoomId}`); // Relative URL for Next.js App Router

      // Crucial: Emit 'appointment-booked' with the patient's data nested under 'data'
      socket.emit("appointment-booked", { data: patientDataForSubmission });
      console.log("Patient: Emitted 'appointment-booked' with data:", { data: patientDataForSubmission });

      setQrFormData(initialQrFormData);
      // setFormData(initialFormData); // Optionally clear main form
      setPaymentOptions(false);
      setShowDialog(true);
    } catch (error) {
      console.error("Error in QR submission process:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.specialization || !formData.place ) {
      toast.error("Please fill all required patient details.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }
    setPaymentOptions(true);
  };

  const hasCompletedConsultation = updates.some(
    (update) => update.triggered_action === "Completed" && update.custom_order_id === roomId
  );

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-10">
          Fill Patient <span className="text-primary">Details</span>
        </h1>
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12 hidden lg:block">
            <p className="max-w-xl text-lg">
              we believe that access to quality healthcare should be
              seamless, efficient, and instant. Our mission is to bridge the gap
              between those seeking medical attention and qualified healthcare
              professionals, ensuring timely support and care.
            </p>
            <div className="mt-8">
              <a href="" className="text-2xl font-bold text-primary">
               
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="name">Name</label>
                <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Name" type="text" id="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="age">Age</label>
                <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Age" type="number" id="age" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="phone">Phone</label>
                <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Phone Number (10 digits)" type="tel" id="phone" pattern="[0-9]{10}" title="Please enter a 10-digit phone number" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="gender">Gender</label>
                <select className="w-full rounded-lg border-gray-200 p-3 text-sm text-gray-500" id="gender" value={formData.gender} onChange={handleChange} required >
                  <option value="">Select Gender</option> <option value="M">Male</option> <option value="F">Female</option> <option value="Other">Other</option>
                </select>
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="specialization">Specialization</label>
                <select className="w-full rounded-lg border-gray-200 p-3 text-sm text-gray-500" id="specialization" value={formData.specialization} onChange={handleChange} required >
                  <option value="">Select Specialization</option>
                  {specialtyList.map((specialty, index) => (<option key={index} value={specialty}>{specialty}</option>))}
                </select>
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="mgoodId">Mgood ID (Patient)</label>
                <input className="w-full rounded-lg border-gray-200 p-3 text-sm" id="mgoodId" placeholder="Patient's MgoodId (optional)" value={formData.mgoodId} onChange={handleChange} />
              </div>
              <div className="border-2 rounded-md focus-within:border-primary">
                <label className="sr-only" htmlFor="place">Place</label>
                <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="City/Place" type="text" id="place" value={formData.place} onChange={handleChange} required />
              </div>
              <Button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90" disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {paymentOptions && (
        <Dialog open={paymentOptions} onOpenChange={setPaymentOptions}>
          <DialogContent className="sm:max-w-[425px] p-6">
            <DialogHeader><DialogTitle className="text-center text-xl">Pay with QR</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-6 pt-4">
              <form className="flex flex-col gap-4 justify-center" onSubmit={handleQrSubmit}>
                <img src="/mgood-qr.jpg" alt="QR Code for MGood Payment" className="w-40 h-40 mx-auto border rounded-md" />
                <p className="text-center text-sm text-gray-600">Scan QR to pay. Then fill payment details below.</p>
                <input type="tel" id="phoneNumber" placeholder="Phone used for Payment (10 digits)" pattern="[0-9]{10}" value={qrFormData.phoneNumber} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
                <input type="text" id="mgoodId" placeholder="Your MgoodId (Clinic/User)" value={qrFormData.mgoodId} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
                <input type="text" id="transactionId" placeholder="UPI Transaction ID / Reference ID" value={qrFormData.transactionId} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
                <Button type="submit" className="bg-primary text-white text-lg py-2.5 rounded-lg hover:bg-primary/90 disabled:bg-gray-400" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Payment Details"}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={(isOpen) => { if (!isOpen) setShowDialog(false); else setShowDialog(true); }}>
          <DialogContent className="sm:max-w-md p-6">
            <DialogHeader><DialogTitle className="text-center text-xl">Starting Consultation</DialogTitle></DialogHeader>
            <div className="pt-4 text-center flex flex-col gap-8 font-body text-base">
              {timer > 0 && (
                <>
                  <p>Please wait while we connect you. Your consultation will begin shortly.</p>
                  <div className="flex justify-center my-4"><PacmanLoader color="#1CAC78" size={25} /></div>
                </>
              )}
              <div className="text-lg font-semibold">
                {timer > 0 ? `Time remaining: ${timer} seconds` : "Ready to Join!"}
              </div>
              {meetingUrl && (
                <div className="flex flex-col gap-4 mt-2">
                  <Link href={meetingUrl} target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
                    <Button as="a" className={`w-full text-lg px-6 py-3 rounded-lg ${buttonEnabled && meetingUrl ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-400 cursor-not-allowed"}`} disabled={!buttonEnabled || !meetingUrl}>
                      Join Consultation
                    </Button>
                  </Link>
                </div>
              )}
              {!meetingUrl && timer <= 0 && (<p className="text-red-500 font-semibold">Room setup error. Please try again or contact support.</p>)}
            </div>
            <DialogFooter className="mt-6 items-center justify-between">
              {hasCompletedConsultation && (<Button onClick={() => setShowDialog(false)} variant="outline">Consultation Completed</Button>)}
              <Button onClick={() => setShowDialog(false)} variant="ghost">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default PatientDetails;