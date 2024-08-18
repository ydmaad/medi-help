"use client";

import { useCommunitySearchFlagStore } from "@/store/communitySearchFlag";
import { PostWithUser } from "@/types/communityTypes";
import Image from "next/image";
import React, { useState } from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
  allPosts: PostWithUser[];
}

const Search = ({ handleSearch, allPosts }: SearchProps) => {
  const [newSearchTerm, setNewSearchTerm] = useState<string>("");
  const { isSearchOpen, setIsSearchOpen } = useCommunitySearchFlagStore();

  const toggleSearch = () => {
    allPosts;
    setNewSearchTerm("");
    setIsSearchOpen(!isSearchOpen);
  };

  const searchTermReset = () => {
    setNewSearchTerm("");
  };

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(newSearchTerm);
    }
  };

  // console.log(newSearchTerm);

  return (
    <>
      {/* 웹 버전 */}
      <div className="hidden desktop:flex relative">
        <input
          type="text"
          value={newSearchTerm}
          onChange={(e) => setNewSearchTerm(e.target.value)}
          placeholder="제목 및 내용, 작성자 등을 검색하세요"
          className="w-[300px] border-solid border-2 border-brand-primary-300 py-2 pl-10 pr-4 text-sm bg-white rounded-full focus:outline-none"
          onKeyDown={handleKeyboardDown}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image
            src="/magnifier.svg"
            alt="돋보기이미지"
            width={20}
            height={20}
          ></Image>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="flex desktop:hidden">
        {isSearchOpen ? (
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={newSearchTerm}
                onChange={(e) => setNewSearchTerm(e.target.value)}
                placeholder="제목 및 내용, 작성자 등을 검색하세요"
                className="w-[291px] border-solid border-2 border-brand-primary-300 py-2 pl-4 pr-10 text-sm bg-white rounded-full focus:outline-none "
                onKeyDown={handleKeyboardDown}
              />
              <div className="absolute inset-y-0 right-11 pr-3 flex items-center">
                {newSearchTerm.length === 0 ? (
                  <button type="submit">
                    <Image
                      src="/magnifier.svg"
                      alt="돋보기이미지"
                      width={20}
                      height={20}
                    ></Image>
                  </button>
                ) : (
                  <button onClick={searchTermReset} type="button">
                    <Image
                      src="/XBtn.svg"
                      alt="x버튼"
                      width={20}
                      height={20}
                    ></Image>
                  </button>
                )}
              </div>
              <button
                onClick={toggleSearch}
                className="text-[16px] text-brand-gray-800 my-[8px] ml-[16px] whitespace-nowrap"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button onClick={toggleSearch}>
            <Image
              src="/magnifier.svg"
              alt="돋보기이미지"
              width={30}
              height={30}
            ></Image>
          </button>
        )}
      </div>
    </>
  );
};

export default Search;
