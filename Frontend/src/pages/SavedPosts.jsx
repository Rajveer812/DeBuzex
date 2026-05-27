import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostItem from '../components/PostItem';
import RightSidebar from '../components/RightSidebar/RightSidebar';

function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:5000/api/users/saved-posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSavedPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching saved posts');
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, [user]);

  // We reuse the same handler functions from Post.jsx
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedPosts(savedPosts.map(post => {
        if (post._id === postId) return { ...post, likes: response.data.likes };
        return post;
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to like post");
    }
  };

  const submitSolution = async (postId, text) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/post/${postId}/solution`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedPosts(savedPosts.map(post => {
        if (post._id === postId) return { ...post, solutions: response.data.solutions };
        return post;
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to add solution");
    }
  };

  const handleStar = async (postId, solutionId, rating) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/solution/${solutionId}/star`, { rating }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedPosts(savedPosts.map(post => {
        if (post._id === postId) return { ...post, solutions: response.data.solutions };
        return post;
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (postId, solutionId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/post/${postId}/solution/${solutionId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedPosts(savedPosts.map(post => {
        if (post._id === postId) return { ...post, solutions: response.data.solutions, isResolved: response.data.isResolved };
        return post;
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 py-4 pr-6 min-w-0">
        <h1 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-yellow-500">Saved Problems</h1>
        
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading saved posts...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error: {error}</div>
        ) : !user ? (
          <div className="text-center py-10 bg-[#0b1d35] rounded-2xl border border-gray-800">
             <p className="text-gray-400">Please log in to view your saved bugs. 🐛</p>
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-10 bg-[#0b1d35] rounded-2xl border border-gray-800">
             <p className="text-gray-400">You haven't saved any bugs yet. 🔖</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedPosts.map((post) => (
              <PostItem 
                key={post._id}
                post={post} 
                user={user} 
                onLike={handleLike} 
                onSubmitSolution={submitSolution} 
                onStar={handleStar}
                onAccept={handleAccept}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[350px] shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
}

export default SavedPosts;
