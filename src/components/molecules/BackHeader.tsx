"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageButton from "../atoms/ImageButton";
import Sidebar from "./SideBar";

const BackHeader = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleBackButtonClick = () => {
    router.back();
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const handleHomeButtonClick = () => {
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 flex desktop:hidden flex-row items-center justify-between p-4 bg-white h-[67px]">
        <div className="flex">
          <div className="mr-4">
            <ImageButton
              src="/chevron-left.svg"
              alt="뒤로가기"
              onClick={handleBackButtonClick}
            />
          </div>
          <ImageButton
            src="/home.svg"
            alt="홈"
            onClick={handleHomeButtonClick}
          />
        </div>
        <ImageButton
          src="/hambergerbtn.svg"
          alt="햄버거 버튼"
          onClick={toggleSidebar}
        />
      </header>
      <div className="absolute z-20 desktop:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>
    </>
  );
};

export default BackHeader;
