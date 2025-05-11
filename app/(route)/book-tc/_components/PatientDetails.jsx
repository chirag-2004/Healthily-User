// "use client";
// import React, { useState, useEffect, useRef } from "react"; // Added useRef
// import axios from "axios";
// import Link from "next/link";
// import {
//   Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog";
// import { PacmanLoader } from "react-spinners";
// import { Button } from "@/components/ui/button";
// import io from "socket.io-client";
// import { toast } from "sonner";

// const specialtyList = [
//   "Dental", "Ortho", "Derma", "Patho", "Pedo", "Physiotherapy", "General Physician",
//   "Dietician", "Gyane", "Psychiatry", "Cardio", "Neuro", "Urology", "Pulmonologist",
//   "General Surgeon", "Radiology", "Hair Transplant Clinics", "Plastic Surgeon",
//   "Ayurveda", "Homeopathy", "Eye", "ENT", "Primary Healthcare Centres",
//   "Yoga Instructors", "Pharmacy", "Diagnostic Centres", "Associate", "RMP",
// ];

// const PatientDetails = () => {
//   const [socket, setSocket] = useState(null);
//   const socketRef = useRef(null); // Use ref to hold socket for stable listeners

//   const initialFormData = {
//     name: "", age: "", gender: "", phone: "", specialization: "", place: "",
//   };
//   const initialQrFormData = { phoneNumber: "", transactionId: "" };

//   const [qrFormData, setQrFormData] = useState(initialQrFormData);
//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(false);
//   const [currentRoomIdForPatient, setCurrentRoomIdForPatient] = useState(null); // Renamed for clarity
//   const [showDialog, setShowDialog] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [buttonEnabled, setButtonEnabled] = useState(false);
//   const [meetingUrl, setMeetingUrl] = useState("");
//   const [paymentOptions, setPaymentOptions] = useState(false);
//   const [updates, setUpdates] = useState([]); // For webhook updates

//   useEffect(() => {
//     const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
//       transports: ['websocket', 'polling'] // Explicitly define transports
//     });
//     setSocket(newSocket);
//     socketRef.current = newSocket; // Store in ref

//     newSocket.on("connect", () => {
//       console.log("Patient Client: Socket connected successfully. ID:", newSocket.id);
//     });

//     newSocket.on("disconnect", (reason) => {
//       console.log("Patient Client: Socket disconnected. Reason:", reason);
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("Patient Client: Socket connection error.", err);
//       toast.error("Connection issue. Trying to reconnect...");
//     });

//     // Listeners that depend on currentRoomIdForPatient should be in a separate useEffect or managed carefully
//     // For now, keeping them here, but they'll re-bind if currentRoomIdForPatient changes, which is fine.

//     newSocket.on("update", (data) => {
//       console.log("Patient Client: Webhook Update received:", data);
//       setUpdates((prev) => [...prev, data]);
//     });

//     newSocket.on("appointment-status-updated", ({ appointmentId, status, userId, appointmentData }) => {
//       console.log(`Patient Client: Appointment ${appointmentId} status: ${status} by ${userId}. Current patient room ID: ${currentRoomIdForPatient}`);
//       // Check against the roomId that was active when this patient booked
//       if (currentRoomIdForPatient === appointmentId) {
//         if (status === "declined") {
//           toast.error(`Your appointment request for ${appointmentData?.name || 'patient'} was declined.`);
//           setShowDialog(false); // Close the waiting dialog
//           setCurrentRoomIdForPatient(null); // Reset
//         } else if (status === "accepted") {
//           toast.success(`Your appointment for ${appointmentData?.name || 'patient'} has been accepted!`);
//           // The dialog is already open, patient just needs to click "Join"
//         }
//       }
//     });

//     newSocket.on("booking-error", ({ message }) => {
//       toast.error(`Booking Error: ${message}`);
//       setLoading(false);
//       setShowDialog(false); // Close dialog if there's a booking error from server
//       setCurrentRoomIdForPatient(null); // Reset
//     });
    
