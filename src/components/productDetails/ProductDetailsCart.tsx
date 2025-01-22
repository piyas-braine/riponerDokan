"use client";

import { toast, ToastContainer } from "react-toastify";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductDetailsCart({ product }: { product: Product }) {
  const addToCart = () => {
    const cartItems = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as Product[];

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} has been added to your cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <div>
      <button
        onClick={addToCart}
        className="w-full inline-block text-center px-6 py-3 bg-primaryColor text-white text-lg font-medium rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor"
      >
        Add to Cart
      </button>
      <ToastContainer />
    </div>
  );
}
