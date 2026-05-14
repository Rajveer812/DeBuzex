import React from "react";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";

function PostArea() {
  return (
    <div className="grid grid-cols-3">

      <div className="col-span-2 ">
        <div className="py-2"><CreatePost /></div>
        <div className="py-2"><Post /></div>
      </div>

      <div className="col-span-2">
        <div><RightSidebar /></div>
      </div>

    </div>
  );
}

export default PostArea;
