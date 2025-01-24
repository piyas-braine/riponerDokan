import React from "react";
import Icons from "./Icons";
import Links from "./Links";

const Footer = () => {
  return (
    <div className="">
      <footer className="px-6 divide-y  dark:bg-black dark:text-white ">
        <div className="container w-full flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="lg:w-1/3 pl-5">
            <Icons></Icons>
          </div>
          <div className="flex justify-around text-sm gap-x-3 gap-y-8  lg:w-2/3 ">
            <Links></Links>
          </div>
        </div>
        <div className="py-6 text-sm text-center dark:text-gray-200">
          © 2025 Company Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
