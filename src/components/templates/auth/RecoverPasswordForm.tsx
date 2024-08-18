// src/components/templates/auth/RecoverPasswordForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthInput } from "@/components/atoms/AuthInput";
import { AuthButton } from "@/components/atoms/AuthButton";
import { useRouter } from "next/navigation";

export const RecoverPasswordForm: React.FC = () => {
  // 상태 관리
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    const handlePasswordReset = async () => {
      // console.log("Starting password reset process");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // console.log("Current session:", session);

      if (session) {
        // console.log("Valid session found");
        setMessage("비밀번호를 재설정할 수 있습니다.");
      } else {
        // console.log("No valid session found");
        setMessage(
          "유효하지 않은 접근입니다. 비밀번호 재설정 이메일을 다시 요청해 주세요."
        );
      }
      setIsLoading(false);
    };

    handlePasswordReset();
  }, []);

  // 비밀번호 재설정 핸들러
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to reset password");
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      console.log("Password reset successful", data);
      setMessage("비밀번호가 성공적으로 재설정되었습니다.");
      // 2초 후 로그인 페이지로 리다이렉트
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof Error) {
        setMessage(`오류: ${error.message}`);
      } else {
        setMessage("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 컴포넌트 렌더링
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">새 비밀번호 설정</h1>
      {message !== "비밀번호를 재설정할 수 있습니다." ? (
        <p className="text-center">{message}</p>
      ) : (
        <form onSubmit={handleResetPassword}>
          <AuthInput
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호"
            required
          />
          <AuthButton type="submit" className="w-full mt-4">
            비밀번호 변경
          </AuthButton>
        </form>
      )}
    </div>
  );
};
