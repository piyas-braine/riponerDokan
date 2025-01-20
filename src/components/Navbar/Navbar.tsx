import Image from "next/image";
import React from "react";
import logo from "../../../public/images/Logo.svg";

const Navbar = () => {
  return (
    <div className="flex justify-between w-full items-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src={logo} alt="Logo" width={31} height={29}></Image>
        <h2 className="text-[25px] font-bold">RiponDokan</h2>
      </div>
      {/* routes */}
      <div className="flex space-x-10">
        <ul className="flex items-center space-x-8 font-semibold">
          <li>Catalogue</li>
          <li>Fashion</li>
          <li>Favourite</li>
          <li>Lifestyle</li>
        </ul>
        <button className="bg-black text-white font-semibold px-5 py-2 rounded-md">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
