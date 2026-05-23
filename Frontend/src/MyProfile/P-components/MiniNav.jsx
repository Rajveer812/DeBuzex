import React from 'react'

function MiniNav({ activeTab, setActiveTab }) {
  return (
    <div className='flex justify-start gap-2 p-2 border-b border-gray-800 mb-4'>
        <button 
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'posts' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
        >
          My Posts
        </button>
        <button 
          onClick={() => setActiveTab('solutions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'solutions' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
        >
          My Solutions
        </button>
    </div>
  )
}

export default MiniNav