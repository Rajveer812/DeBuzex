import React from 'react'
import { Link } from 'react-router-dom'

function UserName({ profileData }) {
    if (!profileData) return null;

    return (
        <div className='rounded-xl bg-[#0b1d35]  p-8 grid grid-cols-8'>
        
        <div className='  grid grid-cols-9 grid-flow-col col-span-7'>

            <div className='col-span-1'>
                {profileData.profilePic && profileData.profilePic !== "default-avatar.png" ? (
                  <img className='rounded-xl block-20 border-2 border-indigo-500 object-cover w-20 h-20' src={profileData.profilePic} alt="avatar"></img>
                ) : (
                  <div className="rounded-xl border-2 border-indigo-500 w-20 h-20 bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-4xl">
                    {profileData.username.charAt(0).toUpperCase()}
                  </div>
                )}
            </div>

            <div className='col-span-8 wrap-break-word'>
                <p className=' font-outfit font-[700] text-3xl'>{profileData.name || profileData.username}</p>
                <p className=' text-[12px] font-outfit text-sm text-blue-600 dark:text-sky-400'>@{profileData.username}</p>
                <p className='text-sm text-[#5d80a5] dark:text-sky-400/50'>{profileData.bio ? profileData.bio : "This user hasn't written a bio yet."}</p>
            </div>
        </div> 

        <div className=' ml-4 col-span-1 grid-cols-3 content-center'>
             <Link to="/editProfile" 
             className="bg-blue-600/20 p-3 text-sky-400 hover:bg-blue-600/40 text-center py-2 rounded-lg transition-colors text-sm font-semibold border border-blue-500/30"
            >Edit Profile</Link>
        </div>

    </div>
  )
}

export default UserName