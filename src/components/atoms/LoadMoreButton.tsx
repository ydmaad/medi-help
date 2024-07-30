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
      className="text-brand-gray-600 font-bold text-[20px]"
    >
      더보기
    </button>
  );
};

export default LoadMoreButton;
