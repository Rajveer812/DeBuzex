import React from "react";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";

function PostArea() {
  return (
    <div className="flex w-full">
      <div className="flex-1 pr-6 min-w-0">
        <div className="py-2"><CreatePost /></div>
        <div className="py-2"><Post /></div>
      </div>

      <div className="w-[350px] shrink-0">
        <div><RightSidebar /></div>
      </div>
    </div>
  );
}

export default PostArea;
