"use client";

import Navbar from "@/components/Navbar/Navbar";
import OrderTrackingTable from "@/components/OrderTrackingTable";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
};

interface Order {
  id: string;
  status: string;
  items: OrderItem[] | []; // Define the type of items based on your data structure
  subTotal: number;
  deliveryCharge: number;
  totalAmount: number;
}

const OrderTracking = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(params.id);
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        if (orderId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}/customer-tracking`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          // console.log("Order:", data);
          setOrder(data?.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="py-2 container mx-auto">
      <Navbar />
      <h1 className="pt-10 text-2xl text-center font-bold">Order Tracking</h1>

      <div className="mt-4">
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
