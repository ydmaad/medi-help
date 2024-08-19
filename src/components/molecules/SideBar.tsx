"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarXBtn from "../atoms/SidebarXBtn";
import SidebarBtn from "../atoms/SidebarBtn";
import SidebarLogoButton from "../atoms/SidebarLogo";
import SidebarNav from "../atoms/SidebarNav";
import SidebarLoginNav from "../atoms/SidebarLoginNav";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      className={`w-[267px] h-[800px] rounded-tl-[20px] rounded-bl-[20px] shadow-[-16px_0_24px_rgba(0,0,0,16%)] bg-white transform transition-transform duration-300 fixed top-0 right-0 mt-[67px] ${
        isOpen ? "translate-x-[0]" : "translate-x-[100%]"
      }`}
    >
      <div className="flex justify-between h-[67px]">
        <SidebarLogoButton />
        <SidebarLoginNav />
        <SidebarXBtn onClick={onClose} />
      </div>

      <div className="flex w-[267px] my-[16px] mx-[20px]">
        <SidebarBtn
          text="로그인"
          href="/auth/login"
          onClick={() => handleNavigation("/auth/login")}
        />
        <SidebarBtn
          text="회원가입"
          href="/auth/signup"
          onClick={() => handleNavigation("/auth/signup")}
        />
      </div>
      <SidebarNav
        imageSrc="/sidebarsearch.svg"
        text="약 검색"
        href="/search"
        onClick={() => handleNavigation("/search")}
      />
      <SidebarNav
        imageSrc="/sidebarcolumn.svg"
        text="칼럼"
        href="/magazine"
        onClick={() => handleNavigation("/magazine")}
      />
      <SidebarNav
        imageSrc="/sidebarcommunity.svg"
        text="커뮤니티"
        href="/community"
        onClick={() => handleNavigation("/community")}
      />
      <SidebarNav
        imageSrc="/sidebarcalendar.svg"
        text="복약달력"
        href="/calendar"
        onClick={() => handleNavigation("/calendar")}
      />
    </div>
  );
};

export default Sidebar;
