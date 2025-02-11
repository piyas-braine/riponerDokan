"use client";

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
  totalAmount: number;
  deliveryCharge: number;
  subTotal: number;
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
            `http://localhost:3002/api/orders/${orderId}/customer-tracking`,
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

  if (!order) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="pt-10 text-2xl text-center font-bold">Order Tracking</h1>
      <div className="mt-4">
        <OrderTrackingTable {...order} />
      </div>
    </div>
  );
};

export default OrderTracking;
