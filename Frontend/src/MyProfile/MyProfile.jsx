import React from 'react'
import UserName from './P-components/UserName'
import ActivityBar from './P-components/ActivityBar'
import MiniNav from './P-components/MiniNav'
import MyRanking from './P-components/MyRanking'
function MyProfile() {
  return (
    <div className='grid grid-cols-5 gap-4 my-3'> 

      <div className='col-span-4 '>
        <div><UserName/></div>
        <div><ActivityBar/></div>
        <div className='grid grid-cols-8 gap-x-3'>

          <div  className='col-span-5  rounded-md'>
            <div className='bg-[#0b1d35] rounded-md'><MiniNav /></div>
          </div>

          <div className='col-span-3 bg-[#0b1d35] rounded-md'>
            <div ><MyRanking /></div>
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default MyProfile