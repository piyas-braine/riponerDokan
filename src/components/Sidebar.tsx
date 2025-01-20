"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMenu } from "react-icons/io5"; // Hamburger Menu Icon
import { RxCross2 } from "react-icons/rx"; // Close Icon
import { usePathname } from "next/navigation";
import { routes } from "@/constants/Routes"; // Updated routes with icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Track sidebar state for mobile and large screens
  const path = usePathname(); // For pathname tracking

  useEffect(() => {
    // Ensure sidebar remains open for larger screens
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Auto open on larger screens
      } else {
        setIsOpen(false); // Auto close on small screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
  };

  return (
    <div className="relative">
      {/* Hamburger Menu Icon */}
      <button
        className="fixed top-4 ml-4 z-50 bg-white p-2 hover:scale-105 hover:shadow-md transition-all duration-700"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <RxCross2 className="h-6 w-6 text-black" />
        ) : (
          <IoMenu className="h-6 w-6 text-black" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-40 h-screen transition-all duration-500 ease-in-out bg-white shadow-lg 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64 
          ${isOpen ? "md:max-w-64" : "md:max-w-16"}
        `}
      >
        <nav
          className={`h-full py-4 px-2 mt-12 transition-opacity duration-700 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            visibility: isOpen ? "visible" : "hidden",
          }}
        >
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link href={route.path} passHref>
                  <span
                    className={`flex items-center rounded-lg p-2 text-base font-normal 
                    ${
                      path === route.path
                        ? "bg-gray-200 text-black"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    `}
                  >
                    {/* Display icon */}
                    {route.icon}
                    {/* Conditionally render only the text on large screens */}
                    <span className={` ml-3`}>{route.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
