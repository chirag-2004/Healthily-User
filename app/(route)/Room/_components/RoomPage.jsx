// // File: ../_components/RoomPage.jsx (or similar path, where RoomPageClient imports it from)

// "use client"; // This component uses client-side hooks (useEffect, useRef) and third-party libraries.

// import React, { useEffect, useRef } from "react";
// import { useRouter } from 'next/navigation'; // FOR NAVIGATION

// // ZegoUIKitPrebuilt can be imported directly or dynamically.
// // If direct import causes SSR issues, dynamic import is preferred.
// // import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// const RoomPage = ({ roomId: propRoomId }) => { // Renamed prop to avoid confusion with any local var
//   const router = useRouter(); // For programmatic navigation (e.g., onLeaveRoom)
//   const meetingRef = useRef(null);

//   useEffect(() => {
//     // Use propRoomId directly.
//     if (!propRoomId || !meetingRef.current) {
//       console.log("RoomPage useEffect: Waiting for propRoomId or meetingRef.", { propRoomId, meetingRefCurrent: !!meetingRef.current });
//       return;
//     }

//     const initMeeting = async () => {
//       console.log("RoomPage: Initializing meeting for propRoomId:", propRoomId);
//       try {
//         // Dynamically import ZegoUIKitPrebuilt. This is generally safer for client-side only libraries.
//         const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

//         const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID);
//         const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SECRET;

//         if (!appID || !serverSecret) {
//           console.error("ZegoCloud App ID or Server Secret is missing from environment variables.");
//           alert("Video service configuration error. Please contact support.");
//           return;
//         }

//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           propRoomId.toString(),   // Use the roomId from props
//           Date.now().toString(),   // User ID: can be random, unique per user in room
//           "Paitent"          // User Name (can be dynamic if you pass user info)
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);

//         zp.joinRoom({
//           container: meetingRef.current,
//           scenario: {
//             mode: ZegoUIKitPrebuilt.OneONoneCall,
//           },
//           showScreenSharingButton: true,
//           showLeavingView: true, // Set to true if you want Zego's default leaving view
//           onLeaveRoom: () => {
//             // Use the router from next/navigation to redirect
//             router.push("/"); // Or any other appropriate page
//           },
//           // sharedLinks: [ // Optional: if you want a copy link button in the Zego UI
//           //   {
//           //     name: 'Copy Link',
//           //     url: window.location.href,
//           //   },
//           // ],
//         });
//       } catch (error) {
//         console.error("Failed to initialize ZegoCloud meeting:", error);
//         alert("Could not start the video call. Please try again or contact support.");
//       }
//     };

//     initMeeting();

//     // Optional: Cleanup if needed, though ZegoUIKitPrebuilt often handles its own cleanup
//     // return () => {
//     //   // If you stored the zp instance, you might call zp.destroy() or similar here
//     // };

//   }, [propRoomId, router]); // Add router to dependencies as it's used in onLeaveRoom

//   if (!propRoomId) {
//     // This should ideally not be shown if the Server Component always passes a valid roomId
//     return (
//       <div className="h-screen w-screen flex justify-center items-center text-white bg-gray-800">
//         Loading Room Details...
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-screen bg-gray-50 flex justify-center items-center"> {/* Changed my-auto and object-contain for better full screen */}
//       <div ref={meetingRef} style={{ width: "100vw", height: "100vh" }} />
//     </div>
//   );
// };

// export default RoomPage;



// File: app/_components/RoomPage.jsx

"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

const RoomPage = ({ roomId: propRoomId , userRole }) => { // userRole would be received
  const router = useRouter();
  const meetingRef = useRef(null);

  useEffect(() => {
    if (!propRoomId || !meetingRef.current) {
      console.log("RoomPage (Patient Side) useEffect: Waiting for propRoomId or meetingRef.", { propRoomId, meetingRefCurrent: !!meetingRef.current });
      return;
    }

    let zpInstance = null; // For potential cleanup

    const initMeeting = async () => {
      console.log("RoomPage (Patient Side): Initializing meeting for propRoomId:", propRoomId);
      try {
        const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

        const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SECRET;

        if (!appID || !serverSecret) {
          console.error("ZegoCloud App ID or Server Secret is missing.");
          alert("Video service configuration error. Please contact support.");
          router.push("/"); // Redirect to home
          return;
        }

        const userID = Date.now().toString() + "_patient_" + Math.floor(Math.random() * 1000); // Make userID distinct
        
        // Use the hardcoded "Paitent" or a role-based name
        let userName = "Patient"; // Corrected typo, or use userRole to customize
        // if (userRole === 'patient') {
        //   userName = "Patient " + userID.slice(-4); // Or actual patient name if available
        // } else {
        //   userName = "MGood User " + userID.slice(-4); // Default if no role
        // }
        // Your current code hardcodes "Paitent" (which has a typo). Let's assume you mean "Patient".

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          propRoomId.toString(),
          userID,
          userName // Using the determined userName
        );

        zpInstance = ZegoUIKitPrebuilt.create(kitToken);

        zpInstance.joinRoom({
          container: meetingRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true, // Patient might need to share screen
          showLeavingView: true,
          onLeaveRoom: () => {
            console.log("Patient left ZegoCloud room. Redirecting...");
            router.push("/"); // Redirect patient to home or a "consultation ended" page
          },
          // sharedLinks: [ ... ], // Optional
        });
      } catch (error) {
        console.error("Failed to initialize ZegoCloud meeting (Patient Side):", error);
        alert("Could not start the video call. Please try again or contact support.");
        router.push("/"); // Redirect to home on error
      }
    };

    initMeeting();

    return () => {
      if (zpInstance) {
        // console.log("RoomPage (Patient Side): Cleaning up Zego instance.");
        // zpInstance.destroy(); // Check Zego docs for explicit cleanup if needed
      }
    };

  }, [propRoomId, router , userRole ]); // Add userRole if you use it in this component

  if (!propRoomId) {
    return (
      <div className="h-screen w-screen flex justify-center items-center text-white bg-gray-800">
        Loading Room Details...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center"> {/* Black bg for video */}
      <div ref={meetingRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
};

export default RoomPage;