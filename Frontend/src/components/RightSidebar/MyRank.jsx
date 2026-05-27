import React from 'react'
import { Star } from 'lucide-react'

function MyRank({ myStats }) {
  // If the user has no stats (e.g., they haven't given any solutions), we show default values
  const rankDisplay = myStats ? `#${myStats.globalRank}` : "Unranked";
  const solutions = myStats ? myStats.solutionsGiven : 0;
  const accepted = myStats ? myStats.solutionsAccepted : 0;
  const avgStars = myStats ? myStats.avgStars : "0.0";

  return (
    <div className='mx-2 mt-4 p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0b1d35] to-[#020617] border border-white/5 border-t-sky-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] font-syne relative overflow-hidden group'>
        {/* Animated Background Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-sky-400/30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -ml-16 -mb-16 transition-all duration-700 group-hover:bg-indigo-400/30"></div>
        
        <div className='flex items-center gap-6 mb-8 relative z-10'>
          {/* Star Icon Container */}
          <div className='relative h-20 w-20 flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-500 cursor-default' >
            <Star className="absolute  text-[#0ea5e9] fill-[#0ea5e9]/30 drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]" size={86} strokeWidth={0.5} />
            <p className='text-xl  font-black text-white z-10 mt-1 drop-shadow-md'>{myStats ? myStats.totalStars : 0}</p>
          </div>

          {/* Rank Display */}
          <div className='flex flex-col justify-center items-start'>
            <p className='font-bold text-sky-400/90 text-xs tracking-widest uppercase mb-1 drop-shadow-sm'>Global Rank</p>
            <p className='text-4xl font-[1000] bg-clip-text text-transparent bg-gradient-to-br from-white via-sky-100 to-sky-400 tracking-tight drop-shadow-lg leading-none'>{rankDisplay}</p>
            <p className='mt-2 text-[10px] font-bold text-indigo-300 drop-shadow-md bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30 uppercase tracking-widest'>
              {myStats && myStats.rank ? myStats.rank : "Novice"}
            </p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className='grid grid-cols-3 gap-3 relative z-10'>
              <div className='rounded-xl bg-white/5 backdrop-blur-sm text-center py-4 px-2 border border-white/5 hover:bg-white/10 hover:border-sky-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group/stat'>
                <p className='font-black text-sky-400 text-xl drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] group-hover/stat:scale-110 transition-transform'>{solutions}</p>
                <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5'>Solutions</p>
              </div>
          
              <div className='rounded-xl bg-white/5 backdrop-blur-sm text-center py-4 px-2 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group/stat' >
                <p className='font-black text-emerald-400 text-xl drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] group-hover/stat:scale-110 transition-transform'>{accepted}</p>
                <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5'>Accepted</p>
              </div>

              <div className='rounded-xl bg-white/5 backdrop-blur-sm text-center py-4 px-2 border border-white/5 hover:bg-white/10 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group/stat' >
                <p className='font-black text-amber-400 text-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] group-hover/stat:scale-110 transition-transform'>{avgStars}</p>
                <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5'>Avg Stars</p>
              </div>
        </div>
    </div>
  )
}

export default MyRank