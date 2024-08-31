import React, { useState } from "react";
import SearchButton from "@/components/atoms/SearchButton";

interface SearchBarProps {
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchButtonClick = () => {
    onSearchChange(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  return (
    <>
      <div className="relative hidden desktop:flex  items-center border-3 border-brand-primary-300 rounded-full">
        <input
          type="text"
          placeholder="복용 중인 약에 대해 검색해 보세요 (ex. 약효, 약 이름)"
          className="h-[48px] w-[335px] desktop:w-[792px] desktop:h-[56px] rounded-full p-4 border-0 focus:outline-none ring-[3px] text-[18px] ring-brand-primary-300 focus:ring-brand-primary-500 placeholder:to-brand-gray-600"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-[21.5px]">
          <SearchButton
            searchTerm={searchTerm}
            onClick={handleSearchButtonClick}
          />
        </div>
      </div>
      <div className=" relative flex desktop:hidden  items-center border-3 border-brand-primary-300 rounded-full">
        <input
          type="text"
          placeholder="복용 중인 약에 대해 검색해 보세요"
          className="h-[48px] w-[335px] desktop:w-[792px] desktop:h-[56px] rounded-full p-4 border-0 focus:outline-none ring-[2px] text-[18px] ring-brand-primary-300 focus:ring-brand-primary-500 placeholder:to-brand-gray-600"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-[21.5px]">
          <SearchButton
            searchTerm={searchTerm}
            onClick={handleSearchButtonClick}
          />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
