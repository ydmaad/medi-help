"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Logo from "../atoms/Logo";

const BackHeader = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex flex-row items-center justify-between p-4 bg-white h-[67px] shadow-md">
      <button
        onClick={handleBackButtonClick}
        className="bg-blue-500 text-white p-2 rounded"
      >
        뒤로 가기
      </button>
      <Logo />
    </header>
  );
};

export default BackHeader;
