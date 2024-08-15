"use client";

import CommunitySearch from "@/components/molecules/CommunitySearch";
import React, { useState } from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
}

const Search = ({ handleSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
    console.log(searchTerm);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center">
        <CommunitySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        ></CommunitySearch>
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </>
  );
};

export default Search;
