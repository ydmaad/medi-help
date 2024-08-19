"use client";

import { fetchSearchPosts } from "@/lib/commentsAPI";
import { useCommunitySearchFlagStore } from "@/store/communitySearchFlag";
import { PostWithUser } from "@/types/communityTypes";
import Image from "next/image";
import React, { useState } from "react";

interface SearchProps {
  onSearchResults: (results: PostWithUser[]) => void;
  searchCurrentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPosts: number;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const Search = ({
  onSearchResults,
  searchCurrentPage,
  totalPages,
  onPageChange,
  setCurrentPage,
  totalPosts,
  sortOption,
  setSortOption,
}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isSearchOpen, setIsSearchOpen } = useCommunitySearchFlagStore();

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      onSearchResults([]);
      return;
    }

    try {
      console.log("검색 시작:", searchTerm);
      const results = await fetchSearchPosts(
        searchTerm,
        searchCurrentPage,
        sortOption
      );
      onSearchResults(results);
    } catch (error) {
      console.error("검색 에러:", error);
      onSearchResults([]);
    }
  };

  console.log(searchTerm);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const toggleSearch = () => {
    setSearchTerm("");
    setIsSearchOpen(!isSearchOpen);
  };

  const searchTermReset = () => {
    setSearchTerm("");
    onSearchResults([]);
  };

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="hidden desktop:flex relative">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 및 내용, 작성자 등을 검색하세요"
            className="w-[300px] border-solid border-2 border-brand-primary-300 py-2 pl-10 pr-4 text-sm bg-white rounded-full focus:outline-none"
            onKeyDown={handleKeyboardDown}
          />
        </form>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image
            src="/magnifier.svg"
            alt="돋보기이미지"
            width={20}
            height={20}
          />
        </div>
      </div>

      {/* 모바일 버전 (주석 처리된 부분은 그대로 유지) */}
    </>
  );
};

export default Search;
