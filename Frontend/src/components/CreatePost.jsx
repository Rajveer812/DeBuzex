import React from "react";
import img from "../assets/Designer1.png";

function CreatePost() {
  return (
    <form className="border rounded-xl  border-white/10 p-3">
      <div>
        <h3 className="p-2">Ask for a solution</h3>

        <div className=" ">

          <div className="flex  gap-x-2 pb-2">
            <img src={img} alt="user" className="w-10 h-10 rounded-full " />
            <input className="rounded-md border p-2 w-full  " type="text" placeholder="Title of your problem"/>
          </div>
          

          <textarea
            placeholder="Type problem here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none overflow-hidden min-h-[40px]"
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

        <div className="text-center flex justify-between mt-3">
          <input type="file" accept="image/*" />
          <button className="rounded-full border p-2">Submit</button>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;