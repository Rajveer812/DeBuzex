import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import UserName from './P-components/UserName';
import ActivityBar from './P-components/ActivityBar';
import MiniNav from './P-components/MiniNav';
import MyRanking from './P-components/MyRanking';
import MyPost from './P-components/MyPost';
import Solution from './P-components/Solution';

function MyProfile() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch full stats using username
        const response = await axios.get(`http://localhost:5000/api/users/${user.username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) return <div className="p-8 text-sky-400 text-center">Loading profile...</div>;
  if (!user) return <div className="p-8 text-gray-400 text-center">Please log in to view your profile.</div>;
  if (error) return <div className="p-8 text-red-400 text-center">{error}</div>;
  if (!profileData) return null;

  return (
    <div className='grid grid-cols-5 gap-4 my-3'> 
      <div className='col-span-4'>
        <div><UserName profileData={profileData} /></div>
        <div><ActivityBar stats={profileData.stats} /></div>
        <div className='grid grid-cols-8 gap-x-3 mt-4'>
          <div className='col-span-5 rounded-md'>
            <div className='bg-[#0b1d35] rounded-xl p-4 border border-gray-800'>
              <MiniNav activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="mt-4">
                {activeTab === 'posts' ? (
                  <MyPost username={user.username} />
                ) : (
                  <Solution username={user.username} />
                )}
              </div>
            </div>
          </div>
          <div className='col-span-3 bg-[#0b1d35] rounded-xl border border-gray-800 overflow-hidden'>
            <div><MyRanking stats={profileData.stats} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile