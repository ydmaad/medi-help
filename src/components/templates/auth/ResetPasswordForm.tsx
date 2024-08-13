// src/components/templates/auth/ResetPasswordForm.tsx

"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthInput } from "@/components/atoms/AuthInput";
import { AuthButton } from "@/components/atoms/AuthButton";

export const ResetPasswordForm: React.FC = () => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // 비밀번호 재설정 요청 핸들러
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 환경에 따른 사이트 URL 설정
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://medi-help-seven.vercel.app";

      // Supabase API를 사용하여 비밀번호 재설정 이메일 전송
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/recover`,
      });

      if (error) throw error;

      // 성공 메시지 설정
      setMessage("비밀번호 재설정 링크를 이메일로 전송했습니다.");
    } catch (error) {
      // 에러 처리
      if (error instanceof Error) {
        setMessage(`오류: ${error.message}`);
      } else {
        setMessage("오류가 발생했습니다. 다시 시도해 주세요.");
      }
      // 콘솔에 에러 로깅
      console.error("Password reset request error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">비밀번호 재설정</h1>
      <form onSubmit={handleResetPassword}>
        {/* 이메일 입력 필드 */}
        <AuthInput
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
        />
        {/* 재설정 링크 전송 버튼 */}
        <AuthButton type="submit" className="w-full mt-4">
          재설정 링크 전송
        </AuthButton>
      </form>
      {/* 메시지 표시 영역 */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};
