"use client";
import Link from "next/link";

const SearchButton = () => {
  return (
    <Link href="/search" className="flex items-center cursor-pointer">
      <img src="/search.png" alt="돋보기" className="mr-[3px]" />
    </Link>
  );
};

export default SearchButton;
