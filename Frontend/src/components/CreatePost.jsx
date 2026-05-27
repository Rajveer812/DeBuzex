import React, { useState, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CreatePost() {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  
  // FIXED: Changed 'category' to 'platform' to match your backend PostSchema
  const [formData, setFormData] = useState({title:'', description: '', platform: ''});
  const [images, setImages] = useState([]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('platform', formData.platform);
      
      images.forEach(img => {
        submitData.append('images', img);
      });

      const response = await axios.post('http://localhost:5000/api/post/newpost ', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // 3. Success! Clear the form so they can write another post
      setFormData({title:'', description: '', platform: ''});
      setImages([]);
      alert("Problem posted successfully!");
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to server.");
    }
  };

  return (
    <form className="border border-white/5 border-t-sky-500/50 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0b1d35] to-[#020617] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group" onSubmit={handleSubmit}>
      {/* Animated Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-sky-400/10 pointer-events-none"></div>
      
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center relative z-10 mb-3">{error}</div>}
      
      <div className="relative z-10">
        <h3 className="p-2 text-white font-bold">Post a Problem</h3>

        <div className="">
          <div className="flex gap-x-2 pb-2">
            {user?.profilePic && user.profilePic !== "default-avatar.png" ? (
              <img src={user.profilePic} alt="user" className="w-10 h-10 rounded-full object-cover border border-gray-600" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-lg flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <input 
              className="rounded-md bg-[#0b1830] p-2 w-full text-white focus:outline-none" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              type="text" 
              placeholder="Title of your problem"
              required
            />
          </div>

          <textarea
            placeholder="Type problem here..."
            className="w-full bg-[#0b1830] px-4 py-2 rounded-lg text-[#8b92a8] focus:outline-none resize-none overflow-hidden min-h-[50px]"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        {/* FIXED: Swapped to Radio Buttons and bound them to formData.platform */}
        {/* The 'value' perfectly matches the Enum in your backend Schema */}
        <div className="flex items-center gap-4 mt-2 text-white text-sm">
          <p className="font-semibold text-sky-400">Platform:</p>  
          
          <div className="flex gap-1 items-center">
            <input type="radio" id="android" name="platform" value="Android" onChange={handleChange} required checked={formData.platform === "Android"} />
            <label htmlFor="android">Android</label>
          </div>
          <div className="flex gap-1 items-center">
            <input type="radio" id="ios" name="platform" value="Ios" onChange={handleChange} checked={formData.platform === "Ios"} />
            <label htmlFor="ios">iOS</label>
          </div>
          <div className="flex gap-1 items-center">
            <input type="radio" id="windows" name="platform" value="Windows" onChange={handleChange} checked={formData.platform === "Windows"} />
            <label htmlFor="windows">Windows</label>
          </div>
          <div className="flex gap-1 items-center">
            <input type="radio" id="macos" name="platform" value="MacOS" onChange={handleChange} checked={formData.platform === "MacOS"} />
            <label htmlFor="macos">MacOS</label>
          </div>
          <div className="flex gap-1 items-center">
            <input type="radio" id="linux" name="platform" value="Linux" onChange={handleChange} checked={formData.platform === "Linux"} />
            <label htmlFor="linux">Linux</label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 gap-4">
          <label className="cursor-pointer bg-[#162544] hover:bg-[#1b2d52] text-white transition px-4 py-2 rounded-lg border border-white/10 text-sm">
            {images.length > 0 ? `Images Selected (${images.length})` : "Upload Image(s)"}
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white font-medium">Submit</button>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;