"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5"; // For the dropdown menu icon
import { MdDelete, MdDisabledByDefault, MdUpdate } from "react-icons/md";
import { RxOpenInNewWindow } from "react-icons/rx";

const Page = () => {
  const users = [
    {
      id: "1",
      email: "admin@example.com",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-10",
    },
    {
      id: "2",
      email: "moderator@example.com",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-12",
    },
    {
      id: "3",
      email: "user@example.com",
      createdAt: "2025-01-03",
      updatedAt: "2025-01-15",
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: string, userId: string) => {
    console.log(action, userId);
    // Handle your action here (e.g., disable, delete, or update user)
  };

  return (
    <div className="w-full mx-auto px-4 md:px-8">
      <div className="flex justify-end mb-4">
        <Link href="users/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Create Moderator
          </button>
        </Link>
      </div>
      <div className="overflow-auto bg-white rounded-lg shadow-md table-auto max-h-[80vh]">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-left">Updated At</th>
              <th className="px-6 py-4">View Details</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.createdAt}</td>
                <td className="px-6 py-4">{user.updatedAt}</td>

                <td className="px-6 py-4 text-center">
                  <Link href={`users/${user.id}`}>
                    <button className="text-gray-600 hover:text-black">
                      <RxOpenInNewWindow size={20} />
                    </button>
                  </Link>
                </td>
                <td className="px-6 py-4 relative text-center">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === user.id ? null : user.id)
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    <IoEllipsisHorizontal size={20} />
                  </button>
                  {dropdownOpen === user.id && (
                    <div
                      ref={dropdownRef}
                      className="z-20 absolute right-1/2 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200"
                    >
                      <button
                        onClick={() => handleAction("disable", user.id)}
                        className="w-full flex items-center text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition duration-200"
                      >
                        <MdDisabledByDefault className="mr-2 text-gray-500" />{" "}
                        Disable
                      </button>
                      <button
                        onClick={() => handleAction("delete", user.id)}
                        className="w-full flex items-center text-left px-4 py-2 text-red-600 hover:bg-red-100 transition duration-200"
                      >
                        <MdDelete className="mr-2 text-red-500" /> Delete
                      </button>
                      <button
                        onClick={() => handleAction("update", user.id)}
                        className="w-full flex items-center text-left px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-b-lg transition duration-200"
                      >
                        <MdUpdate className="mr-2 text-blue-500" /> Update
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
