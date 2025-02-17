"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { products } from "../../../../data/products";
import { use } from "react"; // Import use to unwrap the promise

export default function OrderPage({ params }: { params: { id: string } }) {
  const unwrappedParams = use(Promise.resolve(params)) as { id: string };
  console.log("Unwrapped Params:", unwrappedParams); // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (unwrappedParams?.id) {
      const foundProduct = products.find(
        (product) => product.id === Number(unwrappedParams.id)
      );
      console.log("Found product:", foundProduct); // Debugging log
      setProduct(foundProduct || null);
    }
  }, [unwrappedParams?.id]);

  useEffect(() => {
    if (product) {
      console.log("Product loaded:", product); // Debugging log
      const numericPrice = parseFloat(product.price.replace("$", "")); // Convert price to number
      if (!isNaN(numericPrice)) {
        setTotalPrice(quantity * numericPrice);
      } else {
        console.log("Invalid product price:", product.price);
        setTotalPrice(0);
      }
    }
  }, [quantity, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    setQuantity(newQuantity);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const orderData = {
      customerEmail: formData.get("email"),
      customerPhone: formData.get("phone"),
      address: formData.get("address"),
      subTotal: totalPrice.toFixed(2),
      items: {
        id: product?.id,
        name: product?.name,
        image: product?.image,
        price: product?.price,
        quantity,
      },
    };

    console.log(orderData); // Replace with your API call
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-600">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Order Now: {product.name}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        {/* Product Image */}
        <div className="flex justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={160}
            height={160}
            className="object-cover rounded-lg"
          />
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="font-semibold text-gray-800">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            min={1}
            onChange={handleQuantityChange}
            className="w-16 border rounded-lg px-2 py-1 text-center"
          />
        </div>

        {/* Total Price Display */}
        <div className="text-lg font-semibold text-gray-800">
          Total Price: ${totalPrice.toFixed(2)}
        </div>

        {/* Customer Email */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        {/* Customer Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Your Address"
          className="w-full border rounded-lg px-4 py-2"
          rows={4}
          required
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primaryColor text-white py-2 rounded-lg"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
