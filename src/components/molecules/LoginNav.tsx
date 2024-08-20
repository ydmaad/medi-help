// src/components/molecules/LoginNav.tsx

"use client";

import React, { useLayoutEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import TextButton from "../atoms/Textbutton";
import { useRouter } from "next/navigation";
import ImageButton from "../atoms/ImageButton";

const LoginNav: React.FC = () => {
  // isLogedIn 상태를 추가로 가져옵니다.
  const { user, clearAuth, isLogedIn, setIsLogedIn } = useAuthStore();
  // console.log(user);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      // 로그아웃 시 isLogedIn을 false로 설정
      setIsLogedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useLayoutEffect(() => {
    if (user) return setIsLogedIn(true);
    return setIsLogedIn(false);
  }, [user, setIsLogedIn]);

  // isLogedIn 상태를 기반으로 UI를 결정합니다.
  if (isLogedIn && user) {
    return (
      <div className="flex items-center space-x-4 ">
        <ImageButton src="/ring.svg" alt="알림" href="/mypage" />
        <TextButton
          text={`${user.nickname || user.email?.split("@")[0] || "User"}님`}
          href="/mypage"
          className="text-brand-primary-500"
        />
        <div onClick={handleLogout}>
          <TextButton text="로그아웃" href="#" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-start">
        <TextButton text="로그인" href="/auth/login" />
      </div>
    );
  }
};

export default LoginNav;
