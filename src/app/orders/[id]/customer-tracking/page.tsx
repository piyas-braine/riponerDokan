"use client";

import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import OrderTrackingTable from "@/components/OrderTrackingTable";
import { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";

type OrderItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
};

interface Order {
  id: string;
  status: string;
  items: OrderItem[] | [];
  subTotal: number;
  deliveryCharge: number;
  totalAmount: number;
}

const OrderTracking = ({ params }: { params: Promise<{ id: string }> }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { toPDF, targetRef } = usePDF({
    filename: "customer-order-tracking.pdf",
  });

  // Unwrap the params promise using React.use()
  const resolvedParams = React.use(params);

  useEffect(() => {
    if (!resolvedParams?.id) return;

    const fetchOrder = async () => {
      try {
        if (process.env.NEXT_PUBLIC_BASE_URL) {
          console.log(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${resolvedParams.id}/customer-tracking`
          );
          const response = await fetch(
            `/api/orders/${resolvedParams.id}/customer-tracking`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log("Order:", data);
          setOrder(data?.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [resolvedParams?.id]);

  return (
    <div className="py-2 container mx-auto">
      <Navbar />
      <h1 className="pt-10 text-2xl text-center font-bold">Order Tracking</h1>
      <div className="mt-4 text-center">
        {order && (
          <button
            onClick={() => toPDF()}
            className="bg-red-600 text-white text-sm font-medium p-2 rounded-md"
          >
            Download As PDF
          </button>
        )}
      </div>
      <div ref={targetRef} className="mt-4">
        {order ? (
          <OrderTrackingTable {...order} />
        ) : (
          <h2>No Order available with this number...</h2>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