//     newSocket.on("appointment-expired", ({ appointmentId, message }) => {
//         console.log(`Patient Client: Appointment ${appointmentId} expired. Current patient room ID: ${currentRoomIdForPatient}`);
//         if (currentRoomIdForPatient === appointmentId) {
//             toast.warn(message || `Your appointment request for ${appointmentId} has expired.`);
//             setShowDialog(false);
//             setCurrentRoomIdForPatient(null);
//         }
//     });


//     return () => {
//       console.log("Patient Client: Cleaning up socket connection.");
//       newSocket.disconnect();
//       socketRef.current = null;
//     };
//   }, []); // currentRoomIdForPatient removed from deps, listeners are general or use ref/state

//   // Separate useEffect for listeners that specifically depend on currentRoomIdForPatient if needed,
//   // or ensure logic inside listeners correctly checks against the state value of currentRoomIdForPatient.
//   // The current setup should be okay as long as currentRoomIdForPatient is updated correctly.

//   useEffect(() => {
//     let interval;
//     if (showDialog) {
//       setTimer(30); // Reset timer each time dialog shows
//       setButtonEnabled(false); // Disable button initially
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev > 1) return prev - 1;
//           clearInterval(interval);
//           setButtonEnabled(true); // Enable button when timer hits 0
//           return 0;
//         });
//       }, 1000);
//     } else {
//         // Clear timer and reset button if dialog is closed prematurely
//         setTimer(30);
//         setButtonEnabled(false);
//     }
//     return () => clearInterval(interval); // Cleanup interval
//   }, [showDialog]);


//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [id]: value }));
//   };

//   const handleQrChange = (e) => {
//     const { id, value } = e.target;
//     setQrFormData((prevData) => ({ ...prevData, [id]: value }));
//   };

//   const handleQrSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Use the socket from the ref for stability if preferred, or from state
//     const currentSocket = socketRef.current || socket;

//     if (!currentSocket || !currentSocket.connected) {
//         toast.error("Not connected to server. Please wait a moment or refresh and try again.");
//         console.error("Patient Client: Attempted to submit QR but socket is not connected or null.", currentSocket);
//         setLoading(false);
//         return;
//     }

//     if (!qrFormData.phoneNumber || !qrFormData.transactionId) {
//       toast.error("All QR payment fields are required!");
//       setLoading(false);
//       return;
//     }

//     const patientDataForSubmission = {
//       ...formData,
//       age: parseInt(formData.age, 10),
//       // phone is already a string
//     };

//     if (isNaN(patientDataForSubmission.age)) {
//       toast.error("Invalid age. Please enter a number.");
//       setLoading(false);
//       return;
//     }
//     if (!/^\d{10}$/.test(patientDataForSubmission.phone)) {
//       toast.error("Phone number must be 10 digits.");
//       setLoading(false);
//       return;
//     }

//     const newRoomId = patientDataForSubmission.phone.toString();
//     setCurrentRoomIdForPatient(newRoomId); // Set this patient's active room ID
//     setMeetingUrl(`/Room/${newRoomId}`);

//     try {
//       // These HTTP requests are independent of the socket booking itself
//       // but are part of your business logic.
//       console.log("Patient Client: Submitting QR payment details:", qrFormData);
//       await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/qr`, qrFormData);
//       toast.success("QR Payment Details Submitted");

//       console.log("Patient Client: Submitting patient form data:", { data: patientDataForSubmission });
//       await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient`, { data: patientDataForSubmission });
//       toast.success("Patient Form Submitted");

//       // CRUCIAL: Emit 'appointment-booked'
//       console.log("Patient Client: Emitting 'appointment-booked' with data:", { data: patientDataForSubmission });
//       currentSocket.emit("appointment-booked", { data: patientDataForSubmission });
//       // No immediate confirmation here, relies on server's 'appointment-status-updated' or 'booking-error'

