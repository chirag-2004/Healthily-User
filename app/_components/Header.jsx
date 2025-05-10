// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"; // Assuming this path is correct
// import axios from "axios";

// function Header() {
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [mgoodId, setMgoodId] = useState("");

//   // --- Mock User State (Replace with your actual auth logic) ---
//   // For demonstration, let's assume a simple logged-in state
//   // In a real app, this would come from your auth context/hook or a library
//   const [user, setUser] = useState(null); // null if not logged in, user object if logged in

//   // Example: Simulate login/logout for demo purposes
//   // You would remove this and use your actual auth flow
//   const handleMockLogin = () => {
//     setUser({
//       email: "testuser@example.com",
//       picture: "/profile.jpg", // A default or fetched profile picture
//       // Add other user properties your app might need
//     });
//   };
//   const handleMockLogout = () => {
//     setUser(null);
//     setMgoodId(""); // Clear MgoodId on logout
//   };
//   // --- End Mock User State ---


//   const navLinks = [
//     {
//       id: 1,
//       name: "Home",
//       path: "/",
//     },
//     {
//       id: 3,
//       name: "Teleconsultation",
//       path: "/book-tc", // Assuming PatientDetails is at this path or similar
//     },
//     {
//       id: 4,
//       name: "Prescriptions",
//       path : "/prescriptions"
//     }
//     // You can add more links like Dashboard if relevant for logged-in users
//     // {
//     //   id: 5,
//     //   name: "Dashboard",
//     //   path: "/dashboard" // Path to your admin/doctor dashboard
//     // }
//   ];

//   const handleMenuToggle = () => {
//     setShowMobileMenu(!showMobileMenu);
//   };

//   useEffect(() => {
//     // Fetch MgoodId if user is logged in and has an email
//     if (user && user.email) {
//       axios
//         .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getMgoodId`, {
//           email: user.email,
//         })
//         .then((res) => {
//           setMgoodId(res.data.mgoodId);
//         })
//         .catch((error) => {
//           setMgoodId("Not Found");
//           console.error("Failed to fetch MgoodId:", error.response?.data?.message || error.message);
//         });
//     } else {
//       setMgoodId(""); // Clear MgoodId if no user or no email
//     }
//   }, [user]); // Re-run when the user object changes

//   return (
//     <nav className="p-3 flex justify-between bg-white items-center shadow-sm text-black sticky top-0 z-50">
//       <Link href="/" className="flex items-center gap-2">
//         <Image
//           src="/asset5.jpg" // Make sure this image is in your /public folder
//           className="object-cover" // Removed max-w and max-h for better Image component control
//           width={48} // Example width
//           height={48} // Example height
//           alt="logo"
//         />
//         <span className="text-lg font-medium font-display">MGood</span>
//       </Link>

//       <ul className="hidden md:flex gap-12 font-body font-medium">
//         {navLinks.map((item) => (
//           <Link href={item.path} key={item.id}>
//             <li className="hover:scale-105 ease-in-out hover:text-primary cursor-pointer">
//               {item.name}
//             </li>
//           </Link>
//         ))}
//       </ul>

//       <div className="flex items-center gap-2">
//         {!user ? (
//           <>
//             {/* "Start Teleconsultation" button for non-logged-in users */}
//             <Link href="/book-tc">
//               <button className="text-xs md:text-base flex items-center gap-2 border-2 border-gray-400 hover:bg-primary hover:text-white px-2 md:px-6 py-2 rounded-md font-display">
//                 <span>Start Teleconsultation</span>
//                 <i className="fa-solid fa-phone ml-1 md:ml-0"></i>
//               </button>
//             </Link>
//             {/* TODO: Add your Login button/link here */}
//             {/* <button onClick={handleMockLogin} className="text-xs md:text-base bg-secondary text-white px-4 py-2 rounded-md">
//               Login (Demo)
//             </button> */}
//           </>
//         ) : (
//           <Popover>
//             <PopoverTrigger asChild>
//               <button className="focus:outline-none">
//                 <Image
//                   width={40}
//                   height={40}
//                   src={user.picture || "/profile.jpg"} // Use a default if picture is missing
//                   alt="profile-pic"
//                   className="rounded-full border-2 border-gray-300 hover:border-primary"
//                 />
//               </button>
//             </PopoverTrigger>
//             <PopoverContent className="w-56 mr-4 mt-1"> {/* Adjusted width and margin */}
//               <div className="p-2">
//                 <p className="font-semibold text-sm mb-1 truncate">{user.email}</p>
//                 {mgoodId && <p className="text-xs text-gray-500 mb-2">MgoodId: {mgoodId}</p>}
//                 <hr className="my-2"/>
//                 <ul className="flex flex-col font-display text-sm">
//                   {/* TODO: Update these links to actual paths */}
//                   <Link href="/profile">
//                     <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
//                       My Profile
//                     </li>
//                   </Link>
//                   <Link href="/my-appointments">
//                     <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
//                       My Appointments
//                     </li>
//                   </Link>
//                   {/* Add Dashboard link if applicable for this user role */}
//                   {/* <Link href="/dashboard">
//                     <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
//                       Dashboard
//                     </li>
//                   </Link> */}
//                   <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md text-red-600">
//                     {/* TODO: Implement your actual logout logic */}
//                     <button onClick={handleMockLogout} className="w-full text-left">
//                         Log Out
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </PopoverContent>
//           </Popover>
//         )}

