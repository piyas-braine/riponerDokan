"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../../../public/images/logo.png";
// import { BsCart } from "react-icons/bs";
import Link from "next/link";
// import { FaShoppingBag } from "react-icons/fa";
import { BiShoppingBag } from "react-icons/bi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartLength, setCartLength] = useState<number>(0);

  // Fetch cart length from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      setCartLength(cartItems.length); // Set the length of items in cart
      console.log("Cart Items:", cartItems); // Debug
    }
  }, []);

  return (
    <nav className="relative z-50 flex justify-between w-full items-center px-4 py-1 bg-white">
      {/* Logo */}
      <Link href={"/"}>
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={60} height={40} className="object-contain" />
          <h2 className="text-2xl font-bold">Ripon Miar Dokan</h2>
        </div>
      </Link>

      {/* Menu for larger devices */}
      <div className="hidden md:flex space-x-5">
        <ul className="flex items-center space-x-8 font-semibold">
          <li className="hover:text-gray-700 cursor-pointer">Products</li>
          <Link href={"myCart"}>
            <li className="relative hover:text-gray-700 cursor-pointer">
              <BiShoppingBag size={28} />
              <span className="absolute -top-0 -right-1 flex justify-center items-center text-xs text-white bg-black rounded-full w-4 h-4">
                {cartLength > 0 ? cartLength : 0}
              </span>
            </li>
          </Link>
        </ul>
      </div>

      {/* Hamburger Menu for smaller devices */}
      <div className="md:hidden">
        <button
          className="focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white md:hidden z-50">
          <ul className="flex flex-col items-center space-y-4 py-4 font-semibold">
            {/* <li className="hover:text-gray-700 cursor-pointer">Products</li> */}
            <Link href={"myCart"}>
              <li className="relative hover:text-gray-700 cursor-pointer">
                <BiShoppingBag size={28} />
                <span className="absolute top-0 right-0 flex justify-center items-center text-xs text-white bg-black rounded-full w-4 h-4">
                  {cartLength > 0 ? cartLength : 0}
                </span>
              </li>
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
