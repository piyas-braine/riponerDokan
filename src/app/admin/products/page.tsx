"use client";
import React, { useState, useEffect, useRef } from "react";

interface Order {
  id: string;
  product: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

const orders: Order[] = [
  {
    id: "1",
    product: "Wireless Headphones",
    customer: "John Doe",
    total: 299.99,
    status: "Completed",
    date: "2025-01-01",
  },
  {
    id: "2",
    product: "Smartphone",
    customer: "Jane Smith",
    total: 799.99,
    status: "Processing",
    date: "2025-01-05",
  },
  // Add more orders as needed
];

const Page: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAction = (action: string, orderId: string) => {
    console.log(`Action: ${action}, Order ID: ${orderId}`);
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
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg max-h-[80vh] overflow-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date
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
                  {order.product}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.date}
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
                          onClick={() => handleAction("view", order.id)}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAction("edit", order.id)}
                          className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("delete", order.id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b-lg transition duration-200"
                        >
                          Delete
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

export default Page;
