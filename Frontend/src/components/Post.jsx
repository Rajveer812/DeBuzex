import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import PostItem from './PostItem'

function Post() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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

  // We modified this to accept the text directly from the PostItem!
  const submitSolution = async (postId, text) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/post/${postId}/solution`, {
        text: text
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
      setPostData(postData.map(post => {
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
      setPostData(postData.map(post => {
        if (post._id === postId) return { ...post, solutions: response.data.solutions, isResolved: response.data.isResolved };
        return post;
      }));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-400">Loading posts...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      {postData?.map((post) => (
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
  );
}

export default Post;