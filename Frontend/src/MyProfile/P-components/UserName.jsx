import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../../assets/Designer1.png'

function UserName() {
  return (
    <div className='grid grid-cols-3'>
        <div className='col-span-2'>

            <div className='grid grid-cols-9 grid-flow-col'>
                <div className='col-span-1'>
                    <img className='rounded-full block-20 border-4  border-r-indigo-500' src={avatar}></img>
                </div>
                <div className='col-span-8 wrap-break-word'>
                    <p>Mr. Xeta</p>
                    <p>sdklwsqwhfuiqewhiwqhdwiuqhduwhdiuwhyfiuyfouwqyfoyqofyuifyhsuhfwuiyfuwqyfuwyfuwyfoqeiyfiqhfiuqefiufw</p>
                </div>
            </div> 

        </div>
        <div className=''>
             <Link to="/editProfile">Edit Profile</Link>
        </div>
    </div>
  )
}

export default UserName