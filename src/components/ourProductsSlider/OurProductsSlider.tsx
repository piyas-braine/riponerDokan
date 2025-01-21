"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import firstSlide from "../../../public/images/Rectangle 20.svg";
import secondSlide from "../../../public/images/Rectangle 21.svg";
import thirdSlide from "../../../public/images/Rectangle 22.svg";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";

// Dummy product data
export const products = [
  {
    id: 1,
    name: "Hoodies $ Sweetshirt",
    price: "$49.99",
    image: firstSlide,
  },
  {
    id: 2,
    name: "Coats & Parkas",
    price: "$79.99",
    image: secondSlide,
  },
  {
    id: 3,
    name: "Tees & T-Shirt",
    price: "$99.99",
    image: thirdSlide,
  },
  {
    id: 4,
    name: "Product 4",
    price: "$59.99",
    image: "/images/product4.jpg",
  },
  {
    id: 5,
    name: "Product 5",
    price: "$89.99",
    image: "/images/product5.jpg",
  },
];

const OurProductsSlider = () => {
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
                src={product.image}
                alt={product.name}
                width={400}
                height={200}
                objectFit="cover"
                className="rounded-t-lg"
              />
              <div className="flex  justify-between items-center mt-4">
                <div>
                  <h3 className="text-xl font-semibold ">{product.name}</h3>
                  <p className="text-lg text-[#7F7F7F]">{product.price}</p>
                  <button className="border border-black font-semibold px-3 py-1 text-sm mt-2 rounded-md">
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
    </div>
  );
};

export default OurProductsSlider;
