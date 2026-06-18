import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditProfile() {
  const { updateUser } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', username: '', bio: '', profilePic: '' });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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

        const response = await axios.get(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFormData({
          name: response.data.name || '',
          username: response.data.username || '',
          bio: response.data.bio || '',
          profilePic: response.data.profilePic || ''
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('username', formData.username);
      submitData.append('bio', formData.bio);
      if (profilePicFile) {
        submitData.append('profilePic', profilePicFile);
      }

      const response = await axios.put(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/users/profile`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update global context so Navbar/Sidebar update instantly!
      updateUser({ 
        name: response.data.name,
        username: response.data.username,
        bio: response.data.bio,
        profilePic: response.data.profilePic
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

        <div className="flex flex-col items-center mb-2">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500 overflow-hidden mb-3 bg-gray-800">
            <img 
              src={previewUrl || formData.profilePic || "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png"} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png" }}
            />
          </div>
          <label className="cursor-pointer bg-blue-600/20 hover:bg-blue-600/40 text-sky-400 px-4 py-2 rounded-lg text-sm font-semibold transition border border-blue-500/30">
            Change Avatar
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

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