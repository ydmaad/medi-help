"use client";

import CommunitySearch from "@/components/molecules/CommunitySearch";
import React, { useState } from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = ({ handleSearch }: SearchProps) => {
  const [newSearchTerm, setNewSearchTerm] = useState<string>("");

  // 추후 커뮤니티서치 여기로 합치기!!!(굳이 나눌 필요 없음)
  console.log(newSearchTerm);

  return (
    <>
      <div className="flex items-center">
        <CommunitySearch
          searchTerm={newSearchTerm}
          setSearchTerm={setNewSearchTerm}
          handleSearch={handleSearch}
        ></CommunitySearch>
      </div>
    </>
  );
};

export default Search;