//         <button className="p-2 md:hidden" onClick={handleMenuToggle}>
//           <i className={`fa-solid ${showMobileMenu ? 'fa-xmark' : 'fa-bars'} text-gray-600 text-xl`}></i>
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       <div
//         className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
//           showMobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={handleMenuToggle} // Close menu when clicking overlay
//       />
//       <div
//         className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
//           showMobileMenu ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center mb-4 shadow-sm p-3 border-b">
//           <Link href="/" className="flex items-center gap-2" onClick={handleMenuToggle}>
//             <Image
//               src="/asset5.jpg"
//               width={40}
//               height={40}
//               alt="logo"
//             />
//             <span className="text-lg font-medium font-display">MGood</span>
//           </Link>
//           <button className="p-2" onClick={handleMenuToggle}>
//             <i className="fa-solid fa-xmark text-gray-600 text-xl"></i>
//           </button>
//         </div>
//         <ul className="flex flex-col gap-2 font-body font-medium p-3">
//           {navLinks.map((item) => (
//             <Link href={item.path} key={item.id} onClick={handleMenuToggle}>
//               <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">
//                 {item.name}
//               </li>
//             </Link>
//           ))}
//            {/* Mobile Menu: Auth actions */}
//           {!user ? (
//             <>
//               <hr className="my-2"/>
//               {/* <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">
//                 <button onClick={() => { handleMockLogin(); handleMenuToggle(); }} className="w-full text-left">
//                     Login (Demo)
//                 </button>
//               </li> */}
//             </>
//           ) : (
//             <>
//               <hr className="my-2"/>
//               <Link href="/profile" onClick={handleMenuToggle}>
//                 <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">My Profile</li>
//               </Link>
//               <Link href="/my-appointments" onClick={handleMenuToggle}>
//                 <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">My Appointments</li>
//               </Link>
//               <li className="p-3 text-sm text-gray-500">MgoodId: {mgoodId || "N/A"}</li>
//               <li className="hover:bg-red-500 hover:text-white p-3 rounded-md cursor-pointer transition-colors text-red-600">
//                  <button onClick={() => { handleMockLogout(); handleMenuToggle(); }} className="w-full text-left">
//                     Log Out
//                 </button>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// }

