"use client";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import { Order } from "@/types/Types";
import apiClient from "@/utils/apiClient";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Page: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [ordersApi, setOrdersApi] = useState<Order[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAction = async (action: string, orderId: string) => {
    // const updatedStatus = action === "approve" ? "PROCESSING" : "REJECTED";
    let updatedStatus: string;

    if (action === "approve") {
      updatedStatus = "PROCESSING";
    } else if (action === "reject") {
      updatedStatus = "CANCELLED";
    } else {
      throw new Error("Invalid action");
    }

    console.log("Sending status:", updatedStatus, "for Order ID:", orderId);

    try {
      const response = await apiClient.patch(`/orders/${orderId}`, {
        status: updatedStatus, // Ensure this is the correct data format
      });

      if (response.data) {
        setOrdersApi((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: updatedStatus as Order["status"] }
              : order
          )
        );

        // Display a success notification
        toast.success(`Order ${updatedStatus} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);

      toast.error("Failed to update order status. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    let filtered = ordersApi;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customerPhone
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.items.some((item: { productName: string }) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        return orderDate === selectedDate.toLocaleDateString();
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, selectedDate, ordersApi]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("orders?status=PENDING");
        if (response.data) {
          setOrdersApi(response.data); // Set the fetched data
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/orders/${id}`);
      setOrdersApi((prevOrders) =>
        prevOrders.filter((order) => order.id !== id)
      );
      toast.success("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the order. Please try again.");
    }
    setConfirmDeleteId(null); // Close the confirm modal
  };

  console.log(ordersApi);
  // for all users pdf
  const generateAllUsersPDF = (orders: Order[]) => {
    const doc = new jsPDF();

    // Title & Tagline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Riponer Dokan", 105, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Etai Bastob !", 105, 22, { align: "center" });

    let startY = 30; // Initial Y position

    orders.forEach((order, index) => {
      // Add spacing between users
      if (index !== 0) startY += 15;

      // Product Details Table
      autoTable(doc, {
        startY: startY + 10,
        head: [["Product Name", "Price", "Quantity", "Total"]],
        body: order.items.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: { productName: any; price: string; quantity: number }) => [
            item.productName,
            `${item.price}`,
            item.quantity,
            `${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
          ]
        ),
        theme: "striped",
        headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      // Order Summary Table (Delivery Charge & Total)
      autoTable(doc, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startY: (doc as any).lastAutoTable.finalY + 5,
        head: [["Field", "Details"]],
        body: [
          ["Delivery Charge", `${order.deliveryCharge}`],
          ["Total Amount", `${order.totalAmount}`],
          ["Customer Email", order.customerEmail],
          ["Customer Phone", order.customerPhone],
          ["Address", order.address],
        ],
        theme: "grid",
        headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY = (doc as any).lastAutoTable.finalY + 10;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save("New_Orders.pdf");
  };

  // for single user pdf
  const generatePDF = (order: Order) => {
    const doc = new jsPDF();

    // Title & Tagline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Riponer Dokan", 105, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Etai Bastob !", 105, 22, { align: "center" });

    // eslint-disable-next-line prefer-const
    let startY = 30;

    autoTable(doc, {
      startY: startY + 10,
      head: [["Product Name", "Price", "Quantity", "Total"]],
      body: order.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: { productName: any; price: string; quantity: number }) => [
          item.productName,
          `${item.price}`,
          item.quantity,
          `${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
        ]
      ),
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Field", "Details"]],
      body: [
        ["Delivery Charge", `${order.deliveryCharge}`],
        ["Total Amount", `${order.totalAmount}`],
        ["Customer Email", order.customerEmail],
        ["Customer Phone", order.customerPhone],
        ["Address", order.address],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // Save PDF
    doc.save(`Order_${order.id}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email or phone "
          className="border p-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Filter by Date"
          className="border p-2 rounded "
        />
        <div>
          <Link href={"/admin/orders/create-order"}>
            <button className="bg-blue-500 text-white px-3 py-2 font-semibold rounded-md">
              Create order
            </button>
          </Link>
        </div>
        <div>
          <button
            onClick={() => generateAllUsersPDF(ordersApi)}
            className="bg-blue-500 text-white px-3 py-2 font-semibold rounded-md"
          >
            Export All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg max-h-[80vh] overflow-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Customer Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Delete
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Export
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customerEmail}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customerPhone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="text-2xl font-bold">৳</span>
                    {order.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.status === "PROCESSING" ? (
                      <span
                        className={`px-3 py-1 text-white text-sm font-medium rounded-lg ${
                          order.status === "PROCESSING"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    ) : (
                      <div className="relative">
                        <button
                          className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                          onClick={() => {
                            setOpenDropdown(
                              openDropdown === order.id ? null : order.id
                            );
                          }}
                        >
                          Actions
                        </button>
                        {openDropdown === order.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-1/2 mt-1 bg-white shadow-lg rounded-lg w-40 border border-gray-200 z-10"
                          >
                            <button
                              onClick={() => handleAction("approve", order.id)}
                              className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-100 rounded-t-lg transition duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction("reject", order.id)}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b-lg transition duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="  p-2">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => setConfirmDeleteId(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => generatePDF(order)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-700"
                >
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {confirmDeleteId && (
        <DeleteModal
          setConfirmDeleteId={setConfirmDeleteId}
          confirmDeleteId={confirmDeleteId}
          handleDelete={handleDelete}
        ></DeleteModal>
      )}
    </div>
  );
};

export default Page;
