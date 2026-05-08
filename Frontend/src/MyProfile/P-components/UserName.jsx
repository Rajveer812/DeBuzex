import React,{useState,useEffect,useContext} from 'react'
import { Link } from 'react-router-dom'
import avatar from '../../assets/Designer1.png'
import axios from 'axios'

function UserName() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
     const [error, setError] = useState('');

     useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const token=localStorage.getItem("token");
                if (!token) {
                    setError("You need to be logged in to view this profile.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfileData(response.data);
                setLoading(false);

            }catch(err){
                setError("Failed to load profile data");
                setLoading(false);
            }
        };
        fetchProfile();
     },[]);
    if (loading) return <div className="p-8 text-sky-400">Loading profile...</div>;
    if (error) return <div className="p-8 text-red-400">{error}</div>;


    return (
        <div className='rounded-xl bg-[#0b1d35]  p-8 grid grid-cols-8'>
        
        <div className='  grid grid-cols-9 grid-flow-col col-span-7'>

            <div className='col-span-1'>
                <img className='rounded-xl block-20 border-2  border-r-indigo-500' src={avatar}></img>
            </div>

            <div className='col-span-8 wrap-break-word'>
                <p className=' font-outfit font-[700] text-3xl'>{profileData.name || profileData.username}</p>
                <p className='font-outfit text-sm text-blue-600 dark:text-sky-400'>@{profileData.username}</p>
                <p className='text-sm text-blue-600 dark:text-sky-400/50'>{profileData.bio ? profileData.bio : "This user hasn't written a bio yet."}</p>
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