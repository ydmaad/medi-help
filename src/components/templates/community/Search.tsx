import React, { useState } from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="p-2 m-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150 ease-in-out"
      >
        검색
      </button>
    </form>
  );
};

export default Search;
