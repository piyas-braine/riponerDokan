"use client";

import { Order } from "@/types/Types";
import apiClient from "@/utils/apiClient";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Page: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [ordersApi, setOrdersApi] = useState<Order[]>([]); // Orders state
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAction = async (action: string, orderId: string) => {
    try {
      if (!orderId) {
        console.error("Invalid order ID:", orderId);
        toast.error("Invalid order ID. Action cannot be performed.");
        return;
      }
      const response = await apiClient.patch(`/orders/${orderId}`, {
        status: action,
      });
      if (response.data) {
        setOrdersApi((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: action } : order
          )
        );
        toast.success(response.data.message, { theme: "colored" });
        setOpenDropdown(null); // Close dropdown after action
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status.",
        { theme: "colored" }
      );
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
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
              ordersApi.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {order.id}
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
                    {order.status === "approved" ||
                    order.status === "rejected" ? (
                      <span
                        className={`px-3 py-1 text-white text-sm font-medium rounded-lg ${
                          order.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    ) : (
                      <div className="relative">
                        <button
                          className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === order.id ? null : order.id
                            )
                          }
                        >
                          Actions
                        </button>
                        {openDropdown === order.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200 z-10"
                          >
                            <button
                              onClick={() => handleAction("approved", order.id)}
                              className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-100 rounded-t-lg transition duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction("rejected", order.id)}
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

export default Page;
