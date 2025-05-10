// // import React, { useState } from "react";

// import RoomPageClient from "../_components/RoomPageClient";

// const Page = async ({ params }) => {
  

//   const roomId = params.roomId;
//   return (
//     <div>
//       <RoomPageClient roomId={roomId} />
//     </div>
//   );
// };

// export default Page;



// File: app/Room/[roomId]/page.js
// (Assuming PatientDetails component links to /Room/someRoomId)

import RoomPageClient from "../_components/RoomPageClient"; // Adjust path if needed

const Page = async ({ params }) => {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;

  if (!roomId) {
    // This is a good fallback, though Next.js routing should ensure params.roomId exists if the route matches
    return <div>Error: Room ID is missing from URL.</div>;
  }

  return (
    <div>
      {/* 
        For the patient side, you might explicitly pass a userRole or let RoomPage default.
        If RoomPage defaults the userName to something generic or "Patient", this is fine.
      */}
      <RoomPageClient roomId={roomId}  userRole="patient"  />
    </div>
  );
};

export default Page;