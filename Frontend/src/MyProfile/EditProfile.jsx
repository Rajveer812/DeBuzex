import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function EditProfile() {
  const [formData, setFormData] = useState({ name: '', username: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/'); 
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFormData({
          name: response.data.name || '',
          username: response.data.username || '',
          bio: response.data.bio || ''
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load current profile data.");
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Navigate back to profile on success
      navigate('/myProfile'); 
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) return <div className="text-sky-400 text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-[#1e2330] rounded-xl border border-white/10 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-white mb-2">Edit Profile</h2>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="text-sky-400 text-xs font-bold mb-1 block">Display Name</label>
          <input 
            type="text" name="name" placeholder="Name" required
            value={formData.name} // <-- This connects the input to the pre-filled data
            onChange={handleChange}
            className="w-full bg-[#0d0f14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sky-400/50"
          />
        </div>

        <div>
          <label className="text-sky-400 text-xs font-bold mb-1 block">Username</label>
          <input 
            type="text" name="username" placeholder="Username" required
            value={formData.username} // <-- Connects to pre-filled data
            onChange={handleChange}
            className="w-full bg-[#0d0f14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sky-400/50"
          />
        </div>

        <div>
          <label className="text-sky-400 text-xs font-bold mb-1 block">Bio</label>
          <textarea 
            name="bio" placeholder="Enter Bio" required rows="3"
            value={formData.bio} // <-- Connects to pre-filled data
            onChange={handleChange}
            className="w-full bg-[#0d0f14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sky-400/50 resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3 mt-2">
          <Link 
            to="/myProfile" 
            className="flex-1 bg-transparent border border-white/20 text-white text-center font-bold py-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default EditProfile;