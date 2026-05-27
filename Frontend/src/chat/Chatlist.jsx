import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // To know who we are!
import { socket } from '../socket';

function Chatlist({ selectedChat, setSelectedChat }) {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);

  // 1. Fetch the chats when the sidebar loads
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/chat', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  useEffect(() => {
    fetchChats();

    // Listen for real-time updates to refresh the list
    socket.on("chat request received", fetchChats);
    socket.on("chat accepted received", fetchChats);
    socket.on("message received", fetchChats);

    return () => {
      socket.off("chat request received", fetchChats);
      socket.off("chat accepted received", fetchChats);
      socket.off("message received", fetchChats);
    };
  }, []);

  // 1b. Handle Accepting a Chat Request
  const handleAcceptRequest = async (e, chatId) => {
    e.stopPropagation(); // Prevent opening the chat while accepting
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/chat/status', 
        { chatId, status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Notify the initiator that we accepted so their UI updates
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        socket.emit("chat accepted", chat.initiator);
      }

      // Refresh chats to get updated status
      fetchChats();
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  // 2. Helper function: The chat array has both your ID and the other person's ID.
  // We need to filter YOU out so we can display THEIR name!
  const getOtherUser = (participants) => {
    if (!user) return null;
    return participants.find(p => p._id !== user._id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3">
      <h2 className="text-white font-bold text-xl mb-2 px-2 mt-2 pb-4 border-b border-white/10">Messages</h2>
      
      <div className="flex flex-col divide-y divide-white/5">
        {chats.map((chat) => {
          const otherUser = getOtherUser(chat.participants);
          const isPending = chat.status === 'pending';
          const iSentRequest = chat.initiator === user._id;
          
          return (
            <div key={chat._id} className="py-2">
              <div
                onClick={() => {
                  if (!isPending || iSentRequest) {
                    setSelectedChat(chat);
                  }
                }}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  selectedChat?._id === chat._id 
                    ? 'bg-blue-600/20 border border-blue-500/50' // Highlight if active
                    : 'hover:bg-[#1e2330] border border-transparent cursor-pointer'
                } ${isPending ? 'border-dashed border-gray-600' : ''}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 w-full overflow-hidden">
                    {/* Avatar */}
                    {otherUser?.profilePic && otherUser.profilePic !== "default-avatar.png" ? (
                      <img src={otherUser.profilePic} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#60a5fa] text-[#0d0f14] font-bold flex items-center justify-center shrink-0 text-lg">
                        {otherUser?.username ? otherUser.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between w-full">
                        <p className="text-white font-semibold text-sm truncate pr-2">
                          {otherUser ? otherUser.name || otherUser.username : "Unknown User"}
                        </p>
                        {isPending && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 shrink-0">Request</span>}
                      </div>
                      
                      {isPending ? (
                        <p className="text-xs mt-1 text-yellow-400/70 italic truncate">
                          {iSentRequest ? "Waiting for them to accept..." : "Wants to chat with you!"}
                        </p>
                      ) : (
                        <p className="text-xs text-[#8b92a8] truncate mt-1">
                          {chat.latestMessage ? chat.latestMessage.text : "No messages yet"}
                        </p>
                      )}
                    </div>
                  </div>

                  {isPending && !iSentRequest && (
                    <button 
                      onClick={(e) => handleAcceptRequest(e, chat._id)}
                      className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-sm transition shrink-0 self-center"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Chatlist;