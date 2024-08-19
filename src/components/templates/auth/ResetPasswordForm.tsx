// src/components/templates/auth/ResetPasswordForm.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthInput } from "@/components/atoms/AuthInput";
// import { AuthButton } from "@/components/atoms/AuthButton";

export const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        // process.env.NEXT_PUBLIC_HOST ||
        "https://medi-help-seven.vercel.app";
      // "http://localhost:3000";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/recover`,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(`오류: ${error.message}`);
      } else {
        setError("오류가 발생했습니다. 다시 시도해 주세요.");
      }
      console.error("Password reset request error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto w-[334px] desktop:w-[384px]">
        <div className="text-[28px] text-brand-gray-800 text-center font-bold mb-[40px]">
          비밀번호 찾기
        </div>
        <form onSubmit={handleResetPassword}>
          <AuthInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <div className="mt-[4px] text-[12px] text-brand-gray-600">
            가입하신 이메일을 입력해주세요.
          </div>
          <button
            type="submit"
            className={`h-[48px] mt-[40px] font-semibold text-[18px] w-full rounded-md transition-colors duration-300 ${
              isSubmitted
                ? "!bg-brand-gray-200 !text-brand-gray-600"
                : "!bg-brand-primary-500 !text-white"
            }`}
            disabled={isSubmitted}
          >
            {isSubmitted ? "전송완료" : "재설정 링크 전송"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};