// export default Header;

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Assuming this path is correct
import axios from "axios";

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mgoodId, setMgoodId] = useState("");

  // --- Mock User State (Replace with your actual auth logic) ---
  // For demonstration, let's assume a simple logged-in state
  // In a real app, this would come from your auth context/hook or a library
  const [user, setUser] = useState(null); // null if not logged in, user object if logged in

  // Example: Simulate login/logout for demo purposes
  // You would remove this and use your actual auth flow
  const handleMockLogin = () => {
    setUser({
      email: "testuser@example.com",
      picture: "/profile.jpg", // A default or fetched profile picture
      // Add other user properties your app might need
    });
  };
  const handleMockLogout = () => {
    setUser(null);
    setMgoodId(""); // Clear MgoodId on logout
  };
  // --- End Mock User State ---


  const navLinks = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 3,
      name: "Teleconsultation",
      path: "/book-tc", // Assuming PatientDetails is at this path or similar
    },
    {
      id: 4,
      name: "Prescriptions",
      path : "/prescriptions"
    }
    // You can add more links like Dashboard if relevant for logged-in users
    // {
    //   id: 5,
    //   name: "Dashboard",
    //   path: "/dashboard" // Path to your admin/doctor dashboard
    // }
  ];

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    // Fetch MgoodId if user is logged in and has an email
    if (user && user.email) {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getMgoodId`, {
          email: user.email,
        })
        .then((res) => {
          setMgoodId(res.data.mgoodId);
        })
        .catch((error) => {
          setMgoodId("Not Found");
          console.error("Failed to fetch MgoodId:", error.response?.data?.message || error.message);
        });
    } else {
      setMgoodId(""); // Clear MgoodId if no user or no email
    }
  }, [user]); // Re-run when the user object changes

  return (
    <nav className="p-3 flex justify-between bg-white items-center shadow-sm text-black sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/asset5.jpg" // Make sure this image is in your /public folder
          className="object-cover" // Removed max-w and max-h for better Image component control
          width={48} // Example width
          height={48} // Example height
          alt="logo"
        />
        <span className="text-lg font-medium font-display">MGood</span>
      </Link>

      <ul className="hidden md:flex gap-12 font-body font-medium">
        {navLinks.map((item) => (
          <Link href={item.path} key={item.id}>
            <li className="hover:scale-105 ease-in-out hover:text-primary cursor-pointer">
              {item.name}
            </li>
          </Link>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        {!user ? (
          <>
            {/* "Start Teleconsultation" button for non-logged-in users */}
            <Link href="/book-tc">
              <button className="text-xs md:text-base flex items-center gap-2 border-2 border-gray-400 hover:bg-primary hover:text-white px-2 md:px-6 py-2 rounded-md font-display">
                <span>Start Teleconsultation</span>
                <i className="fa-solid fa-phone ml-1 md:ml-0"></i>
              </button>
            </Link>
            {/* TODO: Add your Login button/link here */}
            {/* <button onClick={handleMockLogin} className="text-xs md:text-base bg-secondary text-white px-4 py-2 rounded-md">
              Login (Demo)
            </button> */}
          </>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button className="focus:outline-none">
                <Image
                  width={40}
                  height={40}
                  src={user.picture || "/profile.jpg"} // Use a default if picture is missing
                  alt="profile-pic"
                  className="rounded-full border-2 border-gray-300 hover:border-primary"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 mr-4 mt-1"> {/* Adjusted width and margin */}
              <div className="p-2">
                <p className="font-semibold text-sm mb-1 truncate">{user.email}</p>
                {mgoodId && <p className="text-xs text-gray-500 mb-2">MgoodId: {mgoodId}</p>}
                <hr className="my-2"/>
                <ul className="flex flex-col font-display text-sm">
                  {/* TODO: Update these links to actual paths */}
                  <Link href="/profile">
                    <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                      My Profile
                    </li>
                  </Link>
                  <Link href="/my-appointments">
                    <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                      My Appointments
                    </li>
                  </Link>
                  {/* Add Dashboard link if applicable for this user role */}
                  {/* <Link href="/dashboard">
                    <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                      Dashboard
                    </li>
                  </Link> */}
                  <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md text-red-600">
                    {/* TODO: Implement your actual logout logic */}
                    <button onClick={handleMockLogout} className="w-full text-left">
                        Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <button className="p-2 md:hidden" onClick={handleMenuToggle}>
          <i className={`fa-solid ${showMobileMenu ? 'fa-xmark' : 'fa-bars'} text-gray-600 text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          showMobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleMenuToggle} // Close menu when clicking overlay
      />
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4 shadow-sm p-3 border-b">
          <Link href="/" className="flex items-center gap-2" onClick={handleMenuToggle}>
            <Image
              src="/asset5.jpg"
              width={40}
              height={40}
              alt="logo"
            />
            <span className="text-lg font-medium font-display">MGood</span>
          </Link>
          <button className="p-2" onClick={handleMenuToggle}>
            <i className="fa-solid fa-xmark text-gray-600 text-xl"></i>
          </button>
        </div>
        <ul className="flex flex-col gap-2 font-body font-medium p-3">
          {navLinks.map((item) => (
            <Link href={item.path} key={item.id} onClick={handleMenuToggle}>
              <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">
                {item.name}
              </li>
            </Link>
          ))}
           {/* Mobile Menu: Auth actions */}
          {!user ? (
            <>
              <hr className="my-2"/>
              {/* <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">
                <button onClick={() => { handleMockLogin(); handleMenuToggle(); }} className="w-full text-left">
                    Login (Demo)
                </button>
              </li> */}
            </>
          ) : (
            <>
              <hr className="my-2"/>
              <Link href="/profile" onClick={handleMenuToggle}>
                <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">My Profile</li>
              </Link>
              <Link href="/my-appointments" onClick={handleMenuToggle}>
                <li className="hover:bg-primary hover:text-white p-3 rounded-md cursor-pointer transition-colors">My Appointments</li>
              </Link>
              <li className="p-3 text-sm text-gray-500">MgoodId: {mgoodId || "N/A"}</li>
              <li className="hover:bg-red-500 hover:text-white p-3 rounded-md cursor-pointer transition-colors text-red-600">
                 <button onClick={() => { handleMockLogout(); handleMenuToggle(); }} className="w-full text-left">
                    Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;