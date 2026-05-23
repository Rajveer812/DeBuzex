import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react'; // Make sure you have lucide-react installed for the icon!
import { socket } from '../socket';

function Chatarea({ selectedChat }) {
  const { user, onlineUsers } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  
  // This helps us automatically scroll to the newest message
  const scrollRef = useRef(null);

  // ==========================================
  // 1. SOCKET.IO SETUP (The Walkie-Talkie)
  // ==========================================
  useEffect(() => {
    // If user is set and socket is connected globally, we can just mark it connected.
    // The setup is now handled in AuthContext.
    if (user && socket.connected) {
      setSocketConnected(true);
    }
    
    const handleConnect = () => setSocketConnected(true);
    socket.on("connected", handleConnect);
    
    return () => {
      socket.off("connected", handleConnect);
    };
  }, [user]);

  // ==========================================
  // 2. FETCH HISTORY & JOIN ROOM
  // ==========================================
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return; // If no chat is clicked, do nothing

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessages(data); // Put historical messages on screen
        socket.emit("join chat", selectedChat._id); // Tell Socket.io to tune into this specific chat room
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    
    fetchMessages();
  }, [selectedChat]);

  // ==========================================
  // 3. LISTEN FOR LIVE MESSAGES
  // ==========================================
  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      // If we are looking at a different chat, ignore it (for now)
      if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
        return; 
      }
      // If it belongs to this chat, pop it onto the screen!
      setMessages((prev) => [...prev, newMessageReceived]);
    };

    socket.on("message received", messageListener);

    return () => {
      socket.off("message received", messageListener);
    };
  }, [selectedChat]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================
  // 4. SEND A MESSAGE
  // ==========================================
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // A. Save it to the database
      const { data } = await axios.post('http://localhost:5000/api/message', {
        chatId: selectedChat._id,
        text: newMessage
      }, config);

      setNewMessage(""); // Clear the input box

      // B. Broadcast it live through the Walkie-Talkie
      socket.emit("new message", data);

      // C. Pop it onto our own screen
      setMessages([...messages, data]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };


  // ==========================================
  // UI RENDERING
  // ==========================================

  // If no chat is clicked yet, show this blank screen
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-[#8b92a8]">
        <p className="text-xl font-semibold bg-[#1e2330] px-6 py-3 rounded-2xl border border-white/10">
          Click on a user to start chatting
        </p>
      </div>
    );
  }

  // Figure out the name of the person we are talking to
  const otherUser = selectedChat.participants.find(p => p._id !== user._id);
  const isOtherUserOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      
      {/* HEADER */}
      <div className="shrink-0 h-[70px] border-b border-white/10 bg-[#050c1a]/95 flex items-center px-6 sticky top-0 z-10">
        {otherUser?.profilePic && otherUser.profilePic !== "default-avatar.png" ? (
          <img src={otherUser.profilePic} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 uppercase text-lg">
            {otherUser ? otherUser.username.charAt(0) : '?'}
          </div>
        )}
        <div className="ml-4">
          <h2 className="text-white font-bold text-lg">{otherUser ? otherUser.username : "Unknown User"}</h2>
          {isOtherUserOnline ? (
            <p className="text-xs text-green-400 font-medium">Online</p>
          ) : (
            <p className="text-xs text-gray-500">Offline</p>
          )}
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          // Check if WE sent the message, or if THEY sent it
          const isMyMessage = msg.senderId._id === user._id;

          return (
            <div key={index} className={`flex items-end gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}>
              
              {!isMyMessage && (
                otherUser?.profilePic && otherUser.profilePic !== "default-avatar.png" ? (
                  <img src={otherUser.profilePic} alt="avatar" className="w-6 h-6 rounded-full object-cover shrink-0 mb-1 border border-white/10" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 text-[10px] mb-1">
                    {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )
              )}

              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                isMyMessage 
                  ? "bg-blue-600 text-white rounded-br-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                  : "bg-[#1e2330] text-gray-200 border border-white/10 rounded-bl-sm" 
              }`}>
                {msg.text}
              </div>

              {isMyMessage && (
                user?.profilePic && user.profilePic !== "default-avatar.png" ? (
                  <img src={user.profilePic} alt="avatar" className="w-6 h-6 rounded-full object-cover shrink-0 mb-1 border border-white/10" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 text-[10px] mb-1">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )
              )}

            </div>
          );
        })}
        {/* Invisible div to help us auto-scroll to the bottom */}
        <div ref={scrollRef}></div> 
      </div>

      {/* INPUT AREA */}
      <div className="shrink-0 p-4 bg-[#050c1a] border-t border-white/10 sticky bottom-0 z-10 mt-auto">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-[#1e2330] text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default Chatarea;