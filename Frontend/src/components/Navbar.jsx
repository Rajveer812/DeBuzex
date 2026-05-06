import React from "react";
import img from "../assets/img.png";
import {Search} from 'lucide-react'
function Navbar() {
  return (
    <nav className="">
      <div className="flex justify-between pt-[15px] px-4 pb-2 shadow-purple-600 border-white/10 border-b">
        <div>
          <a>
            <img src={img} className="w-40 "></img>
          </a>
        </div>
        <div className="">
          <form>
            <input className="bg-[#0E1F3D] rounded-full py-2 px-10 w-130 inset-ring-blue-300 inset-ring-1 " placeholder="Search"></input>
            <button className=" border border-white/10 py-2 px-2 rounded-full ml-2" type="submit"> <Search size={16} color="#223b5d" strokeWidth={3} /></button>
          </form>
        </div>
        <div className="items-center  object-top-right">
          <a><button className=" inset-ring-blue-500 inset-ring-2 rounded-full py-2 px-10">Login</button></a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
