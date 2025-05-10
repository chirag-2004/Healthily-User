// "use client";
// import React from "react";
// import RoomPage from "./RoomPage";

// export default function RoomPageClient({ roomId }) {
//   return (
//     <div>
//       <RoomPage roomId={roomId} />
//     </div>
//   );
// }



// File: app/_components/RoomPageClient.jsx

"use client";
import React from "react";
import RoomPage from "./RoomPage"; // Assuming RoomPage.jsx is in the same _components folder

export default function RoomPageClient({ roomId , userRole  }) { // userRole would be received if passed from page.js
  return (
    <div>
      <RoomPage roomId={roomId} userRole={userRole} />
    </div>
  );
}