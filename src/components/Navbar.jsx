"use client";

import Link from "next/link";
import { BsCartFill } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="w-full py-2 px-6  flex items-center justify-between bg-green-200">
      <Link href="/"><div
        
        className="cursor-pointer logo flex items-center justify-start  "
      >
        <img className="w-24 " src="/logo.png" alt="" />
        <h2 className="text-3xl mt-5 text-black font-[Norican] font-bold">
          Ship<span className="text-green-700">Boy</span>
        </h2>
      </div></Link>
      <div className="tabs flex items-center justify-center gap-5 mr-16 group:">
        <Link href="/cart">
        <span className="group p-3 transition-all cursor-pointer ease-in-out hover:bg-green-300 rounded-2xl relative flex flex-col items-center justify-center">
            <BsCartFill className="text-2xl font-bold text-green-500 group-hover:text-green-600 transition-all ease-in-out group-hover:scale-[1.2]" />
            <span className="absolute -bottom-8 left-0 z-50 rounded-md text-[13px] font-bold tracking-wide px-3 py-1 text-green-600 bg-green-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 pointer-events-none">
              Cart
            </span>
          </span>
        </Link>
        <Link href="/orders">
          <span className="group p-3 transition-all cursor-pointer ease-in-out hover:bg-green-300 rounded-2xl relative flex flex-col items-center justify-center">
            <FaBoxOpen className="text-2xl font-bold text-green-500 group-hover:text-green-600 transition-all ease-in-out group-hover:scale-[1.2]" />
            <span className="absolute -bottom-8 -left-2 z-50 rounded-md text-[13px] font-bold tracking-wide px-3 py-1 text-green-600 bg-green-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 pointer-events-none">
              Orders
            </span>
          </span>
        </Link>
        <Link href="/profile">
          <span className="group p-3 transition-all cursor-pointer ease-in-out hover:bg-green-300 rounded-2xl relative flex flex-col items-center justify-center">
            <FaUser className="text-2xl font-bold text-green-500 group-hover:text-green-600 transition-all ease-in-out group-hover:scale-[1.2]" />
            <span className="absolute -bottom-8 -left-2 z-50 rounded-md text-[13px] font-bold tracking-wide px-3 py-1 text-green-600 bg-green-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 pointer-events-none">
              Profile
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
