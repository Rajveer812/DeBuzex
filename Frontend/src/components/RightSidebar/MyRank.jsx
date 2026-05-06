import React from 'react'

function MyRank() {
  return (
    <div className='mx-2 bg-[#0E1F3D] p-3 rounded-xl grid auto-rows-auto gap-4 font-syne'>
        <div className='grid grid-cols-3 '>

          <div className='rounded-full  border-4 border-indigo-500 h-20 w-20  grid place-items-center col-span-1' >
            <p>680</p>
          </div>

          <div className='col-span-2 text-[#38bdf8]'>
            <p className='font-[700] '>Global Rank</p>
            <p className='text-4xl font-[1000]'>#142</p>
          </div>

        </div>
        
        <div className='flex justify-center gap-5'>
    
              <div className='rounded-md bg-[#0b1830] text-center grid justify-center w-1/3 p-3 '>
                <p className='font-[700] text-[#38bdf8]'>80</p>
                <p className='text-[10px]'>Solutions</p>
              </div>
          
              <div className='rounded-md bg-[#0b1830] text-center grid place-items-center w-1/3 p-3 ' >
                <p className='font-[700] text-[#fbbf24]'>18</p>
                <p className='text-[10px]'>Accepted</p>
              </div>

              <div className='rounded-md  bg-[#0b1830]  text-center grid place-items-center w-1/3 p-3' >
                <p className='font-[700] text-[#38bdf8]'>4.7</p>
                <p className='text-[10px]'>Avg Stars</p>
              </div>

        </div>
    </div>
  )
}

export default MyRank