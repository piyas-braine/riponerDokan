"use client";
import React, { useState, useEffect } from "react";
import AllOrders from "@/components/AllOrders/AllOrders";
import OrderStatusPieChart from "@/components/charts/OrderStatusPieChart";
import RevenueChart from "@/components/charts/RevenueChart";
import {
  FaEye,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import apiClient from "@/utils/apiClient"; // Replace with your actual API client import

export default function DashboardHome() {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [deliveredOrders, setDeliveredOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/orders"); // Adjust the endpoint to your API
        const orders = response.data;

        // Calculate metrics
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
          (order: any) => order.status === "PENDING"
        ).length;
        const deliveredOrders = orders.filter(
          (order: any) => order.status === "DELIVERED"
        ).length;
        const totalSales = orders
          .filter((order: any) => order.status === "DELIVERED")
          .reduce(
            (sum: number, order: any) =>
              sum + parseFloat(order.totalAmount || "0"),
            0
          );

        // Update state
        setTotalSales(totalSales);
        setTotalOrders(totalOrders);
        setPendingOrders(pendingOrders);
        setDeliveredOrders(deliveredOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  console.log(loading, error);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {/* Total Sales Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Total Sales</h3>
            <p className="text-2xl font-semibold text-gray-800">
              <span className="text-4xl font-bold">৳</span>
              {totalSales.toFixed(2)}
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaMoneyBillWave className="text-gray-700" size={24} />
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Orders in Progress</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {pendingOrders}
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaShoppingCart className="text-gray-700" size={24} />
          </div>
        </div>

        {/* Delivered Orders Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Delivered Orders</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {deliveredOrders}
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaUsers className="text-gray-700" size={24} />
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Total Orders</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {totalOrders}
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaEye className="text-gray-700" size={24} />
          </div>
        </div>
      </div>

      {/* Revenue and Order Status Charts */}
      <div className="flex md:items-center gap-2 flex-col md:flex-row w-full mx-4 md:mx-0">
        <RevenueChart />
        <OrderStatusPieChart />
      </div>

      <AllOrders />
    </div>
  );
}
