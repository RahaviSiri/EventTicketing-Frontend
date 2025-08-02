import React, { useState } from "react";

const SearchBar = ({ onSearch , placeHolder }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query); // Call parent function
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 max-w-xl mx-auto p-2 border border-gray-300 rounded-lg shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeHolder}
        className="flex-grow p-2 outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
