// 목적: 회원가입 페이지의 최상위 컴포넌트
// src/app/(root)/auth/signup/page.tsx

"use client";

import React, { useState } from "react";
import { useAuthStore, AuthUser } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/templates/auth/SignupForm";

export default function SignupPage() {
  // useAuthStore에서 필요한 함수들을 가져옵니다.
  const { setUser, setIsLogedIn } = useAuthStore();
  const router = useRouter();
  // 에러 상태를 관리합니다.
  const [error, setError] = useState<string>("");

  // 회원가입 처리 함수
  const handleSignup = async ({
    nickname,
    email,
    password,
    agreeTerms,
    agreePrivacy,
  }: {
    nickname: string;
    email: string;
    password: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => {
    try {
      // 약관 동의 확인
      if (!agreeTerms || !agreePrivacy) {
        throw new Error("이용약관과 개인정보 처리방침에 동의해주세요.");
      }

      // Supabase를 통한 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: nickname,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        router.push("/auth/complete");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="mt-[30px] flex justify-center items-center min-h-screen">
      <SignupForm onSubmit={handleSignup} error={error} />
    </div>
  );
}
