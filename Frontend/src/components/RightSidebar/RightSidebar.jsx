import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import MyRank from './MyRank'
import TopRankers from './TopRankers'

function RightSidebar() {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/leaderboard`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setLeaderboard(res.data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchLeaderboard();
  }, []);

  const myStats = leaderboard.find(u => u._id === user?._id);

  return (
    <aside 
      className="custom-scrollbar group fixed right-0 top-[95px] h-[calc(100vh-58px)] bg-[#0d0f14]/95 backdrop-blur-md border-l border-white/10 z-50 flex flex-col w-[350px] px-2 overflow-y-auto pb-6">
        <MyRank myStats={myStats} />
        <TopRankers leaderboard={leaderboard.slice(0, 5)} />
    </aside>
  )
}

export default RightSidebar