//       setQrFormData(initialQrFormData);
//       // setFormData(initialFormData); // Optionally clear main form after successful booking intent
//       setPaymentOptions(false); // Close QR dialog
//       setShowDialog(true);      // Show waiting dialog
//     } catch (error) {
//       console.error("Patient Client: Error in QR submission process:", error);
//       const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
//       toast.error(errorMessage);
//       setCurrentRoomIdForPatient(null); // Reset room ID on error
//       setMeetingUrl("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     // Basic client-side validation
//     if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.specialization || !formData.place) {
//       toast.error("Please fill all required patient details.");
//       return;
//     }
//     if (!/^\d{10}$/.test(formData.phone)) {
//       toast.error("Phone number must be 10 digits.");
//       return;
//     }
//     if (isNaN(parseInt(formData.age, 10)) || parseInt(formData.age, 10) <= 0) {
//         toast.error("Please enter a valid age.");
//         return;
//     }
//     setPaymentOptions(true); // Proceed to show QR payment dialog
//   };

//   // For webhook updates, not directly related to appointment list on dashboard
//   const hasCompletedConsultation = updates.some(
//     (update) => update.triggered_action === "Completed" && update.custom_order_id === currentRoomIdForPatient
//   );

//   return (
//     <section className="bg-gray-100 min-h-screen">
//       {/* ... (Your existing JSX for the form) ... */}
//       {/* Ensure all form inputs correctly use `id`, `value`, and `onChange` as in your original code */}
//       {/* I will paste your JSX back here for completeness but without repeating all of it. */}
//       {/* The main logic changes are in the useEffect and handler functions above. */}
      
//       <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold text-center mb-10">
//           Fill Patient <span className="text-primary">Details</span>
//         </h1>
//         <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
//           <div className="lg:col-span-2 lg:py-12 hidden lg:block">
//             <p className="max-w-xl text-lg">
//               We believe that access to quality healthcare should be
//               seamless, efficient, and instant. Our mission is to bridge the gap
//               between those seeking medical attention and qualified healthcare
//               professionals, ensuring timely support and care.
//             </p>
//             <div className="mt-8">
//               <a href="#" className="text-2xl font-bold text-primary">
//                {/* Optional: Contact number or link */}
//               </a>
//             </div>
//           </div>

