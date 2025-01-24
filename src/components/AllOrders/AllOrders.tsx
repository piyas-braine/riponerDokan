"use client";
import { Order } from "@/types/Types";
import apiClient from "@/utils/apiClient";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AllOrders: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [ordersApi, setOrdersApi] = useState<Order[]>([]); // State to hold orders from backend
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAction = async (action: string, orderId: string) => {
    // const updatedStatus = action === "approve" ? "PROCESSING" : "REJECTED";
    let updatedStatus: string;

    if (action === "approve") {
      updatedStatus = "PROCESSING";
    } else if (action === "reject") {
      updatedStatus = "CANCELLED";
    } else {
      throw new Error("Invalid action");
    }

    console.log("Sending status:", updatedStatus, "for Order ID:", orderId);

    try {
      const response = await apiClient.patch(`/orders/${orderId}`, {
        status: updatedStatus, // Ensure this is the correct data format
      });

      if (response.data) {
        setOrdersApi((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: updatedStatus as Order["status"] }
              : order
          )
        );

        // Display a success notification
        toast.success(`Order ${updatedStatus} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);

      toast.error("Failed to update order status. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("orders?status=PENDING");
        if (response.data) {
          setOrdersApi(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg max-h-[80vh] overflow-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersApi.length > 0 ? (
              ordersApi.map((order, index) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customerPhone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.status === "PROCESSING" ||
                    order.status === "REJECTED" ? (
                      <span
                        className={`px-3 py-1 text-white text-sm font-medium rounded-lg ${
                          order.status === "PROCESSING"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    ) : (
                      <div className="relative">
                        <button
                          className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                          onClick={() => {
                            setOpenDropdown(
                              openDropdown === order.id ? null : order.id
                            );
                          }}
                        >
                          Actions
                        </button>
                        {openDropdown === order.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-1/2 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200 z-10"
                          >
                            <button
                              onClick={() => handleAction("approve", order.id)}
                              className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-100 rounded-t-lg transition duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction("reject", order.id)}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b-lg transition duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-700"
                >
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
