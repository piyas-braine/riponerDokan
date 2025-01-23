"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/utils/apiClient"; // Replace with your actual API client

const OrderStatusPieChart: React.FC = () => {
  const [orderData, setOrderData] = useState<any[]>([]); // Dynamic order data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define colors for each segment
  const COLORS = [
    "#FFB6C1", // Light rose for Cancelled
    "#FFEB99", // Light yellow for Pending
    "#A9A9A9", // Dark gray for Approved
    "#808080", // Gray for Processing
    "#D3D3D3", // Lighter gray for Rejected
  ];

  // Fetch order statuses from the API
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/orders"); // Adjust the endpoint to your API
        const orders = response.data;

        // Aggregate the counts for each status
        const statusCounts = orders.reduce((acc: any, order: any) => {
          const status = order.status; // Ensure your API provides a 'status' field
          if (!acc[status]) acc[status] = 0;
          acc[status] += 1; // Increment count for each status
          return acc;
        }, {});

        // Transform aggregated data into a format suitable for the chart
        const transformedData = Object.entries(statusCounts).map(
          ([status, count]) => ({ status, count })
        );

        setOrderData(transformedData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order statuses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatuses();
  }, []);

  // Calculate the total count of all orders
  const totalOrders = orderData.reduce((total, order) => total + order.count, 0);

  // Add percentages to the data for tooltip display
  const orderDataWithPercentage = orderData.map((order) => ({
    ...order,
    percentage: ((order.count / totalOrders) * 100).toFixed(2),
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg text-gray-600 font-semibold mb-4">
        Order Status Distribution
      </h3>

      <ResponsiveContainer width={400} height={354}>
        <PieChart>
          <Pie
            data={orderDataWithPercentage}
            dataKey="count"
            nameKey="status"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {orderDataWithPercentage.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) =>
              `${name}: ${value} orders (${
                orderDataWithPercentage.find((o) => o.status === name)
                  ?.percentage
              }%)`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusPieChart;
