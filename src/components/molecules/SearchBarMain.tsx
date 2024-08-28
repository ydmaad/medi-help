import React, { useState } from "react";
import SearchButton from "@/components/atoms/SearchButton";

interface SearchBarProps {
  onSearchChange: (term: string) => void;
}

const SearchBarMain = ({ onSearchChange }: SearchBarProps) => {
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
    <div className="relative flex items-center border-3 border-brand-primary-300 rounded-full">
      <input
        type="text"
        placeholder="복용 중인 약에 대해 검색해 보세요"
        className="h-[48px] w-[335px] desktop:w-[588px] desktop:h-[56px] rounded-full p-4 border-0 focus:outline-none ring-2 text-[18px] ring-brand-primary-300 focus:ring-brand-primary-500 placeholder:to-brand-gray-600"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute right-2">
        <SearchButton
          searchTerm={searchTerm}
          onClick={handleSearchButtonClick}
        />
      </div>
    </div>
  );
};

export default SearchBarMain;
