import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className=" bg-white flex flex-wrap items-center py-4 text-sm max-w-7xl mx-auto">
      <div className="flex-1 flex justify-between items-center">
        <a href="#" className="text-xl">
          <Logo></Logo>
        </a>
      </div>

      <label htmlFor="menu-toggle" className="pointer-cursor md:hidden block">
        <svg
          className="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </label>
      <input className="hidden" type="checkbox" id="menu-toggle" />

      <div
        className="hidden flex-1 md:flex md:items-center md:w-auto w-full "
        id="menu"
      >
        <nav>
          <ul className="md:flex items-center justify-between text-base border-[1px] shadow-sm px-5 rounded-full text-gray-700  md:pt-0">
            <li>
              <a
                className="px-4 py-3  text-sm text-black block font-semibold"
                href="#"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="px-4 py-3 w-32  text-sm text-black block font-semibold"
                href="#"
              >
                Case Studies
              </a>
            </li>
            <li>
              <a
                className="px-4 py-3  text-sm text-black block font-semibold"
                href="#"
              >
                Impact
              </a>
            </li>
            <li>
              <a
                className="px-4 py-3  text-sm text-black block font-semibold"
                href="#"
              >
                Operations
              </a>
            </li>
            <li>
              <a
                className="px-4 py-3  text-sm text-black block font-semibold md:mb-0 mb-2"
                href="#"
              >
                Career
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <a href="/contact" className="">
          <div className="  text-sm text-black block font-semibold cursor-pointer w-fit bg-surface_white hover:bg-surface_white_2 hidden md:block  font-spaceGrotesk border-neutral_3 border-[1px] px-[36px] py-[10px] rounded-full">
            <p>Build With us</p>
          </div>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
