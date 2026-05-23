import React from 'react'

function MyRank({ myStats }) {
  // If the user has no stats (e.g., they haven't given any solutions), we show default values
  const rankDisplay = myStats ? `#${myStats.globalRank}` : "Unranked";
  const solutions = myStats ? myStats.solutionsGiven : 0;
  const accepted = myStats ? myStats.solutionsAccepted : 0;
  const avgStars = myStats ? myStats.avgStars : "0.0";

  return (
    <div className='mx-2 mt-4 bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 shadow-xl font-syne relative overflow-hidden'>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className='grid grid-cols-3 mb-6 relative z-10 items-center'>
          <div className='rounded-full border-4 border-indigo-500/50 h-16 w-16 grid place-items-center col-span-1 bg-[#050c1a] shadow-[0_0_15px_rgba(99,102,241,0.2)]' >
            <p className='text-xl font-bold text-indigo-400'>{myStats ? myStats.totalStars : 0}</p>
          </div>

          <div className='col-span-2 text-[#38bdf8] flex flex-col justify-center ml-2'>
            <p className='font-semibold text-gray-400 text-xs tracking-wider uppercase mb-1'>Global Rank</p>
            <p className='text-3xl font-[1000] text-white tracking-tight'>{rankDisplay}</p>
          </div>
        </div>
        
        <div className='flex justify-center gap-3 relative z-10'>
              <div className='rounded-xl bg-[#050c1a] text-center grid justify-center w-1/3 p-3 border border-gray-800/50'>
                <p className='font-bold text-[#38bdf8] text-lg'>{solutions}</p>
                <p className='text-[10px] text-gray-500 uppercase tracking-wider mt-1'>Solutions</p>
              </div>
          
              <div className='rounded-xl bg-[#050c1a] text-center grid place-items-center w-1/3 p-3 border border-gray-800/50' >
                <p className='font-bold text-[#4ade80] text-lg'>{accepted}</p>
                <p className='text-[10px] text-gray-500 uppercase tracking-wider mt-1'>Accepted</p>
              </div>

              <div className='rounded-xl bg-[#050c1a] text-center grid place-items-center w-1/3 p-3 border border-gray-800/50' >
                <p className='font-bold text-[#fbbf24] text-lg'>{avgStars}</p>
                <p className='text-[10px] text-gray-500 uppercase tracking-wider mt-1'>Avg Stars</p>
              </div>
        </div>
    </div>
  )
}

export default MyRank