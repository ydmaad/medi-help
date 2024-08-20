"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarXBtn from "../atoms/SidebarXBtn";
import SidebarBtn from "../atoms/SidebarBtn";
import SidebarLogoButton from "../atoms/SidebarLogo";
import SidebarNav from "../atoms/SidebarNav";
import SidebarLoginNav from "../atoms/SidebarLoginNav";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      router.push("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`w-[267px] h-[800px] rounded-tl-[20px] rounded-bl-[20px] bg-white transform transition-transform duration-300 fixed top-0 right-0 ${
        isOpen
          ? "translate-x-[0] shadow-[-16px_0_24px_rgba(0,0,0,16%)]"
          : "translate-x-[100%]"
      }`}
    >
      <div className="flex justify-between h-[67px]">
        <SidebarLogoButton />
        <SidebarLoginNav />
        <SidebarXBtn onClick={onClose} />
      </div>

      <div className="flex w-[267px] my-[16px] mx-[20px]">
        {user ? (
          <>
            <SidebarBtn text="마이페이지" href="/mypage" onClick={onClose} />
            <SidebarBtn text="로그아웃" href="#" onClick={handleLogout} />
          </>
        ) : (
          <>
            <SidebarBtn text="로그인" href="/auth/login" onClick={onClose} />
            <SidebarBtn text="회원가입" href="/auth/signup" onClick={onClose} />
          </>
        )}
      </div>
      <SidebarNav
        imageSrc="/sidebarsearch.svg"
        text="약 검색"
        href="/search"
        onClick={onClose}
      />
      <SidebarNav
        imageSrc="/sidebarcolumn.svg"
        text="칼럼"
        href="/magazine"
        onClick={onClose}
      />
      <SidebarNav
        imageSrc="/sidebarcommunity.svg"
        text="커뮤니티"
        href="/community"
        onClick={onClose}
      />
      <SidebarNav
        imageSrc="/sidebarcalendar.svg"
        text="복약달력"
        href={user ? "/calendar" : "/auth/login"}
        onClick={() => {
          if (!user) {
            onClose();
          }
          handleNavigation(user ? "/calendar" : "/auth/login");
        }}
      />
    </div>
  );
};

export default Sidebar;
