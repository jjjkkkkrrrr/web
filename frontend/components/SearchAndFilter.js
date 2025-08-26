"use client"
import { useState } from 'react';

const SearchAndFilter = ({ onFilter }) => {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleFilter = () => {
    onFilter({ query, startDate });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Tìm kiếm theo ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md p-2 flex-grow"
      />
      <input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      />
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchAndFilter;