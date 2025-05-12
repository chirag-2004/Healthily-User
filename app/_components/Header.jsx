"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 
import axios from "axios";

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // const [healthilyId, setHealthilyId] = useState("");

  const [user, setUser] = useState(null); 

  const handleMockLogin = () => {
    setUser({
      email: "testuser@example.com",
      picture: "/profile.jpg", 
      
    });
  };
 



  const navLinks = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 3,
      name: "Teleconsultation",
      path: "/book-tc", 
    },
    {
      id: 4,
      name: "Prescriptions",
      path : "/prescriptions"
    }
 
  ];

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

 

  return (
    <nav className="p-3 flex justify-between bg-white items-center shadow-sm text-black sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/asset5.jpg" 
          className="object-cover" 
          width={48} 
          height={48} 
          alt="logo"
        />
        <span className="text-lg font-medium font-display">Healthily</span>
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
      
          <>
            
            <Link href="/book-tc">
              <button className="text-xs md:text-base flex items-center gap-2 border-2 border-gray-400 hover:bg-primary hover:text-white px-2 md:px-6 py-2 rounded-md font-display">
                <span>Start Teleconsultation</span>
                <i className="fa-solid fa-phone ml-1 md:ml-0"></i>
              </button>
            </Link>
          </>
    
    

        <button className="p-2 md:hidden" onClick={handleMenuToggle}>
          <i className={`fa-solid ${showMobileMenu ? 'fa-xmark' : 'fa-bars'} text-gray-600 text-xl`}></i>
        </button>
      </div>

    
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          showMobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleMenuToggle} 
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
            <span className="text-lg font-medium font-display">Healthily</span>
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
           
          {!user ? (
            <>
              <hr className="my-2"/>
          
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
              <li className="p-3 text-sm text-gray-500">HealthilyId: {healthilyId || "N/A"}</li>
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