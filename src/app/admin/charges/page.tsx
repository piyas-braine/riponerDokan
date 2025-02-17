"use client";

import EditDeliveryCharge from "@/components/EditDeliverCharge";
import apiClient from "@/utils/apiClient";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5"; // For the dropdown menu icon
import { MdDelete, MdUpdate } from "react-icons/md";
import { toast } from "react-toastify";

export type User = {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

const Page = () => {
  const [deliveryCharges, setDeliveryCharges] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deliveryChargeToEdit, setDeliveryChargeToEdit] = useState<
    string | null
  >(null);
  const [editAmount, setEditAmount] = useState<number | null>(null);
  const [deliveryChargeToDelete, setDeliveryChargeToDelete] = useState<
    string | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchDeliveryCharges = useCallback(async () => {
    const response = await apiClient.get("/delivery-charges"); // Adjust the API endpoint as needed
    if (response.data) {
      setDeliveryCharges(response.data);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryCharges();

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
  }, [fetchDeliveryCharges]);

  const handleEdit = (id: string, amount: number) => {
    setEditAmount(amount);
    setDeliveryChargeToEdit(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(
        `/delivery-charges/${deliveryChargeToDelete}`
      ); // Adjust the API endpoint as needed

      if (response.status === 200) {
        fetchDeliveryCharges();
        toast.success("Delivery charge deleted successfully");
        setDeliveryChargeToDelete(null);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Delivery charge delete error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 md:px-8 pb-10">
      <div className="flex justify-end mb-4">
        <Link href="charges/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Add Delivery Charge
          </button>
        </Link>
      </div>
      <div className="overflow-x-scroll lg:overflow-x-clip rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Charge</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-left">Updated At</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryCharges.map((deliveryCharge) => (
              <tr
                key={deliveryCharge?.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="px-6 py-4">{deliveryCharge?.type}</td>
                <td className="px-6 py-4">{deliveryCharge?.amount}</td>
                <td className="px-6 py-4">
                  {new Date(deliveryCharge.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(deliveryCharge.updatedAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 relative text-center">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === deliveryCharge?.id
                          ? null
                          : deliveryCharge?.id
                      )
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    <IoEllipsisHorizontal size={20} />
                  </button>
                  {dropdownOpen === deliveryCharge?.id && (
                    <div
                      ref={dropdownRef}
                      className="z-20 absolute right-1/2 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200"
                    >
                      <button
                        onClick={() => {
                          setDeliveryChargeToDelete(deliveryCharge?.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center text-left px-4 py-2 text-red-600 hover:bg-red-100 transition duration-200"
                      >
                        <MdDelete className="mr-2 text-red-500" /> Delete
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(deliveryCharge?.id, deliveryCharge?.amount)
                        }
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deliveryChargeToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this delivery charge?</p>
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

      {isEditModalOpen && deliveryChargeToEdit && (
        <EditDeliveryCharge
          id={deliveryChargeToEdit}
          amount={editAmount as number}
          setIsEditModalOpen={setIsEditModalOpen}
          fetchDeliveryCharges={fetchDeliveryCharges}
        />
      )}
    </div>
  );
};

export default Page;
