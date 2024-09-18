import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
  onUpdate: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ query, setQuery, onUpdate }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onUpdate(e.target.value);
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 shadow-sm w-full max-w-md">
      {/* Spyglass Icon */}
      <FaSearch className="text-gray-500 mr-3" />

      {/* Input Box */}
      <input
        type="text"
        className="w-full focus:outline-none bg-transparent text-gray-800"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />
    </div>
  );
};

export default Search;
