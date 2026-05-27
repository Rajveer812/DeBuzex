import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostItem from '../components/PostItem';
import { Compass, Trophy, Bug, Medal, CheckCircle } from 'lucide-react';
import RightSidebar from '../components/RightSidebar/RightSidebar';

function Explore() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('unsolved');
  
  // State for Unsolved Bugs
  const [unsolvedPosts, setUnsolvedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // State for Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Posts
        setPostsLoading(true);
        const postsRes = await axios.get('http://localhost:5000/api/post');
        // Filter only posts that are NOT resolved
        const openBugs = postsRes.data.filter(post => !post.isResolved);
        setUnsolvedPosts(openBugs);
        setPostsLoading(false);

        // Fetch Leaderboard
        setLeaderboardLoading(true);
        const rankRes = await axios.get('http://localhost:5000/api/users/leaderboard', { headers });
        setLeaderboard(rankRes.data);
        setLeaderboardLoading(false);

      } catch (err) {
        console.error("Failed to fetch explore data", err);
        setPostsLoading(false);
        setLeaderboardLoading(false);
      }
    };
    fetchData();
  }, []);

  // Shared Handlers for Posts
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUnsolvedPosts(unsolvedPosts.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post));
    } catch (err) { console.log(err); }
  };

  const submitSolution = async (postId, text) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/post/${postId}/solution`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUnsolvedPosts(unsolvedPosts.map(post => post._id === postId ? { ...post, solutions: response.data.solutions } : post));
    } catch (err) { console.log(err); }
  };

  const handleStar = async (postId, solutionId, rating) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/solution/${solutionId}/star`, { rating }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUnsolvedPosts(unsolvedPosts.map(post => post._id === postId ? { ...post, solutions: response.data.solutions } : post));
    } catch (err) { console.log(err); }
  };

  const handleAccept = async (postId, solutionId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/solution/${solutionId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Since it is now accepted, it is resolved! Remove it from the unsolved feed!
      if (response.data.isResolved) {
        setUnsolvedPosts(unsolvedPosts.filter(post => post._id !== postId));
      } else {
        setUnsolvedPosts(unsolvedPosts.map(post => post._id === postId ? { ...post, solutions: response.data.solutions, isResolved: response.data.isResolved } : post));
      }
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUnsolvedPosts(unsolvedPosts.filter(post => post._id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 py-4 pr-6 h-[calc(100vh-85px)] overflow-y-auto custom-scrollbar min-w-0">
        
        {/* Header & Navigation */}
        <div className="bg-[#0b1d35] rounded-xl p-4 border border-gray-800 mb-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold text-white">Explore</h1>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('unsolved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'unsolved' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              <Bug size={18} /> Unsolved Bugs
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'leaderboard' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              <Trophy size={18} /> Full Leaderboard
            </button>
          </div>
        </div>

        {/* Tab Content: UNSOLVED BUGS */}
        {activeTab === 'unsolved' && (
          <div className="flex flex-col gap-4">
            {postsLoading ? (
              <div className="text-center py-10 text-orange-400">Scanning for bugs...</div>
            ) : unsolvedPosts.length === 0 ? (
              <div className="text-center py-10 bg-[#050c1a] rounded-2xl border border-gray-800">
                <p className="text-gray-400">Wow! Every single bug on DebugIt has been solved! 🎉</p>
              </div>
            ) : (
              unsolvedPosts.map(post => (
                <PostItem 
                  key={post._id}
                  post={post} 
                  user={user} 
                  onLike={handleLike} 
                  onSubmitSolution={submitSolution} 
                  onStar={handleStar}
                  onAccept={handleAccept}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        {/* Tab Content: FULL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-[#050c1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0b1d35]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Medal className="text-yellow-500" /> Top Developers</h2>
              <span className="text-xs text-gray-400">{leaderboard.length} Ranked Members</span>
            </div>
            
            {leaderboardLoading ? (
              <div className="text-center py-10 text-yellow-400">Loading rankings...</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {leaderboard.map((u, index) => (
                  <div key={u._id} className={`flex items-center p-4 hover:bg-white/5 transition-colors ${user?._id === u._id ? 'bg-yellow-500/5' : ''}`}>
                    {/* Rank Number */}
                    <div className="w-12 text-center shrink-0">
                      <span className={`text-xl font-black ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-amber-600' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </span>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      {u.profilePic && u.profilePic !== "default-avatar.png" ? (
                        <img src={u.profilePic} alt="avatar" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 text-sm">
                          {u.username ? u.username.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-100 flex items-center gap-2">
                          {u.name} {user?._id === u._id && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-black">You</span>}
                        </div>
                        <div className="text-xs text-gray-500">@{u.username}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400 flex items-center justify-end gap-1"><CheckCircle size={14} /> {u.solutionsAccepted || 0}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Accepted</div>
                      </div>
                      <div className="text-right w-20">
                        <div className="text-sm font-bold text-yellow-400">{u.totalStars ? u.totalStars * 10 : 0}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total XP</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-[350px] shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Explore;
