import Image from "next/image";
import React, { useState } from "react";

interface SearchProps {
  handleSearch: (term: string) => void;
}

const Search = ({ handleSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center">
        {/* 웹 버전 (desktop: 700px 이상일 때) */}
        <div className="hidden desktop:flex relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 및 내용, 작성자 등을 검색하세요"
            className="w-[300px] border-solid border-2 border-brand-primary-300 py-2 pl-10 pr-4 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* 모바일 버전 (desktop: 700px 미만일 때) */}
        <div className="flex desktop:hidden mx-5">
          <Image
            src="/magnifier.svg"
            alt="돋보기이미지"
            width={30}
            height={30}
          ></Image>
        </div>
      </form>
    </>
  );
};

export default Search;
