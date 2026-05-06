import React from 'react'
import MyRank from './MyRank'
import TopRankers from './TopRankers'

function RightSidebar() {
  return (
    <aside 
      className="group fixed right-0 top-[95px] h-[calc(100vh-58px)] bg-[#0d0f14]/95 backdrop-blur-md border-l border-white/10 z-50 flex flex-col w-[350px] px-2 ">
        <MyRank/>
        <TopRankers/>
    </aside>
  )
}

export default RightSidebar