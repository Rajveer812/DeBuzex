import React from 'react';
import { ArrowRight, Zap, Medal, Trophy } from 'lucide-react';

function MyRanking() {
  return (

    <div className="  rounded-2xl   p-6 font-sans mx-auto shadow-2xl">
      
      <div className="flex justify-between items-center mb-5">
        <span className="text-[#4b6382] font-mono text-[11px] font-bold tracking-widest uppercase">
          // Your Rank
        </span>
      </div>

      {/* Main Rank Display */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-start translate-x-2">
          <span className="text-yellow-500 text-4xl font-black mt-2">#</span>
          <span className="text-white text-[5.5rem] leading-none font-black tracking-tighter">
            142
          </span>
        </div>
        <p className="text-[#4b6382] font-mono text-[13px] mt-4">
          out of <span className="text-[#5a769a]">3,241</span> members
        </p>
      </div>

      {/* XP Progress Section */}
      <div className="mb-10 w-full">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[#7c98b6] font-mono text-[13px]">XP Progress</span>
          <span className="text-[#38bdf8] font-mono text-[13px]">
            680 <span className="text-[#4b6382]">/ 1000</span>
          </span>
        </div>
        
       
        <div className="w-full h-2.5 bg-[#162137] rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-[#38bdf8] rounded-full" 
            style={{ width: '68%' }}
          ></div>
        </div>
        
        {/* XP Subtext */}
        <div className="flex text-xs font-mono text-[#4b6382] mt-3">
          <span>320 XP to unlock</span>
          <span className="text-[#7c98b6] ml-2 flex items-center gap-1">
            <Zap size={12} className="text-orange-500 fill-orange-500" /> Expert
          </span>
        </div>
      </div>

      {/* Full Leaderboard Button */}
      <button className="w-full flex items-center bg-[#131c2e] hover:bg-[#1a263e] transition-colors border border-white/5 rounded-xl p-3 group">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
          <Trophy size={22} className="text-white" />
        </div>
        
        <div className="flex flex-col items-start ml-4 flex-1">
          <span className="text-white font-bold text-[15px]">Full Leaderboard</span>
          <span className="text-[#4b6382] font-mono text-xs mt-0.5">
            See all 3,241 rankings
          </span>
        </div>
        
        <div className="w-10 h-10 bg-[#1e2a44] rounded-lg flex items-center justify-center group-hover:bg-[#253554] transition-colors shrink-0">
          <ArrowRight size={20} className="text-[#7c98b6] group-hover:text-white transition-colors" />
        </div>
      </button>
      
    </div>
  );
}

export default MyRanking;