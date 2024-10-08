// src/components/molecules/LoginNav.tsx

"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import TextButton from "../atoms/Textbutton";
import { useRouter } from "next/navigation";

const SidebarLoginNav: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Supabase를 통해 로그아웃 처리
      await supabase.auth.signOut();
      // 전역 상태의 사용자 정보 초기화
      clearAuth();
      // 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getEmailUsername = (email: string) => {
    return email.split("@")[0];
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4 ">
        <TextButton
          text={`${user.nickname || user.email?.split("@")[0] || "User"}님`}
          href="/mypage"
          className=" text-brand-gray-1000"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-start">
        <p className="text-[14px] text-brand-gray-1000">로그인해 주세요.</p>
      </div>
    );
  }
};

export default SidebarLoginNav;