//           <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
//             <form className="space-y-4" onSubmit={handleFormSubmit}>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="name">Name</label>
//                 <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Name" type="text" id="name" value={formData.name} onChange={handleChange} required />
//               </div>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="age">Age</label>
//                 <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Age" type="number" id="age" value={formData.age} onChange={handleChange} required />
//               </div>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="phone">Phone</label>
//                 <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Phone Number (10 digits)" type="tel" id="phone" pattern="[0-9]{10}" title="Please enter a 10-digit phone number" value={formData.phone} onChange={handleChange} required />
//               </div>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="gender">Gender</label>
//                 <select className="w-full rounded-lg border-gray-200 p-3 text-sm text-gray-500" id="gender" value={formData.gender} onChange={handleChange} required >
//                   <option value="">Select Gender</option> <option value="M">Male</option> <option value="F">Female</option> <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="specialization">Specialization</label>
//                 <select className="w-full rounded-lg border-gray-200 p-3 text-sm text-gray-500" id="specialization" value={formData.specialization} onChange={handleChange} required >
//                   <option value="">Select Specialization</option>
//                   {specialtyList.map((specialty, index) => (<option key={index} value={specialty}>{specialty}</option>))}
//                 </select>
//               </div>
//               <div className="border-2 rounded-md focus-within:border-primary">
//                 <label className="sr-only" htmlFor="place">Place</label>
//                 <input className="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="City/Place" type="text" id="place" value={formData.place} onChange={handleChange} required />
//               </div>
//               <Button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90" disabled={loading}>
//                 {loading ? "Processing..." : "Proceed to Payment"}
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {paymentOptions && (
//         <Dialog open={paymentOptions} onOpenChange={setPaymentOptions}>
//           <DialogContent className="sm:max-w-[425px] p-6">
//             <DialogHeader><DialogTitle className="text-center text-xl">Pay with QR</DialogTitle></DialogHeader>
//             <div className="flex flex-col gap-6 pt-4">
//               <form className="flex flex-col gap-4 justify-center" onSubmit={handleQrSubmit}>
//                 <img src="/mgood-qr.jpg" alt="QR Code for healthily" className="w-40 h-40 mx-auto border rounded-md" />
//                 <p className="text-center text-sm text-gray-600">Scan QR to pay. Then fill payment details below.</p>
//                 <input type="tel" id="phoneNumber" placeholder="Phone used for Payment (10 digits)" pattern="[0-9]{10}" value={qrFormData.phoneNumber} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
//                 <input type="text" id="transactionId" placeholder="UPI Transaction ID / Reference ID" value={qrFormData.transactionId} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
//                 <Button type="submit" className="bg-primary text-white text-lg py-2.5 rounded-lg hover:bg-primary/90 disabled:bg-gray-400" disabled={loading}>
//                   {loading ? "Submitting..." : "Submit Payment Details"}
//                 </Button>
//               </form>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {showDialog && (
//         <Dialog open={showDialog} onOpenChange={(isOpen) => { if (!isOpen) { setShowDialog(false); setCurrentRoomIdForPatient(null); setMeetingUrl("");} else setShowDialog(true); }}>
//           <DialogContent className="sm:max-w-md p-6">
//             <DialogHeader><DialogTitle className="text-center text-xl">Starting Consultation</DialogTitle></DialogHeader>
//             <div className="pt-4 text-center flex flex-col gap-8 font-body text-base">
//               {timer > 0 && (
//                 <>
//                   <p>Please wait while we connect you. Your consultation will begin shortly.</p>
//                   <div className="flex justify-center my-4"><PacmanLoader color="#1CAC78" size={25} /></div>
//                 </>
//               )}
//               <div className="text-lg font-semibold">
//                 {timer > 0 ? `Waiting for doctor: ${timer}s` : "Ready to Join!"}
//               </div>
//               {meetingUrl && (
//                 <div className="flex flex-col gap-4 mt-2">
//                   <Link href={meetingUrl} target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
//                     <Button as="a" className={`w-full text-lg px-6 py-3 rounded-lg ${buttonEnabled && meetingUrl ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-400 cursor-not-allowed"}`} disabled={!buttonEnabled || !meetingUrl}>
//                       Join Consultation
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//               {!meetingUrl && timer <= 0 && (<p className="text-red-500 font-semibold">Room setup error. Please try again or contact support.</p>)}
//             </div>
//             <DialogFooter className="mt-6 items-center justify-between">
//               {hasCompletedConsultation && (<Button onClick={() => {setShowDialog(false); setCurrentRoomIdForPatient(null);}} variant="outline">Consultation Completed</Button>)}
//               <Button onClick={() => {setShowDialog(false); setCurrentRoomIdForPatient(null);}} variant="ghost">Close</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </section>
//   );
// };

// export default PatientDetails;





"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import { toast } from "sonner";

const specialtyList = [
  "Dental", "Ortho", "Derma", "Patho", "Pedo", "Physiotherapy", "General Physician",
  "Dietician", "Gyane", "Psychiatry", "Cardio", "Neuro", "Urology", "Pulmonologist",
  "General Surgeon", "Radiology", "Hair Transplant Clinics", "Plastic Surgeon",
  "Ayurveda", "Homeopathy", "Eye", "ENT", "Primary Healthcare Centres",
  "Yoga Instructors", "Pharmacy", "Diagnostic Centres", "Associate", "RMP",
];

const PatientDetails = () => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const initialFormData = {
    name: "", age: "", gender: "", phone: "", specialization: "", place: "",
  };
  const initialQrFormData = { phoneNumber: "", transactionId: "" };

  const [qrFormData, setQrFormData] = useState(initialQrFormData);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  
  // Initialize currentRoomIdForPatient from sessionStorage
  const [currentRoomIdForPatient, setCurrentRoomIdForPatient] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('activePatientRoomId') || null;
    }
    return null;
  });

  const [showDialog, setShowDialog] = useState(false);
  const [timer, setTimer] = useState(30); // Timer for enabling "Join" button
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [paymentOptions, setPaymentOptions] = useState(false);
  const [updates, setUpdates] = useState([]);

  const clearActiveRoom = () => {
    console.log("Patient Client: Clearing active room data.");
    setCurrentRoomIdForPatient(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('activePatientRoomId');
    }
    setMeetingUrl("");
    setShowDialog(false); // Ensure dialog is closed
  };

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Patient Client: Socket connected. ID:", newSocket.id);
      // If there's an active room ID from session storage, patient might be rejoining a wait
      const sessionRoomId = typeof window !== 'undefined' ? sessionStorage.getItem('activePatientRoomId') : null;
      if (sessionRoomId) {
          console.log("Patient Client: Found active room ID in session on connect:", sessionRoomId);
          setCurrentRoomIdForPatient(sessionRoomId); // Ensure state is synced
          setMeetingUrl(`/Room/${sessionRoomId}`); // Re-set meeting URL
          // Decide if dialog should show based on other factors or if appointment is still pending server-side
          // For simplicity, we're not auto-re-showing dialog here on reconnect,
          // but the `currentRoomIdForPatient` is set for receiving status updates.
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Patient Client: Socket disconnected. Reason:", reason);
    });
    newSocket.on("connect_error", (err) => console.error("Patient Client: Socket connection error.", err));

    newSocket.on("update", (data) => setUpdates((prev) => [...prev, data]));

    newSocket.on("appointment-status-updated", ({ appointmentId, status, userId, appointmentData }) => {
      const activeRoomId = typeof window !== 'undefined' ? sessionStorage.getItem('activePatientRoomId') : currentRoomIdForPatient;
      console.log(`Patient Client: Received 'appointment-status-updated'. Event appointmentId: ${appointmentId}, status: ${status}. Patient's activeRoomId (from session/state): ${activeRoomId}`);
      
      if (activeRoomId === appointmentId) {
        if (status === "declined") {
          toast.error(`Your appointment request for ${appointmentData?.name || 'patient'} was declined.`);
          clearActiveRoom();
        } else if (status === "accepted") {
          toast.success(`Your appointment for ${appointmentData?.name || 'patient'} has been accepted!`);
          // Dialog should already be open, patient can now join
          // No need to clearActiveRoom here as they are proceeding.
        }
      } else {
        console.warn(`Patient Client: Received status update for ${appointmentId}, but current patient room is ${activeRoomId}. Ignoring for UI, but logging.`);
      }
    });

    newSocket.on("booking-error", ({ message }) => {
      toast.error(`Booking Error: ${message}`);
      setLoading(false);
      clearActiveRoom();
    });
    
    newSocket.on("appointment-expired", ({ appointmentId, message }) => {
      const activeRoomId = typeof window !== 'undefined' ? sessionStorage.getItem('activePatientRoomId') : currentRoomIdForPatient;
      console.log(`Patient Client: Received 'appointment-expired' for ${appointmentId}. Patient's activeRoomId: ${activeRoomId}`);
      if (activeRoomId === appointmentId) {
          toast.warn(message || `Your appointment request for ${appointmentId} has expired.`);
          clearActiveRoom();
      }
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, []); // Dependencies should ideally be minimal for the main socket setup.

  useEffect(() => {
    let interval;
    if (showDialog && currentRoomIdForPatient) { // Only start timer if dialog is shown for an active room
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
    } else {
        setTimer(30);
        setButtonEnabled(false);
        if(interval) clearInterval(interval); // Clear interval if dialog closes or no active room
    }
    return () => clearInterval(interval);
  }, [showDialog, currentRoomIdForPatient]);


  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleQrChange = (e) => setQrFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleQrSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const currentSocket = socketRef.current;

    if (!currentSocket || !currentSocket.connected) {
      toast.error("Not connected. Please wait or refresh.");
      setLoading(false); return;
    }
    if (!qrFormData.phoneNumber || !qrFormData.transactionId) {
      toast.error("All QR fields are required!");
      setLoading(false); return;
    }
    const patientDataForSubmission = { ...formData, age: parseInt(formData.age, 10) };
    if (isNaN(patientDataForSubmission.age) || !/^\d{10}$/.test(patientDataForSubmission.phone)) {
      toast.error("Invalid age or phone (10 digits).");
      setLoading(false); return;
    }

    const newRoomId = patientDataForSubmission.phone.toString();
    setCurrentRoomIdForPatient(newRoomId);
    if (typeof window !== 'undefined') sessionStorage.setItem('activePatientRoomId', newRoomId);
    setMeetingUrl(`/Room/${newRoomId}`);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/qr`, qrFormData);
      toast.success("QR Payment Submitted");
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient`, { data: patientDataForSubmission });
      toast.success("Patient Form Submitted");

      console.log("Patient Client: Emitting 'appointment-booked' with data:", { data: patientDataForSubmission });
      currentSocket.emit("appointment-booked", { data: patientDataForSubmission });
      
      setQrFormData(initialQrFormData);
      setPaymentOptions(false);
      setShowDialog(true); // Show waiting dialog
    } catch (error) {
      console.error("Patient Client: Error in QR submission:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred.");
      clearActiveRoom();
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.specialization || !formData.place) {
      toast.error("Please fill all patient details."); return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits."); return;
    }
    if (isNaN(parseInt(formData.age, 10)) || parseInt(formData.age, 10) <= 0) {
        toast.error("Please enter a valid age."); return;
    }
    setPaymentOptions(true);
  };

  const hasCompletedConsultation = updates.some(
    (update) => update.triggered_action === "Completed" && update.custom_order_id === (typeof window !== 'undefined' ? sessionStorage.getItem('activePatientRoomId') : currentRoomIdForPatient)
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
              We believe that access to quality healthcare should be
              seamless, efficient, and instant. Our mission is to bridge the gap
              between those seeking medical attention and qualified healthcare
              professionals, ensuring timely support and care.
            </p>
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
                <img src="/mgood-qr.jpg" alt="QR Code for healthily" className="w-40 h-40 mx-auto border rounded-md" />
                <p className="text-center text-sm text-gray-600">Scan QR to pay. Then fill payment details below.</p>
                <input type="tel" id="phoneNumber" placeholder="Phone used for Payment (10 digits)" pattern="[0-9]{10}" value={qrFormData.phoneNumber} onChange={handleQrChange} className="border bg-slate-100 rounded-md p-2.5 text-sm focus:ring-primary focus:border-primary" required />
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
        <Dialog open={showDialog} onOpenChange={(isOpen) => { if (!isOpen) clearActiveRoom(); else setShowDialog(true); }}>
          <DialogContent className="sm:max-w-md p-6">
            <DialogHeader><DialogTitle className="text-center text-xl">Starting Consultation</DialogTitle></DialogHeader>
            <div className="pt-4 text-center flex flex-col gap-8 font-body text-base">
              {timer > 0 && !buttonEnabled && ( // Show loader only if timer is running AND button isn't enabled yet
                <>
                  <p>Please wait, connecting you to the doctor...</p>
                  <div className="flex justify-center my-4"><PacmanLoader color="#1CAC78" size={25} /></div>
                </>
              )}
              <div className="text-lg font-semibold">
                {timer > 0 && !buttonEnabled ? `Waiting for doctor: ${timer}s` : "Ready to Join!"}
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
              {hasCompletedConsultation && (<Button onClick={clearActiveRoom} variant="outline">Consultation Completed</Button>)}
              <Button onClick={clearActiveRoom} variant="ghost">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default PatientDetails;