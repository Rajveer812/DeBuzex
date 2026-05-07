import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = () => {
  const { isModalOpen, setIsModalOpen } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0f14]/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-[#1e2330] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-[#8b92a8] hover:text-white transition-colors text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            {isLoginMode ? 'Welcome Back' : 'Join TechHelp'}
          </h2>
          <p className="text-[#8b92a8] text-sm">
            {isLoginMode ? 'Sign in to solve problems and earn XP.' : 'Create an account to join the community.'}
          </p>
        </div>

        {/* MAGIC HAPPENS HERE: We just drop in our clean components */}
        {isLoginMode ? <LoginForm /> : <SignupForm />}

        {/* Toggle between Login and Signup */}
        <div className="text-center mt-6 text-sm text-[#8b92a8]">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-[#6ee7b7] hover:underline font-bold"
          >
            {isLoginMode ? 'Sign up' : 'Log in'}
          </button>
        </div>

        {/* Skip option for Soft Gating */}
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-[#555d72] text-xs hover:text-[#8b92a8] transition-colors"
          >
            Skip for now, I just want to browse
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;