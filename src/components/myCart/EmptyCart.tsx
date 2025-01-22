import Link from "next/link";
import React from "react";

const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
        Your cart is empty.
      </h2>
      <p className="text-sm md:text-base text-gray-600 mt-4">
        Add some products to your cart to see them here.
      </p>
      <Link href={"/"}>
        <button className="bg-primaryColor text-white py-2 px-4 rounded-md font-semibold text-sm md:text-base mt-6 transition">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default EmptyCart;
