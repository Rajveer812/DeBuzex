import React from "react";
import img from "../assets/img.png";

function Navbar() {
  return (
    <nav>
      <div className="flex justify-between p-[10px] shadow-purple-600">
        <div>
          <a>
            <img src={img} className="w-50 "></img>
          </a>
        </div>
        <div className="">
          <form>
            <input className=" rounded-full py-2 px-10 w-130 inset-ring-blue-500 inset-ring-2 " placeholder="Search"></input>
            <button className="  inset-ring-blue-500 inset-ring-2 py-2 px-10 rounded-full ml-5" type="submit">Search</button>
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
