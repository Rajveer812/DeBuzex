import React, { useContext } from 'react';
import { Search } from 'lucide-react';
import { SearchContext } from '../context/SearchContext';

function SearchBar() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
  };

  return (
    <form className="flex items-center" onSubmit={handleSearch}>
      <input 
        type="text"
        className="bg-[#0E1F3D] rounded-full py-2 px-6 sm:px-10 w-full sm:w-80 md:w-130 inset-ring-blue-300 inset-ring-1 text-white placeholder-gray-500 focus:outline-none focus:inset-ring-blue-500 transition-all" 
        placeholder="Search bugs, errors, or titles..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="border border-white/10 py-2 px-2 rounded-full ml-2 hover:bg-white/5 transition-colors" type="submit"> 
        <Search size={16} className="text-gray-400 hover:text-white" strokeWidth={3} />
      </button>
    </form>
  );
}

export default SearchBar;
