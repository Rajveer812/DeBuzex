import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Star } from 'lucide-react'

function TopRankers({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className='mx-2 my-4 p-5 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0b1d35] to-[#020617] border border-white/5 border-t-sky-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] font-syne relative overflow-hidden group/container'>
        {/* Animated Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover/container:bg-sky-400/20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl -ml-12 -mb-12 transition-all duration-700 group-hover/container:bg-indigo-400/20"></div>

        <div className='flex items-center gap-2 mb-4 border-b border-white/10 pb-3 relative z-10'>
            <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <h2 className='font-bold text-white text-lg tracking-wide'>Top Debuggers</h2>
        </div>
        <div className='flex flex-col gap-2 relative z-10'>
            {leaderboard.map((user, index) => (
                <Link to={`/user/${user.username}`} key={user._id} className='group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10'>
                    <div className='flex items-center gap-3'>
                        <div className={`w-6 text-center font-bold text-sm ${index === 0 ? 'text-yellow-400 drop-shadow-md' : index === 1 ? 'text-gray-300 drop-shadow-md' : index === 2 ? 'text-amber-600 drop-shadow-md' : 'text-gray-500'}`}>
                            #{index + 1}
                        </div>
                      {user.profilePic && user.profilePic !== "default-avatar.png" ? (
                        <img src={user.profilePic} alt="avatar" className='w-8 h-8 rounded-full border border-indigo-500/30 object-cover' />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                        <div className='flex flex-col'>
                            <p className='text-sm font-semibold text-gray-200 leading-tight group-hover:text-white transition-colors'>{user.name}</p>
                            <p className='text-[10px] text-gray-500'>@{user.username}</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <div className='flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] group-hover:bg-yellow-500/20 group-hover:border-yellow-500/40 transition-all'>
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/40 drop-shadow-sm" />
                            <p className='text-xs font-bold text-yellow-500 drop-shadow-sm'>{user.totalStars}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default TopRankers