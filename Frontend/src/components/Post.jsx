import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { SearchContext } from '../context/SearchContext'
import PostItem from './PostItem'
import FilterBar from './FilterBar'

function Post() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Contexts
  const { user } = useContext(AuthContext);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/post?page=1&limit=10");
        setPostData(response.data);
        setHasMore(response.data.length === 10);
        setPage(1);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching posts');
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await axios.get(`http://localhost:5000/api/post?page=${nextPage}&limit=10`);
      setPostData(prev => [...prev, ...response.data]);
      setPage(nextPage);
      setHasMore(response.data.length === 10);
      setLoadingMore(false);
    } catch (error) {
      console.log("Error loading more posts:", error);
      setLoadingMore(false);
    }
  };

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

  // Derive filtered posts
  const filteredPosts = postData.filter(post => {
    // 1. Search filter
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch = 
        post.title?.toLowerCase().includes(searchLower) || 
        post.description?.toLowerCase().includes(searchLower);
        
    // 2. Platform filter
    const matchesPlatform = selectedPlatform === 'All' || post.platform === selectedPlatform;
    
    // 3. Status filter
    let matchesStatus = true;
    if (selectedStatus === 'Solved') {
        matchesStatus = post.isResolved === true;
    } else if (selectedStatus === 'Unsolved') {
        matchesStatus = post.isResolved === false;
    }
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-2">
      <FilterBar 
        selectedPlatform={selectedPlatform} 
        setSelectedPlatform={setSelectedPlatform} 
        selectedStatus={selectedStatus} 
        setSelectedStatus={setSelectedStatus} 
      />
      
      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-10 bg-[#0b1d35] rounded-2xl border border-gray-800">
           <p className="text-gray-400">No bugs found matching your filters. 🐛</p>
        </div>
      )}

      {filteredPosts?.map((post) => (
        <div key={post._id} className="mb-4">
          <PostItem 
            post={post} 
            user={user} 
            onLike={handleLike} 
            onSubmitSolution={submitSolution} 
            onStar={handleStar}
            onAccept={handleAccept}
          />
        </div>
      ))}

      {hasMore && filteredPosts.length > 0 && (
        <div className="flex justify-center mt-4 mb-8">
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-[#1e2330] hover:bg-[#2a3142] text-sky-400 font-semibold rounded-full border border-sky-500/30 transition-all disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More Bugs'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Post;