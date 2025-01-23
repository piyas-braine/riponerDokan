"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import apiClient from "@/utils/apiClient"; // Replace with your actual API client

interface Order {
  id: string;
  totalAmount: string; // Total amount of the order as string
  createdAt: string; // Order date in ISO format
}

const Sales = () => {
  const [orderStatusSummary, setOrderStatusSummary] = useState<
    Record<string, number>
  >({
    PENDING: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  });
  const [monthlyTrends, setMonthlyTrends] = useState<
    { month: string; sales: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersByStatus = async () => {
      setLoading(true);
      try {
        const statuses = [
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ];
        const statusPromises = statuses.map((status) =>
          apiClient
            .get<Order[]>(`orders?status=${status}`)
            .then((response) => ({
              status,
              count: response.data.length,
              data: response.data,
            }))
        );

        const results = await Promise.all(statusPromises);

        // Update Order Status Summary
        const statusSummary = results.reduce(
          (acc, { status, count }) => ({ ...acc, [status]: count }),
          {}
        );
        setOrderStatusSummary(statusSummary);

        // Calculate Monthly Sales Trends
        const deliveredOrders =
          results.find((res) => res.status === "DELIVERED")?.data || [];
        const salesByMonth = deliveredOrders.reduce(
          (acc: Record<string, number>, order) => {
            const month = new Date(order.createdAt).toLocaleString("default", {
              month: "short",
            });
            const totalAmount = parseFloat(order.totalAmount); // Parse totalAmount as number

            acc[month] = (acc[month] || 0) + totalAmount;
            return acc;
          },
          {}
        );

        const trends = Object.entries(salesByMonth)
          .map(([month, sales]) => ({ month, sales }))
          .sort((a, b) => {
            const monthsOrder = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
          });

        setMonthlyTrends(trends);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Overview</h1>

      {/* Bar Chart: Order Status Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Order Status Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Object.entries(orderStatusSummary).map(([status, count]) => ({
              status,
              count,
            }))}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Monthly Sales Trends */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Monthly Sales Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyTrends}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Sales;
