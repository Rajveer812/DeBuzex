import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../../assets/Designer1.png'

function UserName() {
  return (
    <div className='rounded-xl bg-[#0b1d35]  p-8 grid grid-cols-8'>
        
        <div className='  grid grid-cols-9 grid-flow-col col-span-7'>
            <div className='col-span-1'>
                <img className='rounded-xl block-20 border-2  border-r-indigo-500' src={avatar}></img>
            </div>
            <div className='col-span-8 wrap-break-word'>
                <p className=' font-outfit font-[700] text-3xl'>Mr. Xeta</p>
                <p className='font-outfit text-sm text-blue-600 dark:text-sky-400'>@xeta11</p>
                <p className='text-sm text-blue-600 dark:text-sky-400/50'>Full-stack dev obsessed with fixing things that shouldn't be broken. PC & Android troubleshooter. MERN stack enthusiast. Here to help and learn. </p>
            </div>
        </div> 

        <div className=' ml-4 col-span-1 grid-cols-3 content-center'>
             <Link to="/editProfile">Edit Profile</Link>
        </div>

    </div>
  )
}

export default UserName