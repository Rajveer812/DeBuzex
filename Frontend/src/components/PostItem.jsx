import React, { useState, useContext } from 'react';
// import avatar from '../assets/Designer1.png';
import { ThumbsUp, MessageSquare, Eye, EyeOff, Star, CheckCircle, Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function PostItem({ post, user, onLike, onSubmitSolution, onStar, onAccept, onDelete }) {
  const { updateUser } = useContext(AuthContext);
  const [isWritingSolution, setIsWritingSolution] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [showSolutions, setShowSolutions] = useState(false);
  const [hoveredStar, setHoveredStar] = useState({ solutionId: null, rating: 0 });

  const calculateAverageRating = (stars) => {
    if (!stars || stars.length === 0) return "0.0";
    const validStars = stars.filter(s => s && s.rating !== undefined);
    if (validStars.length === 0) return "0.0";
    
    const sum = validStars.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / validStars.length).toFixed(1);
  };

  const isLiked = user && post.likes?.includes(user._id);
  const isSaved = user && user.savedPosts?.includes(post._id);

  const handleToggleSave = async () => {
    if (!user) {
      alert("Please login to save posts");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/users/save-post/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // The API returns the updated savedPosts array
      updateUser({ savedPosts: response.data.savedPosts });
    } catch (error) {
      console.error("Failed to toggle save", error);
      alert("Failed to save post");
    }
  };

  const handleToggleWriteSolution = () => {
    if (!user) {
      alert("Please login to write a solution");
      return;
    }
    setIsWritingSolution(!isWritingSolution);
    setSolutionText(''); // Clear text when toggling
  };

  const handleSubmit = () => {
    if (!solutionText.trim()) return;
    onSubmitSolution(post._id, solutionText);
    setIsWritingSolution(false);
    setSolutionText('');
  };

  return (
    <div className="bg-[#0b1d35] rounded-2xl p-5 shadow-lg border border-gray-800 transition hover:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/user/${post.author?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {post.author?.profilePic && post.author.profilePic !== "default-avatar.png" ? (
            <img 
              src={post.author.profilePic} 
              alt="Avatar" 
              className="h-12 w-12 rounded-full border-2 border-indigo-500 object-cover" 
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-xl">
              {post.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-100 text-lg">@{post.author?.username || 'Unknown User'}</p>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </Link>
        
        {/* Delete Button (visible only if user is author and onDelete is provided) */}
        {user && post.author && user._id === (post.author._id || post.author) && onDelete && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this post?")) {
                onDelete(post._id);
              }
            }}
            className="ml-auto text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
            title="Delete Post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{post.description}</p>
        
        {/* Render Bug Images if any */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4 flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
            {post.images.map((imgUrl, idx) => (
              <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <img 
                  src={imgUrl} 
                  alt={`Screenshot ${idx + 1}`} 
                  className="h-48 object-cover rounded-lg border border-gray-700/50 hover:border-indigo-500 transition-colors cursor-pointer" 
                />
              </a>
            ))}
          </div>
        )}

        <div className="mt-3 inline-block bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium border border-indigo-700/50">
          {post.platform}
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-2">
        <div className="flex gap-4">
          <button 
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${isLiked ? 'text-blue-400 bg-blue-900/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{post.likes?.length || 0} Likes</span>
          </button>
          
          <button 
            onClick={handleToggleWriteSolution}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Write Solution</span>
          </button>

          <button 
            onClick={handleToggleSave}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${isSaved ? 'text-yellow-500 bg-yellow-900/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            <span>Save</span>
          </button>
        </div>

        <button 
          onClick={() => setShowSolutions(!showSolutions)}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition"
        >
          {showSolutions ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          <span>{showSolutions ? 'Hide Solutions' : `See Solutions (${post.solutions?.length || 0})`}</span>
        </button>
      </div>

      {/* Solutions Dropdown */}
      {isWritingSolution && (
        <div className="mt-4 border-t border-gray-700/50 pt-4 animate-fadeIn">
          <textarea 
            className="w-full bg-[#050c1a] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            rows="3"
            placeholder="Write your solution here..."
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2 gap-2">
            <button 
              onClick={() => setIsWritingSolution(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition shadow-lg shadow-indigo-600/20"
              disabled={!solutionText.trim()}
            >
              Post Solution
            </button>
          </div>
        </div>
      )}
      
      {/* Display Solutions if any */}
      {post.solutions && post.solutions.length > 0 && showSolutions && (
        <div className="mt-4 bg-[#081526] rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Solutions</h3>
          <div className="flex flex-col gap-3">
            {post.solutions.map((sol, index) => (
              <div key={index} className={`text-sm text-gray-200 bg-[#050c1a] p-4 rounded-lg border ${sol.isAccepted ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]' : 'border-gray-800/50'}`}>
                {/* Solution Author Info */}
                <div className="flex items-center gap-2 mb-2">
                  {sol.author?.profilePic && sol.author.profilePic !== "default-avatar.png" ? (
                    <img src={sol.author.profilePic} alt="avatar" className="w-6 h-6 rounded-full border border-gray-600 object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-[10px]">
                      {sol.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <Link to={`/user/${sol.author?.username}`} className="text-xs font-semibold text-gray-300 hover:text-white hover:underline">
                    @{sol.author?.username || 'Unknown'}
                  </Link>
                  {sol.isAccepted && (
                    <span className="ml-auto flex items-center gap-1 text-green-500 font-semibold text-xs bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      <CheckCircle size={12} fill="currentColor" /> Verified Fix
                    </span>
                  )}
                </div>
                
                {/* Solution Text */}
                <p className="mb-3 pl-8 text-gray-300">{sol.text}</p>
                
                {/* Solution Actions */}
                <div className="flex items-center gap-4 border-t border-gray-800/50 pt-2 pl-8">
                  
                  {/* 5-Star Rating System */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        // Safely extract the user's rating, handling legacy strings
                        const userStarObj = sol.stars?.find(s => {
                           if (!s) return false;
                           const sUserId = s.user?._id || s.user || s;
                           return sUserId === user?._id;
                        });
                        const userRating = userStarObj?.rating || 0;
                        
                        const isFilled = hoveredStar.solutionId === sol._id 
                          ? starValue <= hoveredStar.rating 
                          : starValue <= userRating;
                        
                        return (
                          <button
                            key={starValue}
                            onMouseEnter={() => setHoveredStar({ solutionId: sol._id, rating: starValue })}
                            onMouseLeave={() => setHoveredStar({ solutionId: null, rating: 0 })}
                            onClick={() => onStar(post._id, sol._id, starValue)}
                            className={`transition-colors p-0.5 ${isFilled ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-400'}`}
                            disabled={!user}
                          >
                            <Star size={16} fill={isFilled ? "currentColor" : "none"} />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {calculateAverageRating(sol.stars)} <span className="text-gray-600">({sol.stars?.length || 0} reviews)</span>
                    </span>
                  </div>
                  
                  {/* Accept button: Visible ONLY to post author, and if it's not accepted yet */}
                  {user && post.author && user._id === (post.author._id || post.author) && !sol.isAccepted && (
                    <button 
                      onClick={() => onAccept(post._id, sol._id)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors ml-auto"
                    >
                      <CheckCircle size={16} /> <span className="text-xs font-medium">Accept Fix</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
