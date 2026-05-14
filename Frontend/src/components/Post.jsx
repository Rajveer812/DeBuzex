import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import avatar from '../assets/Designer1.png'
import { AuthContext } from '../context/AuthContext'

function Post() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for solutions
  const [activeSolutionId, setActiveSolutionId] = useState(null);
  const [solutionText, setSolutionText] = useState('');
  const [visibleSolutions, setVisibleSolutions] = useState([]);
  
  const toggleViewSolutions = (postId) => {
    setVisibleSolutions(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };
  
  // Auth context
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/post");
        setPostData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching posts');
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setPostData(postData.map(post => {
        if (post._id === postId) {
          return { ...post, likes: response.data.likes };
        }
        return post;
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to like post");
    }
  };

  const handleWriteSolutionToggle = (postId) => {
    if (!user) {
      alert("Please login to write a solution");
      return;
    }
    if (activeSolutionId === postId) {
      setActiveSolutionId(null);
      setSolutionText('');
    } else {
      setActiveSolutionId(postId);
      setSolutionText('');
    }
  };

  const submitSolution = async (postId) => {
    if (!solutionText.trim()) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/post/${postId}/solution`, {
        text: solutionText
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setPostData(postData.map(post => {
        if (post._id === postId) {
          return { ...post, solutions: response.data.solutions };
        }
        return post;
      }));
      
      setActiveSolutionId(null);
      setSolutionText('');
    } catch (err) {
      console.log(err);
      alert("Failed to add solution");
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-400">Loading posts...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      {postData?.map((post) => {
        const isLiked = user && post.likes?.includes(user._id);
        
        return (
          <div key={post._id} className="bg-[#0b1d35] rounded-2xl p-5 shadow-lg border border-gray-800 transition hover:border-gray-700">
            {/* Header: User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img src={post.author?.profilePic || avatar} alt="Avatar" className="h-12 w-12 rounded-full border-2 border-indigo-500 object-cover" />
              <div>
                <p className="font-semibold text-gray-100 text-lg">@{post.author?.username || 'Unknown User'}</p>
                <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Body: Post Content */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
              <p className="text-gray-300 leading-relaxed">{post.description}</p>
              
              <div className="mt-3 inline-block bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium border border-indigo-700/50">
                {post.platform}
              </div>
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-2">
              <div className="flex gap-4">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${isLiked ? 'text-blue-400 bg-blue-900/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
                  <span>{post.likes?.length || 0} Likes</span>
                </button>
                
                <button 
                  onClick={() => handleWriteSolutionToggle(post._id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  <span>Write Solution</span>
                </button>
              </div>

              <button 
                onClick={() => toggleViewSolutions(post._id)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{visibleSolutions.includes(post._id) ? 'Hide Solutions' : `See Solutions (${post.solutions?.length || 0})`}</span>
              </button>
            </div>

            {/* Solutions Dropdown */}
            {activeSolutionId === post._id && (
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
                    onClick={() => setActiveSolutionId(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => submitSolution(post._id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition shadow-lg shadow-indigo-600/20"
                    disabled={!solutionText.trim()}
                  >
                    Post Solution
                  </button>
                </div>
              </div>
            )}
            
            {/* Display Solutions if any */}
            {post.solutions && post.solutions.length > 0 && visibleSolutions.includes(post._id) && (
              <div className="mt-4 bg-[#081526] rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Solutions</h3>
                <div className="flex flex-col gap-3">
                  {post.solutions.map((sol, index) => (
                    <div key={index} className="text-sm text-gray-200 bg-[#050c1a] p-3 rounded-lg border border-gray-800/50">
                      {sol.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default Post;