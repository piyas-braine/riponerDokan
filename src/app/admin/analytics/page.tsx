"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/utils/apiClient"; // Replace with your actual API client

interface Order {
  id: string;
  status: string; // Order status (e.g., "PENDING", "DELIVERED")
  totalAmount: string; // Total amount of the order (as string)
}

const Analytics = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderStatusData, setOrderStatusData] = useState<
    { name: string; value: number }[]
  >([]);
  const [totalSales, setTotalSales] = useState<number>(0); // New state for total sales
  const [totalOrders, setTotalOrders] = useState<number>(0); // New state for total orders

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch all orders (not just delivered ones)
        const response = await apiClient.get<Order[]>("orders");
        setOrders(response.data);

        // Filter out delivered orders
        const delivered = response.data.filter(
          (order) => order.status === "DELIVERED"
        );
        setDeliveredOrders(delivered);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate total orders
      setTotalOrders(orders.length);

      // Calculate distribution of order statuses
      const statusCount = orders.reduce(
        (acc: Record<string, number>, order) => {
          const status = order.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      // Prepare data for Pie Chart, including both total and delivered orders
      const chartData = Object.entries(statusCount).map(([status, count]) => ({
        name: status,
        value: count,
      }));

      setOrderStatusData(chartData);

      // Calculate total sales from the delivered orders
      const sales = deliveredOrders.reduce((total, order) => {
        return total + parseFloat(order.totalAmount); // Add the totalAmount of each delivered order
      }, 0);

      setTotalSales(sales); // Set the total sales
    }
  }, [orders, deliveredOrders]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Color palette for Pie Chart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57"];

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Display Total Sales */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
        <p className="text-lg">
          Total Sales from Delivered Orders:{" "}
          <span className="text-2xl font-bold">৳</span>
          {totalSales.toFixed(2)}
        </p>
      </div>

      {/* Display Total Orders */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
        <p className="text-lg">Total Orders: {totalOrders}</p>
      </div>

      {/* Pie Chart: Order Status Distribution */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Order Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
