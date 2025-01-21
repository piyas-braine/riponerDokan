"use client";
import React, { useState } from "react";
import Image from "next/image"; // Import Next.js Image component

const MyCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Hoodies & Sweetshirt",
      price: 49.99,
      quantity: 1,
      image: "/images/Rectangle 20.svg",
    },
    {
      id: 2,
      name: "Coats & Parkas",
      price: 79.99,
      quantity: 1,
      image: "/images/Rectangle 21.svg",
    },
  ]);

  // Function to increase quantity
  const handleIncreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to decrease quantity
  const handleDecreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Function to remove an item from the cart
  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          My Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-2 md:p-3 text-sm md:text-lg text-gray-700">
                      Product
                    </th>
                    <th className="p-2 md:p-3 text-sm md:text-lg text-gray-700">
                      Price
                    </th>
                    <th className="p-2 md:p-3 text-sm md:text-lg text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 md:p-3 flex items-center space-x-4">
                        <div className="relative w-12 h-12 md:w-16 md:h-16">
                          <Image
                            src={item.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <span className="text-sm md:text-base font-medium text-gray-800">
                          {item.name}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 text-sm md:text-base text-gray-600 flex items-center space-x-2">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="bg-gray-200 text-gray-800 rounded-full px-2 py-1"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="bg-gray-200 text-gray-800 rounded-full px-2 py-1"
                        >
                          +
                        </button>
                      </td>
                      <td className="p-2 md:p-3 text-sm md:text-base text-gray-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2 md:p-3">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 font-bold text-xs md:text-sm py-1 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Price and Checkout */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6">
              <h3 className="text-base md:text-xl font-bold text-gray-800">
                Total: ${totalPrice.toFixed(2)}
              </h3>
              <button className="bg-primaryColor text-white py-2 px-4 rounded-md font-semibold text-sm md:text-base mt-4 md:mt-0 transition">
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              Your cart is empty.
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-4">
              Add some products to your cart to see them here.
            </p>
            <button className="bg-primaryColor text-white py-2 px-4 rounded-md font-semibold text-sm md:text-base mt-6 transition">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCart;
