import React, { useEffect, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
  onUpdate: (query: string) => void;
  loading: boolean;
}

const Search: React.FC<SearchProps> = ({ query, setQuery, onUpdate, loading = false }) => {
  const [localQuery, setLocalQuery] = useState(query);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      onUpdate(localQuery);
      setQuery(localQuery);  
    }, 500); // Delay of 500ms

    // Cleanup function to clear the timeout if the user types again before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, onUpdate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value); // Update local query state
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-sm w-full max-w-md">
      {/* Spyglass Icon */}
      {loading ? <FaSpinner className="animate-spin mr-2 text-gray-500" /> : <FaSearch className="mr-2 text-gray-500" />}

      {/* Input Box */}
      <input
        type="text"
        className="w-full focus:outline-none bg-transparent text-gray-800"
        value={localQuery}
        onChange={handleSearch}
        placeholder="Search..."
      />
      
    </div>
  );
};

export default Search;
