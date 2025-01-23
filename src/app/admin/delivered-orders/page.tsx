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

const DeliveredOrdersPage: React.FC = () => {
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Order[]>(
          "orders?status=DELIVERED"
        );
        setDeliveredOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedOrders();
  }, []);

  console.log(deliveredOrders);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Delivered Orders</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-sm border border-gray-200">
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
            {deliveredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">
                  {order.customerEmail}
                </td>
                <td className="border border-gray-300 text-xs font-bold text-green-500 p-2">
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

export default DeliveredOrdersPage;
