"use client";
import React from "react";
import Link from "next/link";

interface SearchButtonProps {
  searchTerm: string;
  onClick: () => void;
}

const SearchButton = ({ searchTerm, onClick }: SearchButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center cursor-pointer">
      <img src="/search.png" alt="돋보기" className="mr-[3px]" />
    </button>
  );
};

export default SearchButton;
