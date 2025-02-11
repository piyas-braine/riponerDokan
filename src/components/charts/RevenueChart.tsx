/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/utils/apiClient";

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // All data from the API
  const [filteredData, setFilteredData] = useState<any[]>([]); // Data filtered by year and month
  const [years, setYears] = useState<string[]>([]); // Available years
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const months = [
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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/orders");
        const orders = response.data;

        const transformedData = orders.map((order: any) => {
          const date = new Date(order.createdAt);
          const year = date.getFullYear();
          const month = months[date.getMonth()];
          const day = date.getDate();
          return {
            year,
            month,
            day,
            income: parseFloat(order.totalAmount || 0),
            status: order.status,
          };
        });

        setData(transformedData);

        const uniqueYears = Array.from(
          new Set(transformedData.map((item: any) => String(item.year)))
        );

        setYears(uniqueYears as string[]);
        setSelectedYear(uniqueYears[0]?.toString() || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const filtered = data.filter(
        (item) =>
          item.year.toString() === selectedYear &&
          (selectedMonth ? item.month === selectedMonth : true) &&
          item.status === "DELIVERED" // Only include DELIVERED orders
      );
      setFilteredData(filtered);

      // Calculate total income for the filtered data
      const totalIncome = filtered.reduce((sum, item) => sum + item.income, 0);
      setTotalMonthlyIncome(totalIncome);
    }
  }, [data, selectedYear, selectedMonth]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
    setSelectedMonth(""); // Reset month when changing year
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg flex-1">
      <h3 className="text-lg text-gray-600 font-semibold mb-4">Daily Income</h3>

      {/* Filters Section */}
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Year:</label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded-lg bg-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Month:</label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border rounded-lg bg-white"
            disabled={!selectedYear}
          >
            <option value="">All</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Monthly Income */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-lg font-bold text-gray-700">
          Total Delivered Income:{" "}
          <span className="text-3xl text-green-600">৳</span>
          <span className="text-green-600">
            {totalMonthlyIncome.toFixed(2)}
          </span>
        </h4>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
