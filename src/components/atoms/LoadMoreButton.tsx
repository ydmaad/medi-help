"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface LoadMoreButtonProps {
  targetPage: string;
}

const LoadMoreButton = ({ targetPage }: LoadMoreButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(targetPage);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-brand-gray-600 desktop:font-bold desktop:text-[20px] text-[14px]"
    >
      더보기
      <img
        src="/extraleftbtn.svg"
        alt="더보기버튼"
        className="flex desktop:hidden w-[20px] h-[20px] ml-[4px]"
      />
    </button>
  );
};

export default LoadMoreButton;
