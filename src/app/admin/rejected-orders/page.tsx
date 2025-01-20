"use client";
import React, { useState } from "react";

interface RejectedOrder {
  orderId: string;
  product: string;
  customer: string;
  total: number;
  res: string;
  date: string;
}

const rejectedOrders: RejectedOrder[] = [
  {
    orderId: "1a2b3c4d5e6f7g8h9i0j",
    product: "Wireless Headphones",
    customer: "John Doe",
    total: 299.99,
    res: "Order has been rejected due to insufficient stock.",
    date: "2025-01-01",
  },
  {
    orderId: "2a3b4c5d6e7f8g9h0i1j",
    product: "Smartphone",
    customer: "Jane Smith",
    total: 799.99,
    res: "Order rejected by the customer.",
    date: "2025-01-05",
  },
  // Add more rejected orders as needed
];

const Page: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setOpenModal(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      // Perform delete action (filter out the order from the list)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedOrders = rejectedOrders.filter(
        (order) => order.orderId !== orderToDelete
      );
      // Update the rejected orders list (if necessary in state or props)
      // For now, it's updated locally in the code
      console.log(`Order ${orderToDelete} deleted`);
    }
    setOpenModal(false);
  };

  const cancelDelete = () => {
    setOpenModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Rejected Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg max-h-[80vh] overflow-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Order ID
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
                Reason
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
            {rejectedOrders.map((order) => (
              <tr key={order.orderId} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {order.orderId.slice(0, 8)}...
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
                <td className="px-6 py-4 text-sm text-gray-700">{order.res}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleDeleteOrder(order.orderId)}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for confirmation */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this order?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
