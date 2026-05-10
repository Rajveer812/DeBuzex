import React from "react";
import img from "../assets/Designer1.png";
import axios from 'axios';
import { AuthContext } from '../components/Auth/AuthModal';

function CreatePost() {
  return (
    <form className="border rounded-xl bg-[#0E1F3D]  border-white/10 p-3">
      <div>
        <h3 className="p-2">Post a Problem</h3>

        <div className=" ">

          <div className="flex  gap-x-2 pb-2">
            <img src={img} alt="user" className="w-10 h-10 rounded-full " />
            <input className="rounded-md bg-[#0b1830] p-1 w-full  " type="text" placeholder="Title of your problem"/>
          </div>
          

          <textarea
            placeholder="Type problem here..."
            className="w-full bg-[#0b1830] px-4 py-2  rounded-lg focus:ring-1 focus:ring-white-100 focus:outline-none resize-none overflow-hidden min-h-[30px]"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          ></textarea>
        </div>
        
        <div className="flex justify-center gap-5">
          <p>Choose Category</p>  
          <div>
            <input type="checkbox" id="android" />
            <label htmlFor="android">Android</label>
          </div>
          <div>
            <input type="checkbox" id="ios" />
            <label htmlFor="ios">iOS</label>
          </div>
          <div>
            <input type="checkbox" id="windows" />
            <label htmlFor="windows">Windows</label>
          </div>
          <div>
            <input type="checkbox" id="macos" />
            <label htmlFor="macos">MacOS</label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 gap-4">
          <label className="cursor-pointer bg-[#162544] hover:bg-[#1b2d52] transition px-4 py-2 rounded-lg border border-white/10 text-sm">
          Upload Image
          <input type="file" accept="image/*" className="hidden" />
          </label>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white font-medium">Submit</button>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;