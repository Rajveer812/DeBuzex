import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import PostItem from '../../components/PostItem';

function Solution({ username }) {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/post/user/${username}/solutions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPostData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching your solutions');
        setLoading(false);
      }
    };
    if (username) fetchSolutions();
  }, [username]);

  // Handler functions to keep UI reactive
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPostData(postData.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post));
    } catch (err) { console.log(err); }
  };

  const submitSolution = async (postId, text) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/post/${postId}/solution`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPostData(postData.map(post => post._id === postId ? { ...post, solutions: response.data.solutions } : post));
    } catch (err) { console.log(err); }
  };

  const handleStar = async (postId, solutionId, rating) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/post/${postId}/solution/${solutionId}/star`, { rating }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPostData(postData.map(post => post._id === postId ? { ...post, solutions: response.data.solutions } : post));
    } catch (err) { console.log(err); }
  };

  const handleAccept = async (postId, solutionId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/post/${postId}/solution/${solutionId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPostData(postData.map(post => post._id === postId ? { ...post, solutions: response.data.solutions, isResolved: response.data.isResolved } : post));
    } catch (err) { console.log(err); }
  };

  if (loading) return <div className="text-center py-4 text-gray-400">Loading your solutions...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
      {postData.length === 0 ? (
        <div className="text-center py-10 bg-[#050c1a] rounded-2xl border border-gray-800">
           <p className="text-gray-400">You haven't provided any solutions yet. 💡</p>
        </div>
      ) : (
        postData.map(post => (
          <PostItem 
            key={post._id}
            post={post} 
            user={user} 
            onLike={handleLike} 
            onSubmitSolution={submitSolution} 
            onStar={handleStar}
            onAccept={handleAccept}
          />
        ))
      )}
    </div>
  );
}

export default Solution;
