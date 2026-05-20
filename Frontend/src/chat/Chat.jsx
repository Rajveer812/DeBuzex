import React from 'react';
import Chatlist from './Chatlist';
import Chatarea from './Chatarea';
function Chat() {
  return (
    <div className='grid grid-cols-8 gap-4 h-screen bg-[#050c1a]'>
        <div className='col-span-2 h-full border-r border-white/10'><Chatlist/></div>
        <div className='col-span-6 h-full bg-[#050c1a]'><Chatarea/></div>
    </div>
  )
}

export default Chat
