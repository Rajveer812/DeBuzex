import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Star, CheckCircle, UserPlus, Bell } from 'lucide-react';


function Notifications() {
  const { notifications, setNotifications } = useContext(AuthContext);

  useEffect(() => {
    // Mark as read when they visit the page
    const markAsRead = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}/api/notifications/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update local state to show them all as read
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updated);
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    };
    
    // Only fire if there are actually unread notifications
    if (notifications.some(n => !n.isRead)) {
        markAsRead();
    }
  }, [notifications, setNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="text-red-500 w-5 h-5" />;
      case 'solution': return <MessageSquare className="text-blue-500 w-5 h-5" />;
      case 'star': return <Star className="text-yellow-500 w-5 h-5" />;
      case 'accept': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'chat_request': return <UserPlus className="text-purple-500 w-5 h-5" />;
      default: return <Bell className="text-gray-500 w-5 h-5" />;
    }
  };

  const getNotificationText = (notif) => {
    const sender = notif.sender?.username || "Someone";
    switch (notif.type) {
      case 'like': return <span className="text-gray-300"><span className="font-bold text-white">{sender}</span> liked your bug report.</span>;
      case 'solution': return <span className="text-gray-300"><span className="font-bold text-white">{sender}</span> submitted a solution to your bug.</span>;
      case 'star': return <span className="text-gray-300"><span className="font-bold text-white">{sender}</span> starred your solution!</span>;
      case 'accept': return <span className="text-gray-300"><span className="font-bold text-white">{sender}</span> accepted your solution. You earned XP!</span>;
      case 'chat_request': return <span className="text-gray-300"><span className="font-bold text-white">{sender}</span> sent you a chat request.</span>;
      default: return "You have a new notification.";
    }
  };

  return (
    <div className="py-4 pr-6">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
        <Bell className="w-8 h-8 text-sky-400" />
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
      </div>

      <div className="bg-[#0b1d35] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            You don't have any notifications yet.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`flex items-start gap-4 p-5 transition-colors ${!notif.isRead ? 'bg-sky-900/20' : 'hover:bg-white/5'}`}
              >
                <Link to={`/user/${notif.sender?.username}`} className="shrink-0">
                  {notif.sender?.profilePic && notif.sender.profilePic !== "default-avatar.png" ? (
                    <img src={notif.sender.profilePic} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center text-xl">
                      {notif.sender?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getNotificationIcon(notif.type)}
                    <p className="text-sm">
                      {notif.type === 'chat_request' ? (
                         <Link to="/chat" className="hover:underline">{getNotificationText(notif)}</Link>
                      ) : (
                         <Link to="/" className="hover:underline">{getNotificationText(notif)}</Link>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 ml-7">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
