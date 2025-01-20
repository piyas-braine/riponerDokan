import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Icons = () => {
  return (
    <div>
      <h2 className="text-[25px] font-bold ">RiponDokan</h2>
      <p className="mt-3">
        Complete your style with awesome <br />
        cloths from us
      </p>
      <div className="mt-5 flex gap-3">
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EBD96B" }}
        >
          <FaFacebookF className="text-black" />
        </a>
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EBD96B" }}
        >
          <FaInstagram className="text-black" />
        </a>
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EBD96B" }}
        >
          <FaTwitter className="text-black" />
        </a>
        <a
          href="#"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EBD96B" }}
        >
          <FaLinkedinIn className="text-black" />
        </a>
      </div>
    </div>
  );
};

export default Icons;
