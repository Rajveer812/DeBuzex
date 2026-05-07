import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(response.data.user); 
    } catch (err) {
      // Axios puts backend errors inside err.response.data
      setError(err.response?.data?.message || "Failed to connect to server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">{error}</div>}
      
      <input 
        type="email" name="email" placeholder="Email Address" required
        onChange={handleChange}
        className="bg-[#0d0f14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#6ee7b7]/50"
      />
      
      <input 
        type="password" name="password" placeholder="Password" required
        onChange={handleChange}
        className="bg-[#0d0f14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#6ee7b7]/50"
      />

      <button type="submit" className="bg-[#6ee7b7] text-[#0d0f14] font-bold py-3 rounded-lg hover:bg-[#34d399] transition-colors mt-2">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;