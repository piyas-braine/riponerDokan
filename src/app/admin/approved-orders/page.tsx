"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  orderId: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: string;
  trackingId: string | null;
  totalAmount: string;
  deliveryCharge: string;
  subTotal: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const ApprovedOrdersPage: React.FC = () => {
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Order[]>(
          "orders?status=PROCESSING"
        );
        setApprovedOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedOrders();
  }, []);

  const handleStatusToggle = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PROCESSING" ? "SHIPPED" : "PROCESSING";

    // Optimistically update the status in the UI
    setApprovedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      // Make the API call to update the status
      await apiClient.patch(`/orders/${orderId}`, { status: newStatus });
    } catch (error) {
      // Revert the status change if the API call fails
      setApprovedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: currentStatus } : order
        )
      );

      // Handle error and show a toast notification or error message
      setError("Failed to update order status. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Approved Orders</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Customer Email</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {approvedOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">
                  {order.customerEmail}
                </td>
                <td
                  className="border border-gray-300 p-2 cursor-pointer text-blue-500 text-xs font-bold"
                  onClick={() => handleStatusToggle(order.id, order.status)}
                >
                  {order.status}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.totalAmount}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedOrdersPage;
