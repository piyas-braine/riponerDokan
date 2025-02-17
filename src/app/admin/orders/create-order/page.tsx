"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productImages: string[];
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    const totalPrice = selectedProduct.price * quantity;
    const totalAmount = totalPrice + deliveryCharge;

    const orderData = {
      customerEmail,
      customerPhone,
      address,
      totalAmount,
      deliveryCharge,
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          quantity,
        },
      ],
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order placed successfully!");
        closeModal();
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Order
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 flex justify-center items-center">
                  <Image
                    src={`/${product.productImages[0].split("/")[1]}/${
                      product.productImages[0].split("/")[2]
                    }/${product.productImages[0].split("/")[3]}`}
                    width={40}
                    height={40}
                    alt="Product"
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4 font-bold">৳{product.price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(product)}
                    className="px-3 py-2 bg-blue-500 rounded-md text-white font-semibold"
                  >
                    Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[500px] w-[320px]">
            <h3 className="text-xl font-bold mb-4">
              Order {selectedProduct.name}
            </h3>

            <label className="block mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full border p-2 mb-4"
            />

            <label className="block mb-2">Delivery Charge</label>
            <input
              type="number"
              min="0"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(parseInt(e.target.value) || 0)}
              className="w-full border p-2 mb-4"
            />

            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border p-2 mb-4"
              placeholder="Enter your email"
            />

            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border p-2 mb-4"
              placeholder="Enter your phone number"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 mb-4"
              placeholder="Enter your address"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={closeModal}
                className="px-3 py-2 bg-gray-400 rounded-md text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-2 bg-green-500 rounded-md text-white font-semibold"
              >
                Confirm Order (৳
                {selectedProduct.price * quantity + deliveryCharge})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
