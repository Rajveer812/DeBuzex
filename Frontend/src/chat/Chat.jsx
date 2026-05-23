import React, { useState } from 'react';
import Chatlist from './Chatlist';
import Chatarea from './Chatarea';

function Chat() {
  // This state Remembers which chat room is currently open!
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className='grid grid-cols-8 gap-4 h-screen bg-[#050c1a]'>
        <div className='col-span-2 h-full border-r border-white/10'>
            {/* We pass the state and the updater function to the list */}
            <Chatlist selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        </div>
        
        <div className='col-span-6 h-full bg-[#050c1a]'>
            {/* We only need to pass the state to the area so it knows what to load */}
            <Chatarea selectedChat={selectedChat} />
        </div>
    </div>
  )
}

export default Chat;