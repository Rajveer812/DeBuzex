import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquare, Calendar, MapPin, ChevronLeft, Loader2, Check } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { socket } from '../socket';

function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [requestStatus, setRequestStatus] = useState(''); // 'idle', 'sending', 'sent'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileUser(data);
      } catch (err) {
        console.error(err);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const handleAskForHelp = async () => {
    if (!profileUser || !currentUser) return;
    try {
      setRequestStatus('sending');
      const token = localStorage.getItem('token');
      // Create chat/send request
      await axios.post(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/chat`, 
        { userId: profileUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Emit socket event to instantly notify the target user
      socket.emit("new chat request", profileUser._id);

      setRequestStatus('sent');
    } catch (err) {
      console.error(err);
      setRequestStatus('idle'); // revert on error
      alert("Failed to send request.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
        <p className="text-xl mb-4">{error}</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">Back to Feed</Link>
      </div>
    );
  }

  // Format the joined date nicely
  const joinedDate = new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) || "Jan 2025";

  // Initials for avatar fallback
  const initials = profileUser.name ? profileUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "RK";

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b1d35] hover:bg-[#12284c] text-gray-300 rounded-lg text-sm font-medium transition border border-gray-800">
          <ChevronLeft className="w-4 h-4" />
          Back to Feed
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="relative bg-[#0b1d35] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        {/* Top Gradient Border Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            
            {/* Left side: Avatar + Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full sm:w-auto">
              
              {/* Avatar Box */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] flex-shrink-0 shadow-lg">
                <div className="w-full h-full bg-[#8c9eff] rounded-xl overflow-hidden flex items-center justify-center">
                  {profileUser.profilePic ? (
                    <img src={profileUser.profilePic} alt={profileUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white tracking-wider">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-col gap-1 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{profileUser.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-400">@{profileUser.username}</p>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {profileUser.stats?.rank || "Debugger"}
                  </span>
                </div>
                
                <p className="text-gray-300 mt-3 text-sm leading-relaxed max-w-xl">
                  {profileUser.bio || "No bio available."}
                </p>

                {/* Meta Info: Joined & Location */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Earth</span> {/* Placeholder location since we don't have it in schema */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Ask for Help Button */}
            <div className="self-start sm:self-auto mt-4 sm:mt-0 flex-shrink-0">
              {currentUser?._id !== profileUser._id ? (
                <button 
                  onClick={handleAskForHelp}
                  disabled={requestStatus === 'sending' || requestStatus === 'sent'}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto rounded-lg font-bold text-sm transition ${
                    requestStatus === 'sent' 
                      ? 'bg-green-500 text-white shadow-none cursor-default'
                      : 'bg-[#00d2ff] hover:bg-[#00b8e6] text-[#050c1a] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                  }`}
                >
                  {requestStatus === 'sending' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : requestStatus === 'sent' ? (
                    <><Check className="w-4 h-4" /> Request Sent</>
                  ) : (
                    <><MessageSquare className="w-4 h-4" /> Ask for Help</>
                  )}
                </button>
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      {profileUser.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Solutions</p>
            <p className="text-3xl font-bold text-white">{profileUser.stats.solutionsGiven}</p>
          </div>
          <div className="bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium relative z-10">Accepted</p>
            <p className="text-3xl font-bold text-green-400 relative z-10">{profileUser.stats.solutionsAccepted}</p>
          </div>
          <div className="bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium relative z-10">Total Stars</p>
            <p className="text-3xl font-bold text-yellow-400 relative z-10">{profileUser.stats.totalStars}</p>
          </div>
          <div className="bg-[#0b1d35] p-5 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Avg Stars</p>
            <p className="text-3xl font-bold text-white">{profileUser.stats.avgStars}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserProfile;