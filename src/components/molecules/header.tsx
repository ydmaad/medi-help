// // src/components/molecules/header.tsx

"use client";

import React, { useEffect } from "react";
import { AuthUser, useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import LoginNav from "./LoginNav";
import Navigation from "./navigation";
import Logo from "../atoms/Logo";

const Header = () => {
  // 전역 상태에서 user와 setUser 함수를 가져옵니다.
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // 사용자 인증 상태를 확인하고 설정하는 함수
    const checkAndSetUser = async () => {
      try {
        // 현재 세션 정보를 가져옵니다.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // users 테이블에서 사용자 정보를 가져옵니다.
          let { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError) {
            // 사용자 데이터가 없으면 새로 생성합니다.
            const username =
              session.user.user_metadata.full_name ||
              session.user.email?.split("@")[0] ||
              "User";
            const { data: newUserData, error: insertError } = await supabase
              .from("users")
              .insert({
                id: session.user.id,
                email: session.user.email,
                nickname: username,
              })
              .select()
              .single();

            if (insertError) throw insertError;
            userData = newUserData;
          }

          if (userData) {
            // 세션 정보와 데이터베이스 정보를 결합하여 사용자 정보를 설정합니다.
            setUser({ ...session.user, ...userData } as AuthUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        setUser(null);
      }
    };

    // 컴포넌트 마운트 시 사용자 인증 상태를 확인합니다.
    checkAndSetUser();

    // 인증 상태 변경을 감지하는 리스너를 설정합니다.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          checkAndSetUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);

  // 헤더 UI를 렌더링합니다.
  return (
    <header className="flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px]">
      <Logo />
      <Navigation />
      <LoginNav />
    </header>
  );
};

export default Header;
