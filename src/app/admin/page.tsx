import AllOrders from "@/components/AllOrders/AllOrders";
import OrderStatusPieChart from "@/components/charts/OrderStatusPieChart";
import RevenueChart from "@/components/charts/RevenueChart";
import {
  FaEye,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

export default function DashboardHome() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {/* Total Sales Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Total Sales</h3>
            <p className="text-2xl font-semibold text-gray-800">$XXXX</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaMoneyBillWave className="text-gray-700" size={24} />
          </div>
        </div>

        {/* Orders in Progress Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Orders in Progress</h3>
            <p className="text-2xl font-semibold text-gray-800">25</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaShoppingCart className="text-gray-700" size={24} />
          </div>
        </div>

        {/* New Customers Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">New Customers</h3>
            <p className="text-2xl font-semibold text-gray-800">45</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaUsers className="text-gray-700" size={24} />
          </div>
        </div>

        {/* Product Views Card */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border border-black/20">
          <div>
            <h3 className="text-sm text-gray-600">Product Views</h3>
            <p className="text-2xl font-semibold text-gray-800">150</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <FaEye className="text-gray-700" size={24} />
          </div>
        </div>
      </div>

      {/* revenue chart */}
      <div className="flex md:items-center gap-2 flex-col md:flex-row w-full mx-4 md:mx-0">
        <RevenueChart />
        <OrderStatusPieChart />
      </div>

      <AllOrders />
    </div>
  );
}
