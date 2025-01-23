"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

// Define the Product type
interface Product {
  id: string;
  name: string;
  price: string;
  productImages: string[];
}

interface CartItem extends Product {
  quantity: number; // Add a quantity property to manage cart items
}

const OurProductsSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const cartItems = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItem[];

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
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
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="w-auto">
              <Image
                src={`/${product.productImages[0].split("/")[1]}/${
                  product.productImages[0].split("/")[2]
                }/${product.productImages[0].split("/")[3]}`}
                alt={product.name}
                width={400}
                height={200}
                objectFit="cover"
                className="rounded-t-lg"
              />

              <div className="flex justify-between items-center mt-4">
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-lg text-[#7F7F7F]">{product.price}</p>
                  <button
                    onClick={() => addToCart(product)} // Call addToCart function
                    className="border border-black font-semibold px-3 py-1 text-sm mt-2 rounded-md"
                  >
                    Quick Add
                  </button>
                </div>
                <div>
                  <Link href={`/ourProductDetails/${product.id}`}>
                    <button>
                      <HiArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <ToastContainer />
    </div>
  );
};

export default OurProductsSlider;
