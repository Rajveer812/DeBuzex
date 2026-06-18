import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Key, AlertTriangle, UserCog, CheckCircle } from 'lucide-react';
import RightSidebar from '../components/RightSidebar/RightSidebar';

function Settings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      return setPasswordError('New passwords do not match.');
    }

    if (newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters long.');
    }

    try {
      setPasswordLoading(true);
      await axios.put(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/users/change-password`, 
        { currentPassword, newPassword }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (deleteConfirm !== 'DELETE') {
      return setDeleteError('Please type DELETE to confirm.');
    }

    try {
      setDeleteLoading(true);
      await axios.delete(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/users/delete-account`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Logout and redirect
      logout();
      navigate('/');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="py-10 text-center text-gray-400">
          Please log in to view settings.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-85px)] overflow-y-auto custom-scrollbar">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-indigo-500">Account Settings</h1>

        {/* 1. Account Overview */}
        <section className="bg-[#0b1d35] rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-3">
            <UserCog className="text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Account Overview</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
              <p className="text-gray-300 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Username</p>
              <p className="text-gray-300 font-medium">@{user.username}</p>
            </div>
          </div>
          
          <Link to="/editProfile" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium bg-indigo-500/10 px-4 py-2 rounded-lg">
            Edit Public Profile
          </Link>
        </section>

        {/* 2. Security (Change Password) */}
        <section className="bg-[#0b1d35] rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-3">
            <Key className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            {passwordError && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg flex items-center gap-2"><CheckCircle size={16}/> {passwordSuccess}</div>}
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[#050c1a] border border-gray-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Enter current password"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-[#050c1a] border border-gray-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#050c1a] border border-gray-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={passwordLoading}
              className="mt-2 self-start bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* 3. Danger Zone */}
        <section className="bg-[#1a0f14] rounded-xl p-6 border border-red-900/50">
          <div className="flex items-center gap-3 mb-4 border-b border-red-900/50 pb-3">
            <AlertTriangle className="text-red-500" />
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          </div>
          
          <p className="text-sm text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4 bg-red-500/5 p-4 rounded-lg border border-red-500/10">
            {deleteError && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{deleteError}</div>}
            
            <div>
              <label className="block text-sm text-red-400/80 mb-2">
                Type <span className="font-bold text-red-400 select-all">DELETE</span> to confirm.
              </label>
              <input 
                type="text" 
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                required
                className="w-full bg-[#050c1a] border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="DELETE"
              />
            </div>

            <button 
              type="submit" 
              disabled={deleteLoading || deleteConfirm !== 'DELETE'}
              className="mt-2 self-start bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Settings;
