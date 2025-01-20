"use client";
import { data } from "@/constants/data";
import React, { useState } from "react";
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

const RevenueChart: React.FC = () => {
  // Extract the unique years and months for the dropdown
  const years = Array.from(new Set(data.map((item) => item.year)));
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

  const [selectedYear, setSelectedYear] = useState<string>(years[0].toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Filter data by selected year and month
  const filteredData = data.filter(
    (item) =>
      item.year.toString() === selectedYear &&
      (selectedMonth ? item.month === selectedMonth : true)
  );

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
    setSelectedMonth(""); // Reset month when changing year
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

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

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
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
