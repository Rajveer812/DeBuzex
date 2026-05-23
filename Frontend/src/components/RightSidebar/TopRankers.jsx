import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

function TopRankers({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className='mx-2 my-4 bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 shadow-xl'>
        <div className='flex items-center gap-2 mb-4 border-b border-gray-800/50 pb-3'>
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className='font-bold text-gray-200 text-lg'>Top Debuggers</h2>
        </div>
        <div className='flex flex-col gap-2'>
            {leaderboard.map((user, index) => (
                <Link to={`/user/${user.username}`} key={user._id} className='flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <div className={`w-6 text-center font-bold text-sm ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                            #{index + 1}
                        </div>
                        <img src={user.profilePic || "default-avatar.png"} alt="avatar" className='w-8 h-8 rounded-full border border-indigo-500/30 object-cover' />
                        <div className='flex flex-col'>
                            <p className='text-sm font-semibold text-gray-200 leading-tight'>{user.name}</p>
                            <p className='text-xs text-gray-400'>@{user.username}</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <p className='text-sm font-bold text-yellow-500'>⭐ {user.totalStars}</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default TopRankers