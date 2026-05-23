import React, { useContext } from "react";
import img from "../assets/img.png";
import { Search } from 'lucide-react';

// 1. Import the Context we created earlier
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';

function Navbar() {
  // 2. Grab the user data and functions from the Loudspeaker
  const { user, setIsModalOpen, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#050c1a]">
      <div className="flex justify-between pt-[15px] px-4 pb-2 shadow-purple-600 border-white/10 border-b">
        
        {/* Logo Section */}
        <div>
          <a href="#">
            <img src={img} className="w-40" alt="Logo" />
          </a>
        </div>
        
        {/* Search Section */}
        <div className="">
          <SearchBar />
        </div>
        
        {/* Auth Section (The Magic Happens Here) */}
        <div className="flex items-center object-top-right">
          
          {user ? (
            // IF LOGGED IN: Show greeting, Avatar, and Logout button
            <div className="flex items-center gap-4">
              <span className="text-[#8b92a8] font-medium hidden md:block">
                Hi, {user.username}
              </span>
              
              {/* Avatar */}
              {user.profilePic && user.profilePic !== "default-avatar.png" ? (
                <img src={user.profilePic} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-lg border border-white/20">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <button 
                onClick={logout}
                className="inset-ring-red-500 text-red-400 inset-ring-2 rounded-full py-2 px-6 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // IF NOT LOGGED IN: Show the original Login button
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inset-ring-blue-500 text-white inset-ring-2 rounded-full py-2 px-10 hover:bg-blue-500/10 transition-colors"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;