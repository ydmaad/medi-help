"use client";

import CommunitySearch from "@/components/molecules/CommunitySearch";
import React from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = ({ handleSearch, searchTerm, setSearchTerm }: SearchProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center">
        <CommunitySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        ></CommunitySearch>
      </form>
    </>
  );
};

export default Search;
