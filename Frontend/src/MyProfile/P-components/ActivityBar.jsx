import React from 'react'
import {Medal,CircleCheckBig,NotepadText,MessageSquareCode,Star} from 'lucide-react';

function ActivityBar({ stats }) {
  if (!stats) return null;

  return (
    <div className='flex justify-between gap-x-4 py-3 '>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center flex flex-col items-center'>
                <Medal className="text-yellow-500 mb-1" />
                <p className='font-bold text-lg'>{stats.totalStars * 10}</p>
                <p className='text-xs text-gray-400'>total xp</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center flex flex-col items-center'>
                <CircleCheckBig className="text-green-500 mb-1" />
                <p className='font-bold text-lg'>{stats.solutionsAccepted}</p>
                <p className='text-xs text-gray-400'>accepted</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center flex flex-col items-center'>
                <NotepadText className="text-blue-400 mb-1" />
                <p className='font-bold text-lg'>{stats.solutionsGiven}</p>
                <p className='text-xs text-gray-400'>solutions</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className=' place-items-center flex flex-col items-center'>
                <MessageSquareCode className="text-purple-400 mb-1" />
                <p className='font-bold text-lg'>{stats.postsMade}</p>
                <p className='text-xs text-gray-400'>posts made</p>
            </div>
        </div>
        
        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center flex flex-col items-center'>
                <Star strokeWidth={3} className="text-yellow-400 mb-1" />
                <p className='font-bold text-lg'>{stats.avgStars}</p>
                <p className='text-xs text-gray-400'>avg stars</p>
            </div>
        </div>

    </div>
  )
}

export default ActivityBar