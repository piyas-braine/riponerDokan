"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import EmptyCart from "@/components/myCart/EmptyCart";
import CartItems from "@/components/myCart/CartItems";
import OrderModal from "@/components/myCart/OrderModal";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

const MyCart = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      console.log("Cart items loaded from localStorage:", parsedCart); // Debug
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateLocalStorage = (items: any[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const handleIncreaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const handleDecreaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
    toast.success("Item has been removed from your cart!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "red",
      },
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOrderSubmit = async (orderData: any) => {
    try {
      console.log("Order Data:", orderData);

      // Send the order data to the backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), // Convert orderData to JSON string
      });

      if (response.ok) {
        // Handle success
        toast.success("Your order has been placed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Reset modal and cart
        setIsModalOpen(false);
        setCartItems([]);
        localStorage.removeItem("cart");

        const result = await response.json();
        console.log("Order Response:", result);
      } else {
        // Handle error response
        toast.error("Failed to place the order. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        console.error("Order placement failed:", response.statusText);
      }
    } catch (error) {
      // Handle network errors
      console.error("Error placing order:", error);
      toast.error("Something went wrong. Please try again!", {
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

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div className="p-6 mx-auto container">
        <Navbar></Navbar>
      </div>
      <div className="min-h-screen py-8">
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
                    {cartItems.map((item, index) => (
                      <CartItems
                        key={index}
                        item={item}
                        handleDecreaseQuantity={handleDecreaseQuantity}
                        handleIncreaseQuantity={handleIncreaseQuantity}
                        handleRemoveItem={handleRemoveItem}
                      ></CartItems>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Price and Checkout */}
              <div className="flex flex-col md:flex-row justify-center gap-5 items-center mt-6">
                <h3 className="text-base md:text-xl font-bold text-gray-800">
                  Total: <span className="text-4xl font-bold">৳</span>
                  {totalPrice.toFixed(2)}
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primaryColor text-white py-2 px-4 rounded-md font-semibold text-sm md:text-base mt-4 md:mt-0 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          ) : (
            <EmptyCart></EmptyCart>
          )}
        </div>
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleOrderSubmit}
          totalPrice={totalPrice}
          cartItems={cartItems}
        />
        <ToastContainer></ToastContainer>
      </div>
      <div className=" mt-16">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default MyCart;
