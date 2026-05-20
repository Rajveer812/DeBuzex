import React, { useState } from 'react';
import avatar from '../assets/Designer1.png';
import { ThumbsUp, MessageSquare, Eye, EyeOff } from 'lucide-react';

export default function PostItem({ post, user, onLike, onSubmitSolution }) {
  const [isWritingSolution, setIsWritingSolution] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [showSolutions, setShowSolutions] = useState(false);

  const isLiked = user && post.likes?.includes(user._id);

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
        <img 
          src={post.author?.profilePic || avatar} 
          alt="Avatar" 
          className="h-12 w-12 rounded-full border-2 border-indigo-500 object-cover" 
        />
        <div>
          <p className="font-semibold text-gray-100 text-lg">@{post.author?.username || 'Unknown User'}</p>
          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Body: Post Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{post.description}</p>
        
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
              <div key={index} className="text-sm text-gray-200 bg-[#050c1a] p-3 rounded-lg border border-gray-800/50">
                {sol.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
