"use client";
import { Order } from "@/types/Types";
import React, { useState, useEffect, useRef } from "react";

const orders: Order[] = [
  {
    id: "1",
    customerEmail: "john.doe@example.com",
    customerPhone: "123-456-7890",
    address: "123 Main St, Springfield",
    status: "PENDING",
    totalAmount: 299.99,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "2",
    customerEmail: "jane.smith@example.com",
    customerPhone: "987-654-3210",
    address: "456 Elm St, Shelbyville",
    status: "PROCESSING",
    totalAmount: 799.99,
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },
  // Add more orders as needed
];

const AllOrders: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAction = (action: string, orderId: string) => {
    console.log(`Action: ${action}, Order ID: ${orderId}`);
    // You can update the order status here based on the action
    // e.g., "Approve" would change the status to "PROCESSING"
    // and "Reject" would change it to "CANCELLED"
  };

  // Close dropdown if click happens outside of it
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
                Oreder ID
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
            {orders.map((order, index) => (
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
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.createdAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
