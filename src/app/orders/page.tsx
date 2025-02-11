"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const TrackYourOrder = () => {
  const orderNumberRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleOrderTracking = () => {
    const orderNumber = orderNumberRef.current?.value;
    if (!orderNumber) {
      alert("Please enter an order number");
      return;
    }

    router.push(`/orders/${orderNumber}/customer-tracking`);
  };

  return (
    <div className="py-2 mx-auto container">
      <Navbar />

      <h2 className="my-10 text-center text-xl font-medium">
        Track Your Order
      </h2>
      <div className="flex justify-center items-center gap-2 p-4">
        <input
          ref={orderNumberRef}
          type="text"
          placeholder="Enter your order number..."
          className="w-[30%] border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleOrderTracking}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default TrackYourOrder;
