import { ReactNode } from "react";
import { FaTachometerAlt } from "react-icons/fa"; // Dashboard Icon
import { FaClipboardList } from "react-icons/fa"; // Orders Icon
import { FaCheckCircle } from "react-icons/fa"; // Approved Orders Icon
import { FaTimesCircle } from "react-icons/fa"; // Rejected Orders Icon
import { FaHourglassHalf } from "react-icons/fa"; // Pending Orders Icon
import { FaChartLine } from "react-icons/fa"; // Sales Overview Icon

import { FaUserFriends } from "react-icons/fa"; // User Management Icon
import { FaCog } from "react-icons/fa"; // Settings Icon
import { IoAnalytics } from "react-icons/io5";

// Define the type for a route
interface Route {
  name: string;
  path: string;
  icon: ReactNode; // The icon will be a ReactNode, which can be any React element
}

export const routes: Route[] = [
  { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
  { name: "All Orders", path: "/admin/orders", icon: <FaClipboardList /> },
  {
    name: "Approved Orders",
    path: "/admin/approved-orders",
    icon: <FaCheckCircle />,
  },
  {
    name: "Rejected Orders",
    path: "/admin/rejected-orders",
    icon: <FaTimesCircle />,
  },
  {
    name: "Pending Orders",
    path: "/admin/pending-orders",
    icon: <FaHourglassHalf />,
  },
  { name: "Sales Overview", path: "/admin/sales", icon: <FaChartLine /> },
  { name: "Analytics", path: "/admin/analytics", icon: <IoAnalytics /> },
  { name: "User Management", path: "/admin/users", icon: <FaUserFriends /> },
  { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
];
