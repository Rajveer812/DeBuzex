import React from "react";
import RightSidebar from "../components/RightSidebar";
import CreatePost from "../components/CreatePost";

function PostArea() {
  return (
    <div className="grid grid-cols-3">

      <div className="col-span-2">
        <div className=""><CreatePost /></div>
        <div className="">All Post</div>
      </div>

      <div className="col-span-2">
        <div><RightSidebar /></div>
      </div>

    </div>
  );
}

export default PostArea;
