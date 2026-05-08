import React from 'react'
import {Medal,CircleCheckBig,NotepadText,MessageSquareCode,Star} from 'lucide-react';

function ActivityBar() {
  return (
    <div className='flex justify-between gap-x-4 py-3 '>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center'>
                <Medal />
                <p className=''>680</p>
                <p>total xp</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center'>
                <CircleCheckBig />
                <p>18</p>
                <p>accepted</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center'>
                <NotepadText />
                <p>24</p>
                <p>solutions</p>
            </div>
        </div>

        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className=' place-items-center'>
                <MessageSquareCode />
                <p>11</p>
                <p>posts made</p>
            </div>
        </div>
        
        <div className='text-center rounded-md bg-[#0b1d35] w-full h-23 grid place-items-center'>
            <div className='place-items-center'>
                <Star strokeWidth={3} />
                <p>4.1</p>
                <p>avg stars</p>
            </div>
        </div>

    </div>
  )
}

export default ActivityBar