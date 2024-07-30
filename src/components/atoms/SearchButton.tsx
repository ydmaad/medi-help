"use client";
import Link from "next/link";

const SearchButton = () => {
  return (
    <Link href="/search" className="flex items-center cursor-pointer">
      <img src="/search.png" alt="돋보기" className="w-8 h-8" />
    </Link>
  );
};

export default SearchButton;
