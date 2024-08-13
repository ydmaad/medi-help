// 목적: 회원가입 페이지의 최상위 컴포넌트
// src/app/(root)/auth/signup/page.tsx

"use client";

import React, { useState } from "react";
import { useAuthStore, AuthUser } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/templates/auth/SignupForm";

export default function SignupPage() {
  const { setUser } = useAuthStore();
  const router = useRouter();
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
        // 저장된 사용자 정보 조회
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (fetchError) throw fetchError;

        // 전역 상태에 사용자 정보 저장
        setUser(userData as AuthUser);

        // 회원가입 성공 시 메인 페이지로 이동
        router.push("/");
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
    <div className="flex justify-center items-center min-h-screen">
      <SignupForm onSubmit={handleSignup} error={error} />
    </div>
  );
}
