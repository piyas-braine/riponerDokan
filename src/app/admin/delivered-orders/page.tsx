"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  orderId: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: string;
  trackingId: string | null;
  totalAmount: string;
  deliveryCharge: string;
  subTotal: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const DeliveredOrdersPage: React.FC = () => {
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Order[]>(
          "orders?status=DELIVERED"
        );
        setDeliveredOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredOrders();
  }, []);

  useEffect(() => {
    let filtered = deliveredOrders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
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
  }, [searchTerm, selectedDate, deliveredOrders]);
  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/orders/${id}`);
      setDeliveredOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== id)
      );
      toast.success("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the order. Please try again.");
    }
    setConfirmDeleteId(null); // Close the confirm modal
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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

      // Customer Details
      doc.setFontSize(12);
      doc.text(`Customer Email: ${order.customerEmail}`, 14, startY + 10);
      doc.text(`Customer Phone: ${order.customerPhone}`, 14, startY + 20);
      doc.text(`Address: ${order.address}`, 14, startY + 30);
      doc.text(`Total Amount: ${order.totalAmount}`, 14, startY + 40);
      doc.text(`Delivery Charge: ${order.deliveryCharge}`, 14, startY + 50);

      // Customer Information Table
      autoTable(doc, {
        startY: startY + 60,
        head: [["Field", "Details"]],
        body: [
          ["Customer Email", order.customerEmail],
          ["Customer Phone", order.customerPhone],
          ["Address", order.address],
          ["Total Amount", `${order.totalAmount}`],
          ["Delivery Charge", `${order.deliveryCharge}`],
        ],
        theme: "grid",
        headStyles: { fillColor: [0, 150, 136] },
      });

      // Product Table
      autoTable(doc, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startY: (doc as any).previousAutoTable.finalY + 10,
        head: [["Product Name", "Price", "Quantity", "Total"]],
        body: order.items.map((item) => [
          item.productName,
          `${item.price}`,
          item.quantity,
          `${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
        ]),
        theme: "striped",
        headStyles: { fillColor: [44, 62, 80] },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      if (index !== orders.length - 1) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save("Delivered_Orders.pdf");
  };

  // for single user pdf
  const generatePDF = (order: Order) => {
    const doc = new jsPDF();

    // Title & Tagline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Riponer Dokan", 105, 15, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text("Etai Bastob !", 105, 22, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Ensure it's black
    doc.text("All Delivered Reports", 105, 35, { align: "center" });

    // Customer Details Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Customer Email: ${order.customerEmail}`, 14, 40);
    doc.text(`Customer Phone: ${order.customerPhone}`, 14, 50);
    doc.text(`Address: ${order.address}`, 14, 60);
    doc.text(`Total Amount: ${order.totalAmount}`, 14, 70);
    doc.text(`Delivery Charge: ${order.deliveryCharge}`, 14, 80);

    // Customer Information Table
    autoTable(doc, {
      startY: 90,
      head: [["Field", "Details"]],
      body: [
        ["Customer Email", order.customerEmail],
        ["Customer Phone", order.customerPhone],
        ["Address", order.address],
        ["Total Amount", `${order.totalAmount}`],
        ["Delivery Charge", `${order.deliveryCharge}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 150, 136] },
    });

    // Product Table
    autoTable(doc, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY: (doc as any).previousAutoTable.finalY + 10,
      head: [["Product Name", "Price", "Quantity", "Total"]],
      body: order.items.map((item) => [
        item.productName,
        `${item.price}`,
        item.quantity,
        `${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // Save PDF
    doc.save(`Order_${order.id}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Delivered Orders</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email "
          className="border p-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Filter by Date"
          className="border p-2 rounded"
        />
        <div>
          <button
            onClick={() => generateAllUsersPDF(deliveredOrders)}
            className="bg-blue-500 text-white px-3 py-1 font-semibold rounded-md"
          >
            Export All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-sm border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Customer Email</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Created At</th>
              <th className="border border-gray-300 p-2">Actions</th>
              <th className="border border-gray-300 p-2">Export</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">
                  {order.customerEmail}
                </td>
                <td className="border border-gray-300 text-xs font-bold text-green-500 p-2">
                  {order.status}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className="text-2xl font-bold">৳</span>
                  {order.totalAmount}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
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

export default DeliveredOrdersPage;
