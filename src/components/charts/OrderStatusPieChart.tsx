"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrderStatusPieChart: React.FC = () => {
  // Sample order data (status and count)
  const orderData = [
    { status: "New", count: 50 },
    { status: "Approved", count: 30 },
    { status: "Processing", count: 15 },
    { status: "Cancelled", count: 5 },
    { status: "Rejected", count: 5 },
  ];

  // Calculate the total count of all orders
  const totalOrders = orderData.reduce(
    (total, order) => total + order.count,
    0
  );

  // Calculate the percentage for each order status
  const orderDataWithPercentage = orderData.map((order) => ({
    ...order,
    percentage: ((order.count / totalOrders) * 100).toFixed(2),
  }));

  // Define colors for each segment
  const COLORS = [
    "#FFB6C1", // Light rose for Cancelled
    "#FFEB99", // Light yellow for Pending
    "#A9A9A9", // Dark gray for Approved
    "#808080", // Gray for Processing
    "#D3D3D3", // Lighter gray
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg text-gray-600 font-semibold mb-4">
        Order Status Distribution
      </h3>

      <ResponsiveContainer width={400} height={354} className="w-full">
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
              }% )`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusPieChart;
