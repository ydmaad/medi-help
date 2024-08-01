import React from "react";
import SearchButton from "@/components/atoms/SearchButton";

interface SearchBarProps {
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="relative flex items-center border-3 border-brand-primary-300 rounded-full">
      <input
        type="text"
        placeholder="복용 중인 약에 대해 검색해 보세요"
        className="w-[588px] h-[56px] rounded-full p-4 border-0 focus:outline-none ring-2 ring-brand-primary-300 focus:ring-brand-primary-500 placeholder:text-gray-500"
        onChange={handleInputChange}
      />
      <div className="absolute right-2">
        <SearchButton />
      </div>
    </div>
  );
};

export default SearchBar;
