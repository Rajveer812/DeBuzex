import React from 'react';
import { Filter, CheckCircle, Clock } from 'lucide-react';

function FilterBar({ selectedPlatform, setSelectedPlatform, selectedStatus, setSelectedStatus }) {
  const platforms = ['All', 'Android', 'Ios', 'MacOS', 'Windows', 'Linux'];
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-[#0b1d35] p-4 rounded-2xl border border-gray-800 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        <Filter className="w-5 h-5 text-indigo-400" />
        <span className="text-gray-300 font-medium text-sm">Filters</span>
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Platform Filter */}
        <select 
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="bg-[#050c1a] border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2 cursor-pointer outline-none"
        >
          {platforms.map(platform => (
            <option key={platform} value={platform}>
              {platform === 'All' ? 'All Platforms' : platform}
            </option>
          ))}
        </select>
        
        {/* Status Filter */}
        <div className="flex bg-[#050c1a] border border-gray-700 rounded-lg overflow-hidden">
          <button 
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-2 text-xs font-medium transition ${selectedStatus === 'All' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setSelectedStatus('Unsolved')}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition border-l border-r border-gray-700 ${selectedStatus === 'Unsolved' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Clock className="w-3 h-3" /> Unsolved
          </button>
          <button 
            onClick={() => setSelectedStatus('Solved')}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition ${selectedStatus === 'Solved' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <CheckCircle className="w-3 h-3" /> Solved
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
