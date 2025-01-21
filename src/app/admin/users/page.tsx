"use client";

import apiClient from "@/utils/apiClient";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5"; // For the dropdown menu icon
import { MdDelete, MdDisabledByDefault, MdUpdate } from "react-icons/md";
import { RxOpenInNewWindow } from "react-icons/rx";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null); // Store selected user details
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiClient.get("/users"); // Adjust the API endpoint as needed
      if (response.data) {
        setUsers(response.data);
      }
    };
    fetchUsers();

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

  const handleDelete = () => {
    console.log("Deleting user with ID:", userToDelete);
    setIsDeleteModalOpen(false);
  };

  const handleViewDetails = (user: User) => {
    setUserDetails(user);
    setIsModalOpen(true);
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
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="text-gray-600 hover:text-black"
                  >
                    <RxOpenInNewWindow size={20} />
                  </button>
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
                        onClick={() => {
                          setUserToDelete(user.id);
                          setIsDeleteModalOpen(true);
                        }}
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

      {/* User Details Modal */}
      {isModalOpen && userDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Role:</strong> {userDetails.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(userDetails.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(userDetails.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
